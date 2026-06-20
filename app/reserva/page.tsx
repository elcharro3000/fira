"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { SERVICES } from "@/lib/schedule";

type Step = "service" | "datetime" | "details" | "confirm";

interface Slot {
  date: string;
  hour: number;
  minute: number;
  slotId: string;
}

export default function ReservaPage() {
  const [step, setStep] = useState<Step>("service");
  const [serviceId, setServiceId] = useState<string>("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    serviceName: string;
    startsAt: string;
    customerName: string;
  } | null>(null);
  const [canceled, setCanceled] = useState(false);
  const [showTestService, setShowTestService] = useState(false);

  const from = new Date();
  const to = new Date();
  to.setDate(to.getDate() + 14);
  const fromStr = from.toISOString().slice(0, 10);
  const toStr = to.toISOString().slice(0, 10);

  const fetchSlots = useCallback(async () => {
    const res = await fetch(
      `/api/availability?from=${fromStr}&to=${toStr}${serviceId ? `&serviceId=${serviceId}` : ""}`
    );
    const data = await res.json();
    if (data.slots) setSlots(data.slots);
  }, [fromStr, toStr, serviceId]);

  useEffect(() => {
    if (step === "datetime" || step === "details") fetchSlots();
  }, [step, fetchSlots]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setShowTestService(params.get("test") === "1");

    // Stripe redirect callbacks
    if (params.get("success") === "1" && params.get("session_id")) {
      setStep("confirm");
      setLoading(true);
      fetch(`/api/bookings?session_id=${params.get("session_id")}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.booking) {
            setSuccessData({
              serviceName: data.booking.serviceName,
              startsAt: data.booking.startsAt,
              customerName: data.booking.customerName,
            });
          }
        })
        .finally(() => setLoading(false));
      window.history.replaceState({}, "", "/reserva");
      return;
    }
    if (params.get("cancel") === "1") {
      setCanceled(true);
      window.history.replaceState({}, "", "/reserva");
      return;
    }

    // Pre-fill from query params (coming from class card or calendar)
    const sid = params.get("serviceId");
    const slid = params.get("slotId");
    if (sid) {
      setServiceId(sid);
      if (slid) {
        // Both serviceId and slotId: skip to details
        setSelectedSlotId(decodeURIComponent(slid));
        setStep("details");
      } else {
        // Only serviceId: skip service selection, go to datetime
        setStep("datetime");
      }
      window.history.replaceState({}, "", "/reserva");
    }
  }, []);

  const selectedService = SERVICES.find((s) => s.id === serviceId);
  const selectedSlot = slots.find((s) => s.slotId === selectedSlotId);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          slotId: selectedSlotId,
          customerName,
          customerEmail,
          customerPhone,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 503) {
          throw new Error("El pago no está disponible en este momento. Por favor contáctanos en firwellness@gmail.com.");
        }
        throw new Error(data.error || "Error al crear la reserva.");
      }
      if (data.url) window.location.href = data.url;
      else setError("No se recibió URL de pago. Intenta de nuevo o contáctanos.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al procesar");
    } finally {
      setLoading(false);
    }
  };

  if (step === "confirm") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-28 pb-16 px-4">
          <div className="max-w-lg mx-auto text-center">
            {loading ? (
              <p className="text-warm-gray">Cargando confirmación...</p>
            ) : successData ? (
              <div className="glass-card p-8">
                <h1 className="text-2xl font-bold text-coral mb-4">
                  Reserva confirmada
                </h1>
                <p className="text-warm-gray mb-2">
                  Hola {successData.customerName},
                </p>
                <p className="mb-4">
                  Tu clase <strong>{successData.serviceName}</strong> está
                  confirmada para el{" "}
                  {new Date(successData.startsAt).toLocaleDateString("es-MX", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  .
                </p>
                <p className="text-sm text-warm-gray mb-6">
                  Enviamos los detalles a tu correo. Nos vemos en el estudio.
                </p>
                <Link
                  href="/"
                  className="inline-block bg-coral text-white px-6 py-3 rounded-full font-semibold hover:bg-coral-dark transition-colors"
                >
                  Volver al inicio
                </Link>
              </div>
            ) : (
              <div className="glass-card p-8">
                <p className="text-warm-gray">
                  No pudimos cargar los detalles de tu reserva. Revisa tu correo o
                  contáctanos.
                </p>
                <Link href="/" className="text-coral font-semibold mt-4 inline-block">
                  Volver al inicio
                </Link>
              </div>
            )}
          </div>
        </main>
      </>
    );
  }

  if (canceled) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-28 pb-16 px-4">
          <div className="max-w-lg mx-auto text-center glass-card p-8">
            <h1 className="text-xl font-bold mb-2">Reserva cancelada</h1>
            <p className="text-warm-gray mb-6">
              No se realizó ningún cargo. Cuando quieras, puedes intentar de
              nuevo.
            </p>
            <Link
              href="/reserva"
              className="inline-block bg-coral text-white px-6 py-3 rounded-full font-semibold hover:bg-coral-dark transition-colors"
            >
              Reservar clase
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">
            Reserva tu clase
          </h1>
          <p className="text-warm-gray text-center mb-10">
            Elige la clase, fecha y hora. El pago es con tarjeta (Stripe).
          </p>

          {/* Step: Service */}
          {step === "service" && (
            <div className="glass-card p-6 mb-6">
              <h2 className="font-bold mb-4">1. Tipo de clase</h2>
              <div className="grid gap-3">
                {SERVICES.filter((s) => showTestService || s.id !== "prueba-email").map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setServiceId(s.id);
                      setSelectedSlotId("");
                      setStep("datetime");
                    }}
                    className="text-left p-4 rounded-xl border border-peach/40 hover:border-coral/50 hover:bg-rose-glow/30 transition-colors"
                  >
                    <span className="font-semibold">{s.name}</span>
                    <span className="text-warm-gray text-sm block mt-1">
                      ${(s.priceCents / 100).toLocaleString("es-MX")} MXN
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step: Date & Time */}
          {step === "datetime" && (
            <div className="glass-card p-6 mb-6">
              <button
                type="button"
                onClick={() => setStep("service")}
                className="text-coral text-sm font-medium mb-4"
              >
                ← Cambiar clase
              </button>
              <h2 className="font-bold mb-4">2. Fecha y hora</h2>
              <p className="text-warm-gray text-sm mb-4">
                {selectedService?.name} — próximos 14 días
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-80 overflow-y-auto">
                {slots.map((slot) => (
                  <button
                    key={slot.slotId}
                    type="button"
                    onClick={() => {
                      setSelectedSlotId(slot.slotId);
                      setStep("details");
                    }}
                    className="p-3 rounded-xl border border-peach/40 hover:border-coral/50 hover:bg-rose-glow/30 transition-colors text-sm text-left"
                  >
                    {new Date(slot.date + "T12:00:00").toLocaleDateString("es-MX", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    {String(slot.hour).padStart(2, "0")}:
                    {String(slot.minute).padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step: Details + Pay */}
          {step === "details" && selectedSlot && selectedService && (
            <div className="glass-card p-6 mb-6">
              <button
                type="button"
                onClick={() => setStep("datetime")}
                className="text-coral text-sm font-medium mb-4"
              >
                ← Cambiar horario
              </button>
              <h2 className="font-bold mb-4">3. Tus datos y pago</h2>
              <p className="text-warm-gray text-sm mb-4">
                {selectedService.name} —{" "}
                {selectedSlot.date}{" "}
                {String(selectedSlot.hour).padStart(2, "0")}:
                {String(selectedSlot.minute).padStart(2, "0")} — $
                {(selectedService.priceCents / 100).toLocaleString("es-MX")} MXN
              </p>
              <p className="text-xs text-warm-gray mb-4">
                Solo pago con tarjeta. Serás redirigido a Stripe para pagar de
                forma segura.
              </p>
              {error && (
                <p className="text-red-600 text-sm mb-4">{error}</p>
              )}
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-warm-gray">Nombre</span>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="mt-1 w-full px-4 py-2 rounded-xl border border-peach/40 bg-white/80"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-warm-gray">Email</span>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="mt-1 w-full px-4 py-2 rounded-xl border border-peach/40 bg-white/80"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-warm-gray">Teléfono</span>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="mt-1 w-full px-4 py-2 rounded-xl border border-peach/40 bg-white/80"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !customerName.trim() || !customerEmail.trim()}
                  className="w-full bg-coral text-white py-3 rounded-full font-semibold hover:bg-coral-dark disabled:opacity-50 transition-colors"
                >
                  {loading ? "Procesando…" : "Ir a pagar con tarjeta"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
