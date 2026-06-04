import React from "react";
import { Link, useLocation } from "wouter";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, toggle } = useTheme();

  const navLinks = [
    { href: "/simulator", label: "Simulator" },
    { href: "/annahmen", label: "Quellen & Methodik" },
  ];

  return (
    <div className="diz-bg-base min-h-screen diz-text-primary font-sans flex flex-col">
      <nav className="diz-border-b sticky top-0 diz-bg-nav backdrop-blur z-40">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 gap-4">

          <Link href="/" className="text-sm md:text-base font-bold text-[#00c8b4] shrink-0 leading-tight">
            Deutschlandsimulator
          </Link>

          <div className="flex items-center gap-1 sm:gap-5">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-xs sm:text-sm font-medium px-2 sm:px-0 py-1 transition-colors rounded sm:rounded-none
                  ${location === l.href
                    ? "text-[#f0f4f8] font-semibold"
                    : "text-[#8faabb] hover:text-[#f0f4f8]"
                  }`}
              >
                {l.label}
              </Link>
            ))}

            <button
              onClick={toggle}
              aria-label={theme === "dark" ? "Hellmodus aktivieren" : "Dunkelmodus aktivieren"}
              className="ml-1 sm:ml-2 p-1.5 rounded diz-bg-card diz-border border hover:border-[#00c8b4] transition-colors shrink-0"
              title={theme === "dark" ? "Hellmodus" : "Dunkelmodus"}
            >
              {theme === "dark"
                ? <Sun  size={14} className="text-[#f5a623]" />
                : <Moon size={14} className="text-[#00c8b4]" />}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="diz-border-t px-6 py-5 space-y-3">
        <p className="text-xs diz-text-secondary text-center leading-relaxed max-w-3xl mx-auto">
          <span className="text-[#f5a623] font-semibold">Hinweis: </span>
          Dieses Projekt dient der Veranschaulichung möglicher Auswirkungen politischer Entscheidungen.
          Die Ergebnisse basieren auf Daten, Annahmen und Modellrechnungen und können fehlerhaft oder
          unvollständig sein. Bitte prüfen Sie wichtige Informationen anhand der angegebenen Quellen.
        </p>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5">
          {[
            { href: "/impressum",        label: "Impressum" },
            { href: "/impressum",        label: "Datenschutz" },
            { href: "/annahmen",         label: "Transparenz & Annahmen" },
            { href: "/annahmen",         label: "Open Source" },
            { href: "/haftungsausschluss", label: "Haftungsausschluss" },
          ].map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-xs diz-text-secondary hover:text-[#00c8b4] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <p className="text-[10px] diz-text-secondary text-center">
          © Kian Salem · Apache License 2.0 (Code) · CC BY 4.0 (Daten)
        </p>
      </footer>
    </div>
  );
}
