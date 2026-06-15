import { Resend } from "resend";
import Stripe from "stripe";
import { sendBookingEmails } from "@/lib/booking-emails";
import { updateBookingStatus } from "@/lib/bookings-store";

export type ConfirmBookingResult =
  | "sent"
  | "already-sent"
  | "not-paid"
  | "not-configured"
  | "error";

function getStripe(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  return secretKey ? new Stripe(secretKey) : null;
}

/**
 * Confirms a paid Stripe Checkout Session and sends the booking emails.
 *
 * This is called from BOTH the Stripe webhook and the /reserva/success page so
 * that emails go out even if the webhook is misconfigured. Idempotency is
 * enforced via PaymentIntent metadata (persistent + shared across serverless
 * instances), so the customer never receives duplicate emails.
 */
export async function confirmBookingAndSendEmails(
  sessionId: string,
): Promise<ConfirmBookingResult> {
  if (!sessionId) return "error";

  const stripe = getStripe();
  if (!stripe) {
    console.error("confirmBooking skipped: missing STRIPE_SECRET_KEY", { sessionId });
    return "not-configured";
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });
  } catch (e) {
    console.error("confirmBooking: failed to retrieve session", {
      sessionId,
      error: e instanceof Error ? e.message : String(e),
    });
    return "error";
  }

  if (session.payment_status !== "paid") {
    return "not-paid";
  }

  const paymentIntent =
    typeof session.payment_intent === "object" ? session.payment_intent : null;
  const piMetadata = paymentIntent?.metadata ?? {};

  // Legacy flag from before customer/studio emails were tracked separately.
  const legacySent = piMetadata.fira_emails_sent === "1";
  const customerAlreadySent = legacySent || piMetadata.fira_customer_email_sent === "1";
  const studioAlreadySent = legacySent || piMetadata.fira_studio_email_sent === "1";

  // Idempotency guard: if both emails already went out for this payment, stop here.
  if (customerAlreadySent && studioAlreadySent) {
    return "already-sent";
  }

  const metadata = session.metadata ?? {};
  const bookingId = metadata.bookingId;

  if (bookingId) {
    updateBookingStatus(bookingId, "paid", session.id);
  }

  const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

  const { customerEmailSent, studioEmailSent } = await sendBookingEmails(
    resend,
    {
      bookingId,
      sessionId: session.id,
      serviceName: metadata.serviceName ?? "Clase FIRA",
      startsAt: metadata.startsAt ?? "",
      customerName:
        metadata.customerName ?? session.customer_details?.name ?? "Cliente",
      customerEmail:
        metadata.customerEmail ?? session.customer_details?.email ?? "",
      customerPhone:
        metadata.customerPhone ?? session.customer_details?.phone ?? "",
    },
    {
      sendCustomerEmail: !customerAlreadySent,
      sendStudioEmail: !studioAlreadySent,
    }
  );

  // Track each email independently so a failure on one side (e.g. the studio
  // notification) can still be retried on the next webhook delivery without
  // re-sending the other.
  if (paymentIntent && (customerEmailSent || studioEmailSent)) {
    const newMetadata = { ...paymentIntent.metadata };
    delete newMetadata.fira_emails_sent;
    if (customerAlreadySent || customerEmailSent) {
      newMetadata.fira_customer_email_sent = "1";
    }
    if (studioAlreadySent || studioEmailSent) {
      newMetadata.fira_studio_email_sent = "1";
    }
    try {
      await stripe.paymentIntents.update(paymentIntent.id, {
        metadata: newMetadata,
      });
    } catch (e) {
      console.error("confirmBooking: failed to mark emails sent", {
        sessionId,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  const customerDone = customerAlreadySent || customerEmailSent;
  const studioDone = studioAlreadySent || studioEmailSent;
  return customerDone && studioDone ? "sent" : "error";
}
