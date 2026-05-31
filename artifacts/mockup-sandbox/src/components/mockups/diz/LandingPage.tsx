import React from "react";
import { Link } from "lucide-react";

export function LandingPage() {
  return (
    <div className="bg-[#0d1b2a] min-h-screen text-[#f0f4f8] font-sans">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-[#1e3048]">
        <div className="text-xl font-bold text-[#00c8b4]">Deutschland in Zahlen</div>
        <div className="flex gap-6 text-[#8faabb]">
          <a href="#" className="hover:text-[#f0f4f8]">Simulator</a>
          <a href="#" className="hover:text-[#f0f4f8]">Vergleich</a>
          <a href="#" className="hover:text-[#f0f4f8]">KI-Analyse</a>
        </div>
        <div>
          <button className="w-10 h-6 bg-[#1a2b3c] rounded-full border border-[#1e3048] flex items-center px-1">
            <div className="w-4 h-4 bg-[#8faabb] rounded-full"></div>
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4">Deutschland in Zahlen</h1>
          <p className="text-xl text-[#8faabb] mb-8">Simuliere politische Entscheidungen in Echtzeit und erkenne die Konsequenzen.</p>
          <button className="bg-[#00c8b4] hover:bg-[#00a896] text-[#0d1b2a] font-bold py-3 px-8 rounded">
            Simulation starten
          </button>
        </div>

        <div className="flex justify-center mb-16">
          <div className="w-[600px] h-[300px] border border-[#00c8b4] rounded bg-[#1a2b3c] flex items-center justify-center shadow-[0_0_15px_rgba(0,200,180,0.2)]">
            <span className="text-[#8faabb] text-lg font-medium">Deutschlandkarte</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-[#1a2b3c] p-6 rounded border border-[#1e3048]">
            <div className="text-[#8faabb] mb-2">Staatsverschuldung</div>
            <div className="text-3xl font-bold mb-1">2.445 Mrd EUR</div>
            <div className="text-[#e05c5c] text-sm">+1.8%</div>
          </div>
          <div className="bg-[#1a2b3c] p-6 rounded border border-[#1e3048]">
            <div className="text-[#8faabb] mb-2">Bundeshaushalt</div>
            <div className="text-3xl font-bold mb-1">476.8 Mrd EUR</div>
            <div className="text-[#e05c5c] text-sm">-16.3 Mrd Defizit</div>
          </div>
          <div className="bg-[#1a2b3c] p-6 rounded border border-[#1e3048]">
            <div className="text-[#8faabb] mb-2">Bevölkerung</div>
            <div className="text-3xl font-bold mb-1">84.7 Mio</div>
            <div className="text-[#4caf82] text-sm">+0.2%</div>
          </div>
          <div className="bg-[#1a2b3c] p-6 rounded border border-[#1e3048]">
            <div className="text-[#8faabb] mb-2">Erwerbstätige</div>
            <div className="text-3xl font-bold mb-1">45.9 Mio</div>
            <div className="text-[#e05c5c] text-sm">-120k</div>
          </div>
          <div className="bg-[#1a2b3c] p-6 rounded border border-[#1e3048]">
            <div className="text-[#8faabb] mb-2">Rentner</div>
            <div className="text-3xl font-bold mb-1">21.3 Mio</div>
            <div className="text-[#e05c5c] text-sm">+2.1%</div>
          </div>
          <div className="bg-[#1a2b3c] p-6 rounded border border-[#1e3048]">
            <div className="text-[#8faabb] mb-2">Durchschnittslohn</div>
            <div className="text-3xl font-bold mb-1">4.323 EUR/Monat</div>
            <div className="text-[#4caf82] text-sm">+2.8%</div>
          </div>
        </div>
      </main>
    </div>
  );
}
