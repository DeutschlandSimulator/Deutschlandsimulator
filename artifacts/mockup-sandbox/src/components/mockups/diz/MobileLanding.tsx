import React, { useState } from "react";
import { CheckCircle2, Shield, BarChart2, BookOpen, X, Menu } from "lucide-react";

const kpis = [
  { label: "Staatsverschuldung", val: "2.445 Mrd.", delta: "+1,8 %",  pos: false, src: "Bundesbank" },
  { label: "Bundeshaushalt",     val: "476,8 Mrd.", delta: "−16,3 Mrd. Defizit", pos: false, src: "BMF" },
  { label: "Bevölkerung",        val: "84,7 Mio.",  delta: "+0,2 %",  pos: true,  src: "Destatis" },
  { label: "Erwerbstätige",      val: "45,9 Mio.",  delta: "−120k",   pos: false, src: "BA" },
  { label: "Rentner",            val: "21,3 Mio.",  delta: "+2,1 %",  pos: false, src: "DRV" },
  { label: "Durchschnittslohn",  val: "4.323 €",    delta: "+2,8 %",  pos: true,  src: "Destatis" },
];

const trustPillars = [
  { icon: <Shield size={16} className="text-[#00c8b4]" />,    label: "Transparente Quellen",   sub: "Destatis · Bundesbank · OECD" },
  { icon: <BarChart2 size={16} className="text-[#4caf82]" />, label: "Evidenz-Level sichtbar",  sub: "Hoch · Mittel · Unsicher" },
  { icon: <BookOpen size={16} className="text-[#f5a623]" />,  label: "Offene Berechnungslogik", sub: "Jede Zahl nachvollziehbar" },
];

export function MobileLanding() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-[390px] min-h-[844px] bg-[#0d1b2a] mx-auto text-[#f0f4f8] font-sans border-x border-[#1e3048]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-4 py-3 border-b border-[#1e3048] bg-[#1a2b3c] sticky top-0 z-20">
        <div className="text-base font-bold text-[#00c8b4]">Deutschland in Zahlen</div>
        <button className="text-[#8faabb] p-1" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="bg-[#1a2b3c] border-b border-[#1e3048] px-4 py-3 space-y-2">
          {["Simulator", "Vergleich", "KI-Analyse", "Dashboard"].map((link) => (
            <button key={link} className="block w-full text-left py-2 text-sm text-[#8faabb] hover:text-[#f0f4f8] border-b border-[#1e3048] last:border-0">
              {link}
            </button>
          ))}
        </div>
      )}

      <main className="px-5 pb-10">
        {/* Hero */}
        <div className="text-center pt-8 pb-8">
          <div className="inline-flex items-center gap-1.5 bg-[#1a2b3c] border border-[#00c8b4]/30 rounded-full px-3 py-1 text-xs text-[#00c8b4] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4caf82] animate-pulse" />
            Echtzeit-Simulation aktiv
          </div>
          <h1 className="text-3xl font-extrabold mb-3 leading-tight">
            Deutschland in Zahlen
          </h1>
          <p className="text-sm text-[#8faabb] mb-6 leading-relaxed px-2">
            Simuliere politische Entscheidungen und entdecke ihre Auswirkungen auf Staat, Gesellschaft und Wirtschaft.
          </p>
          <button className="w-full bg-[#00c8b4] hover:bg-[#00a896] text-[#0d1b2a] font-bold py-4 rounded-xl text-base transition-colors">
            Simulation starten →
          </button>
        </div>

        {/* Map placeholder */}
        <div className="w-full h-[180px] border border-[#00c8b4]/60 rounded-xl bg-[#1a2b3c] flex items-center justify-center shadow-[0_0_20px_rgba(0,200,180,0.15)] mb-6">
          <span className="text-[#8faabb] text-sm font-medium">Deutschlandkarte</span>
        </div>

        {/* KPI grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#8faabb]">Aktuelle Kennzahlen</h2>
            <span className="text-[10px] text-[#8faabb]">Letztes Update: Mär 2024</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="bg-[#1a2b3c] p-3 rounded-xl border border-[#1e3048]">
                <div className="text-[#8faabb] text-xs mb-0.5">{kpi.label}</div>
                <div className="text-lg font-bold text-[#f0f4f8] leading-tight">{kpi.val}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-xs font-medium ${kpi.pos ? "text-[#4caf82]" : "text-[#e05c5c]"}`}>{kpi.delta}</span>
                  <span className="text-[9px] text-[#8faabb] bg-[#0d1b2a] px-1.5 py-0.5 rounded border border-[#1e3048]">{kpi.src}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transparency trust section */}
        <div className="bg-[#1a2b3c] border border-[#1e3048] rounded-xl p-4 mb-6">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
            <Shield size={14} className="text-[#00c8b4]" />
            Transparent und nachvollziehbar
          </h3>
          <div className="space-y-3">
            {trustPillars.map((p) => (
              <div key={p.label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0d1b2a] border border-[#1e3048] flex items-center justify-center shrink-0">
                  {p.icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#f0f4f8]">{p.label}</div>
                  <div className="text-[10px] text-[#8faabb]">{p.sub}</div>
                </div>
                <CheckCircle2 size={13} className="text-[#4caf82] ml-auto shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Evidence legend */}
        <div className="bg-[#0d1b2a] border border-[#1e3048] rounded-xl p-4 mb-6">
          <h3 className="text-xs font-bold text-[#8faabb] uppercase tracking-widest mb-3">Evidenz-Skala</h3>
          <div className="space-y-2">
            {[
              { color: "#4caf82", label: "Hohe Evidenz",    desc: "Wissenschaftlich gut belegt, mehrere unabhängige Studien" },
              { color: "#f5a623", label: "Mittlere Evidenz", desc: "Belastbare Schätzungen, aber Bandbreite möglich" },
              { color: "#e05c5c", label: "Hohe Unsicherheit", desc: "Kontroverse Schätzungen, langfristige Prognosen" },
            ].map((e) => (
              <div key={e.label} className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full mt-0.5 shrink-0" style={{ backgroundColor: e.color }} />
                <div>
                  <span className="text-xs font-medium" style={{ color: e.color }}>{e.label}</span>
                  <span className="text-[10px] text-[#8faabb] block">{e.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button className="w-full border border-[#00c8b4]/40 text-[#00c8b4] font-bold py-3 rounded-xl text-sm hover:bg-[#1a2b3c] transition-colors">
          KI-Analyse starten
        </button>
      </main>
    </div>
  );
}
