export type BookingStatus = "pending" | "paid" | "cancelled";

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  slotId: string;
  startsAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amountCents: number;
  currency: string;
  stripeSessionId: string | null;
  status: BookingStatus;
  createdAt: string;
  emailSent?: boolean;
}

// In-memory store — resets on cold start; enough for serverless single-instance use
const bookings = new Map<string, Booking>();
const sessionIndex = new Map<string, string>(); // stripeSessionId -> bookingId

function generateId(): string {
  return `bk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createBooking(data: Omit<Booking, "id" | "createdAt">): Booking {
  const booking: Booking = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  bookings.set(booking.id, booking);
  if (booking.stripeSessionId) {
    sessionIndex.set(booking.stripeSessionId, booking.id);
  }
  return booking;
}

export function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
  stripeSessionId?: string | null
): Booking | null {
  const booking = bookings.get(bookingId);
  if (!booking) return null;
  booking.status = status;
  if (stripeSessionId) {
    booking.stripeSessionId = stripeSessionId;
    sessionIndex.set(stripeSessionId, bookingId);
  }
  return booking;
}

export function getBookingById(id: string): Booking | null {
  return bookings.get(id) ?? null;
}

export function getBookingByStripeSessionId(sessionId: string): Booking | null {
  const id = sessionIndex.get(sessionId);
  return id ? (bookings.get(id) ?? null) : null;
}

export function getPaidBookingsForSlot(slotId: string): Booking[] {
  return Array.from(bookings.values()).filter(
    (b) => b.slotId === slotId && b.status === "paid"
  );
}
