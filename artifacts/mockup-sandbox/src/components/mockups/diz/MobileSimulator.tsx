import React, { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Info, TrendingUp, TrendingDown, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

type ActiveTab = "parameter" | "ergebnisse" | "zusammenfassung";
type ScenarioMode = "optimistisch" | "realistisch" | "pessimistisch";

function SliderRow({ label, value, min, max, step = 1, unit, onChange, evidenz }: {
  label: string; value: number; min: number; max: number; step?: number;
  unit?: string; onChange: (v: number) => void; evidenz: "hoch" | "mittel" | "gering";
}) {
  const dotColor = evidenz === "hoch" ? "bg-[#4caf82]" : evidenz === "mittel" ? "bg-[#f5a623]" : "bg-[#e05c5c]";
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
          <span className="text-sm font-medium text-[#f0f4f8]">{label}</span>
          <button className="text-[#8faabb]"><Info size={11} /></button>
        </div>
        <Badge variant="outline" className="bg-[#243447] text-[#00c8b4] border-[#1e3048] text-xs py-0">{value}{unit}</Badge>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 accent-[#00c8b4] rounded-lg" />
    </div>
  );
}

function ToggleRow({ label, value, onChange, danger }: {
  label: string; value: boolean; onChange: (v: boolean) => void; danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className={`text-sm ${danger && value ? "text-[#e05c5c]" : "text-[#f0f4f8]"}`}>{label}</span>
      <button onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full relative transition-colors ${value ? (danger ? "bg-[#e05c5c]" : "bg-[#00c8b4]") : "bg-[#1e3048]"}`}>
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? "translate-x-7" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

export function MobileSimulator() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("parameter");
  const [scenario, setScenario] = useState<ScenarioMode>("realistisch");

  const [beamte, setBeamte] = useState(4900);
  const [ministerien, setMinisterien] = useState(16);
  const [verteidigung, setVerteidigung] = useState(2.0);
  const [entwicklung, setEntwicklung] = useState(0.4);
  const [fluechtlinge, setFluechtlinge] = useState(180);
  const [fachkraefte, setFachkraefte] = useState(200);
  const [euZuwanderung, setEuZuwanderung] = useState(true);
  const [einheitsversicherung, setEinheitsversicherung] = useState(false);
  const [privatAbschaffen, setPrivatAbschaffen] = useState(false);
  const [beitragssatz, setBeitragssatz] = useState(14.6);
  const [buergergeld, setBuergergeld] = useState(502);
  const [rentenalter, setRenteneintrittsalter] = useState(67);
  const [rentenniveau, setRentenniveau] = useState(48);
  const [einkommensteuer, setEinkommensteuer] = useState(42);
  const [unternehmenssteuer, setUnternehmenssteuer] = useState(29.9);
  const [vermoegenssteuer, setVermoegenssteuer] = useState(false);

  const alq = (5.7 - (fachkraefte - 200) * 0.003 + (buergergeld - 502) * 0.001).toFixed(1);
  const wachstum = (0.8 + (fachkraefte - 200) * 0.0008).toFixed(1);
  const steuer = (916 + (einkommensteuer - 42) * 3.2).toFixed(0);

  const scenarioColors: Record<ScenarioMode, string> = {
    optimistisch: "bg-[#1a3d2b] text-[#4caf82] border-[#4caf82]/50",
    realistisch:  "bg-[#243447] text-[#00c8b4] border-[#00c8b4]/50",
    pessimistisch:"bg-[#3d1515] text-[#e05c5c] border-[#e05c5c]/50",
  };

  return (
    <div className="w-[390px] min-h-[844px] bg-[#0d1b2a] mx-auto flex flex-col text-[#f0f4f8] font-sans border-x border-[#1e3048] relative">
      {/* Header */}
      <header className="p-4 border-b border-[#1e3048] bg-[#1a2b3c] shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-base font-bold">Simulator</h1>
          <Badge className="bg-[#4caf82] text-white text-xs">LIVE</Badge>
        </div>
        {/* Scenario chips */}
        <div className="flex gap-1.5">
          {(["optimistisch","realistisch","pessimistisch"] as ScenarioMode[]).map((s) => (
            <button key={s} onClick={() => setScenario(s)}
              className={`text-[10px] px-2.5 py-1 rounded-full border font-medium transition-colors capitalize ${
                scenario === s ? scenarioColors[s] : "bg-[#0d1b2a] text-[#8faabb] border-[#1e3048]"
              }`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {activeTab === "parameter" && (
          <div className="p-4">
            {/* Evidenz legend */}
            <div className="flex gap-3 text-[10px] text-[#8faabb] mb-4">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#4caf82]" /> Hohe Evidenz</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f5a623]" /> Mittel</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#e05c5c]" /> Unsicher</span>
            </div>
            <Accordion type="single" defaultValue="staat" className="space-y-2">
              <AccordionItem value="staat" className="border border-[#1e3048] bg-[#1a2b3c] rounded-lg px-4">
                <AccordionTrigger className="text-[#00c8b4] font-bold text-sm py-3">Staat</AccordionTrigger>
                <AccordionContent className="space-y-5 pt-1 pb-4">
                  <SliderRow label="Beamte" value={beamte} min={4200} max={6000} unit="k" onChange={setBeamte} evidenz="hoch" />
                  <SliderRow label="Ministerien" value={ministerien} min={10} max={25} onChange={setMinisterien} evidenz="mittel" />
                  <SliderRow label="Verteidigung" value={verteidigung} min={1.0} max={3.0} step={0.1} unit="% BIP" onChange={setVerteidigung} evidenz="hoch" />
                  <SliderRow label="Entwicklungshilfe" value={entwicklung} min={0.2} max={0.8} step={0.1} unit="% BIP" onChange={setEntwicklung} evidenz="hoch" />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="migration" className="border border-[#1e3048] bg-[#1a2b3c] rounded-lg px-4">
                <AccordionTrigger className="text-[#8faabb] font-bold text-sm py-3">Migration</AccordionTrigger>
                <AccordionContent className="space-y-5 pt-1 pb-4">
                  <SliderRow label="Flüchtlingsaufnahme" value={fluechtlinge} min={50} max={400} unit="k/J" onChange={setFluechtlinge} evidenz="mittel" />
                  <SliderRow label="Fachkräftezuwanderung" value={fachkraefte} min={50} max={500} unit="k/J" onChange={setFachkraefte} evidenz="hoch" />
                  <ToggleRow label="EU-Zuwanderung frei" value={euZuwanderung} onChange={setEuZuwanderung} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="gesundheit" className="border border-[#1e3048] bg-[#1a2b3c] rounded-lg px-4">
                <AccordionTrigger className="text-[#8faabb] font-bold text-sm py-3">Gesundheit</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-1 pb-4">
                  <ToggleRow label="Einheitsversicherung" value={einheitsversicherung} onChange={setEinheitsversicherung} />
                  <ToggleRow label="Privatversicherung abschaffen" value={privatAbschaffen} onChange={setPrivatAbschaffen} danger />
                  <SliderRow label="Beitragssatz" value={beitragssatz} min={14} max={18} step={0.1} unit="%" onChange={setBeitragssatz} evidenz="hoch" />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="soziales" className="border border-[#1e3048] bg-[#1a2b3c] rounded-lg px-4">
                <AccordionTrigger className="text-[#8faabb] font-bold text-sm py-3">Soziales</AccordionTrigger>
                <AccordionContent className="space-y-5 pt-1 pb-4">
                  <SliderRow label="Bürgergeld" value={buergergeld} min={400} max={700} unit=" €" onChange={setBuergergeld} evidenz="mittel" />
                  <SliderRow label="Renteneintrittsalter" value={rentenalter} min={63} max={70} unit=" J." onChange={setRenteneintrittsalter} evidenz="hoch" />
                  <SliderRow label="Rentenniveau" value={rentenniveau} min={40} max={55} unit="%" onChange={setRentenniveau} evidenz="hoch" />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="steuern" className="border border-[#1e3048] bg-[#1a2b3c] rounded-lg px-4">
                <AccordionTrigger className="text-[#8faabb] font-bold text-sm py-3">Steuern</AccordionTrigger>
                <AccordionContent className="space-y-5 pt-1 pb-4">
                  <SliderRow label="Spitzensteuersatz" value={einkommensteuer} min={30} max={55} step={0.5} unit="%" onChange={setEinkommensteuer} evidenz="mittel" />
                  <SliderRow label="Unternehmenssteuer" value={unternehmenssteuer} min={10} max={35} step={0.1} unit="%" onChange={setUnternehmenssteuer} evidenz="mittel" />
                  <ToggleRow label="Vermögenssteuer einführen" value={vermoegenssteuer} onChange={setVermoegenssteuer} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {activeTab === "ergebnisse" && (
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-bold">Echtzeit-KPIs</span>
              <Badge className="bg-[#4caf82] text-white text-xs">LIVE</Badge>
            </div>
            {[
              { label: "Haushaltsdefizit",    val: "-34.2 Mrd. €", color: "#e05c5c", icon: <TrendingDown size={14} />, src: "BMF" },
              { label: "Staatsverschuldung",  val: "2.445 Mrd. €", color: "#f0f4f8", icon: null,                        src: "Bundesbank" },
              { label: "Steueraufkommen",     val: `${steuer} Mrd. €`,  color: "#4caf82", icon: <TrendingUp size={14} />,   src: "Destatis" },
              { label: "Gesundheitskosten",   val: "468 Mrd. €",   color: "#f0f4f8", icon: null,                        src: "BMG" },
              { label: "Rentenkosten",        val: "362 Mrd. €",   color: "#f0f4f8", icon: null,                        src: "DRV" },
              { label: "Arbeitslosenquote",   val: `${alq}%`,           color: Number(alq) > 5.5 ? "#e05c5c" : "#4caf82", icon: <TrendingDown size={14} />, src: "BA" },
              { label: "Fachkräftemangel",    val: `${Math.max(0, 890-(fachkraefte-200)*1.5).toFixed(0)}k`, color: "#f5a623", icon: null, src: "IW Köln" },
              { label: "Wirtschaftswachstum", val: `+${wachstum}%`,     color: "#4caf82", icon: <TrendingUp size={14} />,   src: "SVR" },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-[#1a2b3c] border border-[#1e3048] rounded-lg p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#8faabb] mb-0.5">{kpi.label}</div>
                  <div className="font-bold" style={{ color: kpi.color }}>{kpi.val}</div>
                </div>
                <div className="text-right">
                  <div style={{ color: kpi.color }}>{kpi.icon}</div>
                  <div className="text-[10px] text-[#8faabb] mt-1">{kpi.src}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "zusammenfassung" && (
          <div className="p-4 space-y-4">
            <div className="bg-[#1a2b3c] border border-[#1e3048] rounded-lg p-4">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                <span className="text-[#00c8b4]">▣</span> Dein Deutschland
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Wirtschaftswachstum", val: `+${wachstum}%`, pos: true },
                  { label: "Arbeitslosenquote",   val: `${alq}%`,       pos: Number(alq) < 5.7 },
                  { label: "Steueraufkommen",     val: `${steuer} Mrd.`, pos: true },
                  { label: "Rentenniveau",        val: `${rentenniveau}%`,  pos: rentenniveau >= 48 },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between text-sm">
                    <span className="text-[#8faabb]">{r.label}</span>
                    <span className={`font-bold ${r.pos ? "text-[#4caf82]" : "text-[#e05c5c]"}`}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-[#1a3d2b] border border-[#4caf82]/30 rounded-lg p-3 flex items-start gap-2">
                <CheckCircle2 size={13} className="text-[#4caf82] mt-0.5 shrink-0" />
                <p className="text-xs text-[#4caf82]">Fachkräftezuwanderung verbessert Haushalt langfristig</p>
              </div>
              <div className="bg-[#3d1515] border border-[#e05c5c]/30 rounded-lg p-3 flex items-start gap-2">
                <XCircle size={13} className="text-[#e05c5c] mt-0.5 shrink-0" />
                <p className="text-xs text-[#e05c5c]">Verteidigungsausgaben belasten Haushalt strukturell</p>
              </div>
              <div className="bg-[#3d2d0a] border border-[#f5a623]/30 rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle size={13} className="text-[#f5a623] mt-0.5 shrink-0" />
                <p className="text-xs text-[#f5a623]">Demografischer Rentendruck bleibt langfristiges Risiko</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tab bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[72px] bg-[#1a2b3c] border-t border-[#1e3048] flex">
        {[
          { key: "parameter" as ActiveTab,        icon: "⚙", label: "Parameter" },
          { key: "ergebnisse" as ActiveTab,        icon: "📊", label: "Ergebnisse" },
          { key: "zusammenfassung" as ActiveTab,   icon: "▣", label: "Zusammenfassung" },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
              activeTab === tab.key ? "text-[#00c8b4]" : "text-[#8faabb]"
            }`}>
            <span className="text-lg leading-none">{tab.icon}</span>
            <span className="text-[10px] font-medium">{tab.label}</span>
            {activeTab === tab.key && <span className="w-4 h-0.5 bg-[#00c8b4] rounded-full mt-0.5" />}
          </button>
        ))}
      </div>
    </div>
  );
}
