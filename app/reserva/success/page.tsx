import Navbar from "@/components/Navbar";

export default function ReservaSuccessPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-2xl mx-auto glass-card p-8 sm:p-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral mb-4">
            Reserva confirmada
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Gracias por tu pago
          </h1>
          <p className="text-warm-gray mb-8 leading-relaxed">
            Tu pago fue procesado por Stripe. Recibirás la confirmación de tu clase por correo.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a
              href="/calendario"
              className="inline-flex justify-center rounded-full border border-coral/30 px-6 py-3 font-semibold text-coral hover:border-coral/60 transition-colors"
            >
              Ver calendario
            </a>
            <a
              href="/"
              className="inline-flex justify-center rounded-full bg-coral px-6 py-3 font-semibold text-white hover:bg-coral-dark transition-colors shadow-md shadow-coral/20"
            >
              Volver al inicio
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
