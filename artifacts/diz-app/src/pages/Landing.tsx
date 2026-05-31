import React from "react";
import { Link } from "wouter";
import { Info } from "lucide-react";
import { Layout } from "@/components/Layout";

const stats = [
  { label: "Staatsverschuldung", value: "2.445 Mrd", unit: "EUR", delta: "+1.8%", deltaColor: "#e05c5c" },
  { label: "Bundeshaushalt",     value: "476.8 Mrd", unit: "EUR", delta: "-16.3 Mrd Defizit", deltaColor: "#e05c5c" },
  { label: "Bevölkerung",        value: "84.7 Mio",  unit: "",    delta: "+0.2%", deltaColor: "#4caf82" },
  { label: "Erwerbstätige",      value: "45.9 Mio",  unit: "",    delta: "-120k", deltaColor: "#e05c5c" },
  { label: "Rentner",            value: "21.3 Mio",  unit: "",    delta: "+2.1%", deltaColor: "#e05c5c" },
  { label: "Ø Monatslohn",       value: "4.323",     unit: "EUR", delta: "+2.8%", deltaColor: "#4caf82" },
];

export default function Landing() {
  return (
    <Layout>
      <div className="flex-1 max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16 w-full flex flex-col justify-center">
        <div className="text-center mb-10 md:mb-16 max-w-3xl mx-auto mt-6 md:mt-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 tracking-tight leading-tight">
            Deutschlandsimulator
          </h1>
          <p className="text-base md:text-xl text-[#8faabb] mb-5 leading-relaxed">
            Simuliere politische Entscheidungen in Echtzeit und erkenne die wirtschaftlichen Konsequenzen.
            Ein Cockpit für Deutschland — transparent, datenbasiert und unabhängig.
          </p>

          <div className="bg-[#1a2b3c] border border-[#1e3048] rounded-lg px-5 py-4 mb-4 text-left">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#8faabb] mb-1.5">
              <Info size={11} className="shrink-0" />
              Unabhängiges Privatprojekt
            </p>
            <p className="text-xs text-[#8faabb] leading-relaxed">
              Der Deutschland-Simulator wird privat entwickelt und ist nicht mit Behörden, Parteien,
              Forschungseinrichtungen oder anderen offiziellen Stellen verbunden.
            </p>
          </div>

          <div className="bg-[#1a2b3c] border border-[#1e3048] rounded-lg px-5 py-4 mb-8 text-left">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#00c8b4] mb-1.5">Datenbasis</p>
            <p className="text-xs text-[#8faabb] leading-relaxed mb-3">
              Basierend auf Daten des Statistischen Bundesamtes, der Bundesbank, des Bundeshaushalts,
              der Bundesagentur für Arbeit und weiterer öffentlicher Quellen.
            </p>
            <Link
              href="/annahmen"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00c8b4] hover:text-[#00a896] border border-[#00c8b4]/40 hover:border-[#00c8b4] rounded px-3 py-1.5 transition-colors"
            >
              Quellen &amp; Methodik →
            </Link>
          </div>

          <Link
            href="/simulator"
            className="inline-block bg-[#00c8b4] hover:bg-[#00a896] text-[#0d1b2a] font-bold py-3 md:py-4 px-8 md:px-10 rounded text-base md:text-lg transition-transform hover:-translate-y-0.5 shadow-lg shadow-[#00c8b4]/20"
            data-testid="button-start-sim"
          >
            Simulation starten
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-10 md:mb-16">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-[#1a2b3c] p-4 md:p-6 rounded border border-[#1e3048] hover:border-[#00c8b4]/50 transition-colors"
            >
              <div className="text-[#8faabb] mb-1 md:mb-2 text-xs md:text-sm font-medium uppercase tracking-wider leading-tight">
                {s.label}
              </div>
              <div className="text-xl md:text-2xl lg:text-3xl font-bold mb-1 leading-tight">
                {s.value}
                {s.unit && <span className="text-base md:text-xl"> {s.unit}</span>}
              </div>
              <div className="text-xs md:text-sm font-medium" style={{ color: s.deltaColor }}>
                {s.delta}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
