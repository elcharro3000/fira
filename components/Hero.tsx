import { BOOKING_URL } from "@/lib/constants";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4"
    >
      {/* Animated Orb */}
      <div className="orb" />

      {/* Floating Bubbles */}
      <div className="bubble bubble-1" />
      <div className="bubble bubble-2" />
      <div className="bubble bubble-3" />
      <div className="bubble bubble-4" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <div
          className="reveal-up reveal-delay-1 inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-peach/40 rounded-full px-4 py-2 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-coral" />
          <span className="text-sm font-medium text-warm-gray">
            Wellness Club &amp; Pilates &nbsp;·&nbsp; Polanco, CDMX
          </span>
        </div>

        {/* Main Heading */}
        <h1
          className="reveal-up reveal-delay-2 text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          Da el primer paso
          <br />
          más allá de tus
          <br />
          <span className="font-[family-name:var(--font-playfair)] italic text-coral">
            límites
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="reveal-up reveal-delay-3 text-base sm:text-lg text-warm-gray max-w-xl mx-auto mb-10 leading-relaxed"
        >
          FIRA Wellness Club te invita a descubrir un camino donde tu cuerpo, tu
          mente y tu energía son prioridad. Pilates reformer en un espacio
          diseñado para ti.
        </p>

        {/* CTAs */}
        <div
          className="reveal-up reveal-delay-4 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href={BOOKING_URL}
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
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
