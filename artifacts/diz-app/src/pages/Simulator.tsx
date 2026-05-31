import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line,
} from "recharts";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Info, CheckCircle2, AlertTriangle, XCircle,
  TrendingUp, TrendingDown, Users, Wallet,
  HeartPulse, Briefcase, ShoppingCart, Building2,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { InfoPanel } from "@/components/simulator/InfoPanel";
import {
  SLIDER_INFO, scenarioMultipliers, partyProfiles,
} from "@/components/simulator/data";
import { EvidenzLevel, ScenarioMode } from "@/components/simulator/types";

function EvidenzDot({ level }: { level: EvidenzLevel }) {
  const colors: Record<EvidenzLevel, string> = {
    hoch:   "bg-[#4caf82]",
    mittel: "bg-[#f5a623]",
    gering: "bg-[#e05c5c]",
  };
  const labels: Record<EvidenzLevel, string> = {
    hoch:   "Hohe Evidenz",
    mittel: "Mittlere Evidenz",
    gering: "Hohe Unsicherheit",
  };
  return (
    <span
      title={labels[level]}
      className={`w-2 h-2 rounded-full shrink-0 ${colors[level]}`}
    />
  );
}

function SliderRow({
  label, infoKey, value, min, max, step = 1, unit, onChange, onInfo,
}: {
  label: string; infoKey: string; value: number; min: number; max: number;
  step?: number; unit?: string; onChange: (v: number) => void; onInfo: (k: string) => void;
}) {
  const info = SLIDER_INFO[infoKey];
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-[#f0f4f8]">{label}</span>
          {info && (
            <button
              onClick={() => onInfo(infoKey)}
              className="text-[#8faabb] hover:text-[#00c8b4] transition-colors"
              data-testid={`button-info-${infoKey}`}
            >
              <Info size={13} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className="bg-[#243447] text-[#00c8b4] border-[#1e3048] text-xs py-0">
            {value}{unit}
          </Badge>
          {info && <EvidenzDot level={info.evidenz} />}
        </div>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#00c8b4] h-1.5"
        data-testid={`slider-${infoKey}`}
      />
    </div>
  );
}

function ToggleRow({
  label, infoKey, value, onChange, danger, onInfo,
}: {
  label: string; infoKey?: string; value: boolean; onChange: (v: boolean) => void;
  danger?: boolean; onInfo: (k: string) => void;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-1.5 text-sm">
        <span className={danger && value ? "text-[#e05c5c]" : "text-[#f0f4f8]"}>{label}</span>
        {infoKey && SLIDER_INFO[infoKey] && (
          <button
            onClick={() => onInfo(infoKey)}
            className="text-[#8faabb] hover:text-[#00c8b4] transition-colors"
            data-testid={`button-info-${infoKey}`}
          >
            <Info size={13} />
          </button>
        )}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-10 h-5 rounded-full relative transition-colors shrink-0 ${
          value ? (danger ? "bg-[#e05c5c]" : "bg-[#00c8b4]") : "bg-[#1e3048]"
        }`}
        data-testid={`toggle-${infoKey ?? label.replace(/\s+/g, "-").toLowerCase()}`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            value ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function calcPartyMatch(
  vals: Record<string, number | boolean>,
  p: typeof partyProfiles[0],
) {
  const fields: [keyof typeof p, number, number][] = [
    ["beamte",          4200, 6000],
    ["ministerien",     10,   25],
    ["verteidigung",    1.0,  3.0],
    ["fachkraefte",     50,   500],
    ["buergergeld",     400,  700],
    ["rentenalter",     63,   70],
    ["einkommensteuer", 30,   55],
  ];
  let score = 0;
  for (const [key, min, max] of fields) {
    const range = max - min;
    const diff = Math.abs(Number(vals[key as string]) - Number(p[key]));
    score += Math.max(0, 1 - diff / range);
  }
  const boolMatch = vals.vermoegenssteuer === p.vermoegenssteuer ? 1 : 0;
  return Math.round(((score + boolMatch) / (fields.length + 1)) * 100);
}

export default function SimulatorPage() {
  // State
  const [beamte,          setBeamte]          = useState(4900);
  const [ministerien,     setMinisterien]      = useState(16);
  const [verteidigung,    setVerteidigung]     = useState(2.0);
  const [entwicklung,     setEntwicklung]      = useState(0.4);
  const [fluechtlinge,    setFluechtlinge]     = useState(180);
  const [fachkraefte,     setFachkraefte]      = useState(200);
  const [euZuwanderung,   setEuZuwanderung]    = useState(true);
  const [einheitsversicherung, setEinheitsversicherung] = useState(false);
  const [privatAbschaffen,     setPrivatAbschaffen]     = useState(false);
  const [beitragssatz,    setBeitragssatz]     = useState(14.6);
  const [buergergeld,     setBuergergeld]      = useState(502);
  const [rentenalter,     setRentenalter]      = useState(67);
  const [rentenniveau,    setRentenniveau]     = useState(48);
  const [einkommensteuer, setEinkommensteuer]  = useState(42);
  const [unternehmenssteuer, setUnternehmenssteuer] = useState(29.9);
  const [vermoegenssteuer, setVermoegenssteuer] = useState(false);
  const [erbschaftssteuer, setErbschaftssteuer] = useState(400);
  const [infoKey,   setInfoKey]   = useState<string | null>(null);
  const [scenario,  setScenario]  = useState<ScenarioMode>("realistisch");

  // Computations
  const sm = scenarioMultipliers[scenario];
  const vals = { beamte, ministerien, verteidigung, fachkraefte, buergergeld, rentenalter, einkommensteuer, vermoegenssteuer };

  // --- Ausgaben-Delta vs. Baseline (alle Werte in Mrd. €) ---
  const ausgabenDelta =
    (verteidigung  - 2.0)  * 39.9  +   // NATO-Ausgaben (1% BIP = 39,9 Mrd)
    (entwicklung   - 0.4)  * 39.9  +   // Entwicklungshilfe (gleiche Skala)
    (beamte        - 4900) * 0.072  +   // Beamte (58.400 € × 23% Versorgung × 1.000)
    (ministerien   - 16)   * 0.12   +   // Ministerien (120 Mio. € pro Ministerium)
    (fluechtlinge  - 180)  * 0.018  +   // Flüchtlinge (18.000 €/Person × 1.000)
    (buergergeld   - 502)  * 0.066  +   // Bürgergeld (5,5 Mio. × 12 × 1 €)
    (rentenniveau  - 48)   * 4.0    -   // Rentenniveau (+4 Mrd. pro %-Punkt)
    (rentenalter   - 67)   * 18.5   -   // Rentenalter (−18,5 Mrd. pro Jahr Anhebung)
    (beitragssatz  - 14.6) * 4.0;      // Beitragssatz (höher = weniger Bundeszuschuss)

  // --- Einnahmen-Delta vs. Baseline (alle Werte in Mrd. €) ---
  const einnahmenDelta =
    (einkommensteuer    - 42)    * 3.2    +   // Spitzensteuersatz (3,2 Mrd. pro %-Punkt)
    (fachkraefte        - 200)   * 0.0145 +   // Fachkräfte (14.500 € Steuer/Person)
    (vermoegenssteuer ? 9 : 0)             +  // Vermögenssteuer (+9 Mrd.)
    (unternehmenssteuer - 29.9)  * 3.0    +   // Körperschaftsteuer (3 Mrd. pro %-Punkt)
    (400 - erbschaftssteuer)     * 0.005;     // Erbschaftsfreibetrag (höher = weniger Einnahmen)

  const netDelta     = (ausgabenDelta - einnahmenDelta) * sm;
  const defizit      = (-(34.2 + netDelta)).toFixed(1);
  const steuer       = (916 + einnahmenDelta * sm).toFixed(0);
  const wachstum     = Math.max(0,
    (0.8
      + (fachkraefte        - 200)  * 0.0008
      - (verteidigung       - 2.0)  * 0.08
      - (einkommensteuer    - 42)   * 0.008
      - (unternehmenssteuer - 29.9) * 0.015
      - (beamte             - 4900) * 0.00002
    ) * sm
  ).toFixed(1);
  const alq          = Math.max(0,
    5.7
    - (fachkraefte - 200) * 0.003
    + (buergergeld - 502) * 0.0015
    + (rentenalter - 67)  * 0.05
  ).toFixed(1);
  const rentenKosten = (362 + (rentenniveau - 48) * 4 - (rentenalter - 67) * 18.5).toFixed(0);
  const fachluecke   = Math.max(0, 890 - (fachkraefte - 200) * 1.5).toFixed(0);

  const reformDelta = {
    ausgaben: (-(ausgabenDelta * sm)).toFixed(1),
    steuer:   (einnahmenDelta  * sm).toFixed(1),
  };

  // --- Dynamische Chart-Daten ---
  const wachstumNum = Number(wachstum);
  const dynBarData = [
    { name: "Soziales",     einnahmen: 0,                                               ausgaben: Math.round(175 + (buergergeld - 502) * 0.066 + (rentenniveau - 48) * 4) },
    { name: "Verteidigung", einnahmen: 0,                                               ausgaben: Math.round(52  + (verteidigung - 2.0) * 39.9) },
    { name: "Bildung",      einnahmen: 0,                                               ausgaben: 21 },
    { name: "Zinsen",       einnahmen: 0,                                               ausgaben: Math.round(37  - netDelta * 0.05) },
    { name: "Sonstiges",    einnahmen: Math.round(460 + einnahmenDelta * sm),           ausgaben: Math.round(191 + (beamte - 4900) * 0.072 + (ministerien - 16) * 0.12) },
  ];
  const dynLineData = [
    { year: "2024", statusQuo: 0.2, simulation: 0.2 },
    { year: "2025", statusQuo: 0.5, simulation: +(0.2 + wachstumNum * 0.5).toFixed(2) },
    { year: "2026", statusQuo: 0.8, simulation: +(0.2 + wachstumNum * 1.0).toFixed(2) },
    { year: "2027", statusQuo: 1.0, simulation: +(0.2 + wachstumNum * 1.5).toFixed(2) },
    { year: "2028", statusQuo: 1.1, simulation: +(0.2 + wachstumNum * 1.9).toFixed(2) },
    { year: "2029", statusQuo: 1.2, simulation: +(0.2 + wachstumNum * 2.2).toFixed(2) },
    { year: "2030", statusQuo: 1.2, simulation: +(0.2 + wachstumNum * 2.5).toFixed(2) },
  ];

  const partyMatches = partyProfiles
    .map((p) => ({ ...p, match: calcPartyMatch(vals, p) }))
    .sort((a, b) => b.match - a.match);

  const defizitNum     = Number(defizit);
  const steuerNum      = Number(steuer);
  const rentenNum      = Number(rentenKosten);
  const alqNum         = Number(alq);
  const fachlueckeNum  = Number(fachluecke);
  const wachstumNum2   = Number(wachstum);

  const kpiCards = [
    { label: "Haushaltsdefizit",    val: `${defizit} Mrd.`,     col: defizitNum >= 0    ? "#4caf82" : "#e05c5c",                 src: "BMF",            upd: "Mär 2024" },
    { label: "Staatsverschuldung",  val: "2.445 Mrd.",           col: "#f0f4f8",                                                  src: "Bundesbank",     upd: "Feb 2024" },
    { label: "Steueraufkommen",     val: `${steuer} Mrd.`,       col: steuerNum >= 916   ? "#4caf82" : "#e05c5c",                 src: "Destatis",       upd: "Jan 2024" },
    { label: "Gesundheitskosten",   val: "468 Mrd.",              col: "#f0f4f8",                                                  src: "BMG",            upd: "Feb 2024" },
    { label: "Rentenkosten",        val: `${rentenKosten} Mrd.`,  col: rentenNum < 362    ? "#4caf82" : rentenNum > 380 ? "#e05c5c" : "#f0f4f8", src: "DRV Bund", upd: "Jan 2024" },
    { label: "Arbeitslosenquote",   val: `${alq}%`,               col: alqNum <= 5.0      ? "#4caf82" : alqNum <= 6.0 ? "#f5a623" : "#e05c5c",  src: "BA",       upd: "Mär 2024" },
    { label: "Fachkräftemangel",    val: `${fachluecke}k`,        col: fachlueckeNum < 600 ? "#4caf82" : fachlueckeNum < 800 ? "#f5a623" : "#e05c5c", src: "IW Köln", upd: "Feb 2024" },
    { label: "Wirtschaftswachstum", val: `${wachstumNum2 >= 0 ? "+" : ""}${wachstum}% BIP`, col: wachstumNum2 >= 1.0 ? "#4caf82" : wachstumNum2 >= 0.5 ? "#f5a623" : "#e05c5c", src: "SVR Wirtschaft", upd: "Nov 2023" },
  ];

  const citizenCards = [
    { icon: <Wallet size={20} className="text-[#4caf82]" />,   label: "Nettoeinkommen",  val: "2.587 €/Monat",          delta: einkommensteuer > 42 ? `−${((einkommensteuer-42)*12).toFixed(0)} €/J.` : `+${((42-einkommensteuer)*12).toFixed(0)} €/J.`, pos: einkommensteuer <= 42 },
    { icon: <HeartPulse size={20} className="text-[#e05c5c]" />, label: "KV-Beitrag",    val: `${beitragssatz.toFixed(1)}% Lohn`, delta: beitragssatz > 14.6 ? `+${((beitragssatz-14.6)*25).toFixed(0)} €/Mon.` : `−${((14.6-beitragssatz)*25).toFixed(0)} €/Mon.`, pos: beitragssatz <= 14.6 },
    { icon: <Building2 size={20} className="text-[#f5a623]" />, label: "Rente (Ø)",      val: `${rentenniveau}% Lohnniveau`, delta: rentenniveau >= 48 ? `+${(rentenniveau-48)*8} €/Mon.` : `${(rentenniveau-48)*8} €/Mon.`, pos: rentenniveau >= 48 },
    { icon: <Briefcase size={20} className="text-[#00c8b4]" />, label: "Arbeitsmarkt",   val: `${alq}% Quote`,           delta: Number(alq) < 5.7 ? `−${(5.7-Number(alq)).toFixed(1)}pp` : `+${(Number(alq)-5.7).toFixed(1)}pp`, pos: Number(alq) < 5.7 },
    { icon: <TrendingUp size={20} className="text-[#4caf82]" />, label: "Kaufkraft",     val: `+${wachstum}% Reallohn`,  delta: "Ø +380 €/J.", pos: true },
    { icon: <ShoppingCart size={20} className="text-[#8faabb]" />, label: "Inflation-Schutz", val: "2,3% (Ziel)",       delta: "EZB: 2% Ziel", pos: true },
    { icon: <TrendingDown size={20} className="text-[#e05c5c]" />, label: "Schulden/Kopf", val: "29.100 €",             delta: "+180 €/J.", pos: false },
    { icon: <Users size={20} className="text-[#00c8b4]" />,   label: "Fachkräftelücke", val: `${fachluecke}k Stellen`,  delta: fachkraefte > 200 ? `↓ ${((fachkraefte-200)*1.5).toFixed(0)}k` : "stagniert", pos: fachkraefte > 200 },
  ];

  const currentInfo = infoKey ? SLIDER_INFO[infoKey] ?? null : null;

  return (
    <Layout>
      <InfoPanel info={currentInfo} onClose={() => setInfoKey(null)} />

      {/* Scenario bar */}
      <div className="bg-[#0d1b2a] border-b border-[#1e3048] px-6 py-2 flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold text-[#8faabb] uppercase tracking-widest">Szenario:</span>
        {(["optimistisch", "realistisch", "pessimistisch"] as ScenarioMode[]).map((s) => (
          <button
            key={s}
            onClick={() => setScenario(s)}
            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors capitalize ${
              scenario === s
                ? s === "optimistisch" ? "bg-[#1a3d2b] text-[#4caf82] border border-[#4caf82]/60"
                : s === "realistisch"  ? "bg-[#243447] text-[#00c8b4] border border-[#00c8b4]/60"
                : "bg-[#3d1515] text-[#e05c5c] border border-[#e05c5c]/60"
                : "bg-[#1a2b3c] text-[#8faabb] border border-[#1e3048] hover:text-[#f0f4f8]"
            }`}
            data-testid={`button-scenario-${s}`}
          >
            {s === "optimistisch" ? "Optimistisch" : s === "realistisch" ? "Realistisch" : "Pessimistisch"}
          </button>
        ))}
        <span className="ml-auto text-xs text-[#8faabb] hidden md:block">Alle Prognosen werden entsprechend angepasst</span>
      </div>

      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        {/* LEFT PANEL — sliders */}
        <div className="w-full md:w-[360px] md:shrink-0 bg-[#1a2b3c] p-4 border-b md:border-b-0 md:border-r border-[#1e3048] overflow-y-auto md:h-[calc(100vh-113px)]">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-base font-bold border-b-2 border-[#00c8b4] pb-1">Politische Parameter</h2>
          </div>
          <div className="text-xs text-[#8faabb] flex items-center gap-3 mb-4">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#4caf82] inline-block" /> Hohe Evidenz</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f5a623] inline-block" /> Mittlere</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#e05c5c] inline-block" /> Unsicher</span>
          </div>

          <Accordion type="multiple" defaultValue={["item-1"]} className="w-full">
            <AccordionItem value="item-1" className="border-[#1e3048]">
              <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8] text-sm">Staat</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <SliderRow label="Beamte"           infoKey="beamte"        value={beamte}       min={4200} max={6000}          unit="k"     onChange={setBeamte}       onInfo={setInfoKey} />
                <SliderRow label="Ministerien"      infoKey="ministerien"   value={ministerien}  min={10}   max={25}             onChange={setMinisterien}  onInfo={setInfoKey} />
                <SliderRow label="Verteidigung"     infoKey="verteidigung"  value={verteidigung} min={1.0}  max={3.0} step={0.1} unit="% BIP" onChange={setVerteidigung} onInfo={setInfoKey} />
                <SliderRow label="Entwicklungshilfe" infoKey="entwicklung"  value={entwicklung}  min={0.2}  max={0.8} step={0.1} unit="% BIP" onChange={setEntwicklung}  onInfo={setInfoKey} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-[#1e3048]">
              <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8] text-sm">Migration</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <SliderRow label="Flüchtlingsaufnahme"   infoKey="fluechtlinge" value={fluechtlinge} min={50}  max={400} unit="k/J" onChange={setFluechtlinge} onInfo={setInfoKey} />
                <SliderRow label="Fachkräftezuwanderung" infoKey="fachkraefte"  value={fachkraefte}  min={50}  max={500} unit="k/J" onChange={setFachkraefte}  onInfo={setInfoKey} />
                <ToggleRow label="EU-Zuwanderung frei"   value={euZuwanderung}  onChange={setEuZuwanderung} onInfo={setInfoKey} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-[#1e3048]">
              <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8] text-sm">Gesundheit</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <ToggleRow label="Einheitsversicherung"          value={einheitsversicherung} onChange={setEinheitsversicherung} onInfo={setInfoKey} />
                <ToggleRow label="Privatversicherung abschaffen" value={privatAbschaffen}     onChange={setPrivatAbschaffen}     danger onInfo={setInfoKey} />
                <SliderRow label="Beitragssatz" infoKey="beitragssatz" value={beitragssatz}  min={14}  max={18}  step={0.1} unit="%" onChange={setBeitragssatz} onInfo={setInfoKey} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-[#1e3048]">
              <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8] text-sm">Soziales</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <SliderRow label="Bürgergeld"          infoKey="buergergeld" value={buergergeld}  min={400} max={700}          unit=" €"   onChange={setBuergergeld}  onInfo={setInfoKey} />
                <SliderRow label="Renteneintrittsalter" infoKey="rentenalter" value={rentenalter}  min={63}  max={70}           unit=" J."  onChange={setRentenalter}  onInfo={setInfoKey} />
                <SliderRow label="Rentenniveau"        infoKey="rentenniveau" value={rentenniveau} min={40}  max={55}           unit="%"    onChange={setRentenniveau} onInfo={setInfoKey} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-[#1e3048]">
              <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8] text-sm">Steuern</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <SliderRow label="Spitzensteuersatz"   infoKey="einkommensteuer"   value={einkommensteuer}   min={30} max={55} step={0.5} unit="%" onChange={setEinkommensteuer}   onInfo={setInfoKey} />
                <SliderRow label="Unternehmenssteuer"  infoKey="unternehmenssteuer" value={unternehmenssteuer} min={10} max={35} step={0.1} unit="%" onChange={setUnternehmenssteuer} onInfo={setInfoKey} />
                <ToggleRow label="Vermögenssteuer einführen"   value={vermoegenssteuer} onChange={setVermoegenssteuer} onInfo={setInfoKey} />
                <SliderRow label="Erbschaft-Freibetrag" infoKey="erbschaftssteuer"  value={erbschaftssteuer}  min={100} max={1000} step={50} unit="k €" onChange={setErbschaftssteuer} onInfo={setInfoKey} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* RIGHT PANEL — results */}
        <div className="flex-1 p-5 overflow-y-auto md:h-[calc(100vh-113px)] space-y-6">
          {/* KPI row */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-bold">Echtzeit-Simulation</h2>
              <Badge className="bg-[#4caf82] text-white text-xs">LIVE</Badge>
              <span className="text-xs text-[#8faabb] ml-auto">
                Szenario: <span className="text-[#00c8b4] font-medium capitalize">{scenario}</span>
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {kpiCards.map((kpi) => (
                <div key={kpi.label} className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]" data-testid={`card-kpi-${kpi.label.replace(/\s+/g,"-").toLowerCase()}`}>
                  <div className="text-[#8faabb] text-xs mb-1">{kpi.label}</div>
                  <div className="text-lg font-bold mb-2" style={{ color: kpi.col }}>{kpi.val}</div>
                  <div className="flex items-center gap-1 text-[10px] text-[#8faabb]">
                    <span className="bg-[#0d1b2a] px-1.5 py-0.5 rounded border border-[#1e3048]">{kpi.src}</span>
                    <span>{kpi.upd}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[220px]">
            <div className="bg-[#1a2b3c] p-4 rounded border border-[#1e3048] h-[220px]">
              <h3 className="text-[#8faabb] mb-3 text-xs font-semibold uppercase tracking-widest">Bundeshaushalt: Einnahmen vs. Ausgaben</h3>
              <ResponsiveContainer width="100%" height="88%">
                <BarChart data={dynBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
                  <XAxis dataKey="name" stroke="#8faabb" fontSize={10} />
                  <YAxis stroke="#8faabb" fontSize={10} />
                  <RechartsTooltip cursor={{ fill: "#243447" }} contentStyle={{ backgroundColor: "#0d1b2a", borderColor: "#1e3048", fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: "10px" }} />
                  <Bar dataKey="einnahmen" fill="#00c8b4" name="Einnahmen" />
                  <Bar dataKey="ausgaben"  fill="#e05c5c" name="Ausgaben"  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-[#1a2b3c] p-4 rounded border border-[#1e3048] h-[220px]">
              <h3 className="text-[#8faabb] mb-3 text-xs font-semibold uppercase tracking-widest">Wirtschaftswachstum 2024–2030</h3>
              <ResponsiveContainer width="100%" height="88%">
                <LineChart data={dynLineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
                  <XAxis dataKey="year" stroke="#8faabb" fontSize={10} />
                  <YAxis stroke="#8faabb" fontSize={10} />
                  <RechartsTooltip contentStyle={{ backgroundColor: "#0d1b2a", borderColor: "#1e3048", fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: "10px" }} />
                  <Line type="monotone" dataKey="statusQuo"  stroke="#8faabb" name="Status Quo" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="simulation" stroke="#00c8b4" name="Simulation"  strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Citizen impact */}
          <div className="bg-[#1a2b3c] rounded border border-[#1e3048] p-5">
            <h3 className="font-bold text-base mb-4 flex items-center gap-2">
              <Users size={16} className="text-[#00c8b4]" />
              Was bedeutet das für Bürgerinnen und Bürger?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {citizenCards.map((item) => (
                <div key={item.label} className="bg-[#0d1b2a] p-3 rounded border border-[#1e3048]" data-testid={`card-citizen-${item.label.replace(/\s+/g,"-").toLowerCase()}`}>
                  <div className="mb-2">{item.icon}</div>
                  <div className="text-xs text-[#8faabb] mb-0.5">{item.label}</div>
                  <div className="text-sm font-bold text-[#f0f4f8]">{item.val}</div>
                  <div className={`text-xs mt-1 font-medium ${item.pos ? "text-[#4caf82]" : "text-[#e05c5c]"}`}>{item.delta}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dein Deutschland + Party match */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Reform summary */}
            <div className="bg-[#1a2b3c] rounded border border-[#1e3048] p-5">
              <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                <span className="text-[#00c8b4] text-lg leading-none">▣</span>
                Dein Deutschland
              </h3>
              <div className="space-y-2 mb-4">
                {[
                  { label: "Staatsausgaben",     val: `${reformDelta.ausgaben} Mrd. €`,                                                          pos: Number(reformDelta.ausgaben) < 0 },
                  { label: "Steueraufkommen",    val: `${Number(reformDelta.steuer) >= 0 ? "+" : ""}${reformDelta.steuer} Mrd. €`,                pos: Number(reformDelta.steuer) > 0 },
                  { label: "Wirtschaftswachstum",val: `+${wachstum}%`,                                                                            pos: true },
                  { label: "Arbeitslosenquote",  val: `${alq}%`,                                                                                  pos: Number(alq) < 5.7 },
                  { label: "Rentenniveau",       val: `${rentenniveau}%`,                                                                         pos: rentenniveau >= 48 },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between items-center text-sm">
                    <span className="text-[#8faabb]">{r.label}</span>
                    <span className={`font-bold ${r.pos ? "text-[#4caf82]" : "text-[#e05c5c]"}`}>{r.val}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 bg-[#1a3d2b] rounded px-3 py-2 border border-[#4caf82]/30">
                  <CheckCircle2 size={13} className="text-[#4caf82] mt-0.5 shrink-0" />
                  <span className="text-[#4caf82]">Fiskalischer Spielraum verbessert sich durch Fachkräftezuwanderung</span>
                </div>
                <div className="flex items-start gap-2 bg-[#3d1515] rounded px-3 py-2 border border-[#e05c5c]/30">
                  <XCircle size={13} className="text-[#e05c5c] mt-0.5 shrink-0" />
                  <span className="text-[#e05c5c]">Steigende Verteidigungsausgaben belasten den Haushalt strukturell</span>
                </div>
                <div className="flex items-start gap-2 bg-[#3d2d0a] rounded px-3 py-2 border border-[#f5a623]/30">
                  <AlertTriangle size={13} className="text-[#f5a623] mt-0.5 shrink-0" />
                  <span className="text-[#f5a623]">Demografischer Druck auf Rentensystem bleibt langfristiges Risiko</span>
                </div>
              </div>
            </div>

            {/* Party comparison */}
            <div className="bg-[#1a2b3c] rounded border border-[#1e3048] p-5">
              <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                <span className="text-[#00c8b4] text-lg leading-none">⊞</span>
                Welche Partei liegt am nächsten?
              </h3>
              <div className="space-y-2.5">
                {partyMatches.map((p) => (
                  <div key={p.name} className="flex items-center gap-3" data-testid={`row-party-${p.abk}`}>
                    <span className="text-xs font-bold w-10 shrink-0" style={{ color: p.farbe }}>{p.abk}</span>
                    <div className="flex-1 bg-[#0d1b2a] rounded-full h-2 border border-[#1e3048]">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ width: `${p.match}%`, backgroundColor: p.farbe }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#f0f4f8] w-10 text-right shrink-0">{p.match}%</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[#8faabb] mt-4 leading-relaxed">
                Basierend auf Vergleich von 8 Hauptpolitikfeldern mit den aktuellen Parteiprogrammen (Stand: Bundestagswahl 2025).
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
