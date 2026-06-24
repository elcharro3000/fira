import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getSheetScheduleSlots } from "@/lib/google-sheets-schedule";
import { ensureMemberProfile } from "@/lib/members";
import { getSlotStartsAt } from "@/lib/schedule";
import { createSupabaseServerClient, hasSupabaseConfig } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("es-MX", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Mexico_City",
  }).format(value);
}

export default async function MemberReservePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  if (!hasSupabaseConfig()) redirect("/dashboard");

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase!.auth.getUser();
  if (!data.user) redirect("/login");

  const profile = await ensureMemberProfile(data.user);
  const from = new Date();
  from.setHours(0, 0, 0, 0);
  const to = new Date(from);
  to.setDate(to.getDate() + 10);

  const slots = (await getSheetScheduleSlots(from, to))
    .map((slot) => ({
      ...slot,
      startsAt: getSlotStartsAt(slot.date, slot.hour, slot.minute),
    }))
    .filter((slot) => slot.startsAt >= new Date())
    .slice(0, 30);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <section className="glass-card p-8 sm:p-10">
            <Link href="/dashboard" className="text-sm font-semibold text-coral hover:text-coral-dark">
              ← Volver al dashboard
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-5 mb-3">
              Reserva una clase
            </h1>
            <p className="text-warm-gray">
              Tienes {profile?.class_credits_remaining ?? 0} clases disponibles.
            </p>
          </section>

          {params.error && (
            <div className="rounded-2xl border border-coral/20 bg-coral/10 px-4 py-3 text-sm text-coral">
              No pudimos reservar: {params.error}
            </div>
          )}

          <section className="glass-card p-6 sm:p-8">
            <div className="space-y-3">
              {slots.map((slot) => (
                <form
                  key={slot.slotId}
                  action="/api/member-reservations"
                  method="post"
                  className="rounded-2xl border border-peach/40 bg-white/60 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <input type="hidden" name="slotId" value={slot.slotId} />
                  <input type="hidden" name="serviceId" value={slot.serviceId} />
                  <input type="hidden" name="serviceName" value={slot.className} />
                  <div>
                    <p className="font-semibold">{slot.className}</p>
                    <p className="text-sm text-warm-gray">{formatDate(slot.startsAt)}</p>
                  </div>
                  <button
                    disabled={(profile?.class_credits_remaining ?? 0) <= 0}
                    className="rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                  >
                    Reservar
                  </button>
                </form>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
