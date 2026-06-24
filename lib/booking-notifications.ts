import { NTFY_BASE_URL, NTFY_TOPIC } from "@/lib/constants";

export type BookingNotificationPayload = {
  bookingId?: string;
  sessionId: string;
  serviceName: string;
  startsAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
};

export type MemberReservationNotificationPayload = {
  reservationId?: string;
  serviceName: string;
  startsAt: string;
  memberEmail: string;
  memberName?: string | null;
  remainingCredits: number;
};

export type MemberPackageNotificationPayload = {
  sessionId: string;
  packageName: string;
  classesAdded: number;
  amountCents: number;
  memberEmail: string;
  remainingCredits: number;
};

function formatBookingDate(startsAt: string): string {
  if (!startsAt) return "Horario pendiente";

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

export async function sendBookingPhoneNotification(
  payload: BookingNotificationPayload,
): Promise<boolean> {
  const topic = NTFY_TOPIC.trim();
  if (!topic) {
    console.error("ntfy notification skipped: missing NTFY_TOPIC", {
      sessionId: payload.sessionId,
      bookingId: payload.bookingId,
    });
    return false;
  }

  const baseUrl = NTFY_BASE_URL.replace(/\/+$/, "");
  const formattedDate = formatBookingDate(payload.startsAt);
  const message = [
    `Cliente: ${payload.customerName}`,
    `Clase: ${payload.serviceName}`,
    `Horario: ${formattedDate}`,
    `Telefono: ${payload.customerPhone}`,
    `Email: ${payload.customerEmail}`,
    `Stripe: ${payload.sessionId}`,
  ].join("\n");

  try {
    const response = await fetch(`${baseUrl}/${encodeURIComponent(topic)}`, {
      method: "POST",
      headers: {
        Title: "Nueva reserva FIRA",
        Priority: "high",
        Tags: "calendar,white_check_mark",
      },
      body: message,
    });

    if (!response.ok) {
      console.error("ntfy notification rejected", {
        sessionId: payload.sessionId,
        bookingId: payload.bookingId,
        status: response.status,
        statusText: response.statusText,
      });
      return false;
    }

    return true;
  } catch (e) {
    console.error("ntfy notification failed", {
      sessionId: payload.sessionId,
      bookingId: payload.bookingId,
      error: e instanceof Error ? e.message : String(e),
    });
    return false;
  }
}

async function sendNtfyNotification({
  title,
  message,
  tags,
  context,
}: {
  title: string;
  message: string;
  tags: string;
  context: Record<string, unknown>;
}): Promise<boolean> {
  const topic = NTFY_TOPIC.trim();
  if (!topic) {
    console.error("ntfy notification skipped: missing NTFY_TOPIC", context);
    return false;
  }

  const baseUrl = NTFY_BASE_URL.replace(/\/+$/, "");

  try {
    const response = await fetch(`${baseUrl}/${encodeURIComponent(topic)}`, {
      method: "POST",
      headers: {
        Title: title,
        Priority: "high",
        Tags: tags,
      },
      body: message,
    });

    if (!response.ok) {
      console.error("ntfy notification rejected", {
        ...context,
        status: response.status,
        statusText: response.statusText,
      });
      return false;
    }

    return true;
  } catch (e) {
    console.error("ntfy notification failed", {
      ...context,
      error: e instanceof Error ? e.message : String(e),
    });
    return false;
  }
}

export async function sendMemberReservationPhoneNotification(
  payload: MemberReservationNotificationPayload,
): Promise<boolean> {
  const message = [
    `Miembro: ${payload.memberName || payload.memberEmail}`,
    `Email: ${payload.memberEmail}`,
    `Clase: ${payload.serviceName}`,
    `Horario: ${formatBookingDate(payload.startsAt)}`,
    `Creditos restantes: ${payload.remainingCredits}`,
  ].join("\n");

  return sendNtfyNotification({
    title: "Nueva reserva de miembro FIRA",
    message,
    tags: "calendar,white_check_mark",
    context: {
      reservationId: payload.reservationId,
      memberEmail: payload.memberEmail,
    },
  });
}

export async function sendMemberPackagePhoneNotification(
  payload: MemberPackageNotificationPayload,
): Promise<boolean> {
  const amount = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(payload.amountCents / 100);
  const message = [
    `Miembro: ${payload.memberEmail}`,
    `Paquete: ${payload.packageName}`,
    `Clases agregadas: ${payload.classesAdded}`,
    `Total: ${amount}`,
    `Creditos disponibles: ${payload.remainingCredits}`,
    `Stripe: ${payload.sessionId}`,
  ].join("\n");

  return sendNtfyNotification({
    title: "Paquete comprado FIRA",
    message,
    tags: "moneybag,white_check_mark",
    context: {
      sessionId: payload.sessionId,
      memberEmail: payload.memberEmail,
    },
  });
}
