const contactInfo = [
  {
    icon: (
      <svg className="w-6 h-6 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    label: "Dirección",
    value: "Av. Horacio 632, Polanco\nCiudad de México",
    href: "https://maps.google.com/?q=Av.+Horacio+632+Polanco+Ciudad+de+Mexico",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    label: "Email",
    value: "firawellness@gmail.com",
    href: "mailto:firawellness@gmail.com",
  },
];

const hours = [
  { days: "Lunes - Viernes", time: "7:00 am – 9:00 pm" },
  { days: "Sábado", time: "8:00 am – 8:00 pm" },
  { days: "Domingo", time: "8:00 am – 8:00 pm" },
];

export default function Contact() {
  return (
    <section id="contacto" className="relative py-24 md:py-32 px-4">
      {/* Background accent */}
      <div className="absolute inset-0 section-glow pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div
          className="reveal-up text-center mb-16 max-w-2xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Encuéntranos{" "}
            <span className="font-[family-name:var(--font-playfair)] italic text-coral">
              aquí
            </span>
          </h2>
          <p className="text-warm-gray text-base sm:text-lg leading-relaxed">
            Visítanos en nuestro estudio en el corazón de Polanco.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div
            className="reveal-up glass-card p-8 flex flex-col gap-8"
          >
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-rose-glow/50 flex items-center justify-center flex-shrink-0 group-hover:bg-coral/10 transition-colors">
                  {info.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-warm-gray mb-1">
                    {info.label}
                  </p>
                  <p className="font-semibold whitespace-pre-line group-hover:text-coral transition-colors">
                    {info.value}
                  </p>
                </div>
              </a>
            ))}

            {/* Instagram */}
            <a
              href="https://www.instagram.com/firawellnessclub/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-glow/50 flex items-center justify-center flex-shrink-0 group-hover:bg-coral/10 transition-colors">
                <svg className="w-6 h-6 text-coral" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-warm-gray mb-1">
                  Instagram
                </p>
                <p className="font-semibold group-hover:text-coral transition-colors">
                  @firawellnessclub
                </p>
              </div>
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@firawellnessclub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-glow/50 flex items-center justify-center flex-shrink-0 group-hover:bg-coral/10 transition-colors">
                <svg className="w-6 h-6 text-coral" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.321 5.562a5.124 5.124 0 0 1-3.17-1.07A5.168 5.168 0 0 1 14.4 1.5h-3.69v13.53a2.312 2.312 0 1 1-1.996-2.29V9.004a6.09 6.09 0 0 0-1.01-.084A6.422 6.422 0 1 0 14.4 15.03V8.34a8.75 8.75 0 0 0 4.92 1.5V6.24c-.001 0 0-.678 0-.678z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-warm-gray mb-1">
                  TikTok
                </p>
                <p className="font-semibold group-hover:text-coral transition-colors">
                  @firawellnessclub
                </p>
              </div>
            </a>
          </div>

          {/* Hours */}
          <div
            className="reveal-up glass-card p-8 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-rose-glow/50 flex items-center justify-center">
                <svg className="w-6 h-6 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Horarios</h3>
            </div>

            <div className="space-y-4 flex-grow">
              {hours.map((h, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-peach/20 last:border-0"
                >
                  <span className="font-medium">{h.days}</span>
                  <span className="text-warm-gray text-sm">{h.time}</span>
                </div>
              ))}
            </div>

            {/* Google Maps embed: Av. Horacio 632, Polanco, CDMX */}
            <div className="mt-8 rounded-xl overflow-hidden h-48 bg-rose-glow/30">
              <iframe
                title="FIRA Wellness Club — Av. Horacio 632, Polanco, Ciudad de México"
                src="https://maps.google.com/maps?q=Av.+Horacio+632,+Polanco,+Ciudad+de+M%C3%A9xico&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-xl w-full h-full min-h-[12rem]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
