const plans = [
  {
    name: "Esencial",
    classes: "5 Clases por mes",
    price: "$1,600",
    period: "/mes",
    popular: false,
    stripeUrl: "https://buy.stripe.com/8x27sF5sv1TQgB7b63afS0j",
    features: [
      "5 clases al mes",
      "Acceso a todas las modalidades",
      "Reserva desde la app",
    ],
  },
  {
    name: "Balance",
    classes: "8 Clases por mes",
    price: "$2,400",
    period: "/mes",
    popular: false,
    stripeUrl: "https://buy.stripe.com/fZu00d1cf41Yfx30rpafS0k",
    features: [
      "8 clases al mes",
      "Acceso a todas las modalidades",
      "Reserva desde la app",
      "Flexibilidad de horarios",
    ],
  },
  {
    name: "Intenso",
    classes: "12 Clases por mes",
    price: "$3,360",
    period: "/mes",
    popular: true,
    stripeUrl: "https://buy.stripe.com/4gMbIVaMP0PM4Sp6PNafS0l",
    features: [
      "12 clases al mes",
      "Acceso a todas las modalidades",
      "Reserva desde la app",
      "Flexibilidad de horarios",
      "Prioridad en reservas",
    ],
  },
  {
    name: "Ilimitado",
    classes: "Clases ilimitadas",
    price: "$4,500",
    period: "/mes",
    popular: false,
    stripeUrl: "https://buy.stripe.com/cNi14hf35buqesZ7TRafS0m",
    features: [
      "Clases ilimitadas",
      "Acceso a todas las modalidades",
      "Reserva desde la app",
      "Máxima flexibilidad",
      "Prioridad en reservas",
      "Experiencia premium",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="precios" className="relative py-24 md:py-32 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div
          className="reveal-up text-center mb-16 max-w-2xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Planes y{" "}
            <span className="font-[family-name:var(--font-playfair)] italic text-coral">
              precios
            </span>
          </h2>
          <p className="text-warm-gray text-base sm:text-lg leading-relaxed">
            Con tu membresía tienes acceso a clases diseñadas para fortalecer,
            estilizar y equilibrar tu cuerpo de forma inteligente y sostenible.
          </p>
        </div>

        {/* Pricing Cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`reveal-up relative p-8 rounded-[20px] flex flex-col transition-all duration-300 ${
                plan.popular
                  ? "bg-coral text-white shadow-xl shadow-coral/20 scale-[1.03]"
                  : "glass-card"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-white text-coral text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                    Más Popular
                  </span>
                </div>
              )}

              <h3
                className={`text-lg font-bold mb-1 ${
                  plan.popular ? "text-white" : ""
                }`}
              >
                {plan.name}
              </h3>
              <p
                className={`text-sm mb-6 ${
                  plan.popular ? "text-white/80" : "text-warm-gray"
                }`}
              >
                {plan.classes}
              </p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span
                  className={`text-sm ${
                    plan.popular ? "text-white/70" : "text-warm-gray"
                  }`}
                >
                  {plan.period}
                </span>
              </div>

              {/* Features */}
              <ul className="flex-grow space-y-3 mb-8">
                {plan.features.map((feature, fi) => (
                  <li key={fi} className="flex items-start gap-2 text-sm">
                    <svg
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        plan.popular ? "text-white" : "text-coral"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span
                      className={
                        plan.popular ? "text-white/90" : "text-warm-gray"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={plan.stripeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full text-center py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                  plan.popular
                    ? "bg-white text-coral hover:bg-white/90 shadow-md"
                    : "bg-coral text-white hover:bg-coral-dark shadow-md shadow-coral/15"
                }`}
              >
                Suscribirme
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
