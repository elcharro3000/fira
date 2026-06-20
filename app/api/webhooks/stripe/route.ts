import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";
import { sendBookingEmails } from "@/lib/booking-emails";
import { updateBookingStatus } from "@/lib/bookings-store";

export const dynamic = "force-dynamic";

function getStripe(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  return secretKey ? new Stripe(secretKey) : null;
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured" },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      webhookSecret,
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid signature" },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata ?? {};
    const bookingId = metadata.bookingId;

    if (bookingId) {
      updateBookingStatus(bookingId, "paid", session.id);
    }

    const resend = process.env.RESEND_API_KEY
      ? new Resend(process.env.RESEND_API_KEY)
      : null;

    await sendBookingEmails(resend, {
      bookingId,
      sessionId: session.id,
      serviceName: metadata.serviceName ?? "Clase FIRA",
      startsAt: metadata.startsAt ?? "",
      customerName: metadata.customerName ?? session.customer_details?.name ?? "Cliente",
      customerEmail: metadata.customerEmail ?? session.customer_details?.email ?? "",
      customerPhone: metadata.customerPhone ?? session.customer_details?.phone ?? "",
    });
  }

  return NextResponse.json({ received: true });
}
