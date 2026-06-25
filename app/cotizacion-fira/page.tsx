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
  "Sitio web premium responsivo para FIRA Wellness Club.",
  "Secciones de inicio, beneficios, clases, membresías, calendario y contacto.",
  "Calendario conectado a Google Sheets para actualizar horarios sin tocar código.",
  "Reservas en línea con disponibilidad por clase.",
  "Pagos con Stripe Checkout.",
  "Correos de confirmación para clientas y notificaciones para el estudio.",
  "Notificaciones al teléfono del equipo cuando entra una reserva.",
  "Dashboard para clientas con clases disponibles, historial y nuevas reservas.",
  "Compra de paquetes desde el dashboard y suma automática de créditos.",
  "Configuración en producción con dominio, hosting y base de datos.",
];

const valueItems = [
  {
    title: "Menos trabajo manual",
    text: "El equipo puede recibir reservas, pagos y notificaciones sin responder todo por WhatsApp desde cero.",
  },
  {
    title: "Más claridad para la clienta",
    text: "Cada persona puede ver sus clases disponibles y reservar desde su propio dashboard.",
  },
  {
    title: "Operación más ordenada",
    text: "Los pagos, créditos, reservas y datos de contacto quedan conectados en un solo flujo.",
  },
];

const maintenanceItems = [
  "Revisión de Vercel, dominio y deploys.",
  "Monitoreo de Stripe, Supabase, Resend y notificaciones.",
  "Soporte si una reserva, correo o pago no entra correctamente.",
  "Cambios menores de texto, precios, horarios o clases.",
  "Hasta 2 ajustes pequeños al mes incluidos.",
  "Revisión mensual básica de dependencias y funcionamiento.",
];

export default function FiraQuotePage() {
  return (
    <>
      <main className="min-h-screen px-4 py-10 sm:py-14">
        <section className="mx-auto max-w-6xl pt-8 sm:pt-12">
          <div className="reveal-up glass-card overflow-hidden p-6 sm:p-10 lg:p-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <span className="mb-5 inline-flex rounded-full border border-coral/20 bg-coral/10 px-4 py-2 text-sm font-semibold text-coral">
                  Cotización privada
                </span>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Proyecto digital para{" "}
                  <span className="font-[family-name:var(--font-playfair)] italic text-coral">
                    FIRA Wellness Club
                  </span>
                </h1>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-warm-gray sm:text-lg">
                  Una plataforma para presentar la marca, vender clases, manejar
                  reservas y dar a cada clienta un dashboard personal para sus
                  paquetes y créditos.
                </p>
              </div>

              <div className="rounded-[28px] border border-coral/20 bg-white/70 p-6 shadow-xl shadow-coral/10 dark:bg-white/5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-warm-gray">
                  Acompañamiento mensual
                </p>
                <p className="mt-3 text-5xl font-bold text-coral">$3,500</p>
                <p className="mt-1 text-sm font-semibold text-warm-gray">MXN / mes</p>
                <div className="mt-5 rounded-2xl bg-coral/10 p-4 text-sm leading-relaxed text-warm-gray">
                  Lo más importante después del lanzamiento: mantener reservas,
                  pagos, correos, dashboard y notificaciones funcionando todos los días.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-3">
          <div className="reveal-up glass-card border border-coral/30 p-6 reveal-delay-1 md:col-span-2">
            <p className="text-sm font-semibold text-coral">Inversión inicial preferencial</p>
            <p className="mt-3 text-3xl font-bold text-coral">$68,000</p>
            <p className="mt-3 text-sm leading-relaxed text-warm-gray">
              Precio único por el desarrollo completo: sitio, reservas, pagos,
              notificaciones, dashboard de clientas, configuración en producción y lanzamiento.
              El valor regular de un proyecto así sería mayor, pero se propone este precio
              preferencial para FIRA por la etapa actual del estudio.
            </p>
          </div>
          <div className="reveal-up glass-card p-6 reveal-delay-2">
            <p className="text-sm font-semibold text-warm-gray">Valor regular estimado</p>
            <p className="mt-3 text-3xl font-bold">$78,000</p>
            <p className="mt-3 text-sm leading-relaxed text-warm-gray">
              Referencia del valor completo considerando diseño, desarrollo, integraciones,
              pruebas, deploy y soporte de lanzamiento.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-8 max-w-6xl">
          <div className="glass-card border border-coral/30 p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral">
                  Mantenimiento mensual recomendado
                </p>
                <h2 className="mt-3 text-4xl font-bold text-coral">$3,500 MXN / mes</h2>
                <p className="mt-4 text-sm leading-relaxed text-warm-gray">
                  Esta es la parte más importante para que el sistema no se quede solo
                  como una página publicada. El mantenimiento mantiene vivo el flujo de
                  reservas, pagos, correos, dashboard y notificaciones del estudio.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {maintenanceItems.map((item) => (
                  <div key={item} className="rounded-2xl bg-white/60 p-4 text-sm leading-relaxed text-warm-gray dark:bg-white/5">
                    <span className="mr-2 font-bold text-coral">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-bold">Qué incluye el proyecto</h2>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {includedItems.map((item) => (
                <div key={item} className="rounded-2xl border border-peach/30 bg-white/60 p-4 text-sm leading-relaxed text-warm-gray dark:bg-white/5">
                  <span className="mr-2 font-bold text-coral">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="glass-card p-6 sm:p-8">
              <h2 className="text-2xl font-bold">Por qué tiene este valor</h2>
              <p className="mt-4 text-sm leading-relaxed text-warm-gray">
                No es solo una página informativa. Es un sistema operativo pequeño para el estudio:
                agenda, pagos, clientas, paquetes, créditos y notificaciones trabajando juntos.
              </p>
            </div>

            {valueItems.map((item) => (
              <div key={item.title} className="glass-card p-6">
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-warm-gray">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-8 max-w-6xl">
          <div className="glass-card p-6 sm:p-8 lg:p-10">
            <h2 className="text-2xl font-bold">Costos externos y operación</h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-warm-gray">
              El mantenimiento mensual cubre el cuidado técnico y soporte del sistema.
              Algunos servicios externos pueden tener costos propios según el uso.
            </p>
            <div className="mt-8 rounded-[24px] border border-peach/30 bg-white/60 p-5 text-sm leading-relaxed text-warm-gray dark:bg-white/5">
              <strong className="text-foreground">Costos externos:</strong> dominio, comisiones de Stripe,
              herramientas de correo, Vercel/Supabase si el uso crece, y cualquier servicio externo se cobra por
              separado al proveedor. El mantenimiento cubre administración y soporte técnico, no las comisiones de terceros.
            </div>
          </div>
        </section>

        <section className="mx-auto mt-8 max-w-6xl">
          <div className="glass-card border border-coral/20 p-6 text-center sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral">
              Resumen claro
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Inversión inicial: $68,000 MXN
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-warm-gray sm:text-base">
              Incluye sitio, reservas, pagos, notificaciones, dashboard de clientas, configuración en producción
              y acompañamiento de lanzamiento. Para mantenerlo operando correctamente, se recomienda el
              mantenimiento mensual de $3,500 MXN.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
