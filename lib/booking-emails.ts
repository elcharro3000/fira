import { Resend } from "resend";
import { RESEND_FROM_EMAIL, STUDIO_EMAIL } from "@/lib/constants";

export type BookingEmailPayload = {
  bookingId?: string;
  sessionId: string;
  serviceName: string;
  startsAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
};

function formatBookingDate(startsAt: string): string {
  if (!startsAt) return "";
  const parsed = new Date(startsAt);
  if (Number.isNaN(parsed.getTime())) return startsAt;
  return parsed.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Mexico_City",
  });
}

async function sendPushNotification(
  payload: BookingEmailPayload,
  formattedDate: string
): Promise<void> {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) return;
  try {
    const headers: Record<string, string> = {
      Title: "Nueva reserva en FIRA",
      Priority: "high",
      Tags: "calendar,tada",
    };
    if (process.env.NTFY_TOKEN) {
      headers.Authorization = `Bearer ${process.env.NTFY_TOKEN}`;
    }
    await fetch(`https://ntfy.sh/${topic}`, {
      method: "POST",
      headers,
      body: `${payload.customerName} | ${payload.serviceName} | ${formattedDate}`,
    });
  } catch (e) {
    console.error("Push notification failed", {
      sessionId: payload.sessionId,
      error: e instanceof Error ? e.message : String(e),
    });
  }
}

export async function sendBookingEmails(
  resend: Resend | null,
  payload: BookingEmailPayload
) {
  const formattedDate = formatBookingDate(payload.startsAt);

  // Fire push notification regardless of email config — owner needs instant alerts
  await sendPushNotification(payload, formattedDate);

  if (!resend) {
    console.error("booking email skipped: missing RESEND_API_KEY", {
      sessionId: payload.sessionId,
      bookingId: payload.bookingId,
    });
    return;
  }
  if (!payload.customerEmail) {
    console.error("booking email skipped: missing customer email", {
      sessionId: payload.sessionId,
      bookingId: payload.bookingId,
    });
    return;
  }

  try {
    await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: payload.customerEmail,
      replyTo: STUDIO_EMAIL,
      subject: `Reserva confirmada — ${payload.serviceName}`,
      html: `
        <h2 style="color:#E8587A;">Reserva confirmada ✓</h2>
        <p>Hola ${payload.customerName},</p>
        <p>Tu clase en FIRA Wellness Club está confirmada.</p>
        <ul>
          <li><strong>Clase:</strong> ${payload.serviceName}</li>
          <li><strong>Fecha y hora:</strong> ${formattedDate}</li>
          <li><strong>Dirección:</strong> Av. Horacio 632, Polanco, Ciudad de México</li>
        </ul>
        <p>Nos vemos en el estudio.</p>
        <p>— FIRA Wellness Club</p>
      `,
    });
  } catch (e) {
    console.error("Client confirmation email failed", {
      sessionId: payload.sessionId,
      bookingId: payload.bookingId,
      to: payload.customerEmail,
      from: RESEND_FROM_EMAIL,
      error: e instanceof Error ? e.message : String(e),
    });
  }

  try {
    await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: STUDIO_EMAIL,
      subject: `Nueva reserva: ${payload.customerName} — ${payload.serviceName}`,
      html: `
        <h2>Nueva reserva</h2>
        <p><strong>Cliente:</strong> ${payload.customerName}</p>
        <p><strong>Email:</strong> ${payload.customerEmail}</p>
        <p><strong>Teléfono:</strong> ${payload.customerPhone}</p>
        <p><strong>Clase:</strong> ${payload.serviceName}</p>
        <p><strong>Fecha y hora:</strong> ${formattedDate}</p>
        <p><strong>Session Stripe:</strong> ${payload.sessionId}</p>
      `,
    });
  } catch (e) {
    console.error("Studio notification email failed", {
      sessionId: payload.sessionId,
      bookingId: payload.bookingId,
      to: STUDIO_EMAIL,
      from: RESEND_FROM_EMAIL,
      error: e instanceof Error ? e.message : String(e),
    });
  }
}
