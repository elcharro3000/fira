export type ServiceId = "reformer-burn" | "prueba-email";

export interface Service {
  id: ServiceId;
  name: string;
  priceCents: number;
}

export const SERVICES: Service[] = [
  {
    id: "reformer-burn",
    name: "Reformer Burn",
    priceCents: 35000,
  },
  {
    id: "prueba-email",
    name: "Clase Prueba (Test)",
    priceCents: 1000,
  },
];

// Day-of-week schedule: 0=Sunday, 1=Monday, ..., 6=Saturday
// Each entry is [hour, minute] in 24h
export const REFORMER_BURN_SCHEDULE: Record<number, [number, number][]> = {
  0: [], // Sunday — closed
  1: [[7, 0], [8, 0], [9, 0], [10, 0], [17, 0], [18, 0], [19, 0]],
  2: [[7, 0], [8, 0], [9, 0], [10, 0], [17, 0], [18, 0], [19, 0]],
  3: [[7, 0], [8, 0], [9, 0], [10, 0], [17, 0], [18, 0], [19, 0]],
  4: [[7, 0], [8, 0], [9, 0], [10, 0], [17, 0], [18, 0], [19, 0]],
  5: [[7, 0], [8, 0], [9, 0], [10, 0], [17, 0], [18, 0], [19, 0]],
  6: [[8, 0], [9, 0], [10, 0], [11, 0]], // Saturday
};

const SCHEDULE_BY_SERVICE: Record<ServiceId, Record<number, [number, number][]>> = {
  "reformer-burn": REFORMER_BURN_SCHEDULE,
  "prueba-email": {
    0: [[10, 0]], 1: [[10, 0]], 2: [[10, 0]],
    3: [[10, 0]], 4: [[10, 0]], 5: [[10, 0]], 6: [[10, 0]],
  },
};

export interface Slot {
  date: string; // YYYY-MM-DD
  hour: number;
  minute: number;
  serviceId: ServiceId;
}

export function slotToId(date: string, hour: number, minute: number): string {
  return `${date}_${String(hour).padStart(2, "0")}_${String(minute).padStart(2, "0")}`;
}

export function slotFromId(slotId: string): { date: string; hour: number; minute: number } {
  const parts = slotId.split("_");
  return {
    date: parts[0],
    hour: parseInt(parts[1], 10),
    minute: parseInt(parts[2], 10),
  };
}

export function getSlotsForDateRange(
  from: Date,
  to: Date,
  serviceId: ServiceId = "reformer-burn"
): Slot[] {
  const schedule = SCHEDULE_BY_SERVICE[serviceId] ?? REFORMER_BURN_SCHEDULE;
  const slots: Slot[] = [];
  const now = new Date();

  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);

  while (cursor <= to) {
    const dow = cursor.getDay();
    const times = schedule[dow] ?? [];
    const dateStr = cursor.toISOString().slice(0, 10);

    for (const [h, m] of times) {
      const slotTime = new Date(`${dateStr}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`);
      if (slotTime > now) {
        slots.push({ date: dateStr, hour: h, minute: m, serviceId });
      }
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return slots;
}
