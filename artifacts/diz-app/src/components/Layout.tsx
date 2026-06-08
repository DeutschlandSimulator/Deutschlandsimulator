import React from "react";
import { Link, useLocation } from "wouter";
import { Sun, Moon, LogIn, LogOut, User } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@workspace/replit-auth-web";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, toggle } = useTheme();
  const { isAuthenticated, isLoading: authLoading, login, logout, user } = useAuth();

  const navLinks = [
    { href: "/simulator",  label: "Simulator",          cta: false },
    { href: "/annahmen",   label: "Quellen & Methodik",  cta: false },
    { href: "/mitmachen",  label: "Mitmachen",           cta: true  },
  ];

  return (
    <div className="diz-bg-base min-h-screen diz-text-primary font-sans flex flex-col">
      <nav className="diz-border-b sticky top-0 diz-bg-nav backdrop-blur z-40">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 gap-4">

          <Link href="/" className="text-sm md:text-base font-bold text-[#00c8b4] shrink-0 leading-tight">
            DeutschlandSimulator
          </Link>

          <div className="flex items-center gap-1 sm:gap-5">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={
                  l.cta
                    ? `text-xs sm:text-sm font-semibold px-3 py-1 rounded border transition-colors
                       ${location === l.href
                         ? "bg-[#00c8b4] text-[#0d1b2a] border-[#00c8b4]"
                         : "border-[#00c8b4] text-[#00c8b4] hover:bg-[#00c8b4] hover:text-[#0d1b2a]"
                       }`
                    : `text-xs sm:text-sm font-medium px-2 sm:px-0 py-1 transition-colors rounded sm:rounded-none
                       ${location === l.href
                         ? "text-[#f0f4f8] font-semibold"
                         : "text-[#8faabb] hover:text-[#f0f4f8]"
                       }`
                }
              >
                {l.label}
              </Link>
            ))}

            {/* Auth button */}
            {!authLoading && (
              isAuthenticated ? (
                <div className="flex items-center gap-1.5 ml-1 shrink-0">
                  {user?.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt="" className="w-6 h-6 rounded-full border border-[#1e3048]" />
                  ) : (
                    <User size={14} className="text-[#8faabb]" />
                  )}
                  <button
                    onClick={logout}
                    title="Ausloggen"
                    className="flex items-center gap-1 text-[10px] text-[#8faabb] hover:text-[#f0f4f8] transition-colors"
                  >
                    <LogOut size={12} />
                    <span className="hidden sm:inline">Ausloggen</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={login}
                  title="Einloggen"
                  className="ml-1 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded border border-[#1e3048] text-[#8faabb] hover:border-[#00c8b4]/60 hover:text-[#00c8b4] transition-colors shrink-0"
                >
                  <LogIn size={12} />
                  <span className="hidden sm:inline">Einloggen</span>
                </button>
              )
            )}

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
        <p className="text-xs diz-text-secondary text-center leading-relaxed max-w-2xl mx-auto">
          Dieses Projekt dient der Veranschaulichung möglicher Auswirkungen politischer Entscheidungen.
          Ergebnisse basieren auf Daten, Annahmen und Modellrechnungen und stellen keine Prognosen dar.
        </p>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5">
          {[
            { href: "/impressum",           label: "Impressum",              external: false },
            { href: "/impressum",           label: "Datenschutz",            external: false },
            { href: "/annahmen",            label: "Transparenz & Annahmen", external: false },
            { href: "/mitmachen",           label: "Mitmachen",              external: false },
            { href: "https://github.com/DeutschlandSimulator", label: "GitHub / Open Source", external: true },
            { href: "/haftungsausschluss",  label: "Haftungsausschluss",     external: false },
          ].map((l) =>
            l.external ? (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs diz-text-secondary hover:text-[#00c8b4] transition-colors"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.label}
                href={l.href}
                className="text-xs diz-text-secondary hover:text-[#00c8b4] transition-colors"
              >
                {l.label}
              </Link>
            )
          )}
        </div>
        <p className="text-[10px] diz-text-secondary text-center">
          © Kian Salem · Apache License 2.0 (Code) · CC BY 4.0 (Daten)
        </p>
      </footer>
    </div>
  );
}
