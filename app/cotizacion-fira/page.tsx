import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cotización FIRA Wellness Club",
  robots: {
    index: false,
    follow: false,
  },
};

const includedItems = [
  "Página web premium para presentar FIRA",
  "Calendario de clases conectado a Google Sheets",
  "Reservas en línea",
  "Pagos con Stripe",
  "Correos automáticos de confirmación",
  "Notificaciones al teléfono del equipo",
  "Dashboard para clientas",
  "Control de paquetes y créditos",
  "Carga inicial de clases en la página y calendario",
  "Configuración del sitio en producción",
];

const monthlyItems = [
  "Hosting administrado en Vercel con SSL y monitoreo",
  "Dominio estándar incluido el primer año",
  "Soporte prioritario por WhatsApp con respuesta en 24h hábiles",
  "Hasta 6 cambios ligeros al mes",
  "SEO básico y optimización continua",
  "Reporte mensual y recomendaciones de mejora",
  "Mantenimiento preventivo del sitio",
];

export default function FiraQuotePage() {
  return (
    <>
      <main className="min-h-screen px-4 py-10 sm:py-14">
        <section className="mx-auto max-w-5xl pt-8 sm:pt-12">
          <div className="reveal-up glass-card p-6 text-center sm:p-10 lg:p-12">
            <span className="mb-5 inline-flex rounded-full border border-coral/20 bg-coral/10 px-4 py-2 text-sm font-semibold text-coral">
              Cotización privada ✨
            </span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              FIRA Wellness Club
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-warm-gray sm:text-lg">
              Sitio web, reservas, pagos y dashboard para que las clientas puedan
              comprar paquetes, ver sus clases disponibles y reservar fácil.
              Precio con descuento amigos y familia para la etapa actual del estudio.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="reveal-up glass-card border border-coral/30 p-6 sm:p-8 reveal-delay-1">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-coral">
              Plan Business 🌿
            </p>
            <h2 className="mt-4 text-4xl font-bold text-coral sm:text-5xl">
              $3,500 MXN / mes
            </h2>
            <p className="mt-4 text-base leading-relaxed text-warm-gray">
              Plan Business de TopSitio — hosting, soporte prioritario, SEO básico
              y hasta 6 cambios ligeros al mes. Incluye mantenimiento del sitio,
              monitoreo y optimización continua para que FIRA siempre funcione bien.
            </p>
            <div className="mt-6 space-y-3">
              {monthlyItems.map((item) => (
                <div key={item} className="rounded-2xl bg-white/60 p-4 text-sm text-warm-gray dark:bg-white/5">
                  ✅ {item}
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-up glass-card p-6 sm:p-8 reveal-delay-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-warm-gray">
              Inversión inicial 💻
            </p>
            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
              <span className="text-coral line-through decoration-2">$68,000 MXN</span>
              <span className="ml-3">$6,800 MXN</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-warm-gray">
              Pago único por construir y dejar funcionando la plataforma completa.
            </p>
            <div className="mt-6 rounded-[24px] bg-coral/10 p-5 text-sm leading-relaxed text-warm-gray">
              <strong className="text-foreground">Descuento amigos y familia:</strong> 90% de descuento
              sobre el precio regular de $68,000 MXN. Precio especial exclusivo por la etapa actual del estudio.
            </div>
          </div>
        </section>

        <section className="mx-auto mt-8 max-w-5xl">
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-bold">Qué incluye 🚀</h2>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {includedItems.map((item) => (
                <div key={item} className="rounded-2xl border border-peach/30 bg-white/60 p-4 text-sm leading-relaxed text-warm-gray dark:bg-white/5">
                  ✨ {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3">
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold">Menos WhatsApp 📲</h3>
            <p className="mt-3 text-sm leading-relaxed text-warm-gray">
              Las clientas pueden reservar y comprar sin que el equipo tenga que hacer todo manualmente.
            </p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold">Más orden 🧘</h3>
            <p className="mt-3 text-sm leading-relaxed text-warm-gray">
              Paquetes, créditos, reservas y datos de contacto quedan en un flujo más claro.
            </p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold">Más confianza 💳</h3>
            <p className="mt-3 text-sm leading-relaxed text-warm-gray">
              El sitio se ve profesional y permite pagar, confirmar y reservar desde un mismo lugar.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-8 max-w-5xl">
          <div className="glass-card border border-coral/20 p-6 text-center sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-coral">
              Resumen claro 💗
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              $6,800 MXN inicial + $3,500 MXN mensuales
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-warm-gray sm:text-base">
              Descuento amigos y familia del 90% en la inversión inicial.
              El plan Business mensual de TopSitio mantiene el sitio funcionando,
              optimizado y con soporte prioritario.
            </p>
          </div>
        </section>

        <div className="mx-auto mt-8 max-w-5xl text-center">
          <a
            href="https://topsitio.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block transition-opacity hover:opacity-80"
          >
            <img
              src="/topsitio-logo-light.png"
              alt="TopSitio"
              className="block h-20 w-auto dark:hidden"
            />
            <img
              src="/topsitio-logo-dark.png"
              alt="TopSitio"
              className="hidden h-20 w-auto dark:block"
            />
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
