import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { confirmBookingAndSendEmails } from "@/lib/confirm-booking";
import { creditMemberPackageFromStripeSession } from "@/lib/member-purchases";

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

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.metadata?.purchaseType === "member-package") {
      await creditMemberPackageFromStripeSession(session);
    } else {
      // Idempotent: safe even if the success page already sent the emails.
      await confirmBookingAndSendEmails(session.id);
    }
  }

  return NextResponse.json({ received: true });
}
