import React from "react";
import { Link, useLocation } from "wouter";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="bg-[#0d1b2a] min-h-screen text-[#f0f4f8] font-sans flex flex-col">
      <nav className="flex items-center justify-between px-6 py-3 border-b border-[#1e3048] sticky top-0 bg-[#0d1b2a]/95 backdrop-blur z-40">
        <Link href="/" className="text-lg font-bold text-[#00c8b4]">
          Deutschland in Zahlen
        </Link>
        <div className="flex gap-6 text-[#8faabb] text-sm font-medium">
          <Link href="/simulator" className={`hover:text-[#f0f4f8] transition-colors ${location === '/simulator' ? 'text-[#f0f4f8]' : ''}`}>
            Simulator
          </Link>
          <Link href="/dashboard" className={`hover:text-[#f0f4f8] transition-colors ${location === '/dashboard' ? 'text-[#f0f4f8]' : ''}`}>
            Dashboard
          </Link>
          <Link href="/vergleich" className={`hover:text-[#f0f4f8] transition-colors ${location === '/vergleich' ? 'text-[#f0f4f8]' : ''}`}>
            Vergleich
          </Link>
        </div>
        <div className="flex gap-3 items-center">
          <button className="bg-[#1a2b3c] border border-[#1e3048] text-[#f0f4f8] px-3 py-1.5 rounded text-xs font-medium hover:bg-[#243447] transition-colors" data-testid="button-login">
            Login
          </button>
        </div>
      </nav>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
