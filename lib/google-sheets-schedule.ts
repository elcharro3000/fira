import { getSlotsForDateRange, slotToId } from "@/lib/schedule";

const DEFAULT_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRfXGcoeOUt8KYg_ETt7Vq5CQJF6wGUoNvObZ4FUq9yMV9SEfql3p42RQG4iPSjzF08vvygoqyz7t8I/pub?gid=0&single=true&output=csv";

const DAY_NAMES: Record<string, number> = {
  sunday: 0,
  domingo: 0,
  sun: 0,
  monday: 1,
  lunes: 1,
  mon: 1,
  tuesday: 2,
  martes: 2,
  tue: 2,
  wednesday: 3,
  miercoles: 3,
  miércoles: 3,
  wed: 3,
  thursday: 4,
  jueves: 4,
  thu: 4,
  friday: 5,
  viernes: 5,
  fri: 5,
  saturday: 6,
  sabado: 6,
  sábado: 6,
  sat: 6,
};

export interface SheetScheduleSlot {
  date: string;
  hour: number;
  minute: number;
  className: string;
  capacity: number;
  slotId: string;
}

interface SheetScheduleRow {
  date: string;
  day: string;
  time: string;
  class_name: string;
  capacity: string;
  active: string;
}

function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < csv.length; i += 1) {
    const char = csv[i];
    const next = csv[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(field.trim());
      field = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(field.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  row.push(field.trim());
  if (row.some(Boolean)) rows.push(row);

  return rows;
}

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase().replace(/\s+/g, "_");
}

function rowsFromCsv(csv: string): SheetScheduleRow[] {
  const rows = parseCsv(csv);
  const headers = rows[0]?.map(normalizeHeader) ?? [];

  return rows.slice(1).map((values) => {
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    return {
      date: row.date ?? "",
      day: row.day ?? "",
      time: row.time ?? "",
      class_name: row.class_name ?? row.class ?? "Reformer Burn",
      capacity: row.capacity ?? "8",
      active: row.active ?? "TRUE",
    };
  });
}

function parseTime(time: string): { hour: number; minute: number } | null {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;

  return { hour, minute };
}

function parseDate(value: string): string | null {
  const date = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;

  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : date;
}

function parseDay(value: string): number | null {
  const normalized = value.trim().toLowerCase();
  return DAY_NAMES[normalized] ?? null;
}

function isActive(value: string): boolean {
  return !["false", "no", "0", "inactive", "inactivo"].includes(
    value.trim().toLowerCase(),
  );
}

function datesInRangeForDay(fromDate: Date, toDate: Date, day: number): string[] {
  const dates: string[] = [];
  const current = new Date(fromDate);
  current.setHours(0, 0, 0, 0);

  while (current <= toDate) {
    if (current.getDay() === day) {
      dates.push(current.toISOString().slice(0, 10));
    }
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export async function getSheetScheduleSlots(
  fromDate: Date,
  toDate: Date,
): Promise<SheetScheduleSlot[]> {
  const csvUrl = process.env.GOOGLE_SHEET_CSV_URL ?? DEFAULT_SHEET_CSV_URL;
  const response = await fetch(csvUrl, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Google Sheet schedule fetch failed: ${response.status}`);
  }

  const rows = rowsFromCsv(await response.text());
  if (rows.length === 0) {
    return getSlotsForDateRange(fromDate, toDate).map((slot) => ({
      ...slot,
      className: "Reformer Burn",
      capacity: 8,
      slotId: slotToId(slot.date, slot.hour, slot.minute),
    }));
  }

  const slots = new Map<string, SheetScheduleSlot>();
  const cancelledSlotIds = new Set<string>();

  for (const row of rows) {
    const time = parseTime(row.time);
    const capacity = Number(row.capacity) || 8;
    const className = row.class_name || "Reformer Burn";
    if (!time || capacity <= 0) continue;

    const date = parseDate(row.date);
    const dates = date
      ? [date]
      : datesInRangeForDay(fromDate, toDate, parseDay(row.day) ?? -1);

    for (const slotDate of dates) {
      const slotDateObj = new Date(`${slotDate}T00:00:00`);
      if (slotDateObj < fromDate || slotDateObj > toDate) continue;

      const slotId = slotToId(slotDate, time.hour, time.minute);
      if (!isActive(row.active)) {
        cancelledSlotIds.add(slotId);
        continue;
      }

      slots.set(slotId, {
        date: slotDate,
        hour: time.hour,
        minute: time.minute,
        className,
        capacity,
        slotId,
      });
    }
  }

  cancelledSlotIds.forEach((slotId) => slots.delete(slotId));

  return Array.from(slots.values()).sort((a, b) => a.slotId.localeCompare(b.slotId));
}
