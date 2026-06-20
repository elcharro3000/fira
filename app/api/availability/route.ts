import { NextRequest, NextResponse } from "next/server";
import {
  getSlotsForDateRange,
  slotToId,
  SERVICES,
  type ServiceId,
} from "@/lib/schedule";
import { getPaidBookingsForSlot } from "@/lib/bookings-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("serviceId") as ServiceId | null;
    const from = searchParams.get("from"); // YYYY-MM-DD
    const to = searchParams.get("to");

    if (!from || !to) {
      return NextResponse.json(
        { error: "from and to (YYYY-MM-DD) required" },
        { status: 400 }
      );
    }

    const fromDate = new Date(from + "T00:00:00");
    const toDate = new Date(to + "T23:59:59");
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
    }

    const allSlots = getSlotsForDateRange(fromDate, toDate);
    const bookedSlotIds = new Set<string>();
    for (const slot of allSlots) {
      const slotId = slotToId(slot.date, slot.hour, slot.minute);
      const paid = getPaidBookingsForSlot(slotId);
      if (paid.length > 0) bookedSlotIds.add(slotId);
    }

    const available = allSlots
      .filter((s) => !bookedSlotIds.has(slotToId(s.date, s.hour, s.minute)))
      .map((s) => ({
        date: s.date,
        hour: s.hour,
        minute: s.minute,
        slotId: slotToId(s.date, s.hour, s.minute),
      }));

    return NextResponse.json({
      slots: available,
      services: serviceId
        ? SERVICES.filter((s) => s.id === serviceId)
        : SERVICES,
    });
  } catch (e) {
    console.error("availability", e);
    return NextResponse.json(
      { error: "Failed to load availability" },
      { status: 500 }
    );
  }
}
