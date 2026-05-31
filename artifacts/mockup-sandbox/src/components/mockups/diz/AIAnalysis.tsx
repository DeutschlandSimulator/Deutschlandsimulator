import React, { useState } from "react";
import { Send, ChevronRight, BookOpen, BarChart2, Zap } from "lucide-react";

const savedAnalyses = [
  { title: "Auswirkung Bürgergeld auf Erwerbsquote", time: "Heute, 14:30", active: false },
  { title: "Beamtenzahl Reduktion um 20%",            time: "Gestern, 09:15", active: true  },
  { title: "Rente mit 70 — Szenario",                 time: "12. Okt, 16:45", active: false },
  { title: "Vermögenssteuer Modelle EU-Vergleich",    time: "10. Okt, 11:20", active: false },
];

const suggestions = [
  "Wie wirkt sich das auf Pensionen aus?",
  "Welche Ministerien wären am stärksten betroffen?",
  "In der Simulation anwenden",
];

interface AnalysisSection {
  color: string;
  borderColor: string;
  bgColor: string;
  label: string;
  text: string;
  confidence: string;
  source: string;
}

const sections: AnalysisSection[] = [
  {
    color:       "#4caf82",
    borderColor: "border-[#4caf82]",
    bgColor:     "bg-[#1a3d2b]",
    label:       "Chancen",
    text:        "Einsparung ca. 28 Mrd. € jährlich bei Personalkosten und Pensionsrückstellungen. Schlankere Verwaltung ermöglicht schnellere Prozesse und kürzere Genehmigungszeiten. Der fiskalische Spielraum für Investitionen in Bildung und Infrastruktur steigt signifikant.",
    confidence:  "Hohe Evidenz",
    source:      "BMI / Destatis",
  },
  {
    color:       "#e05c5c",
    borderColor: "border-[#e05c5c]",
    bgColor:     "bg-[#3d1515]",
    label:       "Risiken",
    text:        "Überlastung verbleibender Beamter in systemkritischen Bereichen (Schulen, Polizei, Finanzämter). Qualitätsverlust bei öffentlichen Dienstleistungen kurzfristig unvermeidbar. Umbau dauert realistisch 10–15 Jahre — politischer Widerstand ist erheblich.",
    confidence:  "Mittlere Evidenz",
    source:      "DIW Berlin",
  },
  {
    color:       "#4a90e2",
    borderColor: "border-[#4a90e2]",
    bgColor:     "bg-[#0d1e3d]",
    label:       "Gewinner",
    text:        "Steuerzahler (Entlastung ca. −320 €/Jahr pro Haushalt). Unternehmen durch weniger Bürokratie und schnellere Verwaltungsentscheidungen. Technologieanbieter (Digitalisierungsschub). Junge Generationen durch niedrigere Staatsschulden.",
    confidence:  "Mittlere Evidenz",
    source:      "IW Köln",
  },
  {
    color:       "#f5a623",
    borderColor: "border-[#f5a623]",
    bgColor:     "bg-[#3d2d0a]",
    label:       "Verlierer",
    text:        "Betroffene Beamte (~980.000 Stellen gefährdet, vor allem im mittleren Dienst). Gewerkschaften (ver.di, dbb). Strukturschwache Regionen im Osten mit hohem Staatsbeamtenanteil. Kommunen mit geringer Eigeneinnahmekraft.",
    confidence:  "Hohe Evidenz",
    source:      "DGB / Destatis",
  },
  {
    color:       "#8faabb",
    borderColor: "border-[#1e3048]",
    bgColor:     "bg-[#243447]",
    label:       "Langfristig (2030–2040)",
    text:        "BIP +0,3% durch Effizienzgewinne ab ca. 2032 — wenn Digitalisierung konsequent umgesetzt wird. Demografisch ist die Reduktion notwendig: Zahl der Erwerbstätigen sinkt bis 2035 um ~4 Mio., Beamtenapparat muss schrumpfen. Pensionslast bleibt hoch.",
    confidence:  "Hohe Unsicherheit",
    source:      "SVR Wirtschaft",
  },
];

export function AIAnalysis() {
  const [input, setInput] = useState("");

  return (
    <div className="bg-[#0d1b2a] min-h-screen text-[#f0f4f8] font-sans flex">
      {/* Sidebar */}
      <div className="w-[260px] bg-[#1a2b3c] border-r border-[#1e3048] flex flex-col shrink-0">
        <div className="p-4 border-b border-[#1e3048]">
          <h2 className="font-bold text-sm uppercase tracking-widest text-[#8faabb]">Analysen</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {savedAnalyses.map((a, i) => (
            <button key={i} className={`w-full text-left p-3 rounded transition-colors text-sm ${a.active ? "bg-[#243447] border border-[#00c8b4]/30" : "hover:bg-[#243447]"}`}>
              <div className="truncate font-medium text-[#f0f4f8] text-sm leading-tight">{a.title}</div>
              <div className="text-xs text-[#8faabb] mt-1">{a.time}</div>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-[#1e3048]">
          <button className="w-full bg-[#0d1b2a] hover:bg-[#243447] text-[#00c8b4] border border-[#00c8b4]/40 px-3 py-2 rounded text-sm font-medium flex items-center gap-2">
            <span>+</span> Neue Analyse
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col h-screen relative">
        {/* Header */}
        <div className="p-5 border-b border-[#1e3048] flex items-center gap-3">
          <h1 className="text-xl font-bold">KI-Politikanalyse</h1>
          <span className="bg-[#00c8b4] text-[#0d1b2a] text-xs font-bold px-2 py-0.5 rounded">AI</span>
          <div className="ml-auto flex items-center gap-4 text-xs text-[#8faabb]">
            <span className="flex items-center gap-1"><BookOpen size={11} /> Quellen verifiziert</span>
            <span className="flex items-center gap-1"><BarChart2 size={11} /> Simulation aktiv</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">
          {/* Context bar */}
          <div className="bg-[#1a2b3c] border border-[#1e3048] rounded px-4 py-2.5 flex items-center gap-3">
            <Zap size={13} className="text-[#00c8b4] shrink-0" />
            <span className="text-xs text-[#8faabb]">Analyse basiert auf aktueller Simulation:</span>
            <span className="text-xs text-[#f0f4f8] font-medium">Beamte 4.900k → 3.920k | Szenario Realistisch</span>
            <ChevronRight size={12} className="text-[#8faabb] ml-auto" />
          </div>

          {/* User message */}
          <div className="flex justify-end">
            <div className="bg-[#00c8b4] text-[#0d1b2a] px-5 py-3 rounded-2xl rounded-tr-sm max-w-xl font-medium text-sm">
              Was passiert, wenn die Beamtenzahl um 20% sinkt?
            </div>
          </div>

          {/* AI response */}
          <div className="max-w-3xl">
            <div className="bg-[#1a2b3c] border border-[#1e3048] rounded-2xl rounded-tl-sm p-5">
              <p className="text-sm text-[#8faabb] mb-5 leading-relaxed">
                Eine Reduktion der Beamtenzahl um 20 % (ca. 980.000 Stellen) ist ein massiver struktureller Eingriff in den deutschen Staatsapparat. Hier ist die detaillierte Analyse der Konsequenzen auf Basis aktueller wissenschaftlicher Erkenntnisse:
              </p>

              <div className="space-y-3">
                {sections.map((s) => (
                  <div key={s.label} className={`${s.bgColor} border-l-2 ${s.borderColor} rounded-r px-4 py-3`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-bold text-sm" style={{ color: s.color }}>{s.label}</h4>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] px-2 py-0.5 rounded-full border font-medium"
                          style={{ color: s.color, borderColor: `${s.color}40`, background: "rgba(0,0,0,0.2)" }}>
                          {s.confidence}
                        </span>
                        <span className="text-[9px] text-[#8faabb]">{s.source}</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#8faabb] leading-relaxed">{s.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-[#1e3048]">
                <div className="text-[10px] text-[#8faabb] flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4caf82]" /> 2 Quellen mit hoher Evidenz
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f5a623]" /> 2 mit mittlerer Evidenz
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e05c5c]" /> 1 mit hoher Unsicherheit
                  </span>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {suggestions.map((s) => (
                <button key={s} className="bg-[#1a2b3c] hover:bg-[#243447] text-[#00c8b4] border border-[#1e3048] px-3 py-1.5 rounded-full text-xs transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#0d1b2a] via-[#0d1b2a]/95 to-transparent">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Stelle eine Frage zur aktuellen Simulation…"
              className="flex-1 bg-[#1a2b3c] border border-[#1e3048] focus:border-[#00c8b4] rounded-full px-5 py-3 text-[#f0f4f8] text-sm focus:outline-none placeholder:text-[#8faabb] transition-colors"
            />
            <button className="bg-[#00c8b4] hover:bg-[#00a896] text-[#0d1b2a] px-5 py-3 rounded-full font-bold flex items-center gap-2 transition-colors">
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
