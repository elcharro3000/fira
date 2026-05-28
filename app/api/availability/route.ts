import { NextRequest, NextResponse } from "next/server";
import { getPaidBookingsForSlot } from "@/lib/bookings-store";
import { getSheetScheduleSlots } from "@/lib/google-sheets-schedule";
import { getSlotStartsAt } from "@/lib/schedule";

export const dynamic = "force-dynamic";

function parseDateParam(value: string | null): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const from = parseDateParam(searchParams.get("from"));
  const to = parseDateParam(searchParams.get("to"));

  if (!from || !to || from > to) {
    return NextResponse.json(
      { error: "Invalid date range" },
      { status: 400 },
    );
  }

  try {
    const now = new Date();
    const slots = (await getSheetScheduleSlots(from, to)).map((slot) => {
      const startsAt = getSlotStartsAt(slot.date, slot.hour, slot.minute);
      const bookedCount = getPaidBookingsForSlot(slot.slotId).length;
      const spotsLeft = Math.max(slot.capacity - bookedCount, 0);

      return {
        ...slot,
        available: spotsLeft > 0 && startsAt >= now,
        spotsLeft,
        startsAt: startsAt.toISOString(),
      };
    });

    return NextResponse.json(
      { slots },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("availability sheet fetch failed", error);
    return NextResponse.json(
      { error: "Schedule unavailable", slots: [] },
      { status: 503 },
    );
  }
}
