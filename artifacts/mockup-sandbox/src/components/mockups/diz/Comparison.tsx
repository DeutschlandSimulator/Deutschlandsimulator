import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

const data = [
  { name: "Staatsverschuldung", StatusQuo: 2445, Reformmodell: 2189 },
  { name: "Steuereinnahmen",    StatusQuo: 916,  Reformmodell: 978  },
  { name: "Rentenkosten",       StatusQuo: 362,  Reformmodell: 341  },
  { name: "Gesundheitskosten",  StatusQuo: 468,  Reformmodell: 451  },
];

type ScenarioKey = "status_quo" | "reformA" | "reformB";

const scenarios: Record<ScenarioKey, { label: string; farbe: string; cls: string }> = {
  status_quo: { label: "Status Quo 2024",   farbe: "#8faabb", cls: "bg-[#1a2b3c] text-[#8faabb] border border-[#1e3048]"  },
  reformA:    { label: "Reformmodell A",     farbe: "#00c8b4", cls: "bg-[#0d3332] text-[#00c8b4] border border-[#00c8b4]/50" },
  reformB:    { label: "Reformmodell B",     farbe: "#4caf82", cls: "bg-[#1a3d2b] text-[#4caf82] border border-[#4caf82]/50" },
};

interface CompRow {
  label: string;
  left: string;
  right: string;
  delta: string;
  positive: boolean;
  source: string;
  confidence: "hoch" | "mittel";
}

const rows: CompRow[] = [
  { label: "Staatsverschuldung", left: "2.445 Mrd. €", right: "2.189 Mrd. €", delta: "−256 Mrd. €", positive: true,  source: "Deutsche Bundesbank",    confidence: "hoch"   },
  { label: "Steuereinnahmen",    left: "916 Mrd. €",   right: "978 Mrd. €",   delta: "+62 Mrd. €",   positive: true,  source: "Destatis / BMF",          confidence: "hoch"   },
  { label: "Arbeitslosenquote",  left: "5,7 %",        right: "4,9 %",        delta: "−0,8 Pp.",     positive: true,  source: "Bundesagentur für Arbeit", confidence: "hoch"   },
  { label: "Rentenkosten",       left: "362 Mrd. €",   right: "341 Mrd. €",   delta: "−21 Mrd. €",   positive: true,  source: "Deutsche Rentenvers.",    confidence: "mittel" },
  { label: "Gesundheitskosten",  left: "468 Mrd. €",   right: "451 Mrd. €",   delta: "−17 Mrd. €",   positive: true,  source: "BMG / GKV-SV",            confidence: "mittel" },
];

export function Comparison() {
  const [leftScen, setLeftScen] = useState<ScenarioKey>("status_quo");
  const [rightScen, setRightScen] = useState<ScenarioKey>("reformA");

  return (
    <div className="bg-[#0d1b2a] min-h-screen p-6 text-[#f0f4f8] font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Szenario-Vergleich</h1>
          <p className="text-[#8faabb] text-sm mt-1">Vergleiche zwei Reformszenarien direkt nebeneinander</p>
        </div>
        <div className="flex gap-3 items-center">
          <select
            value={leftScen}
            onChange={(e) => setLeftScen(e.target.value as ScenarioKey)}
            className="bg-[#1a2b3c] border border-[#1e3048] text-[#f0f4f8] p-2 rounded text-sm"
          >
            {Object.entries(scenarios).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <span className="text-[#8faabb] font-bold">vs</span>
          <select
            value={rightScen}
            onChange={(e) => setRightScen(e.target.value as ScenarioKey)}
            className="bg-[#1a2b3c] border border-[#00c8b4] text-[#f0f4f8] p-2 rounded text-sm"
          >
            {Object.entries(scenarios).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_160px_1fr] gap-4 mb-4 text-center">
        <div className={`py-2.5 px-4 rounded text-sm font-bold ${scenarios[leftScen].cls}`}>
          {scenarios[leftScen].label}
        </div>
        <div className="flex items-center justify-center">
          <span className="text-xs text-[#8faabb]">Differenz</span>
        </div>
        <div className={`py-2.5 px-4 rounded text-sm font-bold ${scenarios[rightScen].cls}`}>
          {scenarios[rightScen].label}
        </div>
      </div>

      {/* Comparison rows */}
      <div className="space-y-3 mb-10">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[1fr_160px_1fr] bg-[#1a2b3c] border border-[#1e3048] rounded overflow-hidden">
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-[#f0f4f8]">{row.left}</div>
            </div>
            <div className="flex flex-col items-center justify-center p-3 border-x border-[#1e3048]">
              <div className="text-[10px] text-[#8faabb] mb-1">{row.label}</div>
              <div className={`text-sm font-bold px-3 py-1 rounded-full ${row.positive ? "bg-[#1a3d2b] text-[#4caf82]" : "bg-[#3d1515] text-[#e05c5c]"}`}>
                {row.delta}
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className={`w-1.5 h-1.5 rounded-full ${row.confidence === "hoch" ? "bg-[#4caf82]" : "bg-[#f5a623]"}`} />
                <span className="text-[9px] text-[#8faabb]">{row.source}</span>
              </div>
            </div>
            <div className="p-4 text-center">
              <div className="text-2xl font-bold" style={{ color: scenarios[rightScen].farbe }}>{row.right}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-[#1a2b3c] p-5 rounded border border-[#1e3048] mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Kennzahlen im Vergleich (Mrd. €)</h3>
          <span className="text-[10px] text-[#8faabb]">Quelle: BMF, Destatis, DRV, BMG — Stand März 2024</span>
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
              <XAxis dataKey="name" stroke="#8faabb" fontSize={11} />
              <YAxis stroke="#8faabb" fontSize={11} />
              <RechartsTooltip
                cursor={{ fill: "#243447" }}
                contentStyle={{ backgroundColor: "#0d1b2a", borderColor: "#1e3048", fontSize: 12 }}
                formatter={(v: number) => [`${v} Mrd. €`]}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="StatusQuo"   fill="#8faabb" name={scenarios[leftScen].label}  radius={[3,3,0,0]} />
              <Bar dataKey="Reformmodell" fill="#00c8b4" name={scenarios[rightScen].label} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insight cards */}
      <div>
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
          <Info size={14} className="text-[#00c8b4]" />
          Wichtigste Unterschiede
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#1a2b3c] p-4 border-l-4 border-[#4caf82] rounded-r border border-l-0 border-[#1e3048]">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={14} className="text-[#4caf82]" />
              <span className="font-bold text-sm text-[#4caf82]">Fiskalischer Spielraum</span>
            </div>
            <p className="text-[#8faabb] text-sm leading-relaxed">Der Staatshaushalt wird um 256 Mrd. € entlastet — Spielraum für Infrastruktur und Bildungsinvestitionen.</p>
            <div className="mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4caf82]" />
              <span className="text-[10px] text-[#8faabb]">Hohe Evidenz · Bundesbank</span>
            </div>
          </div>
          <div className="bg-[#1a2b3c] p-4 border-l-4 border-[#4caf82] rounded-r border border-l-0 border-[#1e3048]">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={14} className="text-[#4caf82]" />
              <span className="font-bold text-sm text-[#4caf82]">Arbeitsmarkt-Belebung</span>
            </div>
            <p className="text-[#8faabb] text-sm leading-relaxed">Arbeitslosenquote unter 5% entlastet Sozialkassen um ~12 Mrd. € jährlich und stärkt die Kaufkraft.</p>
            <div className="mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4caf82]" />
              <span className="text-[10px] text-[#8faabb]">Hohe Evidenz · BA</span>
            </div>
          </div>
          <div className="bg-[#1a2b3c] p-4 border-l-4 border-[#e05c5c] rounded-r border border-l-0 border-[#1e3048]">
            <div className="flex items-center gap-2 mb-2">
              <XCircle size={14} className="text-[#e05c5c]" />
              <span className="font-bold text-sm text-[#e05c5c]">Sozialer Spannungspotenzial</span>
            </div>
            <p className="text-[#8faabb] text-sm leading-relaxed">Rentenkürzungen und höheres Renteneintrittsalter könnten Akzeptanzprobleme und soziale Proteste verursachen.</p>
            <div className="mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5a623]" />
              <span className="text-[10px] text-[#8faabb]">Mittlere Evidenz · DIW</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-[#8faabb] mt-6 text-right">
        Modellannahmen und Berechnungslogik basieren auf Daten von Destatis, Bundesbank, BMF, DRV, BA, OECD und IWF. Stand März 2024.
      </p>
    </div>
  );
}
