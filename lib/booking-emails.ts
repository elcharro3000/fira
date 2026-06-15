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

export type BookingEmailResult = {
  customerEmailSent: boolean;
  studioEmailSent: boolean;
};

export type SendBookingEmailsOptions = {
  sendCustomerEmail?: boolean;
  sendStudioEmail?: boolean;
};

export async function sendBookingEmails(
  resend: Resend | null,
  payload: BookingEmailPayload,
  options: SendBookingEmailsOptions = {}
): Promise<BookingEmailResult> {
  const { sendCustomerEmail = true, sendStudioEmail = true } = options;
  const result: BookingEmailResult = {
    customerEmailSent: false,
    studioEmailSent: false,
  };

  if (!resend) {
    console.error("booking email skipped: missing RESEND_API_KEY", {
      sessionId: payload.sessionId,
      bookingId: payload.bookingId,
    });
    return result;
  }
  if (!payload.customerEmail) {
    console.error("booking email skipped: missing customer email", {
      sessionId: payload.sessionId,
      bookingId: payload.bookingId,
    });
    return result;
  }

  const formattedDate = formatBookingDate(payload.startsAt);

  if (sendCustomerEmail)
  try {
    const { error } = await resend.emails.send({
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
    if (error) {
      console.error("Client confirmation email rejected", {
        sessionId: payload.sessionId,
        bookingId: payload.bookingId,
        to: payload.customerEmail,
        from: RESEND_FROM_EMAIL,
        error,
      });
    } else {
      result.customerEmailSent = true;
    }
  } catch (e) {
    console.error("Client confirmation email failed", {
      sessionId: payload.sessionId,
      bookingId: payload.bookingId,
      to: payload.customerEmail,
      from: RESEND_FROM_EMAIL,
      error: e instanceof Error ? e.message : String(e),
    });
  }

  if (sendStudioEmail)
  try {
    const { error } = await resend.emails.send({
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
    if (error) {
      console.error("Studio notification email rejected", {
        sessionId: payload.sessionId,
        bookingId: payload.bookingId,
        to: STUDIO_EMAIL,
        from: RESEND_FROM_EMAIL,
        error,
      });
    } else {
      result.studioEmailSent = true;
    }
  } catch (e) {
    console.error("Studio notification email failed", {
      sessionId: payload.sessionId,
      bookingId: payload.bookingId,
      to: STUDIO_EMAIL,
      from: RESEND_FROM_EMAIL,
      error: e instanceof Error ? e.message : String(e),
    });
  }

  return result;
}
