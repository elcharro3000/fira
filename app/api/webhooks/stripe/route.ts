import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { getBookingByStripeSessionId, updateBookingStatus } from "@/lib/bookings-store";
import { sendBookingEmails } from "@/lib/booking-emails";

const stripe =
  process.env.STRIPE_SECRET_KEY && new Stripe(process.env.STRIPE_SECRET_KEY);
const resend =
  process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Webhook or Stripe not configured" },
      { status: 503 }
    );
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook signature failed: ${message}` }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const booking = getBookingByStripeSessionId(session.id);
  if (booking) {
    updateBookingStatus(booking.id, "paid", session.id);
  } else {
    console.warn("webhook booking not found in memory, using Stripe metadata", {
      sessionId: session.id,
      bookingId: session.metadata?.bookingId,
    });
  }

  const emailPayload = {
    bookingId: booking?.id ?? session.metadata?.bookingId,
    sessionId: session.id,
    serviceName: booking?.serviceName ?? session.metadata?.serviceName ?? "Clase",
    startsAt: booking?.startsAt ?? session.metadata?.startsAt ?? "",
    customerName:
      booking?.customerName ??
      session.metadata?.customerName ??
      session.customer_details?.name ??
      "Cliente",
    customerEmail:
      booking?.customerEmail ?? session.customer_details?.email ?? "",
    customerPhone:
      booking?.customerPhone ?? session.metadata?.customerPhone ?? "",
  };

  await sendBookingEmails(resend ?? null, emailPayload);

  return NextResponse.json({ received: true });
}
