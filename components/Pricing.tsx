"use client";

import { motion, type Variants } from "framer-motion";

const BOOKING_URL = "https://www.firawellness.com/reserva-online";

interface Plan {
  name: string;
  classes: string;
  price: string;
  period: string;
  popular: boolean;
  features: string[];
}

const plans: Plan[] = [
  {
    name: "Esencial",
    classes: "5 Clases por mes",
    price: "$1,600",
    period: "/mes",
    popular: false,
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

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Pricing() {
  return (
    <section id="precios" className="relative py-24 md:py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-2xl mx-auto"
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
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`relative p-8 rounded-[20px] flex flex-col transition-all duration-300 ${
                plan.popular
                  ? "bg-coral text-white shadow-xl shadow-coral/20 scale-[1.03]"
                  : "glass-card"
              }`}
            >
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

              <a
                href={BOOKING_URL}
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
