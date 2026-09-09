"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function PruebaEmailPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-lg mx-auto glass-card p-8 text-center">
          <h1 className="text-2xl font-bold text-coral mb-3">
            Prueba de correos (interno)
          </h1>
          <p className="text-warm-gray text-sm mb-6">
            Esta página es solo para pruebas del sistema de confirmación por correo.
          </p>
          <Link
            href="/reserva?serviceId=prueba-email&test=1"
            className="inline-flex items-center justify-center w-full bg-coral text-white py-3 rounded-full font-semibold hover:bg-coral-dark transition-colors"
          >
            Reservar clase prueba ($10)
          </Link>
          <p className="text-xs text-warm-gray mt-4">
            Si compartes esta URL, cualquier persona podría acceder.
          </p>
        </div>
      </main>
    </>
  );
}

