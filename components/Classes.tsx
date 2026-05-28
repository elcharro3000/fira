const classes = [
  {
    name: "Core Sculpt",
    serviceId: "core-sculpt",
    active: false,
    description:
      "Fortalece el centro del cuerpo con movimientos precisos y controlados. Mejora postura, estabilidad y conexión mente–cuerpo.",
    intensity: "Media",
    icon: "🎯",
  },
  {
    name: "Lower Body Burn",
    serviceId: "lower-body-burn",
    active: false,
    description:
      "Trabajo profundo de piernas y glúteos con enfoque en control y resistencia. Intenso, lento y altamente efectivo.",
    intensity: "Alta",
    icon: "🔥",
  },
  {
    name: "Full Body Burn",
    serviceId: "full-body-burn",
    active: false,
    description:
      "Entrenamiento completo que activa todo el cuerpo de forma equilibrada. Fuerza, coordinación y energía en una sola sesión.",
    intensity: "Alta",
    icon: "⚡",
  },
  {
    name: "Flow Full Body",
    serviceId: "flow-full-body",
    active: false,
    description:
      "Movimiento continuo y consciente que conecta respiración y fuerza. Ideal para fluir, soltar tensión y recuperar equilibrio.",
    intensity: "Media",
    icon: "🌊",
  },
  {
    name: "Stretching & Meditation",
    serviceId: "stretching-meditation",
    active: false,
    description:
      "Estiramientos suaves y respiración guiada para relajar el cuerpo y la mente. Una pausa consciente para cerrar la semana con calma.",
    intensity: "Baja",
    icon: "🧘",
  },
  {
    name: "Reformer Burn",
    serviceId: "reformer-burn",
    active: true,
    description:
      "Clase intensa y fluida que trabaja todo el cuerpo, combinando fuerza, control y resistencia desde un enfoque consciente.",
    intensity: "Alta",
    icon: "💪",
  },
];

function IntensityBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    Baja: "bg-green-100 text-green-700",
    Media: "bg-amber-100 text-amber-700",
    Alta: "bg-coral/10 text-coral",
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors[level] || ""}`}>
      {level}
    </span>
  );
}

export default function Classes() {
  return (
    <section id="clases" className="relative py-24 md:py-32 px-4">
      {/* Background accent */}
      <div className="absolute inset-0 section-glow pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div
          className="reveal-up text-center mb-16 max-w-2xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Nuestras{" "}
            <span className="font-[family-name:var(--font-playfair)] italic text-coral">
              clases
            </span>
          </h2>
          <p className="text-warm-gray text-base sm:text-lg leading-relaxed">
            Cada sesión está diseñada para fortalecer, estilizar y equilibrar tu
            cuerpo de forma inteligente y sostenible.
          </p>
        </div>

        {/* Class Cards - first row of 3, second row of 2 centered */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {classes.filter((cls) => cls.active).map((cls, index) => (
            <div
              key={index}
              className={`reveal-up glass-card p-8 flex flex-col gap-4 transition-all duration-300 group ${
                index >= 3 ? "lg:col-span-1 lg:mx-auto lg:w-full" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{cls.icon}</span>
                <IntensityBadge level={cls.intensity} />
              </div>
              <h3 className="text-xl font-bold">{cls.name}</h3>
              <p className="text-warm-gray text-sm leading-relaxed flex-grow">
                {cls.description}
              </p>
              <a
                href={`/reserva?serviceId=${cls.serviceId}`}
                className="inline-flex items-center gap-2 text-coral font-semibold text-sm group-hover:gap-3 transition-all duration-300"
              >
                Reserva Clase
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div
          className="reveal-up text-center mt-16 max-w-3xl mx-auto"
        >
          <blockquote className="text-warm-gray text-base sm:text-lg italic leading-relaxed font-[family-name:var(--font-playfair)]">
            &ldquo;Suscribirte no es comprometerte con un entrenamiento. Es elegir un
            estilo de vida donde tu cuerpo, tu mente y tu energía son
            prioridad.&rdquo;
          </blockquote>
        </div>
      </div>
    </section>
  );
}
