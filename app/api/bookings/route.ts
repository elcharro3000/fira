import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { SERVICES } from "@/lib/schedule";
import { slotFromId } from "@/lib/schedule";
import {
  createBooking,
  updateBookingStatus,
  getBookingById,
} from "@/lib/bookings-store";
import { sendBookingEmails } from "@/lib/booking-emails";

const stripe =
  process.env.STRIPE_SECRET_KEY && new Stripe(process.env.STRIPE_SECRET_KEY);
const resend =
  process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured. Add STRIPE_SECRET_KEY." },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const {
      serviceId,
      slotId,
      customerName,
      customerEmail,
      customerPhone,
    } = body as {
      serviceId: string;
      slotId: string;
      customerName: string;
      customerEmail: string;
      customerPhone: string;
    };

    if (
      !serviceId ||
      !slotId ||
      !customerName ||
      !customerEmail ||
      !customerPhone
    ) {
      return NextResponse.json(
        { error: "Missing required fields: serviceId, slotId, customerName, customerEmail, customerPhone" },
        { status: 400 }
      );
    }

    const service = SERVICES.find((s) => s.id === serviceId);
    if (!service) {
      return NextResponse.json({ error: "Invalid service" }, { status: 400 });
    }

    const { date, hour, minute } = slotFromId(slotId);
    // Store as local time string (no Z suffix) so browser displays correct Mexico City time
    const startsAtLocal = `${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;

    // Validate the slot values are sensible
    if (!date || isNaN(hour) || isNaN(minute)) {
      return NextResponse.json({ error: "Invalid slot" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || req.nextUrl.origin;

    const booking = createBooking({
      serviceId: service.id,
      serviceName: service.name,
      slotId,
      startsAt: startsAtLocal,
      customerName,
      customerEmail,
      customerPhone,
      amountCents: service.priceCents,
      currency: "mxn",
      stripeSessionId: null,
      status: "pending",
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: `${service.name} — ${date} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
              description: "Clase en FIRA Wellness Club",
            },
            unit_amount: service.priceCents,
          },
          quantity: 1,
        },
      ],
      customer_email: customerEmail,
      metadata: {
        bookingId: booking.id,
        serviceName: service.name,
        startsAt: startsAtLocal,
        customerName,
        customerPhone,
      },
      success_url: `${origin}/reserva?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/reserva?cancel=1`,
    });

    updateBookingStatus(booking.id, "pending", session.id);

    return NextResponse.json({ url: session.url, bookingId: booking.id });
  } catch (e) {
    console.error("bookings POST", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Booking failed" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "session_id required" }, { status: 400 });
  }
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const bookingId = session.metadata?.bookingId;

    // Pull booking data: prefer metadata (survives serverless cold starts) over in-memory store
    const serviceName =
      session.metadata?.serviceName ??
      (bookingId ? getBookingById(bookingId)?.serviceName : undefined) ??
      "Clase";
    const startsAt =
      session.metadata?.startsAt ??
      (bookingId ? getBookingById(bookingId)?.startsAt : undefined) ??
      "";
    const customerName =
      session.metadata?.customerName ??
      session.customer_details?.name ??
      (bookingId ? getBookingById(bookingId)?.customerName : undefined) ??
      "";
    const customerPhone =
      session.metadata?.customerPhone ??
      (bookingId ? getBookingById(bookingId)?.customerPhone : undefined) ??
      "";
    const customerEmail =
      session.customer_details?.email ??
      (bookingId ? getBookingById(bookingId)?.customerEmail : undefined) ??
      "";

    const isPaid = session.payment_status === "paid";

    // Update in-memory status if available
    if (isPaid && bookingId) {
      const booking = getBookingById(bookingId);
      if (booking && booking.status === "pending") {
        updateBookingStatus(bookingId, "paid", sessionId);
      }
    }

    // Send confirmation emails exactly once, guarded by an in-memory flag.
    const inMemoryBooking = bookingId ? getBookingById(bookingId) : null;
    const alreadySent = inMemoryBooking?.status === "paid" && (inMemoryBooking as { emailSent?: boolean }).emailSent;

    if (isPaid && resend && customerEmail && !alreadySent) {
      // Mark email as sent in-memory to avoid duplicates on page refresh
      if (inMemoryBooking) {
        (inMemoryBooking as { emailSent?: boolean }).emailSent = true;
      }
      await sendBookingEmails(resend, {
        bookingId: bookingId ?? undefined,
        sessionId,
        serviceName,
        startsAt,
        customerName,
        customerEmail,
        customerPhone,
      });
    }

    if (isPaid && (!resend || !customerEmail)) {
      await sendBookingEmails(resend ?? null, {
        bookingId: bookingId ?? undefined,
        sessionId,
        serviceName,
        startsAt,
        customerName,
        customerEmail,
        customerPhone,
      });
    }

    if (isPaid && alreadySent) {
      console.log("booking email skipped: already sent", { sessionId });
    }

    return NextResponse.json({
      booking: {
        id: bookingId ?? sessionId,
        serviceName,
        startsAt,
        customerName,
        customerEmail,
        status: isPaid ? "paid" : "pending",
      },
      paymentStatus: session.payment_status,
    });
  } catch (e) {
    console.error("bookings GET", e);
    return NextResponse.json(
      { error: "Failed to load booking" },
      { status: 500 }
    );
  }
}
