/**
 * Booking: internal reservation page (replaces external Wix booking).
 */
export const BOOKING_URL = "/reserva";

/**
 * Studio email for confirmations and new-booking notifications.
 */
export const STUDIO_EMAIL = "firawellness@gmail.com";

/**
 * Sender address used for booking emails.
 * Configure RESEND_FROM_EMAIL with a verified domain in Resend, for example:
 * "FIRA Wellness Club <hola@firawellness.com>"
 */
export const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ??
  "FIRA Wellness Club <noreply@firawellness.com>";
