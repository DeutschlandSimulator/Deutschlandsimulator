import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggle } = useTheme();

  const navLinks = [
    { href: "/simulator", label: "Simulator" },
    { href: "/dashboard", label: "Dashboard" },

    { href: "/annahmen", label: "Annahmen" },
  ];

  return (
    <div className="diz-bg-base min-h-screen diz-text-primary font-sans flex flex-col">
      <nav className="diz-border-b sticky top-0 diz-bg-nav backdrop-blur z-40">
        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          <Link href="/" className="text-base md:text-lg font-bold text-[#00c8b4] shrink-0">
            Deutschlandsimulator
          </Link>

          <div className="hidden md:flex gap-6 diz-text-secondary text-sm font-medium">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`hover:diz-text-primary transition-colors ${location === l.href ? "diz-text-primary font-semibold" : ""}`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label={theme === "dark" ? "Hellmodus aktivieren" : "Dunkelmodus aktivieren"}
              className="p-2 rounded diz-bg-card diz-border border hover:border-[#00c8b4] transition-colors"
              title={theme === "dark" ? "Hellmodus" : "Dunkelmodus"}
            >
              {theme === "dark"
                ? <Sun  size={15} className="text-[#f5a623]" />
                : <Moon size={15} className="text-[#00c8b4]" />}
            </button>

            <button
              className="md:hidden flex flex-col gap-1 p-2"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menü"
            >
              <span className={`block w-5 h-0.5 diz-bg-primary-text transition-transform ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`block w-5 h-0.5 diz-bg-primary-text transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 diz-bg-primary-text transition-transform ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden diz-border-b diz-bg-base px-4 pb-4 pt-2 flex flex-col gap-3">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium py-2 diz-border-b ${location === l.href ? "text-[#00c8b4]" : "diz-text-secondary"}`}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="diz-border-t px-6 py-4 space-y-2">
        <p className="text-xs diz-text-secondary text-center leading-relaxed max-w-3xl mx-auto">
          <span className="text-[#f5a623] font-semibold">Hinweis: </span>
          Dieses Projekt dient der Veranschaulichung möglicher Auswirkungen politischer Entscheidungen.
          Die Ergebnisse basieren auf Daten, Annahmen und Modellrechnungen und können fehlerhaft oder
          unvollständig sein. Bitte prüfen Sie wichtige Informationen anhand der angegebenen Quellen.
        </p>
        <p className="text-center">
          <Link href="/impressum" className="text-xs diz-text-secondary hover:text-[#00c8b4] transition-colors">
            Impressum
          </Link>
        </p>
      </footer>
    </div>
  );
}
