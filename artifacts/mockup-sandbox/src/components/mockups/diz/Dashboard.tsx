import React from "react";
import { AreaChart, Area, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { ExternalLink, Info } from "lucide-react";

const areaData = [
  { year: "2020", einnahmen: 750, ausgaben: 850 },
  { year: "2021", einnahmen: 780, ausgaben: 860 },
  { year: "2022", einnahmen: 820, ausgaben: 840 },
  { year: "2023", einnahmen: 890, ausgaben: 910 },
  { year: "2024", einnahmen: 916, ausgaben: 950 },
  { year: "2025", einnahmen: 930, ausgaben: 960 },
  { year: "2026", einnahmen: 950, ausgaben: 980 },
  { year: "2027", einnahmen: 970, ausgaben: 990 },
  { year: "2028", einnahmen: 990, ausgaben: 1010 },
  { year: "2029", einnahmen: 1010, ausgaben: 1030 },
  { year: "2030", einnahmen: 1040, ausgaben: 1060 },
];

const pieData = [
  { name: "Arbeit & Soziales", value: 175 },
  { name: "Verteidigung", value: 52 },
  { name: "Bildung & Forschung", value: 21 },
  { name: "Verkehr", value: 38 },
  { name: "Zinsen", value: 37 },
  { name: "Sonstiges", value: 153.8 },
];
const COLORS = ["#00c8b4", "#4caf82", "#f5a623", "#8faabb", "#e05c5c", "#243447"];

const ageData = [
  { age: "0-14", male: -6.5, female: 6.2 },
  { age: "15-24", male: -4.3, female: 4.1 },
  { age: "25-44", male: -11.4, female: 11.1 },
  { age: "45-59", male: -10.2, female: 10.0 },
  { age: "60-74", male: -7.8, female: 8.5 },
  { age: "75+", male: -3.9, female: 5.6 },
];

type ConfidenceLevel = "hoch" | "mittel" | "gering";

interface KPIMeta {
  label: string;
  value: string;
  color: string;
  sparkPoints: string;
  sparkColor: string;
  source: string;
  updated: string;
  confidence: ConfidenceLevel;
}

const kpis: KPIMeta[] = [
  { label: "Haushaltsdefizit",    value: "-34.2 Mrd.",  color: "#e05c5c", sparkPoints: "0,10 10,12 20,5 30,15 40,8 50,18",  sparkColor: "#e05c5c", source: "Bundesministerium der Finanzen",     updated: "Mär 2024", confidence: "hoch"   },
  { label: "Staatsverschuldung",  value: "2.445 Mrd.",  color: "#f0f4f8", sparkPoints: "0,15 10,14 20,12 30,10 40,8 50,6",   sparkColor: "#8faabb", source: "Deutsche Bundesbank",             updated: "Feb 2024", confidence: "hoch"   },
  { label: "Steueraufkommen",     value: "916 Mrd.",    color: "#4caf82", sparkPoints: "0,15 10,12 20,16 30,8 40,5 50,2",    sparkColor: "#4caf82", source: "Statistisches Bundesamt",         updated: "Jan 2024", confidence: "hoch"   },
  { label: "Gesundheitskosten",   value: "468 Mrd.",    color: "#f0f4f8", sparkPoints: "0,12 10,11 20,13 30,10 40,9 50,11",  sparkColor: "#8faabb", source: "Bundesministerium für Gesundheit", updated: "Feb 2024", confidence: "mittel" },
  { label: "Rentenkosten",        value: "362 Mrd.",    color: "#f0f4f8", sparkPoints: "0,15 10,13 20,11 30,10 40,9 50,8",   sparkColor: "#8faabb", source: "Deutsche Rentenversicherung",     updated: "Jan 2024", confidence: "hoch"   },
  { label: "Arbeitslosenquote",   value: "5.7%",        color: "#e05c5c", sparkPoints: "0,5 10,8 20,6 30,10 40,12 50,14",    sparkColor: "#e05c5c", source: "Bundesagentur für Arbeit",         updated: "Mär 2024", confidence: "hoch"   },
  { label: "Fachkräftemangel",    value: "890k",        color: "#f5a623", sparkPoints: "0,5 10,6 20,8 30,10 40,12 50,14",    sparkColor: "#f5a623", source: "IW Köln / BA",                    updated: "Feb 2024", confidence: "mittel" },
  { label: "Wirtschaftswachstum", value: "+0.8%",       color: "#4caf82", sparkPoints: "0,15 10,12 20,10 30,7 40,4 50,2",    sparkColor: "#4caf82", source: "Sachverständigenrat Wirtschaft",   updated: "Nov 2023", confidence: "mittel" },
];

const confidenceDot: Record<ConfidenceLevel, string> = {
  hoch:   "bg-[#4caf82]",
  mittel: "bg-[#f5a623]",
  gering: "bg-[#e05c5c]",
};
const confidenceLabel: Record<ConfidenceLevel, string> = {
  hoch:   "Hohe Evidenz",
  mittel: "Mittlere Evidenz",
  gering: "Hohe Unsicherheit",
};

function SourceTag({ source, updated, confidence }: { source: string; updated: string; confidence: ConfidenceLevel }) {
  return (
    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#1e3048]">
      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${confidenceDot[confidence]}`} title={confidenceLabel[confidence]} />
        <span className="text-[10px] text-[#8faabb] leading-tight">{source}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-[#8faabb]">{updated}</span>
        <ExternalLink size={9} className="text-[#8faabb]" />
      </div>
    </div>
  );
}

export function Dashboard() {
  return (
    <div className="bg-[#0d1b2a] min-h-screen p-6 text-[#f0f4f8] font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-[#8faabb] text-sm mb-1">
            Startseite &gt; <span className="text-[#00c8b4]">Ergebnisse</span>
          </div>
          <h1 className="text-2xl font-bold">Ergebnis-Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#8faabb]">
            <span className="w-2 h-2 rounded-full bg-[#4caf82]" /> Hohe Evidenz
            <span className="w-2 h-2 rounded-full bg-[#f5a623] ml-2" /> Mittel
            <span className="w-2 h-2 rounded-full bg-[#e05c5c] ml-2" /> Unsicher
          </div>
          <button className="bg-[#1a2b3c] hover:bg-[#243447] text-[#f0f4f8] py-2 px-4 rounded border border-[#1e3048] text-sm">
            Teilen
          </button>
          <button className="bg-[#00c8b4] hover:bg-[#00a896] text-[#0d1b2a] font-bold py-2 px-4 rounded text-sm">
            PDF Export
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-[#1a2b3c] p-4 rounded border border-[#1e3048] relative">
            <div className="text-[#8faabb] text-sm mb-1">{kpi.label}</div>
            <div className="flex items-start justify-between">
              <div className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
              <svg className="w-12 h-6 mt-1" viewBox="0 0 50 20">
                <polyline points={kpi.sparkPoints} fill="none" stroke={kpi.sparkColor} strokeWidth="2" />
              </svg>
            </div>
            <SourceTag source={kpi.source} updated={kpi.updated} confidence={kpi.confidence} />
          </div>
        ))}
      </div>

      {/* Area chart */}
      <div className="bg-[#1a2b3c] p-6 rounded border border-[#1e3048] mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold">Einnahmen vs. Ausgaben 2020–2030</h3>
          <div className="flex items-center gap-1.5 text-xs text-[#8faabb]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4caf82]" />
            <span>Destatis / BMF</span>
            <span className="mx-1">·</span>
            <span>Aktualisiert: Feb 2024</span>
          </div>
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="einGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00c8b4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00c8b4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ausGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e05c5c" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e05c5c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
              <XAxis dataKey="year" stroke="#8faabb" fontSize={12} />
              <YAxis stroke="#8faabb" fontSize={12} />
              <RechartsTooltip contentStyle={{ backgroundColor: "#0d1b2a", borderColor: "#1e3048", fontSize: 12 }} formatter={(v: number) => [`${v} Mrd. €`]} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Area type="monotone" dataKey="ausgaben" stroke="#e05c5c" fill="url(#ausGrad)" strokeWidth={2} name="Ausgaben" />
              <Area type="monotone" dataKey="einnahmen" stroke="#00c8b4" fill="url(#einGrad)" strokeWidth={2} name="Einnahmen" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie + Age pyramid */}
      <div className="flex gap-6 mb-6">
        <div className="flex-1 bg-[#1a2b3c] p-5 rounded border border-[#1e3048]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">Haushaltsaufteilung</h3>
            <span className="text-[10px] text-[#8faabb]">Quelle: Bundeshaushalt.de · Feb 2024</span>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: "#0d1b2a", borderColor: "#1e3048", fontSize: 11 }} formatter={(v: number) => [`${v} Mrd. €`]} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="flex-1 bg-[#1a2b3c] p-5 rounded border border-[#1e3048]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">Altersstruktur Deutschland 2024</h3>
            <span className="text-[10px] text-[#8faabb]">Quelle: Destatis · Jan 2024</span>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={ageData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
                <XAxis type="number" stroke="#8faabb" fontSize={11} tickFormatter={(v) => Math.abs(v) + "%"} />
                <YAxis dataKey="age" type="category" stroke="#8faabb" fontSize={11} />
                <RechartsTooltip contentStyle={{ backgroundColor: "#0d1b2a", borderColor: "#1e3048", fontSize: 11 }} formatter={(v: number) => [`${Math.abs(v)}%`]} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="male" fill="#4a90e2" name="Männlich" />
                <Bar dataKey="female" fill="#00c8b4" name="Weiblich" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1a2b3c] rounded border border-[#1e3048] overflow-hidden">
        <div className="p-4 border-b border-[#1e3048] flex items-center justify-between">
          <h3 className="text-base font-bold">Reformmaßnahmen Übersicht</h3>
          <div className="flex items-center gap-1.5 text-xs text-[#8faabb]">
            <Info size={11} />
            <span>Klicke eine Zeile für Berechnungsdetails</span>
          </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-[#0d1b2a]">
            <tr>
              <th className="p-4 text-[#8faabb] font-medium text-sm">Maßnahme</th>
              <th className="p-4 text-[#8faabb] font-medium text-sm">Auswirkung</th>
              <th className="p-4 text-[#8faabb] font-medium text-sm">Einsparung / Kosten</th>
              <th className="p-4 text-[#8faabb] font-medium text-sm">Evidenz</th>
              <th className="p-4 text-[#8faabb] font-medium text-sm">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3048]">
            {[
              { name: "Bürgergeld Anpassung",      effect: "Arbeitsanreize +2.1%",  cost: "+4.2 Mrd.",  pos: true,  conf: "mittel" as ConfidenceLevel, src: "IAB",      status: "Simuliert", stcls: "text-[#00c8b4] bg-[#243447]"  },
              { name: "Renteneintritt 69",          effect: "Fachkräfte +400k",      cost: "+18.5 Mrd.", pos: true,  conf: "hoch"   as ConfidenceLevel, src: "DRV",      status: "Aktiv",     stcls: "text-[#4caf82] bg-[#1a3d2b]"  },
              { name: "Vermögenssteuer 1%",         effect: "Kapitalflucht Risiko",  cost: "+9.0 Mrd.",  pos: true,  conf: "gering" as ConfidenceLevel, src: "IW Köln",  status: "Inaktiv",   stcls: "text-[#8faabb] bg-[#1e3048]"  },
              { name: "Fachkräftezuwanderung +200k",effect: "BIP +0.4%",             cost: "+12.3 Mrd.", pos: true,  conf: "hoch"   as ConfidenceLevel, src: "OECD",     status: "Simuliert", stcls: "text-[#00c8b4] bg-[#243447]"  },
              { name: "Subventionsabbau",           effect: "Wirtschaftsbelastung",  cost: "+15.0 Mrd.", pos: true,  conf: "mittel" as ConfidenceLevel, src: "BMF",      status: "Inaktiv",   stcls: "text-[#8faabb] bg-[#1e3048]"  },
              { name: "Verteidigung 2.5% BIP",      effect: "NATO-Ziel erfüllt",     cost: "-21.0 Mrd.", pos: false, conf: "hoch"   as ConfidenceLevel, src: "BMVg",     status: "Simuliert", stcls: "text-[#00c8b4] bg-[#243447]"  },
            ].map((row) => (
              <tr key={row.name} className="hover:bg-[#243447] cursor-pointer transition-colors">
                <td className="p-4 text-sm font-medium">{row.name}</td>
                <td className="p-4 text-sm text-[#8faabb]">{row.effect}</td>
                <td className={`p-4 text-sm font-bold ${row.pos ? "text-[#4caf82]" : "text-[#e05c5c]"}`}>{row.cost} €</td>
                <td className="p-4">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${confidenceDot[row.conf]}`} />
                    <span className="text-[10px] text-[#8faabb]">{row.src}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${row.stcls}`}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-[#8faabb] mt-4 text-right">
        Datenquellen: Statistisches Bundesamt, Deutsche Bundesbank, BMF, Deutsche Rentenversicherung, Bundesagentur für Arbeit, OECD, IWF, Eurostat.
        Letzte Aktualisierung der Modellparameter: März 2024.
      </p>
    </div>
  );
}
