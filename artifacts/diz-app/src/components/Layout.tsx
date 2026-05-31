import React, { useState } from "react";
import { Link, useLocation } from "wouter";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/simulator", label: "Simulator" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/vergleich", label: "Vergleich" },
  ];

  return (
    <div className="bg-[#0d1b2a] min-h-screen text-[#f0f4f8] font-sans flex flex-col">
      <nav className="border-b border-[#1e3048] sticky top-0 bg-[#0d1b2a]/95 backdrop-blur z-40">
        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          <Link href="/" className="text-base md:text-lg font-bold text-[#00c8b4] shrink-0">
            Deutschlandsimulator
          </Link>

          <div className="hidden md:flex gap-6 text-[#8faabb] text-sm font-medium">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`hover:text-[#f0f4f8] transition-colors ${location === l.href ? "text-[#f0f4f8]" : ""}`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              className="md:hidden flex flex-col gap-1 p-2"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menü"
            >
              <span className={`block w-5 h-0.5 bg-[#f0f4f8] transition-transform ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`block w-5 h-0.5 bg-[#f0f4f8] transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-[#f0f4f8] transition-transform ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-[#1e3048] bg-[#0d1b2a] px-4 pb-4 pt-2 flex flex-col gap-3">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium py-2 border-b border-[#1e3048] ${location === l.href ? "text-[#00c8b4]" : "text-[#8faabb]"}`}
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
    </div>
  );
}
