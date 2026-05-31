import React from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, ExternalLink, Share2, Download } from "lucide-react";

const areaData = [
  { year: "2020", einnahmen: 750, ausgaben: 850 },
  { year: "2021", einnahmen: 780, ausgaben: 860 },
  { year: "2022", einnahmen: 820, ausgaben: 840 },
  { year: "2023", einnahmen: 890, ausgaben: 910 },
  { year: "2024", einnahmen: 916, ausgaben: 950 },
  { year: "2025", einnahmen: 930, ausgaben: 960 },
  { year: "2030", einnahmen: 1040, ausgaben: 1060 },
];

const barData = [
  { name: "Soziales",    ausgaben: 175 },
  { name: "Verteidigung", ausgaben: 52 },
  { name: "Bildung",     ausgaben: 21 },
  { name: "Zinsen",      ausgaben: 37 },
  { name: "Sonstiges",   ausgaben: 154 },
];

type ConfLevel = "hoch" | "mittel";
const confDot: Record<ConfLevel, string> = { hoch: "bg-[#4caf82]", mittel: "bg-[#f5a623]" };

interface KPI { label: string; val: string; color: string; spark: string; sparkColor: string; src: string; conf: ConfLevel; pos?: boolean }

const kpis: KPI[] = [
  { label: "Haushaltsdefizit",    val: "−34,2 Mrd.",  color: "#e05c5c", spark: "0,4 8,6 16,2 24,8 32,4 40,10 50,16", sparkColor: "#e05c5c", src: "BMF",        conf: "hoch" },
  { label: "Staatsverschuldung",  val: "2.445 Mrd.",  color: "#f0f4f8", spark: "0,14 10,12 20,11 30,9 40,7 50,5",    sparkColor: "#8faabb", src: "Bundesbank", conf: "hoch" },
  { label: "Steueraufkommen",     val: "916 Mrd.",    color: "#4caf82", spark: "0,14 10,11 20,13 30,8 40,4 50,1",    sparkColor: "#4caf82", src: "Destatis",   conf: "hoch",  pos: true },
  { label: "Arbeitslosenquote",   val: "5,7 %",       color: "#e05c5c", spark: "0,4 10,7 20,6 30,9 40,11 50,13",     sparkColor: "#e05c5c", src: "BA",         conf: "hoch" },
  { label: "Fachkräftemangel",    val: "890k",        color: "#f5a623", spark: "0,4 10,6 20,8 30,10 40,12 50,14",    sparkColor: "#f5a623", src: "IW Köln",    conf: "mittel" },
  { label: "Wirtschaftswachstum", val: "+0,8 %",      color: "#4caf82", spark: "0,14 10,11 20,9 30,6 40,3 50,1",     sparkColor: "#4caf82", src: "SVR",        conf: "mittel", pos: true },
];

export function MobileDashboard() {
  return (
    <div className="w-[390px] min-h-[844px] bg-[#0d1b2a] mx-auto text-[#f0f4f8] font-sans border-x border-[#1e3048]">
      {/* Header */}
      <header className="px-4 py-3 border-b border-[#1e3048] bg-[#1a2b3c] sticky top-0 z-10 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold">Ergebnis-Dashboard</h1>
          <div className="text-[10px] text-[#8faabb]">Startseite › Ergebnisse</div>
        </div>
        <div className="flex gap-2">
          <button className="w-8 h-8 flex items-center justify-center bg-[#0d1b2a] border border-[#1e3048] rounded-lg text-[#8faabb]">
            <Share2 size={14} />
          </button>
          <button className="flex items-center gap-1.5 bg-[#00c8b4] text-[#0d1b2a] text-xs font-bold px-3 py-1.5 rounded-lg">
            <Download size={12} /> PDF
          </button>
        </div>
      </header>

      <div className="px-4 pb-8 space-y-4 pt-4">
        {/* Evidence legend */}
        <div className="flex items-center gap-3 text-[10px] text-[#8faabb]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#4caf82]" /> Hohe Evidenz</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f5a623]" /> Mittel</span>
          <span className="ml-auto">Stand: Mär 2024</span>
        </div>

        {/* KPI cards */}
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-[#1a2b3c] border border-[#1e3048] rounded-xl p-4 flex items-center justify-between">
            <div className="flex-1">
              <div className="text-[#8faabb] text-xs mb-1">{kpi.label}</div>
              <div className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.val}</div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${confDot[kpi.conf]}`} />
                <span className="text-[10px] text-[#8faabb]">{kpi.src}</span>
                <ExternalLink size={9} className="text-[#8faabb]" />
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <svg className="w-16 h-8" viewBox="0 0 50 20">
                <polyline points={kpi.spark} fill="none" stroke={kpi.sparkColor} strokeWidth="2" />
              </svg>
              {kpi.pos !== undefined && (
                kpi.pos
                  ? <TrendingUp size={16} style={{ color: kpi.color }} />
                  : <TrendingDown size={16} style={{ color: kpi.color }} />
              )}
            </div>
          </div>
        ))}

        {/* Area chart */}
        <div className="bg-[#1a2b3c] border border-[#1e3048] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold">Einnahmen vs. Ausgaben</h3>
            <span className="text-[10px] text-[#8faabb]">2020–2030</span>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="einM" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00c8b4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00c8b4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ausM" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e05c5c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#e05c5c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
                <XAxis dataKey="year" stroke="#8faabb" fontSize={10} />
                <YAxis stroke="#8faabb" fontSize={10} />
                <RechartsTooltip contentStyle={{ backgroundColor: "#0d1b2a", borderColor: "#1e3048", fontSize: 11 }} formatter={(v: number) => [`${v} Mrd. €`]} />
                <Area type="monotone" dataKey="ausgaben" stroke="#e05c5c" fill="url(#ausM)" strokeWidth={1.5} name="Ausgaben" />
                <Area type="monotone" dataKey="einnahmen" stroke="#00c8b4" fill="url(#einM)" strokeWidth={1.5} name="Einnahmen" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-[#8faabb] mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4caf82]" /> Quelle: Destatis / BMF · Feb 2024
          </div>
        </div>

        {/* Bar chart */}
        <div className="bg-[#1a2b3c] border border-[#1e3048] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold">Haushaltsaufteilung</h3>
            <span className="text-[10px] text-[#8faabb]">2024 Mrd. €</span>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
                <XAxis dataKey="name" stroke="#8faabb" fontSize={9} />
                <YAxis stroke="#8faabb" fontSize={10} />
                <RechartsTooltip contentStyle={{ backgroundColor: "#0d1b2a", borderColor: "#1e3048", fontSize: 11 }} formatter={(v: number) => [`${v} Mrd. €`]} />
                <Bar dataKey="ausgaben" fill="#00c8b4" radius={[3, 3, 0, 0]} name="Ausgaben" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-[#8faabb] mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4caf82]" /> Quelle: Bundeshaushalt.de · Feb 2024
          </div>
        </div>

        {/* Source footer */}
        <div className="bg-[#1a2b3c] border border-[#1e3048] rounded-xl p-4">
          <h3 className="text-xs font-bold text-[#8faabb] uppercase tracking-widest mb-2">Datenquellen</h3>
          <div className="flex flex-wrap gap-2">
            {["Destatis", "Bundesbank", "BMF", "BA", "DRV", "IW Köln", "OECD", "SVR"].map((s) => (
              <span key={s} className="bg-[#0d1b2a] border border-[#1e3048] text-[#8faabb] text-[10px] px-2 py-1 rounded flex items-center gap-1">
                {s} <ExternalLink size={8} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
