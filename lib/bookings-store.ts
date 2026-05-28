/**
 * In-memory store for bookings (serverless-safe: persists per instance).
 * For production, replace with Vercel Postgres or another database.
 */
export type BookingStatus = "pending" | "paid" | "cancelled";

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  slotId: string;
  startsAt: string; // ISO
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amountCents: number;
  currency: string;
  stripeSessionId: string | null;
  status: BookingStatus;
  createdAt: string;
}

const bookings: Map<string, Booking> = new Map();

export function createBooking(booking: Omit<Booking, "id" | "createdAt">): Booking {
  const id = `bk_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const b: Booking = {
    ...booking,
    id,
    createdAt: new Date().toISOString(),
  };
  bookings.set(id, b);
  return b;
}

export function getBookingById(id: string): Booking | undefined {
  return bookings.get(id);
}

export function getBookingByStripeSessionId(sessionId: string): Booking | undefined {
  for (const b of bookings.values()) {
    if (b.stripeSessionId === sessionId) return b;
  }
  return undefined;
}

export function updateBookingStatus(
  id: string,
  status: BookingStatus,
  stripeSessionId?: string
): Booking | undefined {
  const b = bookings.get(id);
  if (!b) return undefined;
  b.status = status;
  if (stripeSessionId != null) b.stripeSessionId = stripeSessionId;
  return b;
}

export function getPaidBookingsForSlot(slotId: string): Booking[] {
  return Array.from(bookings.values()).filter(
    (b) => b.slotId === slotId && b.status === "paid"
  );
}

export function getAllBookings(): Booking[] {
  return Array.from(bookings.values());
}
