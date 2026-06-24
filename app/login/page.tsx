import Navbar from "@/components/Navbar";
import { hasSupabaseConfig } from "@/lib/supabase/server";
import { signInWithEmail } from "./actions";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const params = await searchParams;
  const configured = hasSupabaseConfig();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-16 px-4">
        <section className="max-w-xl mx-auto glass-card p-8 sm:p-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral mb-4">
            Mi cuenta
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Entra a tu dashboard
          </h1>
          <p className="text-warm-gray mb-8 leading-relaxed">
            Recibe un link seguro por correo para ver tus clases disponibles,
            reservar y comprar más paquetes.
          </p>

          {!configured && (
            <div className="mb-6 rounded-2xl border border-coral/20 bg-coral/10 px-4 py-3 text-sm text-coral text-left">
              Supabase todavía no está configurado. Agrega las variables
              NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY para activar el login.
            </div>
          )}

          {params.sent && (
            <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 text-left">
              Enviamos un link de acceso a {params.sent}. Revisa tu correo.
            </div>
          )}

          {params.error && (
            <div className="mb-6 rounded-2xl border border-coral/20 bg-coral/10 px-4 py-3 text-sm text-coral text-left">
              No pudimos iniciar sesión: {params.error}
            </div>
          )}

          <form action={signInWithEmail} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={!configured}
                className="w-full rounded-2xl border border-peach/50 bg-white/70 px-4 py-3 outline-none transition-colors focus:border-coral disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="tu@email.com"
              />
            </div>
            <button
              type="submit"
              disabled={!configured}
              className="w-full rounded-full bg-coral px-6 py-3 font-semibold text-white hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-60 transition-colors shadow-md shadow-coral/20"
            >
              Enviar link de acceso
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
