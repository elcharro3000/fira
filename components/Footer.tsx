export default function Footer() {
  return (
    <footer className="relative py-12 px-4 border-t border-peach/20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="fira-logo fira-logo-footer" role="img" aria-label="FIRA Wellness Club" />
            <span className="text-sm text-warm-gray">Wellness Club</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-warm-gray">
            <a href="/#inicio" className="hover:text-coral transition-colors">
              Inicio
            </a>
            <a href="/#clases" className="hover:text-coral transition-colors">
              Clases
            </a>
            <a href="/#precios" className="hover:text-coral transition-colors">
              Membresias
            </a>
            <a href="/#contacto" className="hover:text-coral transition-colors">
              Contacto
            </a>
          </div>

          {/* Social */}
          <div className="flex items-center gap-5 text-sm text-warm-gray">
            <a
              href="https://www.instagram.com/firawellnessclub/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-coral transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              @firawellnessclub
            </a>
            <a
              href="https://www.tiktok.com/@firawellnessclub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-coral transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.321 5.562a5.124 5.124 0 0 1-3.17-1.07A5.168 5.168 0 0 1 14.4 1.5h-3.69v13.53a2.312 2.312 0 1 1-1.996-2.29V9.004a6.09 6.09 0 0 0-1.01-.084A6.422 6.422 0 1 0 14.4 15.03V8.34a8.75 8.75 0 0 0 4.92 1.5V6.24c-.001 0 0-.678 0-.678z" />
              </svg>
              @firawellnessclub
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-peach/15 text-center">
          <p className="text-xs text-warm-gray/60">
            © {new Date().getFullYear()} FIRA Wellness Club. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
