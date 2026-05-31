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
  HeartPulse, Briefcase, ShoppingCart, Building2, RotateCcw,
  ShieldAlert,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { InfoPanel } from "@/components/simulator/InfoPanel";
import {
  SLIDER_INFO, scenarioMultipliers,
} from "@/components/simulator/data";
import { EvidenzLevel, ScenarioMode } from "@/components/simulator/types";

// ─── Constants ────────────────────────────────────────────────────────────────
const BEAMTE_DELAY        = 0.30;   // Near-term savings: only 30% effective (pensionsschutz)
const FK_INTEGRATION      = 0.80;   // Fachkräfte: 80% avg integration rate (Jahr 1–3)
const RENTE_RISK          = 0.82;   // Rentenalter: 18% risk deduction (Erwerbsminderung etc.)

// ─── Evidenz-Dot ──────────────────────────────────────────────────────────────
function EvidenzDot({ level }: { level: EvidenzLevel }) {
  const colors: Record<EvidenzLevel, string> = { hoch: "bg-[#4caf82]", mittel: "bg-[#f5a623]", gering: "bg-[#e05c5c]" };
  const labels: Record<EvidenzLevel, string> = { hoch: "Hohe Evidenz", mittel: "Mittlere Evidenz", gering: "Hohe Unsicherheit" };
  return <span title={labels[level]} className={`w-2 h-2 rounded-full shrink-0 ${colors[level]}`} />;
}

// ─── SliderRow ────────────────────────────────────────────────────────────────
function SliderRow({ label, infoKey, value, defaultValue, min, max, step = 1, unit, onChange, onInfo }: {
  label: string; infoKey: string; value: number; defaultValue: number;
  min: number; max: number; step?: number; unit?: string;
  onChange: (v: number) => void; onInfo: (k: string) => void;
}) {
  const info = SLIDER_INFO[infoKey];
  const isDirty = value !== defaultValue;
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-[#f0f4f8]">{label}</span>
          {info && (
            <button onClick={() => onInfo(infoKey)} className="text-[#8faabb] hover:text-[#00c8b4] transition-colors" data-testid={`button-info-${infoKey}`}>
              <Info size={13} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {isDirty && (
            <button onClick={() => onChange(defaultValue)} title="Zurücksetzen" className="text-[#8faabb] hover:text-[#f5a623] transition-colors" data-testid={`reset-${infoKey}`}>
              <RotateCcw size={12} />
            </button>
          )}
          <Badge variant="outline" className={`border-[#1e3048] text-xs py-0 ${isDirty ? "bg-[#2a3a1c] text-[#f5a623]" : "bg-[#243447] text-[#00c8b4]"}`}>
            {value}{unit}
          </Badge>
          {info && <EvidenzDot level={info.evidenz} />}
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#00c8b4] h-1.5" data-testid={`slider-${infoKey}`} />
    </div>
  );
}

// ─── ToggleRow ────────────────────────────────────────────────────────────────
function ToggleRow({ label, infoKey, value, onChange, danger, onInfo }: {
  label: string; infoKey?: string; value: boolean; onChange: (v: boolean) => void;
  danger?: boolean; onInfo: (k: string) => void;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-1.5 text-sm">
        <span className={danger && value ? "text-[#e05c5c]" : "text-[#f0f4f8]"}>{label}</span>
        {infoKey && SLIDER_INFO[infoKey] && (
          <button onClick={() => onInfo(infoKey)} className="text-[#8faabb] hover:text-[#00c8b4] transition-colors" data-testid={`button-info-${infoKey}`}>
            <Info size={13} />
          </button>
        )}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-10 h-5 rounded-full relative transition-colors shrink-0 ${value ? (danger ? "bg-[#e05c5c]" : "bg-[#00c8b4]") : "bg-[#1e3048]"}`}
        data-testid={`toggle-${infoKey ?? label.replace(/\s+/g, "-").toLowerCase()}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}


// ─── Core KPI computation (used for all 3 scenarios + current) ───────────────
function computeKPIs(
  s: ScenarioMode,
  smVal: number,
  params: {
    beamte: number; ministerien: number; verteidigung: number; entwicklung: number;
    fluechtlinge: number; fachkraefte: number; beitragssatz: number;
    buergergeld: number; rentenalter: number; rentenniveau: number;
    einkommensteuer: number; unternehmenssteuer: number;
    vermoegenssteuer: boolean; erbschaftssteuer: number;
    einheitsversicherung: boolean; privatAbschaffen: boolean;
  }
) {
  const {
    beamte, ministerien, verteidigung, entwicklung, fluechtlinge, fachkraefte,
    beitragssatz, buergergeld, rentenalter, rentenniveau, einkommensteuer,
    unternehmenssteuer, vermoegenssteuer, erbschaftssteuer, einheitsversicherung, privatAbschaffen,
  } = params;

  // Vermögenssteuer: scenario-dependent
  const vmEinnahmen = vermoegenssteuer
    ? s === "optimistisch" ? 15 : s === "realistisch" ? 8 : 4
    : 0;

  // Verteidigung: scenario-dependent growth effect
  const vertDelta = verteidigung - 2.0;
  const defenseGrowthImpact =
    s === "optimistisch" ? vertDelta * 0.3    // positive short-term demand
    : s === "realistisch" ? 0                 // neutral
    : vertDelta * -0.2;                       // slight drag

  const ausgabenDelta =
    vertDelta                     * 39.9  +
    (entwicklung  - 0.4)          * 39.9  +
    (beamte       - 4900)         * 0.072 * BEAMTE_DELAY +   // delayed
    (ministerien  - 16)           * 0.8   +
    (fluechtlinge - 180)          * 0.018 +
    (buergergeld  - 502)          * 0.066 +
    (rentenniveau - 48)           * 4.0   -
    (rentenalter  - 67)           * 18.5  * RENTE_RISK -      // risk factor
    (beitragssatz - 14.6)         * 4.0   +
    (einheitsversicherung ? 18 : 0)       +
    (privatAbschaffen     ? 11 : 0);

  const einnahmenDelta =
    (einkommensteuer    - 42)     * 3.2   +
    (fachkraefte        - 200)    * 0.0145 * FK_INTEGRATION + // integration factor
    vmEinnahmen                            +
    (unternehmenssteuer - 29.9)   * 3.0   +
    (400 - erbschaftssteuer)      * 0.005 +
    (einheitsversicherung ? 22 : 0)        +
    (privatAbschaffen     ?  7 : 0);

  const netDelta = (ausgabenDelta - einnahmenDelta) * smVal;
  const defizit  = -(34.2 + netDelta);

  // ALQ (no scenario multiplier, behavioral)
  const alq = Math.max(0,
    5.7
    - (fachkraefte - 200)  * 0.003
    + (buergergeld - 502)  * 0.0015
    + (rentenalter - 67)   * 0.05
  );

  // Wachstum — no floor (recessions allowed), scenario + defense effect
  const wachstum = (
    0.8
    + (fachkraefte        - 200)  * 0.0008
    + defenseGrowthImpact
    - (einkommensteuer    - 42)   * 0.008
    - (unternehmenssteuer - 29.9) * 0.015
    - (beamte             - 4900) * 0.00002
  ) * smVal;

  // Chain model: wachstum & alq feed back into Steueraufkommen
  const wachstumDelta  = wachstum - 0.8;
  const alqDelta       = alq - 5.7;
  const chainSteuer    = wachstumDelta * 20 - alqDelta * 15;

  const steuer     = 916 + einnahmenDelta * smVal + chainSteuer;
  const rentenKosten = 362 + (rentenniveau - 48) * 4 - (rentenalter - 67) * 18.5 * RENTE_RISK;
  const fachluecke = Math.max(0, 890 - (fachkraefte - 200) * 1.5);

  return { defizit, steuer, alq, wachstum, rentenKosten, fachluecke, einnahmenDelta, ausgabenDelta };
}

// ─── Vertrauensindex ──────────────────────────────────────────────────────────
const PARAM_EVIDENZ: Record<string, EvidenzLevel> = {
  beamte: "mittel", ministerien: "mittel", verteidigung: "hoch", entwicklung: "hoch",
  fluechtlinge: "mittel", fachkraefte: "hoch", beitragssatz: "mittel",
  buergergeld: "mittel", rentenalter: "hoch", rentenniveau: "mittel",
  einkommensteuer: "mittel", unternehmenssteuer: "mittel",
  vermoegenssteuer: "gering", erbschaftssteuer: "mittel",
  einheitsversicherung: "gering", privatAbschaffen: "gering",
};
const EVIDENZ_PENALTY: Record<EvidenzLevel, number> = { hoch: 2, mittel: 6, gering: 15 };

function calcTrust(dirty: { key: string; isDirty: boolean }[]): number {
  let t = 100;
  for (const { key, isDirty } of dirty) {
    if (isDirty) t -= EVIDENZ_PENALTY[PARAM_EVIDENZ[key] ?? "mittel"];
  }
  return Math.max(10, t);
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SimulatorPage() {
  const [beamte,               setBeamte]               = useState(4900);
  const [ministerien,          setMinisterien]           = useState(16);
  const [verteidigung,         setVerteidigung]          = useState(2.0);
  const [entwicklung,          setEntwicklung]           = useState(0.4);
  const [fluechtlinge,         setFluechtlinge]          = useState(180);
  const [fachkraefte,          setFachkraefte]           = useState(200);
  const [euZuwanderung,        setEuZuwanderung]         = useState(true);
  const [einheitsversicherung, setEinheitsversicherung]  = useState(false);
  const [privatAbschaffen,     setPrivatAbschaffen]      = useState(false);
  const [beitragssatz,         setBeitragssatz]          = useState(14.6);
  const [buergergeld,          setBuergergeld]           = useState(502);
  const [rentenalter,          setRentenalter]           = useState(67);
  const [rentenniveau,         setRentenniveau]          = useState(48);
  const [einkommensteuer,      setEinkommensteuer]       = useState(42);
  const [unternehmenssteuer,   setUnternehmenssteuer]    = useState(29.9);
  const [vermoegenssteuer,     setVermoegenssteuer]      = useState(false);
  const [erbschaftssteuer,     setErbschaftssteuer]      = useState(400);
  const [infoKey,              setInfoKey]               = useState<string | null>(null);
  const [scenario,             setScenario]              = useState<ScenarioMode>("realistisch");

  function resetAll() {
    setBeamte(4900); setMinisterien(16); setVerteidigung(2.0); setEntwicklung(0.4);
    setFluechtlinge(180); setFachkraefte(200); setEuZuwanderung(true);
    setEinheitsversicherung(false); setPrivatAbschaffen(false); setBeitragssatz(14.6);
    setBuergergeld(502); setRentenalter(67); setRentenniveau(48);
    setEinkommensteuer(42); setUnternehmenssteuer(29.9); setVermoegenssteuer(false);
    setErbschaftssteuer(400);
  }

  const p = {
    beamte, ministerien, verteidigung, entwicklung, fluechtlinge, fachkraefte,
    beitragssatz, buergergeld, rentenalter, rentenniveau, einkommensteuer,
    unternehmenssteuer, vermoegenssteuer, erbschaftssteuer, einheitsversicherung, privatAbschaffen,
  };

  // Compute all 3 scenario bands + current
  const kpiOpt  = computeKPIs("optimistisch",  1.30, p);
  const kpiReal = computeKPIs("realistisch",   1.00, p);
  const kpiPess = computeKPIs("pessimistisch", 0.65, p);
  const kpiCur  = computeKPIs(scenario, scenarioMultipliers[scenario], p);

  const { defizit, steuer, alq, wachstum, rentenKosten, fachluecke, einnahmenDelta, ausgabenDelta } = kpiCur;
  const sm = scenarioMultipliers[scenario];

  // Vertrauensindex
  const dirtyList = [
    { key: "beamte",               isDirty: beamte          !== 4900  },
    { key: "ministerien",          isDirty: ministerien     !== 16    },
    { key: "verteidigung",         isDirty: verteidigung    !== 2.0   },
    { key: "entwicklung",          isDirty: entwicklung     !== 0.4   },
    { key: "fluechtlinge",         isDirty: fluechtlinge    !== 180   },
    { key: "fachkraefte",          isDirty: fachkraefte     !== 200   },
    { key: "beitragssatz",         isDirty: beitragssatz    !== 14.6  },
    { key: "buergergeld",          isDirty: buergergeld     !== 502   },
    { key: "rentenalter",          isDirty: rentenalter     !== 67    },
    { key: "rentenniveau",         isDirty: rentenniveau    !== 48    },
    { key: "einkommensteuer",      isDirty: einkommensteuer !== 42    },
    { key: "unternehmenssteuer",   isDirty: unternehmenssteuer !== 29.9 },
    { key: "vermoegenssteuer",     isDirty: vermoegenssteuer          },
    { key: "erbschaftssteuer",     isDirty: erbschaftssteuer !== 400  },
    { key: "einheitsversicherung", isDirty: einheitsversicherung      },
    { key: "privatAbschaffen",     isDirty: privatAbschaffen          },
  ];
  const trust = calcTrust(dirtyList);
  const trustColor = trust >= 70 ? "#4caf82" : trust >= 40 ? "#f5a623" : "#e05c5c";


  // KPI helpers
  const defizitNum  = defizit;
  const steuerNum   = steuer;
  const rentenNum   = rentenKosten;
  const alqNum      = alq;
  const fachNum     = fachluecke;
  const wachNum     = wachstum;

  const defizitLabel = defizitNum >= 0 ? "Haushaltsüberschuss" : "Haushaltsdefizit";
  const fmtDef = (v: number) => v >= 0 ? `+${v.toFixed(1)} Mrd.` : `${Math.abs(v).toFixed(1)} Mrd.`;
  const fmtW   = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`;

  // Dynamic chart data
  const reformDelta = {
    ausgaben: (-(ausgabenDelta * sm)).toFixed(1),
    steuer:   (einnahmenDelta  * sm).toFixed(1),
  };
  const dynBarData = [
    { name: "Soziales",     einnahmen: 0,                             ausgaben: Math.round(175 + (buergergeld - 502) * 0.066 + (rentenniveau - 48) * 4) },
    { name: "Verteidigung", einnahmen: 0,                             ausgaben: Math.round(52  + (verteidigung - 2.0) * 39.9) },
    { name: "Bildung",      einnahmen: 0,                             ausgaben: 21 },
    { name: "Zinsen",       einnahmen: 0,                             ausgaben: Math.round(37  - (ausgabenDelta - einnahmenDelta) * sm * 0.05) },
    { name: "Sonstiges",    einnahmen: Math.round(460 + einnahmenDelta * sm), ausgaben: Math.round(191 + (beamte - 4900) * 0.072 * BEAMTE_DELAY + (ministerien - 16) * 0.8) },
  ];
  const dynLineData = [
    { year: "2024", statusQuo: 0.2, simulation: 0.2 },
    { year: "2025", statusQuo: 0.5, simulation: +(0.2 + wachNum * 0.5).toFixed(2)  },
    { year: "2026", statusQuo: 0.8, simulation: +(0.2 + wachNum * 1.0).toFixed(2)  },
    { year: "2027", statusQuo: 1.0, simulation: +(0.2 + wachNum * 1.5).toFixed(2)  },
    { year: "2028", statusQuo: 1.1, simulation: +(0.2 + wachNum * 1.9).toFixed(2)  },
    { year: "2029", statusQuo: 1.2, simulation: +(0.2 + wachNum * 2.2).toFixed(2)  },
    { year: "2030", statusQuo: 1.2, simulation: +(0.2 + wachNum * 2.5).toFixed(2)  },
  ];

  // Citizen cards
  const citizenCards = [
    { icon: <Wallet size={20} className="text-[#4caf82]" />,    label: "Nettoeinkommen",   val: "2.587 €/Monat",             delta: einkommensteuer > 42 ? `−${((einkommensteuer-42)*12).toFixed(0)} €/J.` : `+${((42-einkommensteuer)*12).toFixed(0)} €/J.`, pos: einkommensteuer <= 42 },
    { icon: <HeartPulse size={20} className="text-[#e05c5c]" />, label: "KV-Beitrag",      val: `${beitragssatz.toFixed(1)}% Lohn`, delta: beitragssatz > 14.6 ? `+${((beitragssatz-14.6)*25).toFixed(0)} €/Mon.` : `−${((14.6-beitragssatz)*25).toFixed(0)} €/Mon.`, pos: beitragssatz <= 14.6 },
    { icon: <Building2 size={20} className="text-[#f5a623]" />,  label: "Rente (Ø)",       val: `${rentenniveau}% Lohnniveau`, delta: rentenniveau >= 48 ? `+${(rentenniveau-48)*8} €/Mon.` : `${(rentenniveau-48)*8} €/Mon.`, pos: rentenniveau >= 48 },
    { icon: <Briefcase size={20} className="text-[#00c8b4]" />,  label: "Arbeitsmarkt",    val: `${alq.toFixed(1)}% Quote`,    delta: alqNum < 5.7 ? `−${(5.7-alqNum).toFixed(1)}pp` : `+${(alqNum-5.7).toFixed(1)}pp`, pos: alqNum < 5.7 },
    { icon: <TrendingUp size={20} className="text-[#4caf82]" />, label: "Kaufkraft",       val: `${fmtW(wachNum)} Reallohn`,   delta: "Ø +380 €/J.", pos: wachNum >= 0 },
    { icon: <ShoppingCart size={20} className="text-[#8faabb]" />, label: "Inflation-Schutz", val: "2,3% (Ziel)",              delta: "EZB: 2% Ziel", pos: true },
    { icon: <TrendingDown size={20} className="text-[#e05c5c]" />, label: "Schulden/Kopf", val: "29.100 €",                    delta: "+180 €/J.", pos: false },
    { icon: <Users size={20} className="text-[#00c8b4]" />,     label: "Fachkräftelücke", val: `${fachluecke.toFixed(0)}k Stellen`, delta: fachkraefte > 200 ? `↓ ${((fachkraefte-200)*1.5).toFixed(0)}k` : "stagniert", pos: fachkraefte > 200 },
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
            key={s} onClick={() => setScenario(s)}
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold border-b-2 border-[#00c8b4] pb-1">Politische Parameter</h2>
            <button
              onClick={resetAll}
              className="flex items-center gap-1 text-xs text-[#8faabb] hover:text-[#f5a623] transition-colors border border-[#1e3048] hover:border-[#f5a623] rounded px-2 py-1"
              title="Alle Werte zurücksetzen"
            >
              <RotateCcw size={11} />
              Zurücksetzen
            </button>
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
                <SliderRow label="Beamte"            infoKey="beamte"       value={beamte}          defaultValue={4900} min={4200} max={6000}          unit="k"     onChange={setBeamte}            onInfo={setInfoKey} />
                <p className="text-[10px] text-[#f5a623] leading-relaxed -mt-2 flex items-start gap-1">
                  <AlertTriangle size={10} className="shrink-0 mt-0.5" />
                  Beamtenabbau wirkt nur schrittweise — Pensionsansprüche und Kündigungsschutz verzögern Einsparungen (hier: 30% Wirkung im Nahzeitraum).
                </p>
                <SliderRow label="Ministerien"       infoKey="ministerien"  value={ministerien}     defaultValue={16}   min={10}   max={25}             onChange={setMinisterien}       onInfo={setInfoKey} />
                <SliderRow label="Verteidigung"      infoKey="verteidigung" value={verteidigung}    defaultValue={2.0}  min={1.0}  max={3.0} step={0.1} unit="% BIP" onChange={setVerteidigung}      onInfo={setInfoKey} />
                <SliderRow label="Entwicklungshilfe" infoKey="entwicklung"  value={entwicklung}     defaultValue={0.4}  min={0.2}  max={0.8} step={0.1} unit="% BIP" onChange={setEntwicklung}       onInfo={setInfoKey} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-[#1e3048]">
              <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8] text-sm">Migration</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <SliderRow label="Flüchtlingsaufnahme"   infoKey="fluechtlinge" value={fluechtlinge} defaultValue={180} min={50}  max={400} unit="k/J" onChange={setFluechtlinge} onInfo={setInfoKey} />
                <p className="text-[10px] text-[#8faabb] leading-relaxed -mt-2">
                  Kurzfrist negativ; nach 5 Jahren Rückflüsse durch Integration (hier: nur Kurzfristkosten modelliert).
                </p>
                <SliderRow label="Fachkräftezuwanderung" infoKey="fachkraefte"  value={fachkraefte}  defaultValue={200} min={50}  max={500} unit="k/J" onChange={setFachkraefte}  onInfo={setInfoKey} />
                <p className="text-[10px] text-[#8faabb] leading-relaxed -mt-2">
                  Integrationsfaktor: Jahr 1 = 60%, Jahr 2 = 80%, Jahr 3 = 100%. Modell nutzt Ø 80%.
                </p>
                <ToggleRow label="EU-Zuwanderung frei" value={euZuwanderung} onChange={setEuZuwanderung} onInfo={setInfoKey} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-[#1e3048]">
              <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8] text-sm">Gesundheit</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <ToggleRow label="Einheitsversicherung"          value={einheitsversicherung} onChange={setEinheitsversicherung} onInfo={setInfoKey} />
                <ToggleRow label="Privatversicherung abschaffen" value={privatAbschaffen}     onChange={setPrivatAbschaffen}     danger onInfo={setInfoKey} />
                <SliderRow label="Beitragssatz" infoKey="beitragssatz" value={beitragssatz} defaultValue={14.6} min={14} max={18} step={0.1} unit="%" onChange={setBeitragssatz} onInfo={setInfoKey} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-[#1e3048]">
              <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8] text-sm">Soziales</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <SliderRow label="Bürgergeld"           infoKey="buergergeld"  value={buergergeld}  defaultValue={502} min={400} max={700}           unit=" €"  onChange={setBuergergeld}  onInfo={setInfoKey} />
                <SliderRow label="Renteneintrittsalter" infoKey="rentenalter"  value={rentenalter}  defaultValue={67}  min={63}  max={70}            unit=" J." onChange={setRentenalter}  onInfo={setInfoKey} />
                <p className="text-[10px] text-[#f5a623] leading-relaxed -mt-2 flex items-start gap-1">
                  <AlertTriangle size={10} className="shrink-0 mt-0.5" />
                  Nettoeinsparung um 18% reduziert (Erwerbsminderungsrenten, körperlich belastende Berufe).
                </p>
                <SliderRow label="Rentenniveau"         infoKey="rentenniveau" value={rentenniveau} defaultValue={48}  min={40}  max={55}            unit="%"   onChange={setRentenniveau} onInfo={setInfoKey} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-[#1e3048]">
              <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8] text-sm">Steuern</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <SliderRow label="Spitzensteuersatz"    infoKey="einkommensteuer"    value={einkommensteuer}    defaultValue={42}    min={30} max={55} step={0.5} unit="%" onChange={setEinkommensteuer}    onInfo={setInfoKey} />
                <SliderRow label="Unternehmenssteuer"   infoKey="unternehmenssteuer" value={unternehmenssteuer} defaultValue={29.9}  min={10} max={35} step={0.1} unit="%" onChange={setUnternehmenssteuer} onInfo={setInfoKey} />
                <ToggleRow label="Vermögenssteuer einführen" value={vermoegenssteuer} onChange={setVermoegenssteuer} onInfo={setInfoKey} />
                {vermoegenssteuer && (
                  <p className="text-[10px] text-[#8faabb] -mt-2">
                    Einnahmen: pess. 4 Mrd. | real. 8 Mrd. | opt. 15 Mrd. (je nach Kapitalflucht)
                  </p>
                )}
                <SliderRow label="Erbschaft-Freibetrag" infoKey="erbschaftssteuer"   value={erbschaftssteuer}   defaultValue={400}   min={100} max={1000} step={50} unit="k €" onChange={setErbschaftssteuer} onInfo={setInfoKey} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 p-5 overflow-y-auto md:h-[calc(100vh-113px)] space-y-6">

          {/* Vertrauensindex */}
          <div className="bg-[#1a2b3c] rounded border border-[#1e3048] p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert size={15} style={{ color: trustColor }} />
                <span className="text-sm font-semibold text-[#f0f4f8]">Vertrauensindex</span>
              </div>
              <span className="text-sm font-bold" style={{ color: trustColor }}>{trust}/100</span>
            </div>
            <div className="w-full bg-[#0d1b2a] rounded-full h-2 border border-[#1e3048]">
              <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${trust}%`, backgroundColor: trustColor }} />
            </div>
            <p className="text-[10px] text-[#8faabb] mt-1.5">
              {trust >= 70 ? "Simulation basiert überwiegend auf gut belegten Parametern."
               : trust >= 40 ? "Mehrere Parameter mit mittlerer Evidenz verändert — Ergebnisse mit Vorsicht interpretieren."
               : "Viele unsichere Parameter aktiv — Ergebnisse sind stark spekulativ."}
            </p>
          </div>

          {/* ── Kategorie 1: Direkte Fiskalwirkung ── */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#00c8b4] mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#00c8b4] rounded" />
              Direkte Fiskalwirkung
              <Badge className="bg-[#4caf82] text-white text-[10px]">LIVE</Badge>
              <span className="text-[10px] text-[#8faabb] font-normal ml-auto capitalize">Szenario: {scenario}</span>
            </h2>

            {/* Scenario bands for fiscal KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              {/* Defizit */}
              <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]" data-testid="card-kpi-haushaltsdefizit">
                <div className="text-[#8faabb] text-xs mb-1">{defizitLabel}</div>
                <div className="text-lg font-bold mb-2" style={{ color: defizitNum >= 0 ? "#4caf82" : "#e05c5c" }}>
                  {fmtDef(defizitNum)} Mrd.
                </div>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[10px]"><span className="text-[#4caf82]">Opt.</span><span className="text-[#4caf82]">{fmtDef(kpiOpt.defizit)} Mrd.</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#00c8b4]">Real.</span><span className="text-[#00c8b4]">{fmtDef(kpiReal.defizit)} Mrd.</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#e05c5c]">Pess.</span><span className="text-[#e05c5c]">{fmtDef(kpiPess.defizit)} Mrd.</span></div>
                </div>
              </div>

              {/* Steueraufkommen */}
              <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]" data-testid="card-kpi-steueraufkommen">
                <div className="text-[#8faabb] text-xs mb-1">Steueraufkommen</div>
                <div className="text-lg font-bold mb-2" style={{ color: steuerNum >= 916 ? "#4caf82" : "#e05c5c" }}>
                  {steuer.toFixed(0)} Mrd.
                </div>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[10px]"><span className="text-[#4caf82]">Opt.</span><span className="text-[#4caf82]">{kpiOpt.steuer.toFixed(0)} Mrd.</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#00c8b4]">Real.</span><span className="text-[#00c8b4]">{kpiReal.steuer.toFixed(0)} Mrd.</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#e05c5c]">Pess.</span><span className="text-[#e05c5c]">{kpiPess.steuer.toFixed(0)} Mrd.</span></div>
                </div>
              </div>

              {/* Staatsverschuldung — static */}
              <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]">
                <div className="text-[#8faabb] text-xs mb-1">Staatsverschuldung</div>
                <div className="text-lg font-bold mb-2 text-[#f0f4f8]">2.445 Mrd.</div>
                <div className="text-[10px] text-[#8faabb]">Statisch — Zinsdynamik nicht modelliert</div>
                <div className="text-[10px] text-[#8faabb] mt-1">Quelle: Deutsche Bundesbank · Feb 2024</div>
              </div>
            </div>
          </section>

          {/* ── Kategorie 2: Volkswirtschaftliche Wirkung ── */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#f5a623] mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#f5a623] rounded" />
              Volkswirtschaftliche Wirkung
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              {/* Wachstum */}
              <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]" data-testid="card-kpi-wirtschaftswachstum">
                <div className="text-[#8faabb] text-xs mb-1">Wirtschaftswachstum</div>
                <div className="text-lg font-bold mb-2" style={{ color: wachNum >= 1.0 ? "#4caf82" : wachNum >= 0 ? "#f5a623" : "#e05c5c" }}>
                  {fmtW(wachNum)} BIP
                </div>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[10px]"><span className="text-[#4caf82]">Opt.</span><span className="text-[#4caf82]">{fmtW(kpiOpt.wachstum)}</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#00c8b4]">Real.</span><span className="text-[#00c8b4]">{fmtW(kpiReal.wachstum)}</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#e05c5c]">Pess.</span><span className="text-[#e05c5c]">{fmtW(kpiPess.wachstum)}</span></div>
                </div>
              </div>

              {/* ALQ */}
              <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]" data-testid="card-kpi-arbeitslosenquote">
                <div className="text-[#8faabb] text-xs mb-1">Arbeitslosenquote</div>
                <div className="text-lg font-bold mb-2" style={{ color: alqNum <= 5.0 ? "#4caf82" : alqNum <= 6.0 ? "#f5a623" : "#e05c5c" }}>
                  {alq.toFixed(1)}%
                </div>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[10px]"><span className="text-[#4caf82]">Opt.</span><span className="text-[#4caf82]">{kpiOpt.alq.toFixed(1)}%</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#00c8b4]">Real.</span><span className="text-[#00c8b4]">{kpiReal.alq.toFixed(1)}%</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#e05c5c]">Pess.</span><span className="text-[#e05c5c]">{kpiPess.alq.toFixed(1)}%</span></div>
                </div>
              </div>

              {/* Fachkräftemangel */}
              <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]" data-testid="card-kpi-fachkräftemangel">
                <div className="text-[#8faabb] text-xs mb-1">Fachkräftemangel</div>
                <div className="text-lg font-bold mb-2" style={{ color: fachNum < 600 ? "#4caf82" : fachNum < 800 ? "#f5a623" : "#e05c5c" }}>
                  {fachluecke.toFixed(0)}k Stellen
                </div>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[10px]"><span className="text-[#4caf82]">Opt.</span><span className="text-[#4caf82]">{kpiOpt.fachluecke.toFixed(0)}k</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#00c8b4]">Real.</span><span className="text-[#00c8b4]">{kpiReal.fachluecke.toFixed(0)}k</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#e05c5c]">Pess.</span><span className="text-[#e05c5c]">{kpiPess.fachluecke.toFixed(0)}k</span></div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Kategorie 3: Gesellschaftliche Wirkung ── */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#8faabb] mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#8faabb] rounded" />
              Gesellschaftliche Wirkung
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              {/* Rentenkosten */}
              <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]" data-testid="card-kpi-rentenkosten">
                <div className="text-[#8faabb] text-xs mb-1">Rentenkosten</div>
                <div className="text-lg font-bold mb-2" style={{ color: rentenNum < 362 ? "#4caf82" : rentenNum > 380 ? "#e05c5c" : "#f0f4f8" }}>
                  {rentenKosten.toFixed(0)} Mrd.
                </div>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[10px]"><span className="text-[#4caf82]">Opt.</span><span className="text-[#4caf82]">{kpiOpt.rentenKosten.toFixed(0)} Mrd.</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#00c8b4]">Real.</span><span className="text-[#00c8b4]">{kpiReal.rentenKosten.toFixed(0)} Mrd.</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#e05c5c]">Pess.</span><span className="text-[#e05c5c]">{kpiPess.rentenKosten.toFixed(0)} Mrd.</span></div>
                </div>
              </div>

              {/* Gesundheitskosten — static */}
              <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]">
                <div className="text-[#8faabb] text-xs mb-1">Gesundheitskosten</div>
                <div className="text-lg font-bold mb-2 text-[#f0f4f8]">468 Mrd.</div>
                <div className="text-[10px] text-[#8faabb]">Statisch — Demografieeffekte nicht modelliert</div>
                <div className="text-[10px] text-[#8faabb] mt-1">Quelle: BMG · Feb 2024</div>
              </div>

              {/* Staatsverschuldung reminder */}
              <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]">
                <div className="text-[#8faabb] text-xs mb-1">Schulden pro Kopf</div>
                <div className="text-lg font-bold mb-2 text-[#e05c5c]">29.100 €</div>
                <div className="text-[10px] text-[#8faabb]">Basiert auf 2.445 Mrd. Staatsschuld ÷ 84,7 Mio. Einwohner</div>
              </div>
            </div>
          </section>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[220px]">
            <div className="bg-[#1a2b3c] p-4 rounded border border-[#1e3048] h-[220px]">
              <h3 className="text-[#8faabb] mb-3 text-xs font-semibold uppercase tracking-widest">Bundeshaushalt: Einnahmen vs. Ausgaben</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={dynBarData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
                  <XAxis dataKey="name" stroke="#8faabb" fontSize={9} />
                  <YAxis stroke="#8faabb" fontSize={9} />
                  <RechartsTooltip contentStyle={{ backgroundColor: "#0d1b2a", borderColor: "#1e3048", fontSize: 11 }} formatter={(v: number) => [`${v} Mrd. €`]} />
                  <Legend wrapperStyle={{ fontSize: "10px" }} />
                  <Bar dataKey="einnahmen" fill="#00c8b4" name="Einnahmen" />
                  <Bar dataKey="ausgaben"  fill="#e05c5c" name="Ausgaben"  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-[#1a2b3c] p-4 rounded border border-[#1e3048] h-[220px]">
              <h3 className="text-[#8faabb] mb-3 text-xs font-semibold uppercase tracking-widest">BIP-Wachstumspfad 2024–2030 (%)</h3>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={dynLineData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
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
            <div className="bg-[#1a2b3c] rounded border border-[#1e3048] p-5">
              <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                <span className="text-[#00c8b4] text-lg leading-none">▣</span>
                Dein Deutschland
              </h3>
              <div className="space-y-2 mb-4">
                {[
                  { label: "Staatsausgaben-Δ",   val: `${reformDelta.ausgaben} Mrd. €`,                                                     pos: Number(reformDelta.ausgaben) < 0 },
                  { label: "Steueraufkommen-Δ",  val: `${Number(reformDelta.steuer) >= 0 ? "+" : ""}${reformDelta.steuer} Mrd. €`,            pos: Number(reformDelta.steuer) > 0  },
                  { label: "Wirtschaftswachstum", val: fmtW(wachNum),                                                                         pos: wachNum >= 0.8 },
                  { label: "Arbeitslosenquote",   val: `${alq.toFixed(1)}%`,                                                                  pos: alqNum < 5.7 },
                  { label: "Rentenniveau",        val: `${rentenniveau}%`,                                                                     pos: rentenniveau >= 48 },
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
                  <span className="text-[#4caf82]">Fachkräftezuwanderung verbessert Steuereinnahmen und senkt Fachkräftelücke (Ketteneffekt modelliert)</span>
                </div>
                <div className="flex items-start gap-2 bg-[#3d1515] rounded px-3 py-2 border border-[#e05c5c]/30">
                  <XCircle size={13} className="text-[#e05c5c] mt-0.5 shrink-0" />
                  <span className="text-[#e05c5c]">Beamtenabbau wirkt erst nach 3–10 Jahren vollständig (Pensionsschutz)</span>
                </div>
                <div className="flex items-start gap-2 bg-[#3d2d0a] rounded px-3 py-2 border border-[#f5a623]/30">
                  <AlertTriangle size={13} className="text-[#f5a623] mt-0.5 shrink-0" />
                  <span className="text-[#f5a623]">Demografischer Druck auf Rentensystem und Gesundheitskosten nicht modelliert</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
