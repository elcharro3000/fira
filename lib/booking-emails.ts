import { Resend } from "resend";

export interface BookingEmailPayload {
  bookingId?: string;
  sessionId: string;
  serviceName: string;
  startsAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

const OWNER_EMAIL = "firwellness@gmail.com";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "FIRA Wellness Club <onboarding@resend.dev>";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("es-MX", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

async function sendPushNotification(payload: BookingEmailPayload): Promise<void> {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) return;

  const dateStr = formatDate(payload.startsAt);
  const body = `${payload.customerName} | ${payload.serviceName} | ${dateStr}`;

  try {
    await fetch(`https://ntfy.sh/${topic}`, {
      method: "POST",
      headers: {
        "Title": "Nueva reserva en FIRA",
        "Priority": "high",
        "Tags": "calendar,tada",
        "Content-Type": "text/plain",
        ...(process.env.NTFY_TOKEN ? { Authorization: `Bearer ${process.env.NTFY_TOKEN}` } : {}),
      },
      body,
    });
  } catch (e) {
    console.error("ntfy push failed", e);
  }
}

async function sendOwnerEmail(resend: Resend, payload: BookingEmailPayload): Promise<void> {
  const dateStr = formatDate(payload.startsAt);

  await resend.emails.send({
    from: FROM_EMAIL,
    to: OWNER_EMAIL,
    subject: `Nueva reserva: ${payload.customerName} — ${payload.serviceName}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
        <h2 style="color:#e07d6a;margin-bottom:4px;">Nueva reserva confirmada</h2>
        <p style="color:#666;margin-top:0;font-size:14px;">Pago procesado exitosamente</p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
          <tr><td style="padding:8px 0;color:#999;font-size:13px;width:120px;">Clase</td><td style="padding:8px 0;font-weight:600;">${payload.serviceName}</td></tr>
          <tr><td style="padding:8px 0;color:#999;font-size:13px;">Fecha</td><td style="padding:8px 0;">${dateStr}</td></tr>
          <tr><td style="padding:8px 0;color:#999;font-size:13px;">Cliente</td><td style="padding:8px 0;">${payload.customerName}</td></tr>
          <tr><td style="padding:8px 0;color:#999;font-size:13px;">Email</td><td style="padding:8px 0;">${payload.customerEmail}</td></tr>
          <tr><td style="padding:8px 0;color:#999;font-size:13px;">Teléfono</td><td style="padding:8px 0;">${payload.customerPhone || "—"}</td></tr>
          ${payload.bookingId ? `<tr><td style="padding:8px 0;color:#999;font-size:13px;">Reserva ID</td><td style="padding:8px 0;font-size:12px;color:#aaa;">${payload.bookingId}</td></tr>` : ""}
        </table>
      </div>
    `,
  });
}

async function sendCustomerEmail(resend: Resend, payload: BookingEmailPayload): Promise<void> {
  const dateStr = formatDate(payload.startsAt);

  await resend.emails.send({
    from: FROM_EMAIL,
    to: payload.customerEmail,
    subject: `Reserva confirmada — ${payload.serviceName}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
        <h2 style="color:#e07d6a;">Tu clase está confirmada</h2>
        <p>Hola ${payload.customerName},</p>
        <p>Tu reserva ha sido procesada exitosamente.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:8px 0;color:#999;font-size:13px;width:120px;">Clase</td><td style="padding:8px 0;font-weight:600;">${payload.serviceName}</td></tr>
          <tr><td style="padding:8px 0;color:#999;font-size:13px;">Fecha y hora</td><td style="padding:8px 0;">${dateStr}</td></tr>
        </table>
        <p style="color:#666;font-size:14px;">¿Tienes alguna duda? Escríbenos a <a href="mailto:${OWNER_EMAIL}" style="color:#e07d6a;">${OWNER_EMAIL}</a>.</p>
        <p style="color:#666;font-size:14px;">Nos vemos en el estudio.</p>
        <p style="margin-top:24px;font-size:13px;color:#aaa;">FIRA Wellness Club · Polanco, CDMX</p>
      </div>
    `,
  });
}

export async function sendBookingEmails(
  resend: Resend | null,
  payload: BookingEmailPayload
): Promise<void> {
  // Always send iPhone push notification (doesn't need Resend)
  await sendPushNotification(payload);

  if (!resend) {
    console.warn("Resend not configured — skipping emails. Set RESEND_API_KEY.");
    return;
  }

  const results = await Promise.allSettled([
    sendOwnerEmail(resend, payload),
    payload.customerEmail ? sendCustomerEmail(resend, payload) : Promise.resolve(),
  ]);

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Email send failed:", result.reason);
    }
  }
}
