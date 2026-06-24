import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { updateMemberProfile } from "./actions";
import { MEMBER_PACKAGES } from "@/lib/member-packages";
import { ensureMemberProfile, getMemberDashboardData } from "@/lib/members";
import { createSupabaseServerClient, hasSupabaseConfig } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Mexico_City",
  }).format(new Date(value));
}

function formatMoney(cents: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reserved?: string; purchase?: string; profile?: string }>;
}) {
  const params = await searchParams;

  if (!hasSupabaseConfig()) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-28 pb-16 px-4">
          <section className="max-w-2xl mx-auto glass-card p-8 sm:p-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral mb-4">
              Dashboard
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Falta configurar Supabase
            </h1>
            <p className="text-warm-gray leading-relaxed">
              El dashboard está construido, pero necesita las variables de Supabase
              y correr el archivo supabase/schema.sql para activarse.
            </p>
          </section>
        </main>
      </>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase!.auth.getUser();

  if (!data.user) redirect("/login");

  await ensureMemberProfile(data.user);
  const dashboardData = await getMemberDashboardData(data.user.id);

  if (!dashboardData) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-28 pb-16 px-4">
          <section className="max-w-2xl mx-auto glass-card p-8 sm:p-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-4">
              No pudimos cargar tu cuenta
            </h1>
            <p className="text-warm-gray">
              Revisa que la base de datos de Supabase esté configurada.
            </p>
          </section>
        </main>
      </>
    );
  }

  const { profile, upcomingReservations, pastReservations, purchases } = dashboardData;
  const needsProfile = !profile.full_name;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <section className="glass-card p-8 sm:p-10">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral mb-4">
                  Mi dashboard
                </p>
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">
                  Hola{profile.full_name ? `, ${profile.full_name}` : ""}
                </h1>
                <p className="text-warm-gray max-w-xl leading-relaxed">
                  Aquí puedes revisar tus clases disponibles, reservar tu siguiente
                  sesión y comprar más paquetes.
                </p>
              </div>
              <a href="/logout" className="text-sm font-semibold text-warm-gray hover:text-coral">
                Cerrar sesión
              </a>
            </div>
          </section>

          {(params.reserved || params.purchase || params.error || params.profile) && (
            <div className="rounded-2xl border border-coral/20 bg-coral/10 px-4 py-3 text-sm text-coral">
              {params.reserved === "success" && "Tu clase quedó reservada."}
              {params.purchase === "success" && "Pago recibido. Tus clases se agregarán en cuanto Stripe confirme el pago."}
              {params.purchase === "cancelled" && "El pago fue cancelado."}
              {params.profile === "updated" && "Tu perfil quedó actualizado."}
              {params.profile === "missing-name" && "Agrega tu nombre para que el estudio identifique tus reservas."}
              {params.profile === "error" && "No pudimos actualizar tu perfil. Intenta de nuevo."}
              {params.error === "no-credits" && "No tienes clases disponibles. Compra un paquete para reservar."}
              {params.error && !["no-credits"].includes(params.error) && `Error: ${params.error}`}
            </div>
          )}

          <section id="perfil" className={`glass-card p-8 ${needsProfile ? "border-coral/40" : ""}`}>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral mb-3">
                  Tus datos
                </p>
                <h2 className="text-2xl font-bold mb-2">
                  {needsProfile ? "Completa tu perfil" : "Perfil de reserva"}
                </h2>
                <p className="text-warm-gray max-w-2xl leading-relaxed">
                  Estos datos aparecen en las notificaciones del estudio para que
                  puedan identificar quién reservó, cuándo y cómo contactarte si es necesario.
                </p>
              </div>
              {needsProfile && (
                <span className="self-start rounded-full bg-coral/10 px-4 py-2 text-sm font-semibold text-coral">
                  Requerido para reservas claras
                </span>
              )}
            </div>

            <form action={updateMemberProfile} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 md:items-end">
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold mb-2">
                  Nombre completo
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  defaultValue={profile.full_name ?? ""}
                  placeholder="Ej. Alexa Aguila"
                  className="w-full rounded-2xl border border-peach/50 bg-white/70 px-4 py-3 outline-none transition-colors focus:border-coral"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                  Teléfono
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={profile.phone ?? ""}
                  placeholder="Ej. 55 1234 5678"
                  className="w-full rounded-2xl border border-peach/50 bg-white/70 px-4 py-3 outline-none transition-colors focus:border-coral"
                />
              </div>
              <button className="rounded-full bg-coral px-6 py-3 font-semibold text-white hover:bg-coral-dark transition-colors shadow-md shadow-coral/20">
                Guardar
              </button>
            </form>
            <p className="mt-4 text-sm text-warm-gray">
              Email de acceso: <span className="font-medium text-foreground">{profile.email}</span>
            </p>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6">
            <div className="glass-card p-8">
              <p className="text-sm text-warm-gray mb-2">Clases disponibles</p>
              <div className="flex items-end gap-3 mb-6">
                <span className="text-6xl font-bold text-coral tabular-nums">
                  {profile.class_credits_remaining}
                </span>
                <span className="text-warm-gray pb-2">clases</span>
              </div>
              <Link
                href="/dashboard/reservar"
                className="inline-flex justify-center rounded-full bg-coral px-6 py-3 font-semibold text-white hover:bg-coral-dark transition-colors shadow-md shadow-coral/20"
              >
                Reservar una clase
              </Link>
            </div>

            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-5">Próximas reservas</h2>
              {upcomingReservations.length > 0 ? (
                <div className="space-y-3">
                  {upcomingReservations.map((reservation) => (
                    <div key={reservation.id} className="rounded-2xl bg-white/60 border border-peach/40 p-4">
                      <p className="font-semibold">{reservation.service_name}</p>
                      <p className="text-sm text-warm-gray">{formatDate(reservation.starts_at)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-warm-gray">Aún no tienes clases reservadas.</p>
              )}
            </div>
          </section>

          <section className="glass-card p-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Comprar más clases</h2>
                <p className="text-warm-gray">Elige un paquete para agregar créditos a tu cuenta.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MEMBER_PACKAGES.map((pkg) => (
                <form key={pkg.id} action="/api/member-package-checkout" method="post" className="rounded-[20px] border border-peach/40 bg-white/60 p-5 flex flex-col">
                  <input type="hidden" name="packageId" value={pkg.id} />
                  <h3 className="font-bold text-lg mb-1">{pkg.name}</h3>
                  <p className="text-sm text-warm-gray mb-4">{pkg.classes} clases</p>
                  <p className="text-3xl font-bold mb-5">{formatMoney(pkg.priceCents)}</p>
                  <button className="mt-auto rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-dark transition-colors">
                    Comprar
                  </button>
                </form>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-5">Historial de clases</h2>
              {pastReservations.length > 0 ? (
                <div className="space-y-3">
                  {pastReservations.map((reservation) => (
                    <div key={reservation.id} className="flex justify-between gap-4 border-b border-peach/30 pb-3 last:border-0">
                      <span className="font-medium">{reservation.service_name}</span>
                      <span className="text-sm text-warm-gray text-right">{formatDate(reservation.starts_at)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-warm-gray">Tu historial aparecerá aquí.</p>
              )}
            </div>

            <div className="glass-card p-8">
              <h2 className="text-xl font-bold mb-5">Compras recientes</h2>
              {purchases.length > 0 ? (
                <div className="space-y-3">
                  {purchases.map((purchase) => (
                    <div key={purchase.id} className="flex justify-between gap-4 border-b border-peach/30 pb-3 last:border-0">
                      <div>
                        <p className="font-medium">{purchase.package_name}</p>
                        <p className="text-sm text-warm-gray">+{purchase.classes_added} clases</p>
                      </div>
                      <span className="text-sm text-warm-gray">{formatMoney(purchase.amount_cents)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-warm-gray">Tus compras aparecerán aquí.</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
