"use client";

import { motion, type Variants } from "framer-motion";

const benefits = [
  {
    icon: (
      <svg
        className="w-8 h-8 text-coral"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
        />
      </svg>
    ),
    title: "Un cuerpo más estético, alineado y elegante",
    description:
      "Pilates no infla músculos, los estiliza. Trabaja el cuerpo como un todo, logrando una figura más larga, firme y proporcionada. La postura mejora, el abdomen se aplana y el cuerpo se ve naturalmente fuerte sin rigidez.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8 text-coral"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    ),
    title: "Movimiento como ritual, no como castigo",
    description:
      "Aquí el movimiento es consciente y no es castigo ni exigencia extrema. Es un ritual de autocuidado, una forma de honrar tu cuerpo y agradecerle todo lo que sostiene por ti cada día.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8 text-coral"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
    title: "Más energía y mejor humor",
    description:
      "Al moverte con control y presencia, tu sistema nervioso se equilibra. El estrés baja, el cuerpo se relaja y el humor se eleva de forma natural.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Benefits() {
  return (
    <section className="relative py-24 md:py-32 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 max-w-2xl mx-auto"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Beneficios de nuestro{" "}
          <span className="font-[family-name:var(--font-playfair)] italic text-coral">
            método
          </span>
        </h2>
        <p className="text-warm-gray text-base sm:text-lg leading-relaxed">
          Descubre cómo FIRA transforma tu cuerpo y mente con un enfoque único
          de bienestar integral.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
      >
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="glass-card p-8 flex flex-col gap-4 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-glow/50 flex items-center justify-center">
              {benefit.icon}
            </div>
            <h3 className="text-xl font-bold leading-snug">{benefit.title}</h3>
            <p className="text-warm-gray text-sm leading-relaxed">
              {benefit.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
