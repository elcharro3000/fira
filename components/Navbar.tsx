"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Clases", href: "/#clases" },
  { label: "Membresias", href: "/#precios" },
  { label: "Calendario", href: "/calendario" },
  { label: "Mi cuenta", href: "/dashboard" },
  { label: "Contacto", href: "/#contacto" },
];

import { BOOKING_URL } from "@/lib/constants";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-full glass-nav transition-all duration-300 ${
        scrolled ? "shadow-lg shadow-coral/5" : ""
      }`}
    >
      <div className="flex items-center justify-between px-4 py-2 md:px-6 md:py-3">
        {/* Logo */}
        <a href="/" className="flex min-h-11 flex-shrink-0 items-center" aria-label="FIRA Wellness Club">
          <span className="fira-logo fira-logo-nav" aria-hidden="true" />
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 min-w-11 items-center justify-center px-1 text-sm font-medium text-foreground/70 hover:text-coral transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <a
          href={BOOKING_URL}
          className="hidden min-h-11 md:inline-flex items-center gap-2 bg-coral text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-coral-dark transition-colors duration-200 shadow-md shadow-coral/20"
        >
          Reserva Clase
        </a>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex min-h-11 min-w-11 flex-col items-center justify-center gap-1.5 p-2"
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

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden overflow-hidden">
          <div className="flex flex-col items-center gap-4 pb-6 pt-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center px-1 text-sm font-medium text-foreground/70 hover:text-coral transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={BOOKING_URL}
                className="inline-flex min-h-11 items-center bg-coral text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-coral-dark transition-colors shadow-md shadow-coral/20"
              >
                Reserva Clase
              </a>
          </div>
        </div>
      )}
    </nav>
  );
}
