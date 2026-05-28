/**
 * Service definitions for booking (match class types on site).
 * Price in MXN centavos for one class (drop-in).
 */
export const SERVICES = [
  { id: "core-sculpt", name: "Core Sculpt", durationMinutes: 55, priceCents: 35000 },
  { id: "lower-body-burn", name: "Lower Body Burn", durationMinutes: 55, priceCents: 35000 },
  { id: "full-body-burn", name: "Full Body Burn", durationMinutes: 55, priceCents: 35000 },
  { id: "flow-full-body", name: "Flow Full Body", durationMinutes: 55, priceCents: 35000 },
  { id: "stretching-meditation", name: "Stretching & Meditation", durationMinutes: 55, priceCents: 35000 },
  { id: "reformer-burn", name: "Reformer Burn", durationMinutes: 55, priceCents: 35000 },
  // Temporary test service — remove once emails are confirmed working
  { id: "prueba-email", name: "Clase Prueba (Test)", durationMinutes: 55, priceCents: 1000 },
] as const;

export type ServiceId = (typeof SERVICES)[number]["id"];

export const STUDIO_TIME_ZONE = "America/Mexico_City";

/**
 * Exact Reformer Burn weekly schedule.
 * Keys are JS day numbers: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat.
 * Values are [hour, minute] pairs in 24h format.
 */
export const REFORMER_BURN_SCHEDULE: Record<number, [number, number][]> = {
  1: [[7,10],[8,10],[9,10],[10,10],[11,10],[12,10],[13,10],[18,10],[19,10],[20,10]],
  2: [[7,10],[8,10],[9,10],[10,10],[11,10],[12,10],[13,10],[18,10],[19,10],[20,10]],
  3: [[7,10],[8,10],[9,10],[10,10],[11,10],[12,10],[13,10],[18,10],[19,10],[20,10]],
  4: [[7,10],[8,10],[9,10],[10,10],[11,10],[12,10],[13,10],[18,10],[19,10],[20,10]],
  5: [[7,10],[8,10],[9,10],[10,10],[11,10],[12,10],[13,10],[14,10],[15,10],[16,10]],
  6: [[10,10],[11,10],[12,10],[13,10]],
};

/**
 * Generate available slot times for a date range using the real schedule.
 */
export function getSlotsForDateRange(
  fromDate: Date,
  toDate: Date,
): { date: string; hour: number; minute: number }[] {
  const slots: { date: string; hour: number; minute: number }[] = [];
  const cur = new Date(fromDate);
  cur.setHours(0, 0, 0, 0);

  while (cur <= toDate) {
    const day = cur.getDay();
    const times = REFORMER_BURN_SCHEDULE[day] ?? [];
    for (const [hour, minute] of times) {
      slots.push({
        date: cur.toISOString().slice(0, 10),
        hour,
        minute,
      });
    }
    cur.setDate(cur.getDate() + 1);
  }
  return slots;
}

/**
 * Convert a slot to a unique ISO-like string ID.
 */
export function slotToId(date: string, hour: number, minute: number): string {
  return `${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
}

function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  );

  const zonedTime = Date.UTC(
    values.year,
    values.month - 1,
    values.day,
    values.hour,
    values.minute,
    values.second,
  );

  return zonedTime - date.getTime();
}

export function getSlotStartsAt(
  date: string,
  hour: number,
  minute: number,
  timeZone = STUDIO_TIME_ZONE,
): Date {
  const [year, month, day] = date.split("-").map(Number);
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const offset = getTimeZoneOffsetMs(utcGuess, timeZone);

  return new Date(utcGuess.getTime() - offset);
}

export function slotFromId(slotId: string): { date: string; hour: number; minute: number } {
  const [date, time] = slotId.split("T");
  const [h, m] = (time || "00:00:00").split(":").map(Number);
  return { date: date || "", hour: h || 0, minute: m || 0 };
}
