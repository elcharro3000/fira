import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createBooking, getPaidBookingsForSlot, updateBookingStatus } from "@/lib/bookings-store";
import { getSheetScheduleSlots } from "@/lib/google-sheets-schedule";
import { SERVICES, getSlotStartsAt, slotFromId } from "@/lib/schedule";

interface CheckoutRequestBody {
  serviceId?: string;
  slotId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

function getStripe(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  return secretKey ? new Stripe(secretKey) : null;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 },
    );
  }

  let body: CheckoutRequestBody;
  try {
    body = (await request.json()) as CheckoutRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
  const serviceId = body.serviceId ?? "reformer-burn";
  const service = SERVICES.find((item) => item.id === serviceId);
  const slotId = body.slotId ?? "";
  const customerName = body.customerName?.trim() ?? "";
  const customerEmail = body.customerEmail?.trim() ?? "";
  const customerPhone = body.customerPhone?.trim() ?? "";

  if (!service) {
    return NextResponse.json({ error: "Invalid service" }, { status: 400 });
  }

  if (!slotId || !customerName || !isValidEmail(customerEmail) || !customerPhone) {
    return NextResponse.json(
      { error: "Missing reservation details" },
      { status: 400 },
    );
  }

  const slot = slotFromId(slotId);
  if (!slot.date) {
    return NextResponse.json({ error: "Invalid slot" }, { status: 400 });
  }

  const from = new Date(`${slot.date}T00:00:00`);
  const to = new Date(`${slot.date}T23:59:59`);
  const scheduleSlot = (await getSheetScheduleSlots(from, to)).find(
    (item) => item.slotId === slotId,
  );

  if (!scheduleSlot) {
    return NextResponse.json({ error: "Slot is no longer available" }, { status: 409 });
  }

  const startsAt = getSlotStartsAt(slot.date, slot.hour, slot.minute);
  if (startsAt < new Date()) {
    return NextResponse.json({ error: "Slot is in the past" }, { status: 409 });
  }

  if (getPaidBookingsForSlot(slotId).length >= scheduleSlot.capacity) {
    return NextResponse.json({ error: "Slot is full" }, { status: 409 });
  }

  const booking = createBooking({
    serviceId: service.id,
    serviceName: scheduleSlot.className || service.name,
    slotId,
    startsAt: startsAt.toISOString(),
    customerName,
    customerEmail,
    customerPhone,
    amountCents: service.priceCents,
    currency: "mxn",
    stripeSessionId: null,
    status: "pending",
  });

  const origin = request.nextUrl.origin;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: customerEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "mxn",
          unit_amount: service.priceCents,
          product_data: {
            name: scheduleSlot.className || service.name,
            description: "FIRA Wellness Club",
          },
        },
      },
    ],
    metadata: {
      bookingId: booking.id,
      serviceId: service.id,
      serviceName: scheduleSlot.className || service.name,
      slotId,
      startsAt: startsAt.toISOString(),
      customerName,
      customerEmail,
      customerPhone,
    },
    success_url: `${origin}/reserva/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/reserva?serviceId=${encodeURIComponent(service.id)}&slotId=${encodeURIComponent(slotId)}&cancelled=1`,
  });

  updateBookingStatus(booking.id, "pending", session.id);

  return NextResponse.json({ url: session.url });
}
