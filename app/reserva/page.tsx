"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getSlotStartsAt } from "@/lib/schedule";

const SERVICE_NAMES: Record<string, string> = {
  "core-sculpt": "Core Sculpt",
  "lower-body-burn": "Lower Body Burn",
  "full-body-burn": "Full Body Burn",
  "flow-full-body": "Flow Full Body",
  "stretching-meditation": "Stretching & Meditation",
  "reformer-burn": "Reformer Burn",
  "yoga-soundbath": "Yoga y Soundbath",
};

function formatSlot(slotId: string | null): string | null {
  if (!slotId) return null;

  const [date, time] = slotId.split("T");
  const [timePart] = (time ?? "").split("--");
  const [hourValue, minuteValue] = timePart.split(":").map(Number);
  if (!date || Number.isNaN(hourValue) || Number.isNaN(minuteValue)) return null;

  const [year, month, day] = date.split("-").map(Number);
  const startsAt = getSlotStartsAt(date, hourValue, minuteValue);
  const displayDate = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "full",
    timeZone: "America/Mexico_City",
  }).format(new Date(Date.UTC(year, month - 1, day, 12, 0, 0)));
  const displayTime = new Intl.DateTimeFormat("es-MX", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Mexico_City",
  }).format(startsAt);

  return `${displayDate}, ${displayTime}`;
}

function ReservaContent() {
  const searchParams = useSearchParams();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const serviceId = searchParams.get("serviceId") ?? "reformer-burn";
  const slotId = searchParams.get("slotId");
  const cancelled = searchParams.get("cancelled") === "1";
  const serviceName = SERVICE_NAMES[serviceId] ?? "Clase";
  const slotLabel = formatSlot(slotId);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          slotId,
          customerName,
          customerEmail,
          customerPhone,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "No pudimos iniciar el pago.");
      }

      window.location.href = data.url;
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "No pudimos iniciar el pago.",
      );
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-2xl mx-auto glass-card p-8 sm:p-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral mb-4">
          Reserva
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          {slotLabel ? "Confirma tu clase" : "Elige tu horario"}
        </h1>
        <p className="text-warm-gray mb-8 leading-relaxed">
          {slotLabel
            ? "Completa tus datos para pagar y confirmar tu lugar."
            : "Selecciona un horario disponible en el calendario para reservar tu lugar."}
        </p>

        {cancelled && (
          <div className="mb-6 rounded-2xl border border-coral/20 bg-coral/10 px-4 py-3 text-sm text-coral">
            El pago fue cancelado. Puedes intentarlo de nuevo cuando quieras.
          </div>
        )}

        <div className="rounded-2xl bg-white/60 border border-peach/40 p-5 mb-8 text-left">
          <div className="flex justify-between gap-4 py-2 border-b border-peach/30">
            <span className="text-warm-gray">Clase</span>
            <span className="font-semibold text-right">{serviceName}</span>
          </div>
          <div className="flex justify-between gap-4 py-2">
            <span className="text-warm-gray">Horario</span>
            <span className="font-semibold text-right">
              {slotLabel ?? "Pendiente"}
            </span>
          </div>
        </div>

        {slotLabel ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="customerName">
                Nombre completo
              </label>
              <input
                id="customerName"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                required
                className="w-full rounded-2xl border border-peach/50 bg-white/70 px-4 py-3 outline-none transition-colors focus:border-coral"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="customerEmail">
                Email
              </label>
              <input
                id="customerEmail"
                type="email"
                value={customerEmail}
                onChange={(event) => setCustomerEmail(event.target.value)}
                required
                className="w-full rounded-2xl border border-peach/50 bg-white/70 px-4 py-3 outline-none transition-colors focus:border-coral"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="customerPhone">
                Teléfono
              </label>
              <input
                id="customerPhone"
                value={customerPhone}
                onChange={(event) => setCustomerPhone(event.target.value)}
                required
                className="w-full rounded-2xl border border-peach/50 bg-white/70 px-4 py-3 outline-none transition-colors focus:border-coral"
                placeholder="55 0000 0000"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-coral/20 bg-coral/10 px-4 py-3 text-sm text-coral">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <a
                href="/calendario"
                className="inline-flex justify-center rounded-full border border-coral/30 px-6 py-3 font-semibold text-coral hover:border-coral/60 transition-colors"
              >
                Cambiar horario
              </a>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex justify-center rounded-full bg-coral px-6 py-3 font-semibold text-white hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-60 transition-colors shadow-md shadow-coral/20"
              >
                {submitting ? "Abriendo pago..." : "Pagar con Stripe"}
              </button>
            </div>
          </form>
        ) : (
          <a
            href="/calendario"
            className="inline-flex justify-center rounded-full bg-coral px-6 py-3 font-semibold text-white hover:bg-coral-dark transition-colors shadow-md shadow-coral/20"
          >
            Ver calendario
          </a>
        )}
      </div>
    </main>
  );
}

export default function ReservaPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={null}>
        <ReservaContent />
      </Suspense>
    </>
  );
}
