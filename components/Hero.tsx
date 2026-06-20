"use client";

import { motion } from "framer-motion";

const BOOKING_URL = "https://www.firawellness.com/reserva-online";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4"
    >
      <div className="orb" />
      <div className="bubble bubble-1" />
      <div className="bubble bubble-2" />
      <div className="bubble bubble-3" />
      <div className="bubble bubble-4" />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-peach/40 rounded-full px-4 py-2 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-coral animate-pulse" />
          <span className="text-sm font-medium text-warm-gray">
            Pilates Reformer en Polanco
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          Da el primer paso
          <br />
          más allá de tus
          <br />
          <span className="font-[family-name:var(--font-playfair)] italic text-coral">
            límites
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-base sm:text-lg text-warm-gray max-w-xl mx-auto mb-10 leading-relaxed"
        >
          FIRA Wellness Club te invita a descubrir un camino donde tu cuerpo, tu
          mente y tu energía son prioridad. Pilates reformer en un espacio
          diseñado para ti.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 bg-coral text-white px-8 py-3.5 rounded-full font-semibold text-base hover:bg-coral-dark transition-all duration-300 shadow-lg shadow-coral/25 hover:shadow-xl hover:shadow-coral/30"
          >
            Reserva Clase
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>

          <a
            href="#clases"
            className="flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-base border border-foreground/15 text-foreground hover:border-coral/40 hover:text-coral transition-all duration-300"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 4-7-4m14 4l-7 4-7-4"
              />
            </svg>
            Conoce Más
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
