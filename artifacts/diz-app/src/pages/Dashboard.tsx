import { useState } from "react";
import {
  AreaChart, Area, PieChart, Pie, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Cell, Legend,
} from "recharts";
import { ExternalLink, Info, Download, Share2, Check } from "lucide-react";
import { Layout } from "@/components/Layout";
import { areaData, pieData, COLORS, ageData, kpis } from "@/components/simulator/data";
import { EvidenzLevel } from "@/components/simulator/types";

const confidenceDot: Record<EvidenzLevel, string> = {
  hoch:   "bg-[#4caf82]",
  mittel: "bg-[#f5a623]",
  gering: "bg-[#e05c5c]",
};
const confidenceLabel: Record<EvidenzLevel, string> = {
  hoch:   "Hohe Evidenz",
  mittel: "Mittlere Evidenz",
  gering: "Hohe Unsicherheit",
};

function SourceTag({ source, updated, confidence }: { source: string; updated: string; confidence: EvidenzLevel }) {
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

const reformRows = [
  { name: "Bürgergeld Anpassung",       effect: "Arbeitsanreize +2.1%",  cost: "+4.2 Mrd.",  pos: true,  conf: "mittel" as EvidenzLevel, src: "IAB",     status: "Simuliert", stcls: "text-[#00c8b4] bg-[#243447]"  },
  { name: "Renteneintritt 69",           effect: "Fachkräfte +400k",      cost: "+18.5 Mrd.", pos: true,  conf: "hoch"   as EvidenzLevel, src: "DRV",     status: "Aktiv",     stcls: "text-[#4caf82] bg-[#1a3d2b]"  },
  { name: "Vermögenssteuer 1%",          effect: "Kapitalflucht Risiko",  cost: "+9.0 Mrd.",  pos: true,  conf: "gering" as EvidenzLevel, src: "IW Köln", status: "Inaktiv",   stcls: "text-[#8faabb] bg-[#1e3048]"  },
  { name: "Fachkräftezuwanderung +200k", effect: "BIP +0.4%",             cost: "+12.3 Mrd.", pos: true,  conf: "hoch"   as EvidenzLevel, src: "OECD",    status: "Simuliert", stcls: "text-[#00c8b4] bg-[#243447]"  },
  { name: "Subventionsabbau",            effect: "Wirtschaftsbelastung",  cost: "+15.0 Mrd.", pos: true,  conf: "mittel" as EvidenzLevel, src: "BMF",     status: "Inaktiv",   stcls: "text-[#8faabb] bg-[#1e3048]"  },
  { name: "Verteidigung 2.5% BIP",       effect: "NATO-Ziel erfüllt",     cost: "-21.0 Mrd.", pos: false, conf: "hoch"   as EvidenzLevel, src: "BMVg",    status: "Simuliert", stcls: "text-[#00c8b4] bg-[#243447]"  },
];

export default function DashboardPage() {
  const [copied, setCopied] = useState(false);

  function handleShare() {
    const url = window.location.href;
    const title = "Deutschlandsimulator — Kennzahlen-Dashboard";
    const text = "Schau dir das Kennzahlen-Dashboard des Deutschlandsimulators an.";
    if (navigator.share) {
      navigator.share({ title, text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  function handlePdf() {
    window.print();
  }

  return (
    <Layout>
      <div className="p-4 md:p-6 max-w-[1400px] mx-auto w-full print-page">
        {/* Header */}
        <div className="mb-6">
          <div className="text-[#8faabb] text-sm mb-1">
            <span>Startseite</span>
            <span className="mx-1">›</span>
            <span className="text-[#00c8b4]">Dashboard</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-xl md:text-2xl font-bold" data-testid="text-dashboard-title">Kennzahlen-Dashboard</h1>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 text-xs text-[#8faabb]">
                <span className="w-2 h-2 rounded-full bg-[#4caf82]" /> Hohe Evidenz
                <span className="w-2 h-2 rounded-full bg-[#f5a623] ml-1" /> Mittel
                <span className="w-2 h-2 rounded-full bg-[#e05c5c] ml-1" /> Unsicher
              </div>
              <button
                onClick={handleShare}
                className="no-print flex items-center gap-1.5 bg-[#1a2b3c] hover:bg-[#243447] text-[#f0f4f8] py-1.5 px-3 rounded border border-[#1e3048] text-sm transition-colors"
                data-testid="button-share"
              >
                {copied ? <Check size={13} className="text-[#4caf82]" /> : <Share2 size={13} />}
                {copied ? "Kopiert!" : "Teilen"}
              </button>
              <button
                onClick={handlePdf}
                className="no-print flex items-center gap-1.5 bg-[#00c8b4] hover:bg-[#00a896] text-[#0d1b2a] font-bold py-1.5 px-3 rounded text-sm transition-colors"
                data-testid="button-export"
              >
                <Download size={13} /> PDF Export
              </button>
            </div>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="bg-[#1a2b3c] p-4 rounded border border-[#1e3048] hover:border-[#00c8b4]/30 transition-colors" data-testid={`card-kpi-${kpi.label.replace(/\s+/g, "-").toLowerCase()}`}>
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

        {/* Area Chart */}
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
                    <stop offset="5%"  stopColor="#00c8b4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00c8b4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ausGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#e05c5c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#e05c5c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
                <XAxis dataKey="year" stroke="#8faabb" fontSize={12} />
                <YAxis stroke="#8faabb" fontSize={12} tickFormatter={(v) => `${v}`} />
                <RechartsTooltip contentStyle={{ backgroundColor: "#0d1b2a", borderColor: "#1e3048", fontSize: 12 }} formatter={(v: number) => [`${v} Mrd. €`]} allowEscapeViewBox={{ x: false, y: false }} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Area type="monotone" dataKey="ausgaben"  stroke="#e05c5c" fill="url(#ausGrad)" strokeWidth={2} name="Ausgaben"  />
                <Area type="monotone" dataKey="einnahmen" stroke="#00c8b4" fill="url(#einGrad)" strokeWidth={2} name="Einnahmen" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie + Age Pyramid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#1a2b3c] p-5 rounded border border-[#1e3048]">
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
                  <RechartsTooltip contentStyle={{ backgroundColor: "#0d1b2a", borderColor: "#1e3048", fontSize: 11 }} formatter={(v: number) => [`${v} Mrd. €`]} allowEscapeViewBox={{ x: false, y: false }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#1a2b3c] p-5 rounded border border-[#1e3048]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">Altersstruktur Deutschland 2024</h3>
              <span className="text-[10px] text-[#8faabb]">Quelle: Destatis · Jan 2024</span>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={ageData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
                  <XAxis type="number" stroke="#8faabb" fontSize={11} tickFormatter={(v) => `${Math.abs(v)}%`} />
                  <YAxis dataKey="age" type="category" stroke="#8faabb" fontSize={11} />
                  <RechartsTooltip contentStyle={{ backgroundColor: "#0d1b2a", borderColor: "#1e3048", fontSize: 11 }} formatter={(v: number) => [`${Math.abs(v)}%`]} allowEscapeViewBox={{ x: false, y: false }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Bar dataKey="male"   fill="#4a90e2" name="Männlich" />
                  <Bar dataKey="female" fill="#00c8b4" name="Weiblich" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Reform Table */}
        <div className="bg-[#1a2b3c] rounded border border-[#1e3048] overflow-hidden">
          <div className="p-4 border-b border-[#1e3048] flex items-center justify-between">
            <h3 className="text-base font-bold">Reformmaßnahmen Übersicht</h3>
            <div className="flex items-center gap-1.5 text-xs text-[#8faabb]">
              <Info size={11} />
              <span>Klicke eine Zeile für Berechnungsdetails</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
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
                {reformRows.map((row) => (
                  <tr key={row.name} className="hover:bg-[#243447] cursor-pointer transition-colors" data-testid={`row-reform-${row.name.replace(/\s+/g, "-").toLowerCase()}`}>
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
        </div>

        <p className="text-[10px] text-[#8faabb] mt-4 text-right">
          Datenquellen: Statistisches Bundesamt, Deutsche Bundesbank, BMF, Deutsche Rentenversicherung, Bundesagentur für Arbeit, OECD, IWF, Eurostat.
          Letzte Aktualisierung der Modellparameter: März 2024.
        </p>
      </div>
    </Layout>
  );
}
