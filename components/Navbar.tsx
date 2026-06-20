"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Clases", href: "#clases" },
  { label: "Precios", href: "#precios" },
  { label: "Contacto", href: "#contacto" },
];

const BOOKING_URL = "https://www.firawellness.com/reserva-online";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-full glass-nav transition-all duration-300 ${
        scrolled ? "shadow-lg shadow-coral/5" : ""
      }`}
    >
      <div className="flex items-center justify-between px-4 py-2 md:px-6 md:py-3">
        <a href="#inicio" className="flex-shrink-0">
          <Image
            src="/FIRA LOGO.avif"
            alt="FIRA Wellness Club"
            width={80}
            height={36}
            className="h-8 w-auto md:h-9"
            style={{
              filter:
                "brightness(0) saturate(100%) invert(42%) sepia(53%) saturate(2065%) hue-rotate(316deg) brightness(92%) contrast(90%)",
            }}
            priority
          />
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/70 hover:text-coral transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-2 bg-coral text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-coral-dark transition-colors duration-200 shadow-md shadow-coral/20"
        >
          Reserva Clase
        </a>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`w-5 h-0.5 bg-foreground transition-all duration-300 ${
              mobileOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-5 h-0.5 bg-foreground transition-all duration-300 ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-5 h-0.5 bg-foreground transition-all duration-300 ${
              mobileOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="flex flex-col items-center gap-4 pb-6 pt-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-foreground/70 hover:text-coral transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-coral text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-coral-dark transition-colors shadow-md shadow-coral/20"
              >
                Reserva Clase
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
