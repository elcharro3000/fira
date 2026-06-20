"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { REFORMER_BURN_SCHEDULE } from "@/lib/schedule";

interface Slot {
  date: string;
  hour: number;
  minute: number;
  slotId: string;
}

const SERVICE_ID = "reformer-burn";
const SERVICE_NAME = "Reformer Burn";

const DAY_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTH_LABELS = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatSlotTime(hour: number, minute: number): string {
  const period = hour < 12 ? "am" : "pm";
  const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${h}:${String(minute).padStart(2, "0")} ${period}`;
}

function formatDateRange(monday: Date): string {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const m1 = MONTH_LABELS[monday.getMonth()];
  const m2 = MONTH_LABELS[sunday.getMonth()];
  const sameMonth = monday.getMonth() === sunday.getMonth();
  return sameMonth
    ? `${monday.getDate()} – ${sunday.getDate()} ${m1} ${monday.getFullYear()}`
    : `${monday.getDate()} ${m1} – ${sunday.getDate()} ${m2} ${monday.getFullYear()}`;
}

export default function CalendarioPage() {
  const router = useRouter();
  const [monday, setMonday] = useState<Date>(() => getMondayOfWeek(new Date()));
  const [availableSlotIds, setAvailableSlotIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  const fromStr = weekDays[0].toISOString().slice(0, 10);
  const toStr = weekDays[6].toISOString().slice(0, 10);

  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/availability?from=${fromStr}&to=${toStr}&serviceId=${SERVICE_ID}`
      );
      const data = await res.json();
      if (data.slots) {
        setAvailableSlotIds(new Set((data.slots as Slot[]).map((s) => s.slotId)));
      }
    } finally {
      setLoading(false);
    }
  }, [fromStr, toStr]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const prevWeek = () => {
    const d = new Date(monday);
    d.setDate(d.getDate() - 7);
    setMonday(d);
  };

  const nextWeek = () => {
    const d = new Date(monday);
    d.setDate(d.getDate() + 7);
    setMonday(d);
  };

  const handleReservar = (slotId: string) => {
    router.push(`/reserva?serviceId=${SERVICE_ID}&slotId=${encodeURIComponent(slotId)}`);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Collect all unique times across the week for row labels
  const allTimes = new Set<string>();
  weekDays.forEach((day) => {
    const times = REFORMER_BURN_SCHEDULE[day.getDay()] ?? [];
    times.forEach(([h, m]) => allTimes.add(`${h}:${String(m).padStart(2, "0")}`));
  });
  const sortedTimes = Array.from(allTimes).sort((a, b) => {
    const [ah, am] = a.split(":").map(Number);
    const [bh, bm] = b.split(":").map(Number);
    return ah !== bh ? ah - bh : am - bm;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-16 px-2 sm:px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              Calendario de{" "}
              <span className="font-[family-name:var(--font-playfair)] italic text-coral">
                clases
              </span>
            </h1>
            <p className="text-warm-gray">
              Selecciona una clase para reservar tu lugar.
            </p>
          </div>

          {/* Week navigation */}
          <div className="flex items-center justify-between mb-6 glass-card px-4 py-3">
            <button
              onClick={prevWeek}
              className="flex items-center gap-1 text-sm font-medium text-warm-gray hover:text-coral transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Semana anterior
            </button>
            <span className="font-semibold text-sm sm:text-base">
              {formatDateRange(monday)}
            </span>
            <button
              onClick={nextWeek}
              className="flex items-center gap-1 text-sm font-medium text-warm-gray hover:text-coral transition-colors"
            >
              Semana siguiente
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Calendar grid */}
          {loading ? (
            <div className="text-center py-20 text-warm-gray">Cargando horarios...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-1.5 min-w-[640px]">
                <thead>
                  <tr>
                    {/* Time label column header */}
                    <th className="w-20" />
                    {weekDays.map((day, i) => {
                      const isToday = day.toDateString() === new Date().toDateString();
                      return (
                        <th key={i} className="text-center pb-2">
                          <div
                            className={`text-xs font-medium uppercase tracking-wide ${
                              isToday ? "text-coral" : "text-warm-gray"
                            }`}
                          >
                            {DAY_LABELS[day.getDay()]}
                          </div>
                          <div
                            className={`text-lg font-bold mt-0.5 w-9 h-9 mx-auto flex items-center justify-center rounded-full ${
                              isToday
                                ? "bg-coral text-white"
                                : "text-foreground"
                            }`}
                          >
                            {day.getDate()}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {sortedTimes.map((timeStr) => {
                    const [rowH, rowM] = timeStr.split(":").map(Number);
                    return (
                      <tr key={timeStr}>
                        {/* Time label */}
                        <td className="text-right pr-3 text-xs text-warm-gray whitespace-nowrap py-1">
                          {formatSlotTime(rowH, rowM)}
                        </td>
                        {weekDays.map((day, di) => {
                          const times = REFORMER_BURN_SCHEDULE[day.getDay()] ?? [];
                          const hasSlot = times.some(([h, m]) => h === rowH && m === rowM);
                          if (!hasSlot) {
                            return <td key={di} />;
                          }
                          const dateStr = day.toISOString().slice(0, 10);
                          const slotId = `${dateStr}T${String(rowH).padStart(2, "0")}:${String(rowM).padStart(2, "0")}:00`;
                          const isPast = day < today;
                          const isAvailable = availableSlotIds.has(slotId);
                          const bookable = !isPast && isAvailable;

                          return (
                            <td key={di} className="p-0">
                              <div
                                className={`rounded-xl p-2 text-center transition-all duration-200 ${
                                  bookable
                                    ? "bg-white/70 border border-peach/40 hover:border-coral/50 hover:bg-rose-glow/40 cursor-pointer"
                                    : isPast
                                    ? "bg-white/30 border border-peach/20 opacity-40"
                                    : "bg-coral/10 border border-coral/20 opacity-60"
                                }`}
                              >
                                <p className="text-xs font-medium text-foreground mb-1">
                                  {SERVICE_NAME}
                                </p>
                                {bookable ? (
                                  <button
                                    onClick={() => handleReservar(slotId)}
                                    className="w-full text-xs font-semibold text-coral hover:text-coral-dark transition-colors"
                                  >
                                    Reservar
                                  </button>
                                ) : (
                                  <span className="text-xs text-warm-gray">
                                    {isPast ? "Pasado" : "Lleno"}
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center gap-6 mt-6 justify-center text-xs text-warm-gray">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-white border border-peach/40" />
              Disponible
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-coral/10 border border-coral/20" />
              Lleno
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-white/30 border border-peach/20 opacity-40" />
              Pasado
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
