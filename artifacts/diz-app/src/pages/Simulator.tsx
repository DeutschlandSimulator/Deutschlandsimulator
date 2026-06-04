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
import { SLIDER_INFO, scenarioMultipliers } from "@/components/simulator/data";
import { EvidenzLevel, ScenarioMode } from "@/components/simulator/types";

// ─── Constants ────────────────────────────────────────────────────────────────
const BEAMTE_DELAY   = 0.30;
const FK_INTEGRATION = 0.80;
const RENTE_RISK     = 0.82;

// ─── Types ────────────────────────────────────────────────────────────────────
type Schuldenbremse = "aktuell" | "reformiert" | "ausgesetzt" | "abgeschafft";
type Atomkraft      = "ausstieg" | "statusquo" | "verlaengerung" | "neubau";
type Kohleausstieg  = "2030" | "2035" | "2038" | "offen";
type VmBetrieb      = "voll" | "halb" | "befreit";

// ─── EvidenzDot ───────────────────────────────────────────────────────────────
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
            <button onClick={() => onInfo(infoKey)} className="text-[#8faabb] hover:text-[#00c8b4] transition-colors">
              <Info size={13} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {isDirty && (
            <button onClick={() => onChange(defaultValue)} title="Zurücksetzen" className="text-[#8faabb] hover:text-[#f5a623] transition-colors">
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
        className="w-full accent-[#00c8b4] h-1.5" />
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
          <button onClick={() => onInfo(infoKey)} className="text-[#8faabb] hover:text-[#00c8b4] transition-colors">
            <Info size={13} />
          </button>
        )}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-10 h-5 rounded-full relative transition-colors shrink-0 ${value ? (danger ? "bg-[#e05c5c]" : "bg-[#00c8b4]") : "bg-[#1e3048]"}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

// ─── RadioRow ─────────────────────────────────────────────────────────────────
function RadioRow({ label, infoKey, value, options, onChange, onInfo }: {
  label: string; infoKey?: string; value: string | number;
  options: { value: string | number; label: string }[];
  onChange: (v: any) => void; onInfo: (k: string) => void;
}) {
  const info = infoKey ? SLIDER_INFO[infoKey] : null;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-sm">
        <span className="text-[#f0f4f8]">{label}</span>
        {info && (
          <button onClick={() => onInfo(infoKey!)} className="text-[#8faabb] hover:text-[#00c8b4] transition-colors">
            <Info size={13} />
          </button>
        )}
        {info && <EvidenzDot level={info.evidenz} />}
      </div>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button key={o.value} onClick={() => onChange(o.value)}
            className={`text-[10px] px-2 py-1 rounded border transition-colors ${
              value === o.value
                ? "bg-[#243447] border-[#00c8b4] text-[#f0f4f8]"
                : "bg-[#0d1b2a] border-[#1e3048] text-[#8faabb] hover:text-[#f0f4f8]"
            }`}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── SelectRow ────────────────────────────────────────────────────────────────
function SelectRow({ label, infoKey, value, options, onChange, onInfo }: {
  label: string; infoKey?: string; value: string | number;
  options: { value: string | number; label: string }[];
  onChange: (v: any) => void; onInfo: (k: string) => void;
}) {
  const info = infoKey ? SLIDER_INFO[infoKey] : null;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-[#f0f4f8]">{label}</span>
          {info && (
            <button onClick={() => onInfo(infoKey!)} className="text-[#8faabb] hover:text-[#00c8b4] transition-colors">
              <Info size={13} />
            </button>
          )}
        </div>
        {info && <EvidenzDot level={info.evidenz} />}
      </div>
      <select value={value} onChange={(e) => {
        const opt = options.find((o) => String(o.value) === e.target.value);
        onChange(opt ? opt.value : e.target.value);
      }}
        className="w-full bg-[#0d1b2a] border border-[#1e3048] text-[#f0f4f8] text-xs rounded px-2 py-1.5 focus:outline-none focus:border-[#00c8b4]">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ─── Core KPI computation ─────────────────────────────────────────────────────
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
    euZuwanderung: boolean;
    vmFreibetrag: number; vmRate: number; vmBetrieb: VmBetrieb;
    estSpitzenbeginn: number;
    reichensteuerAktiv: boolean; reichensteuerSchwelle: number; reichensteuerSatz: number;
    schuldenbremse: Schuldenbremse;
    co2Preis: number; windausbau: number; solarausbau: number;
    atomkraft: Atomkraft; kohleausstieg: Kohleausstieg;
    sozialwohnungen: number; mietpreisbremse: boolean; wohngeld: number;
    bildungsausgaben: number; kitaAusbau: number; bafoeg: number;
  }
) {
  const {
    beamte, ministerien, verteidigung, entwicklung, fluechtlinge, fachkraefte,
    beitragssatz, buergergeld, rentenalter, rentenniveau, einkommensteuer,
    unternehmenssteuer, vermoegenssteuer, erbschaftssteuer, einheitsversicherung, privatAbschaffen,
    euZuwanderung,
    vmFreibetrag, vmRate, vmBetrieb,
    estSpitzenbeginn, reichensteuerAktiv, reichensteuerSchwelle, reichensteuerSatz,
    schuldenbremse,
    co2Preis, windausbau, solarausbau, atomkraft, kohleausstieg,
    sozialwohnungen, mietpreisbremse, wohngeld,
    bildungsausgaben, kitaAusbau, bafoeg,
  } = params;

  // ── Vermögensteuer (dynamic) ────────────────────────────────
  const vmFreibetragF = vmFreibetrag === 1 ? 1.4 : vmFreibetrag === 2 ? 1.0 : vmFreibetrag === 5 ? 0.6 : vmFreibetrag === 10 ? 0.38 : 0.22;
  const vmRateF       = vmRate === 0.5 ? 0.5 : vmRate === 1.0 ? 1.0 : vmRate === 1.5 ? 1.35 : vmRate === 2.0 ? 1.6 : 1.8;
  const vmBetriebF    = vmBetrieb === "voll" ? 1.0 : vmBetrieb === "halb" ? 0.75 : 0.5;
  const vmScenF       = s === "optimistisch" ? 0.90 : s === "realistisch" ? 0.72 : 0.50;
  const vmEinnahmen   = vermoegenssteuer ? 8 * vmFreibetragF * vmRateF * vmBetriebF * vmScenF : 0;

  // ── Einkommensteuer Spitzenbeginn ───────────────────────────
  const estSchwelleDelta = -(estSpitzenbeginn - 80) * 0.036;

  // ── Reichensteuer ──────────────────────────────────────────
  const rStThreshF   = reichensteuerSchwelle === 250 ? 1.0 : reichensteuerSchwelle === 500 ? 0.42 : 0.18;
  const rStRateF     = Math.max(0, (reichensteuerSatz - 45) / 5);
  const rStEmigr     = reichensteuerAktiv && reichensteuerSatz >= 55 ? (reichensteuerSatz - 50) * 0.4 : 0;
  const rStEinnahmen = reichensteuerAktiv
    ? Math.max(0, 3 * rStThreshF * rStRateF * (s === "optimistisch" ? 0.85 : s === "realistisch" ? 0.68 : 0.45) - rStEmigr)
    : 0;

  // ── Schuldenbremse ─────────────────────────────────────────
  const schdbMap: Record<Schuldenbremse, { ausgaben: number; growth: number; zinsen: number; invest: number }> = {
    aktuell:    { ausgaben:  0, growth: 0,    zinsen:  0, invest:  0 },
    reformiert: { ausgaben: 20, growth: 0.12, zinsen:  2, invest: 18 },
    ausgesetzt: { ausgaben: 50, growth: 0.18, zinsen:  6, invest: 44 },
    abgeschafft:{ ausgaben: 80, growth: 0.10, zinsen: 14, invest: 66 },
  };
  const schdb = schdbMap[schuldenbremse];

  // ── Klima & Energie ────────────────────────────────────────
  const co2Delta         = co2Preis - 60;
  const co2EinnahmenD    = co2Delta * 0.018;
  const windDelta        = windausbau - 100;
  const solarDelta       = solarausbau - 100;
  const erneuerbareAusg  = windDelta * 0.12 + solarDelta * 0.06;
  const atomEffekt       = atomkraft === "verlaengerung" ? { stromD: -2, emD: -20, ausgD: -1 }
                         : atomkraft === "neubau"        ? { stromD: -4, emD: -50, ausgD: 15 }
                         : { stromD: 0, emD: 0, ausgD: 0 };
  const kohleEffekt      = kohleausstieg === "2035" ? { stromD: -1, emD:  25 }
                         : kohleausstieg === "2038" ? { stromD: -2, emD:  45 }
                         : kohleausstieg === "offen"? { stromD: -3, emD:  70 }
                         : { stromD: 0, emD: 0 };
  const co2GrowthEffect  = -(Math.max(0, co2Delta) * 0.002);
  const co2Emissionen    = Math.max(0, 670 - co2Delta * 1.8 - windDelta * 0.8 - solarDelta * 0.3 - atomEffekt.emD + kohleEffekt.emD);
  const strompreis       = Math.max(8, 32 + co2Delta * 0.02 - windDelta * 0.025 - solarDelta * 0.01 + atomEffekt.stromD + kohleEffekt.stromD);

  // ── Wohnen ─────────────────────────────────────────────────
  const sozWohnAusg  = (sozialwohnungen - 30) * 0.045;
  const wohngeldAusg = wohngeld * 0.05;
  const mietindex    = Math.max(60, 100 - (sozialwohnungen - 30) * 0.15 + (mietpreisbremse ? -5 : 0));
  const wohnraumdef  = Math.max(0, 700 - sozialwohnungen * 1.5 + (mietpreisbremse ? 20 : 0));

  // ── Bildung ────────────────────────────────────────────────
  const bildAusg        = (bildungsausgaben - 4.3) * 43.06;
  const kitaAusg        = kitaAusbau * 0.13;
  const bafoegAusg      = bafoeg * 0.03;
  const bildGrowthEff   = (bildungsausgaben - 4.3) * 0.015 + kitaAusbau * 0.0008;
  const bildFachluecke  = -(bildungsausgaben - 4.3) * 60;

  // ── Defense growth impact ──────────────────────────────────
  const vertDelta          = verteidigung - 2.0;
  const defenseGrowthImpact = s === "optimistisch" ? vertDelta * 0.3 : s === "realistisch" ? 0 : vertDelta * -0.2;

  // ── ausgabenDelta ──────────────────────────────────────────
  const ausgabenDelta =
    vertDelta                     * 43.06  +
    (entwicklung  - 0.4)          * 43.06  +
    (beamte       - 4900)         * 0.072 * BEAMTE_DELAY +
    (ministerien  - 16)           * 0.8   +
    (fluechtlinge - 180)          * 0.018 +
    (buergergeld  - 502)          * 0.066 +
    (rentenniveau - 48)           * 4.0   -
    (rentenalter  - 67)           * 18.5  * RENTE_RISK -
    (beitragssatz - 14.6)         * 4.0   +
    (einheitsversicherung ? 18 : 0) +
    (privatAbschaffen     ? 11 : 0) +
    schdb.ausgaben + schdb.zinsen  +
    erneuerbareAusg                +
    atomEffekt.ausgD               +
    sozWohnAusg                    +
    wohngeldAusg                   +
    bildAusg + kitaAusg + bafoegAusg;

  // ── einnahmenDelta ─────────────────────────────────────────
  const einnahmenDelta =
    (einkommensteuer    - 42)     * 3.2   +
    (fachkraefte        - 200)    * 0.0145 * FK_INTEGRATION +
    vmEinnahmen                            +
    (unternehmenssteuer - 29.9)   * 3.0   +
    (400 - erbschaftssteuer)      * 0.005 +
    (einheitsversicherung ? 22 : 0) +
    (privatAbschaffen     ?  7 : 0) +
    (euZuwanderung        ?  0 : -10) +
    co2EinnahmenD + rStEinnahmen + estSchwelleDelta;

  const netDelta = (ausgabenDelta - einnahmenDelta) * smVal;
  const defizit  = -(34.2 + netDelta);

  // ── ALQ ────────────────────────────────────────────────────
  const alq = Math.max(0,
    5.7
    - (fachkraefte - 200)  * 0.003
    + (buergergeld - 502)  * 0.0015
    + (rentenalter - 67)   * 0.05
    + (euZuwanderung ? 0 : 0.2));

  // ── Wachstum ───────────────────────────────────────────────
  const wachstum = (
    0.8
    + (fachkraefte        - 200)  * 0.0008
    + defenseGrowthImpact
    - (einkommensteuer    - 42)   * 0.008
    - (unternehmenssteuer - 29.9) * 0.015
    - (beamte             - 4900) * 0.00002
    - (euZuwanderung ? 0 : 0.35)
    + schdb.growth
    + co2GrowthEffect
    + bildGrowthEff
  ) * smVal;

  // ── Chain ──────────────────────────────────────────────────
  const chainSteuer  = (wachstum - 0.8) * 20 - (alq - 5.7) * 15;
  const steuer       = 948 + einnahmenDelta * smVal + chainSteuer;
  const rentenKosten = 362 + (rentenniveau - 48) * 4 - (rentenalter - 67) * 18.5 * RENTE_RISK;
  const fachluecke   = Math.max(0, 890 - (fachkraefte - 200) * 1.5 + (euZuwanderung ? 0 : 180) + bildFachluecke);

  return {
    defizit, steuer, alq, wachstum, rentenKosten, fachluecke,
    einnahmenDelta, ausgabenDelta,
    co2Emissionen, strompreis, mietindex, wohnraumdef,
    schdbInvest: schdb.invest,
  };
}

// ─── Vertrauensindex ──────────────────────────────────────────────────────────
const PARAM_EVIDENZ: Record<string, EvidenzLevel> = {
  beamte: "mittel", ministerien: "mittel", verteidigung: "hoch", entwicklung: "hoch",
  fluechtlinge: "mittel", fachkraefte: "hoch", beitragssatz: "mittel",
  buergergeld: "mittel", rentenalter: "hoch", rentenniveau: "mittel",
  einkommensteuer: "mittel", unternehmenssteuer: "mittel",
  vermoegenssteuer: "gering", erbschaftssteuer: "mittel",
  einheitsversicherung: "gering", privatAbschaffen: "gering",
  euZuwanderung: "mittel",
  vmFreibetrag: "gering", vmRate: "gering", vmBetrieb: "gering",
  estSpitzenbeginn: "mittel", reichensteuer: "gering",
  schuldenbremse: "mittel",
  co2Preis: "hoch", windausbau: "mittel", solarausbau: "mittel",
  atomkraft: "gering", kohleausstieg: "hoch",
  sozialwohnungen: "mittel", mietpreisbremse: "gering", wohngeld: "mittel",
  bildungsausgaben: "mittel", kitaAusbau: "mittel", bafoeg: "mittel",
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
  // ── Existing state ──────────────────────────────────────────
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

  // ── New Steuern state ──────────────────────────────────────
  const [vmFreibetrag,          setVmFreibetrag]          = useState<number>(2);
  const [vmRate,                setVmRate]                = useState<number>(1.0);
  const [vmBetrieb,             setVmBetrieb]             = useState<VmBetrieb>("voll");
  const [estSpitzenbeginn,      setEstSpitzenbeginn]      = useState<number>(80);
  const [reichensteuerAktiv,    setReichensteuerAktiv]    = useState(false);
  const [reichensteuerSchwelle, setReichensteuerSchwelle] = useState<number>(500);
  const [reichensteuerSatz,     setReichensteuerSatz]     = useState<number>(50);

  // ── Finanzen ───────────────────────────────────────────────
  const [schuldenbremse, setSchuldenbremse] = useState<Schuldenbremse>("aktuell");

  // ── Klima & Energie ───────────────────────────────────────
  const [co2Preis,     setCo2Preis]     = useState(60);
  const [windausbau,   setWindausbau]   = useState(100);
  const [solarausbau,  setSolarausbau]  = useState(100);
  const [atomkraft,    setAtomkraft]    = useState<Atomkraft>("statusquo");
  const [kohleausstieg,setKohleausstieg]= useState<Kohleausstieg>("2030");

  // ── Wohnen ─────────────────────────────────────────────────
  const [sozialwohnungen, setSozialwohnungen] = useState(30);
  const [mietpreisbremse, setMietpreisbremse] = useState(false);
  const [wohngeld,        setWohngeld]        = useState(0);

  // ── Bildung ────────────────────────────────────────────────
  const [bildungsausgaben, setBildungsausgaben] = useState(4.3);
  const [kitaAusbau,       setKitaAusbau]       = useState(0);
  const [bafoeg,           setBafoeg]           = useState(0);

  // ── Misc ───────────────────────────────────────────────────
  const [infoKey,  setInfoKey]  = useState<string | null>(null);
  const [scenario, setScenario] = useState<ScenarioMode>("realistisch");

  function resetAll() {
    setBeamte(4900); setMinisterien(16); setVerteidigung(2.0); setEntwicklung(0.4);
    setFluechtlinge(180); setFachkraefte(200); setEuZuwanderung(true);
    setEinheitsversicherung(false); setPrivatAbschaffen(false); setBeitragssatz(14.6);
    setBuergergeld(502); setRentenalter(67); setRentenniveau(48);
    setEinkommensteuer(42); setUnternehmenssteuer(29.9); setVermoegenssteuer(false); setErbschaftssteuer(400);
    setVmFreibetrag(2); setVmRate(1.0); setVmBetrieb("voll");
    setEstSpitzenbeginn(80); setReichensteuerAktiv(false); setReichensteuerSchwelle(500); setReichensteuerSatz(50);
    setSchuldenbremse("aktuell");
    setCo2Preis(60); setWindausbau(100); setSolarausbau(100); setAtomkraft("statusquo"); setKohleausstieg("2030");
    setSozialwohnungen(30); setMietpreisbremse(false); setWohngeld(0);
    setBildungsausgaben(4.3); setKitaAusbau(0); setBafoeg(0);
  }

  const p = {
    beamte, ministerien, verteidigung, entwicklung, fluechtlinge, fachkraefte,
    beitragssatz, buergergeld, rentenalter, rentenniveau, einkommensteuer,
    unternehmenssteuer, vermoegenssteuer, erbschaftssteuer, einheitsversicherung, privatAbschaffen,
    euZuwanderung,
    vmFreibetrag, vmRate, vmBetrieb,
    estSpitzenbeginn, reichensteuerAktiv, reichensteuerSchwelle, reichensteuerSatz,
    schuldenbremse,
    co2Preis, windausbau, solarausbau, atomkraft, kohleausstieg,
    sozialwohnungen, mietpreisbremse, wohngeld,
    bildungsausgaben, kitaAusbau, bafoeg,
  };

  const kpiOpt  = computeKPIs("optimistisch",  1.30, p);
  const kpiReal = computeKPIs("realistisch",   1.00, p);
  const kpiPess = computeKPIs("pessimistisch", 0.65, p);
  const kpiCur  = computeKPIs(scenario, scenarioMultipliers[scenario], p);

  const { defizit, steuer, alq, wachstum, rentenKosten, fachluecke,
          einnahmenDelta, ausgabenDelta,
          co2Emissionen, strompreis, mietindex, wohnraumdef, schdbInvest } = kpiCur;

  const sm = scenarioMultipliers[scenario];

  // ── Vertrauensindex ────────────────────────────────────────
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
    { key: "vmFreibetrag",         isDirty: vermoegenssteuer && vmFreibetrag !== 2 },
    { key: "vmRate",               isDirty: vermoegenssteuer && vmRate     !== 1.0 },
    { key: "vmBetrieb",            isDirty: vermoegenssteuer && vmBetrieb  !== "voll" },
    { key: "erbschaftssteuer",     isDirty: erbschaftssteuer !== 400  },
    { key: "einheitsversicherung", isDirty: einheitsversicherung      },
    { key: "privatAbschaffen",     isDirty: privatAbschaffen          },
    { key: "euZuwanderung",        isDirty: !euZuwanderung            },
    { key: "estSpitzenbeginn",     isDirty: estSpitzenbeginn !== 80   },
    { key: "reichensteuer",        isDirty: reichensteuerAktiv        },
    { key: "schuldenbremse",       isDirty: schuldenbremse !== "aktuell" },
    { key: "co2Preis",             isDirty: co2Preis     !== 60   },
    { key: "windausbau",           isDirty: windausbau   !== 100  },
    { key: "solarausbau",          isDirty: solarausbau  !== 100  },
    { key: "atomkraft",            isDirty: atomkraft    !== "statusquo" },
    { key: "kohleausstieg",        isDirty: kohleausstieg !== "2030"     },
    { key: "sozialwohnungen",      isDirty: sozialwohnungen !== 30    },
    { key: "mietpreisbremse",      isDirty: mietpreisbremse           },
    { key: "wohngeld",             isDirty: wohngeld !== 0            },
    { key: "bildungsausgaben",     isDirty: bildungsausgaben !== 4.3  },
    { key: "kitaAusbau",           isDirty: kitaAusbau !== 0          },
    { key: "bafoeg",               isDirty: bafoeg     !== 0          },
  ];
  const trust      = calcTrust(dirtyList);
  const trustColor = trust >= 70 ? "#4caf82" : trust >= 40 ? "#f5a623" : "#e05c5c";

  const defizitLabel = defizit >= 0 ? "Haushaltsüberschuss" : "Haushaltsdefizit";
  const fmtDef = (v: number) => v >= 0 ? `+${v.toFixed(1)} Mrd.` : `${Math.abs(v).toFixed(1)} Mrd.`;
  const fmtW   = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`;

  // ── Dynamic chart data ─────────────────────────────────────
  const dynBarData = [
    { name: "Soziales",     einnahmen: 0, ausgaben: Math.round(175 + (buergergeld - 502) * 0.066 + (rentenniveau - 48) * 4) },
    { name: "Verteidigung", einnahmen: 0, ausgaben: Math.round(52  + (verteidigung - 2.0) * 43.06) },
    { name: "Bildung",      einnahmen: 0, ausgaben: Math.round(21  + (bildungsausgaben - 4.3) * 43.06) },
    { name: "Zinsen",       einnahmen: 0, ausgaben: Math.round(37  - (ausgabenDelta - einnahmenDelta) * sm * 0.05) },
    { name: "Sonstiges",    einnahmen: Math.round(460 + einnahmenDelta * sm), ausgaben: Math.round(191 + (beamte - 4900) * 0.072 * BEAMTE_DELAY + (ministerien - 16) * 0.8) },
  ];
  const dynLineData = [
    { year: "2024", statusQuo: 0.2, simulation: 0.2 },
    { year: "2025", statusQuo: 0.5, simulation: +(0.2 + wachstum * 0.5).toFixed(2)  },
    { year: "2026", statusQuo: 0.8, simulation: +(0.2 + wachstum * 1.0).toFixed(2)  },
    { year: "2027", statusQuo: 1.0, simulation: +(0.2 + wachstum * 1.5).toFixed(2)  },
    { year: "2028", statusQuo: 1.1, simulation: +(0.2 + wachstum * 1.9).toFixed(2)  },
    { year: "2029", statusQuo: 1.2, simulation: +(0.2 + wachstum * 2.2).toFixed(2)  },
    { year: "2030", statusQuo: 1.2, simulation: +(0.2 + wachstum * 2.5).toFixed(2)  },
  ];

  const citizenCards = [
    { icon: <Wallet size={20} className="text-[#4caf82]" />,      label: "Nettoeinkommen",    val: "2.587 €/Mon.",          delta: einkommensteuer > 42 ? `−${((einkommensteuer-42)*12).toFixed(0)} €/J.` : `+${((42-einkommensteuer)*12).toFixed(0)} €/J.`, pos: einkommensteuer <= 42 },
    { icon: <HeartPulse size={20} className="text-[#e05c5c]" />,   label: "KV-Beitrag",        val: `${beitragssatz.toFixed(1)}% Lohn`, delta: beitragssatz > 14.6 ? `+${((beitragssatz-14.6)*25).toFixed(0)} €/Mon.` : `−${((14.6-beitragssatz)*25).toFixed(0)} €/Mon.`, pos: beitragssatz <= 14.6 },
    { icon: <Building2 size={20} className="text-[#f5a623]" />,    label: "Rente (Ø)",         val: `${rentenniveau}% Lohnni.`, delta: rentenniveau >= 48 ? `+${(rentenniveau-48)*8} €/Mon.` : `${(rentenniveau-48)*8} €/Mon.`, pos: rentenniveau >= 48 },
    { icon: <Briefcase size={20} className="text-[#00c8b4]" />,    label: "Arbeitsmarkt",      val: `${alq.toFixed(1)}% Quote`,  delta: alq < 5.7 ? `−${(5.7-alq).toFixed(1)}pp` : `+${(alq-5.7).toFixed(1)}pp`, pos: alq < 5.7 },
    { icon: <TrendingUp size={20} className="text-[#4caf82]" />,   label: "Kaufkraft",         val: `${fmtW(wachstum)} Reallohn`, delta: "Ø +380 €/J.", pos: wachstum >= 0 },
    { icon: <ShoppingCart size={20} className="text-[#8faabb]" />, label: "Stromkosten",       val: `${strompreis.toFixed(1)} ct/kWh`, delta: strompreis < 32 ? `↓ ${(32-strompreis).toFixed(1)} ct` : `↑ ${(strompreis-32).toFixed(1)} ct`, pos: strompreis < 32 },
    { icon: <TrendingDown size={20} className="text-[#e05c5c]" />, label: "Schulden/Kopf",     val: "29.100 €", delta: "+180 €/J.", pos: false },
    { icon: <Users size={20} className="text-[#00c8b4]" />,        label: "Fachkräftelücke",   val: `${fachluecke.toFixed(0)}k Stellen`, delta: fachkraefte > 200 ? `↓ ${((fachkraefte-200)*1.5).toFixed(0)}k` : "stagniert", pos: fachkraefte > 200 },
  ];

  const currentInfo = infoKey ? SLIDER_INFO[infoKey] ?? null : null;

  return (
    <Layout>
      <InfoPanel info={currentInfo} onClose={() => setInfoKey(null)} />

      {/* Scenario bar */}
      <div className="bg-[#0d1b2a] border-b border-[#1e3048] px-6 py-2 flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold text-[#8faabb] uppercase tracking-widest">Szenario:</span>
        {(["optimistisch", "realistisch", "pessimistisch"] as ScenarioMode[]).map((s) => (
          <button key={s} onClick={() => setScenario(s)}
            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors capitalize ${
              scenario === s
                ? s === "optimistisch" ? "bg-[#1a3d2b] text-[#4caf82] border border-[#4caf82]/60"
                : s === "realistisch"  ? "bg-[#243447] text-[#00c8b4] border border-[#00c8b4]/60"
                : "bg-[#3d1515] text-[#e05c5c] border border-[#e05c5c]/60"
                : "bg-[#1a2b3c] text-[#8faabb] border border-[#1e3048] hover:text-[#f0f4f8]"
            }`} data-testid={`button-scenario-${s}`}>
            {s === "optimistisch" ? "Optimistisch" : s === "realistisch" ? "Realistisch" : "Pessimistisch"}
          </button>
        ))}
        <span className="ml-auto text-xs text-[#8faabb] hidden md:block">Alle Prognosen werden entsprechend angepasst</span>
      </div>

      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        {/* ═══ LEFT PANEL ═══ */}
        <div className="w-full md:w-[360px] md:shrink-0 bg-[#1a2b3c] p-4 border-b md:border-b-0 md:border-r border-[#1e3048] overflow-y-auto md:h-[calc(100vh-113px)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold border-b-2 border-[#00c8b4] pb-1">Politische Parameter</h2>
            <button onClick={resetAll} className="flex items-center gap-1 text-xs text-[#8faabb] hover:text-[#f5a623] transition-colors border border-[#1e3048] hover:border-[#f5a623] rounded px-2 py-1">
              <RotateCcw size={11} /> Zurücksetzen
            </button>
          </div>
          <div className="text-xs text-[#8faabb] flex items-center gap-3 mb-4">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#4caf82] inline-block" /> Hohe Evidenz</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f5a623] inline-block" /> Mittlere</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#e05c5c] inline-block" /> Unsicher</span>
          </div>

          <Accordion type="multiple" defaultValue={["item-1"]} className="w-full">

            {/* ── Staat ── */}
            <AccordionItem value="item-1" className="border-[#1e3048]">
              <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8] text-sm">Staat</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <SliderRow label="Beamte" infoKey="beamte" value={beamte} defaultValue={4900} min={4200} max={6000} unit="k" onChange={setBeamte} onInfo={setInfoKey} />
                <p className="text-[10px] text-[#f5a623] leading-relaxed -mt-2 flex items-start gap-1">
                  <AlertTriangle size={10} className="shrink-0 mt-0.5" />
                  Beamtenabbau wirkt nur schrittweise — Pensionsansprüche verzögern Einsparungen (30% Wirkung kurzfristig).
                </p>
                <SliderRow label="Ministerien"       infoKey="ministerien"  value={ministerien}  defaultValue={16}  min={10}  max={25}             onChange={setMinisterien}  onInfo={setInfoKey} />
                <SliderRow label="Verteidigung"      infoKey="verteidigung" value={verteidigung}  defaultValue={2.0} min={1.0} max={3.0} step={0.1} unit="% BIP" onChange={setVerteidigung} onInfo={setInfoKey} />
                <SliderRow label="Entwicklungshilfe" infoKey="entwicklung"  value={entwicklung}   defaultValue={0.4} min={0.2} max={0.8} step={0.1} unit="% BIP" onChange={setEntwicklung}  onInfo={setInfoKey} />
              </AccordionContent>
            </AccordionItem>

            {/* ── Migration ── */}
            <AccordionItem value="item-2" className="border-[#1e3048]">
              <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8] text-sm">Migration</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <SliderRow label="Flüchtlingsaufnahme"   infoKey="fluechtlinge" value={fluechtlinge} defaultValue={180} min={50} max={400} unit="k/J" onChange={setFluechtlinge} onInfo={setInfoKey} />
                <p className="text-[10px] text-[#8faabb] leading-relaxed -mt-2">Kurzfrist negativ; nach 5 Jahren Rückflüsse durch Integration (hier: nur Kurzfristkosten modelliert).</p>
                <SliderRow label="Fachkräftezuwanderung" infoKey="fachkraefte"  value={fachkraefte}  defaultValue={200} min={50} max={500} unit="k/J" onChange={setFachkraefte}  onInfo={setInfoKey} />
                <p className="text-[10px] text-[#8faabb] leading-relaxed -mt-2">Integrationsfaktor: Jahr 1 = 60%, Jahr 2 = 80%, Jahr 3 = 100%. Modell nutzt Ø 80%.</p>
                <ToggleRow label="EU-Freizügigkeit" infoKey="euZuwanderung" value={euZuwanderung} onChange={setEuZuwanderung} onInfo={setInfoKey} />
              </AccordionContent>
            </AccordionItem>

            {/* ── Gesundheit ── */}
            <AccordionItem value="item-3" className="border-[#1e3048]">
              <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8] text-sm">Gesundheit</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <ToggleRow label="Einheitsversicherung"          value={einheitsversicherung} onChange={setEinheitsversicherung} onInfo={setInfoKey} />
                <ToggleRow label="Privatversicherung abschaffen" value={privatAbschaffen}     onChange={setPrivatAbschaffen}     danger onInfo={setInfoKey} />
                <SliderRow label="Beitragssatz" infoKey="beitragssatz" value={beitragssatz} defaultValue={14.6} min={14} max={18} step={0.1} unit="%" onChange={setBeitragssatz} onInfo={setInfoKey} />
              </AccordionContent>
            </AccordionItem>

            {/* ── Soziales ── */}
            <AccordionItem value="item-4" className="border-[#1e3048]">
              <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8] text-sm">Soziales</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <SliderRow label="Bürgergeld"           infoKey="buergergeld"  value={buergergeld}  defaultValue={502} min={400} max={700}          unit=" €"  onChange={setBuergergeld}  onInfo={setInfoKey} />
                <SliderRow label="Renteneintrittsalter" infoKey="rentenalter"  value={rentenalter}  defaultValue={67}  min={63}  max={70}            unit=" J." onChange={setRentenalter}  onInfo={setInfoKey} />
                <p className="text-[10px] text-[#f5a623] leading-relaxed -mt-2 flex items-start gap-1">
                  <AlertTriangle size={10} className="shrink-0 mt-0.5" />
                  Nettoeinsparung um 18% reduziert (Erwerbsminderungsrenten, körperlich belastende Berufe).
                </p>
                <SliderRow label="Rentenniveau"         infoKey="rentenniveau" value={rentenniveau} defaultValue={48}  min={40}  max={55}            unit="%"   onChange={setRentenniveau} onInfo={setInfoKey} />
              </AccordionContent>
            </AccordionItem>

            {/* ── Steuern (extended) ── */}
            <AccordionItem value="item-5" className="border-[#1e3048]">
              <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8] text-sm">Steuern</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <SliderRow label="Spitzensteuersatz"  infoKey="einkommensteuer"    value={einkommensteuer}    defaultValue={42}   min={30} max={55} step={0.5} unit="%" onChange={setEinkommensteuer}    onInfo={setInfoKey} />
                <RadioRow
                  label="Beginn Spitzensteuersatz"
                  infoKey="estSpitzenbeginn"
                  value={estSpitzenbeginn}
                  options={[{ value: 80, label: "80k €" }, { value: 100, label: "100k €" }, { value: 150, label: "150k €" }, { value: 250, label: "250k €" }]}
                  onChange={setEstSpitzenbeginn}
                  onInfo={setInfoKey}
                />
                <p className="text-[10px] text-[#8faabb] -mt-2">Status quo: ~67k €. Anhebung entlastet Mittelschicht, senkt Aufkommen.</p>

                <ToggleRow label="Reichensteuer aktivieren" infoKey="reichensteuer" value={reichensteuerAktiv} onChange={setReichensteuerAktiv} onInfo={setInfoKey} />
                {reichensteuerAktiv && (
                  <div className="pl-3 border-l border-[#1e3048] space-y-3">
                    <RadioRow
                      label="Schwelle"
                      value={reichensteuerSchwelle}
                      options={[{ value: 250, label: "250k €" }, { value: 500, label: "500k €" }, { value: 1000, label: "1 Mio. €" }]}
                      onChange={setReichensteuerSchwelle}
                      onInfo={setInfoKey}
                    />
                    <RadioRow
                      label="Satz"
                      value={reichensteuerSatz}
                      options={[{ value: 45, label: "45%" }, { value: 50, label: "50%" }, { value: 55, label: "55%" }, { value: 60, label: "60%" }]}
                      onChange={setReichensteuerSatz}
                      onInfo={setInfoKey}
                    />
                    {reichensteuerSatz >= 55 && (
                      <p className="text-[10px] text-[#e05c5c] flex items-start gap-1">
                        <AlertTriangle size={10} className="mt-0.5 shrink-0" />
                        Hohe Abwanderungsrisiken ab 55% — Frankreichs Supertax (75%) führte zu messbarerer Emigration.
                      </p>
                    )}
                  </div>
                )}

                <SliderRow label="Unternehmenssteuer"   infoKey="unternehmenssteuer" value={unternehmenssteuer} defaultValue={29.9}  min={10} max={35} step={0.1} unit="%" onChange={setUnternehmenssteuer} onInfo={setInfoKey} />

                <ToggleRow label="Vermögensteuer einführen" infoKey="vermoegenssteuer" value={vermoegenssteuer} onChange={setVermoegenssteuer} onInfo={setInfoKey} />
                {vermoegenssteuer && (
                  <div className="pl-3 border-l border-[#1e3048] space-y-3">
                    <SelectRow
                      label="Freibetrag"
                      infoKey="vmFreibetrag"
                      value={vmFreibetrag}
                      options={[{ value: 1, label: "1 Mio. €" }, { value: 2, label: "2 Mio. €" }, { value: 5, label: "5 Mio. €" }, { value: 10, label: "10 Mio. €" }, { value: 20, label: "20 Mio. €" }]}
                      onChange={setVmFreibetrag}
                      onInfo={setInfoKey}
                    />
                    <SelectRow
                      label="Steuersatz"
                      infoKey="vmRate"
                      value={vmRate}
                      options={[{ value: 0.5, label: "0,5 %" }, { value: 1.0, label: "1,0 %" }, { value: 1.5, label: "1,5 %" }, { value: 2.0, label: "2,0 %" }, { value: 3.0, label: "3,0 %" }]}
                      onChange={setVmRate}
                      onInfo={setInfoKey}
                    />
                    <SelectRow
                      label="Betriebsvermögen"
                      infoKey="vmBetrieb"
                      value={vmBetrieb}
                      options={[{ value: "voll", label: "Voll steuerpflichtig" }, { value: "halb", label: "50% steuerpflichtig" }, { value: "befreit", label: "Voll befreit" }]}
                      onChange={setVmBetrieb}
                      onInfo={setInfoKey}
                    />
                    <p className="text-[10px] text-[#8faabb]">
                      Ertrag: pess. {(computeKPIs("pessimistisch", 0.65, p).steuer - computeKPIs("pessimistisch", 0.65, { ...p, vermoegenssteuer: false }).steuer).toFixed(1)} | real. {(kpiReal.steuer - computeKPIs("realistisch", 1.0, { ...p, vermoegenssteuer: false }).steuer).toFixed(1)} | opt. {(kpiOpt.steuer - computeKPIs("optimistisch", 1.3, { ...p, vermoegenssteuer: false }).steuer).toFixed(1)} Mrd. (je nach Kapitalflucht)
                    </p>
                  </div>
                )}
                <SliderRow label="Erbschaft-Freibetrag" infoKey="erbschaftssteuer" value={erbschaftssteuer} defaultValue={400} min={100} max={1000} step={50} unit="k €" onChange={setErbschaftssteuer} onInfo={setInfoKey} />
              </AccordionContent>
            </AccordionItem>

            {/* ── Finanzen ── */}
            <AccordionItem value="item-6" className="border-[#1e3048]">
              <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8] text-sm">Finanzen</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <RadioRow
                  label="Schuldenbremse"
                  infoKey="schuldenbremse"
                  value={schuldenbremse}
                  options={[
                    { value: "aktuell",    label: "Aktiv (Status quo)" },
                    { value: "reformiert", label: "Reformiert (+Invest.)" },
                    { value: "ausgesetzt", label: "Ausgesetzt" },
                    { value: "abgeschafft",label: "Abgeschafft" },
                  ]}
                  onChange={setSchuldenbremse}
                  onInfo={setInfoKey}
                />
                {schuldenbremse !== "aktuell" && (
                  <p className="text-[10px] text-[#f5a623] flex items-start gap-1">
                    <AlertTriangle size={10} className="mt-0.5 shrink-0" />
                    Mehr Investitionsspielraum erhöht das Defizit, kann aber durch Wachstumseffekte teilweise kompensiert werden.
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* ── Klima & Energie ── */}
            <AccordionItem value="item-7" className="border-[#1e3048]">
              <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8] text-sm">Klima & Energie</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <SliderRow label="CO₂-Preis" infoKey="co2Preis" value={co2Preis} defaultValue={60} min={0} max={250} unit=" €/t" onChange={setCo2Preis} onInfo={setInfoKey} />
                <SliderRow label="Windkraftausbau" infoKey="windausbau" value={windausbau} defaultValue={100} min={0} max={200} unit="%" onChange={setWindausbau} onInfo={setInfoKey} />
                <SliderRow label="Solarausbau" infoKey="solarausbau" value={solarausbau} defaultValue={100} min={0} max={200} unit="%" onChange={setSolarausbau} onInfo={setInfoKey} />
                <RadioRow
                  label="Atomkraft"
                  infoKey="atomkraft"
                  value={atomkraft}
                  options={[
                    { value: "ausstieg",     label: "Ausstieg" },
                    { value: "statusquo",    label: "Status quo" },
                    { value: "verlaengerung",label: "Laufzeitverlängerung" },
                    { value: "neubau",       label: "Neubau zulassen" },
                  ]}
                  onChange={setAtomkraft}
                  onInfo={setInfoKey}
                />
                {atomkraft === "neubau" && (
                  <p className="text-[10px] text-[#e05c5c] flex items-start gap-1">
                    <AlertTriangle size={10} className="mt-0.5 shrink-0" />
                    Neubau kostet 10–25 Mrd. € pro Reaktor und dauert 20+ Jahre. Kurzfristiger Ausgabenanstieg modelliert.
                  </p>
                )}
                <RadioRow
                  label="Kohleausstieg"
                  infoKey="kohleausstieg"
                  value={kohleausstieg}
                  options={[
                    { value: "2030",  label: "2030" },
                    { value: "2035",  label: "2035" },
                    { value: "2038",  label: "2038" },
                    { value: "offen", label: "Offen" },
                  ]}
                  onChange={setKohleausstieg}
                  onInfo={setInfoKey}
                />
              </AccordionContent>
            </AccordionItem>

            {/* ── Wohnen ── */}
            <AccordionItem value="item-8" className="border-[#1e3048]">
              <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8] text-sm">Wohnen</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <SliderRow label="Sozialwohnungen" infoKey="sozialwohnungen" value={sozialwohnungen} defaultValue={30} min={0} max={250} unit="k/J" onChange={setSozialwohnungen} onInfo={setInfoKey} />
                <p className="text-[10px] text-[#8faabb] -mt-2">Status quo: ~30k/J. Ziel Bundesregierung: 100k/J. Bindungsauslauf ~50k/J.</p>
                <ToggleRow label="Mietpreisbremse" infoKey="mietpreisbremse" value={mietpreisbremse} onChange={setMietpreisbremse} onInfo={setInfoKey} />
                {mietpreisbremse && (
                  <p className="text-[10px] text-[#f5a623] -mt-2 flex items-start gap-1">
                    <AlertTriangle size={10} className="mt-0.5 shrink-0" />
                    Kurzfristig entlastend, langfristig kann Neubau gehemmt werden.
                  </p>
                )}
                <SliderRow label="Wohngeld-Erhöhung" infoKey="wohngeld" value={wohngeld} defaultValue={0} min={0} max={100} unit="%" onChange={setWohngeld} onInfo={setInfoKey} />
              </AccordionContent>
            </AccordionItem>

            {/* ── Bildung ── */}
            <AccordionItem value="item-9" className="border-[#1e3048]">
              <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8] text-sm">Bildung</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <p className="text-[10px] text-[#f5a623] flex items-start gap-1">
                  <AlertTriangle size={10} className="mt-0.5 shrink-0" />
                  Wachstumseffekte wirken mit 5–10 Jahren Verzögerung. Hier als mittelfristiger Modellannahme dargestellt.
                </p>
                <SliderRow label="Bildungsausgaben" infoKey="bildungsausgaben" value={bildungsausgaben} defaultValue={4.3} min={3.0} max={8.0} step={0.1} unit="% BIP" onChange={setBildungsausgaben} onInfo={setInfoKey} />
                <SliderRow label="Kita-Ausbau" infoKey="kitaAusbau" value={kitaAusbau} defaultValue={0} min={0} max={100} unit="%" onChange={setKitaAusbau} onInfo={setInfoKey} />
                <SliderRow label="BAföG-Erhöhung"   infoKey="bafoeg"        value={bafoeg}          defaultValue={0}   min={0} max={100} unit="%" onChange={setBafoeg}        onInfo={setInfoKey} />
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>

        {/* ═══ RIGHT PANEL ═══ */}
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
               : trust >= 40 ? "Mehrere Parameter mit mittlerer oder geringer Evidenz aktiv — Ergebnisse mit Vorsicht interpretieren."
               : "Viele unsichere Parameter aktiv — Ergebnisse sind stark spekulativ."}
            </p>
          </div>

          {/* ── Direkte Fiskalwirkung ── */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#00c8b4] mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#00c8b4] rounded" />
              Direkte Fiskalwirkung
              <Badge className="bg-[#4caf82] text-white text-[10px]">LIVE</Badge>
              <span className="text-[10px] text-[#8faabb] font-normal ml-auto capitalize">Szenario: {scenario}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]" data-testid="card-kpi-haushaltsdefizit">
                <div className="text-[#8faabb] text-xs mb-1">{defizitLabel}</div>
                <div className="text-lg font-bold mb-2" style={{ color: defizit >= 0 ? "#4caf82" : "#e05c5c" }}>{fmtDef(defizit)} Mrd.</div>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[10px]"><span className="text-[#4caf82]">Opt.</span><span className="text-[#4caf82]">{fmtDef(kpiOpt.defizit)} Mrd.</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#00c8b4]">Real.</span><span className="text-[#00c8b4]">{fmtDef(kpiReal.defizit)} Mrd.</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#e05c5c]">Pess.</span><span className="text-[#e05c5c]">{fmtDef(kpiPess.defizit)} Mrd.</span></div>
                </div>
              </div>
              <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]" data-testid="card-kpi-steueraufkommen">
                <div className="text-[#8faabb] text-xs mb-1">Steueraufkommen</div>
                <div className="text-lg font-bold mb-2" style={{ color: steuer >= 948 ? "#4caf82" : "#e05c5c" }}>{steuer.toFixed(0)} Mrd.</div>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[10px]"><span className="text-[#4caf82]">Opt.</span><span className="text-[#4caf82]">{kpiOpt.steuer.toFixed(0)} Mrd.</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#00c8b4]">Real.</span><span className="text-[#00c8b4]">{kpiReal.steuer.toFixed(0)} Mrd.</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#e05c5c]">Pess.</span><span className="text-[#e05c5c]">{kpiPess.steuer.toFixed(0)} Mrd.</span></div>
                </div>
              </div>
              <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]">
                <div className="text-[#8faabb] text-xs mb-1">Investitionsspielraum</div>
                <div className="text-lg font-bold mb-2" style={{ color: schdbInvest > 0 ? "#4caf82" : "#8faabb" }}>
                  {schdbInvest > 0 ? `+${schdbInvest} Mrd.` : "Aktive Bremse"}
                </div>
                <div className="text-[10px] text-[#8faabb]">
                  {schuldenbremse === "aktuell" ? "Schuldenbremse begrenzt Neuverschuldung auf 0,35% BIP" : `Schuldenbremse ${schuldenbremse} — Netto nach Zinsen`}
                </div>
              </div>
            </div>
          </section>

          {/* ── Volkswirtschaftliche Wirkung ── */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#f5a623] mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#f5a623] rounded" />
              Volkswirtschaftliche Wirkung
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]" data-testid="card-kpi-wirtschaftswachstum">
                <div className="text-[#8faabb] text-xs mb-1">Wirtschaftswachstum</div>
                <div className="text-lg font-bold mb-2" style={{ color: wachstum >= 1.0 ? "#4caf82" : wachstum >= 0 ? "#f5a623" : "#e05c5c" }}>{fmtW(wachstum)} BIP</div>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[10px]"><span className="text-[#4caf82]">Opt.</span><span className="text-[#4caf82]">{fmtW(kpiOpt.wachstum)}</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#00c8b4]">Real.</span><span className="text-[#00c8b4]">{fmtW(kpiReal.wachstum)}</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#e05c5c]">Pess.</span><span className="text-[#e05c5c]">{fmtW(kpiPess.wachstum)}</span></div>
                </div>
              </div>
              <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]" data-testid="card-kpi-arbeitslosenquote">
                <div className="text-[#8faabb] text-xs mb-1">Arbeitslosenquote</div>
                <div className="text-lg font-bold mb-2" style={{ color: alq <= 5.0 ? "#4caf82" : alq <= 6.0 ? "#f5a623" : "#e05c5c" }}>{alq.toFixed(1)}%</div>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[10px]"><span className="text-[#4caf82]">Opt.</span><span className="text-[#4caf82]">{kpiOpt.alq.toFixed(1)}%</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#00c8b4]">Real.</span><span className="text-[#00c8b4]">{kpiReal.alq.toFixed(1)}%</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#e05c5c]">Pess.</span><span className="text-[#e05c5c]">{kpiPess.alq.toFixed(1)}%</span></div>
                </div>
              </div>
              <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]" data-testid="card-kpi-fachkräftemangel">
                <div className="text-[#8faabb] text-xs mb-1">Fachkräftemangel</div>
                <div className="text-lg font-bold mb-2" style={{ color: fachluecke < 600 ? "#4caf82" : fachluecke < 800 ? "#f5a623" : "#e05c5c" }}>{fachluecke.toFixed(0)}k Stellen</div>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[10px]"><span className="text-[#4caf82]">Opt.</span><span className="text-[#4caf82]">{kpiOpt.fachluecke.toFixed(0)}k</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#00c8b4]">Real.</span><span className="text-[#00c8b4]">{kpiReal.fachluecke.toFixed(0)}k</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#e05c5c]">Pess.</span><span className="text-[#e05c5c]">{kpiPess.fachluecke.toFixed(0)}k</span></div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Gesellschaftliche Wirkung ── */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#8faabb] mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#8faabb] rounded" />
              Gesellschaftliche Wirkung
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]" data-testid="card-kpi-rentenkosten">
                <div className="text-[#8faabb] text-xs mb-1">Rentenkosten</div>
                <div className="text-lg font-bold mb-2" style={{ color: rentenKosten < 362 ? "#4caf82" : rentenKosten > 380 ? "#e05c5c" : "#f0f4f8" }}>{rentenKosten.toFixed(0)} Mrd.</div>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[10px]"><span className="text-[#4caf82]">Opt.</span><span className="text-[#4caf82]">{kpiOpt.rentenKosten.toFixed(0)} Mrd.</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#00c8b4]">Real.</span><span className="text-[#00c8b4]">{kpiReal.rentenKosten.toFixed(0)} Mrd.</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#e05c5c]">Pess.</span><span className="text-[#e05c5c]">{kpiPess.rentenKosten.toFixed(0)} Mrd.</span></div>
                </div>
              </div>
              <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]">
                <div className="text-[#8faabb] text-xs mb-1">Gesundheitskosten</div>
                <div className="text-lg font-bold mb-2 text-[#f0f4f8]">468 Mrd.</div>
                <div className="text-[10px] text-[#8faabb]">Statisch — Demografieeffekte nicht modelliert</div>
                <div className="text-[10px] text-[#8faabb] mt-1">Quelle: BMG · Feb 2024</div>
              </div>
              <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]">
                <div className="text-[#8faabb] text-xs mb-1">Schulden pro Kopf</div>
                <div className="text-lg font-bold mb-2 text-[#e05c5c]">29.100 €</div>
                <div className="text-[10px] text-[#8faabb]">2.445 Mrd. ÷ 84,7 Mio. Einwohner</div>
              </div>
            </div>
          </section>

          {/* ── Klima & Energie ── */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#4caf82] mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#4caf82] rounded" />
              Klima &amp; Energie
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]">
                <div className="text-[#8faabb] text-xs mb-1">CO₂-Emissionen</div>
                <div className="text-lg font-bold mb-2" style={{ color: co2Emissionen < 500 ? "#4caf82" : co2Emissionen < 650 ? "#f5a623" : "#e05c5c" }}>
                  {co2Emissionen.toFixed(0)} Mt/J.
                </div>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[10px]"><span className="text-[#4caf82]">Opt.</span><span className="text-[#4caf82]">{kpiOpt.co2Emissionen.toFixed(0)} Mt</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#00c8b4]">Real.</span><span className="text-[#00c8b4]">{kpiReal.co2Emissionen.toFixed(0)} Mt</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#e05c5c]">Pess.</span><span className="text-[#e05c5c]">{kpiPess.co2Emissionen.toFixed(0)} Mt</span></div>
                </div>
                <div className="text-[10px] text-[#8faabb] mt-1">Status quo: 670 Mt (2023). Klima-Ziel 2030: ~340 Mt</div>
              </div>
              <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]">
                <div className="text-[#8faabb] text-xs mb-1">Strompreis (Haushalte)</div>
                <div className="text-lg font-bold mb-2" style={{ color: strompreis < 28 ? "#4caf82" : strompreis < 35 ? "#f5a623" : "#e05c5c" }}>
                  {strompreis.toFixed(1)} ct/kWh
                </div>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[10px]"><span className="text-[#4caf82]">Opt.</span><span className="text-[#4caf82]">{kpiOpt.strompreis.toFixed(1)} ct/kWh</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#00c8b4]">Real.</span><span className="text-[#00c8b4]">{kpiReal.strompreis.toFixed(1)} ct/kWh</span></div>
                  <div className="flex justify-between text-[10px]"><span className="text-[#e05c5c]">Pess.</span><span className="text-[#e05c5c]">{kpiPess.strompreis.toFixed(1)} ct/kWh</span></div>
                </div>
                <div className="text-[10px] text-[#8faabb] mt-1">Status quo: ~32 ct/kWh (2024). Quelle: BDEW</div>
              </div>
              <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]">
                <div className="text-[#8faabb] text-xs mb-1">CO₂-Steuereinnahmen</div>
                <div className="text-lg font-bold mb-2" style={{ color: co2Preis > 60 ? "#4caf82" : co2Preis < 30 ? "#e05c5c" : "#f0f4f8" }}>
                  {((co2Preis - 60) * 0.018 + 11).toFixed(1)} Mrd.
                </div>
                <div className="text-[10px] text-[#8faabb]">ETS + nBEHS-Einnahmen. Baseline ~11 Mrd. bei 60 €/t.</div>
                <div className="text-[10px] text-[#8faabb] mt-1">Quelle: Umweltbundesamt · Mär 2024</div>
              </div>
            </div>
          </section>

          {/* ── Wohnen ── */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#00c8b4] mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#00c8b4] rounded" />
              Wohnen
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]">
                <div className="text-[#8faabb] text-xs mb-1">Mietniveau-Index</div>
                <div className="text-lg font-bold mb-2" style={{ color: mietindex < 95 ? "#4caf82" : mietindex < 100 ? "#f5a623" : "#e05c5c" }}>
                  {mietindex.toFixed(0)} / 100
                </div>
                <div className="text-[10px] text-[#8faabb]">100 = Status quo. Niedrigerer Wert = günstigeres Mietniveau.</div>
                <div className="text-[10px] text-[#8faabb] mt-1">Quelle: Institut Pestel / BMWSB 2024</div>
              </div>
              <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]">
                <div className="text-[#8faabb] text-xs mb-1">Wohnraumdefizit</div>
                <div className="text-lg font-bold mb-2" style={{ color: wohnraumdef < 400 ? "#4caf82" : wohnraumdef < 600 ? "#f5a623" : "#e05c5c" }}>
                  {wohnraumdef.toFixed(0)}k Einheiten
                </div>
                <div className="text-[10px] text-[#8faabb]">Status quo: ~700k fehlende Wohneinheiten (IW Köln 2024).</div>
                <div className="text-[10px] text-[#8faabb] mt-1">Quelle: IW Köln / Pestel-Institut · Jan 2024</div>
              </div>
            </div>
          </section>

          {/* ── Bildung & Langfrist ── */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#f5a623] mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#f5a623] rounded" />
              Bildung &amp; Langfrist
              <Badge className="bg-[#3d2d0a] text-[#f5a623] border border-[#f5a623]/30 text-[10px]">5–10 Jahres-Horizont</Badge>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]">
                <div className="text-[#8faabb] text-xs mb-1">Bildungsausgaben</div>
                <div className="text-lg font-bold mb-1 text-[#f0f4f8]">{bildungsausgaben.toFixed(1)}% BIP</div>
                <div className="text-xs mb-2" style={{ color: bildungsausgaben >= 5.5 ? "#4caf82" : bildungsausgaben >= 4.3 ? "#f5a623" : "#e05c5c" }}>
                  = {((bildungsausgaben / 100) * 4306).toFixed(0)} Mrd. €/Jahr
                </div>
                <div className="text-[10px] text-[#8faabb]">OECD-Schnitt: ~5,5%. Deutschland: ~4,3%. Finnland: ~5,5%.</div>
                <div className="text-[10px] text-[#8faabb] mt-1">Quelle: OECD Education at a Glance 2023</div>
              </div>
              <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]">
                <div className="text-[#8faabb] text-xs mb-1">Langfrist-Effekt (Prognose)</div>
                <div className="space-y-1.5 mt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#8faabb]">Wachstum (mittelfristig)</span>
                    <span className={((bildungsausgaben - 4.3) * 0.015 + kitaAusbau * 0.0008) > 0 ? "text-[#4caf82]" : "text-[#8faabb]"}>
                      +{((bildungsausgaben - 4.3) * 0.015 + kitaAusbau * 0.0008).toFixed(2)}% BIP/J.
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#8faabb]">Fachkräftelücke (10J.)</span>
                    <span className={(bildungsausgaben - 4.3) * 60 > 0 ? "text-[#4caf82]" : "text-[#8faabb]"}>
                      −{Math.max(0,(bildungsausgaben - 4.3) * 60).toFixed(0)}k Stellen
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-[#f5a623] mt-2 flex items-start gap-1">
                  <AlertTriangle size={10} className="mt-0.5 shrink-0" />
                  Hohe Unsicherheit. Effekte wirken mit 5–10 Jahren Verzögerung. Quelle: OECD / IZA Meta-Analyse
                </div>
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
                <div key={item.label} className="bg-[#0d1b2a] p-3 rounded border border-[#1e3048]">
                  <div className="mb-2">{item.icon}</div>
                  <div className="text-xs text-[#8faabb] mb-0.5">{item.label}</div>
                  <div className="text-sm font-bold text-[#f0f4f8]">{item.val}</div>
                  <div className={`text-xs mt-1 font-medium ${item.pos ? "text-[#4caf82]" : "text-[#e05c5c]"}`}>{item.delta}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dein Deutschland */}
          <div className="bg-[#1a2b3c] rounded border border-[#1e3048] p-5">
            <h3 className="font-bold text-base mb-4 flex items-center gap-2">
              <span className="text-[#00c8b4] text-lg leading-none">▣</span>
              Dein Deutschland
            </h3>
            <div className="space-y-2 mb-4">
              {[
                { label: "Haushaltsdefizit",    val: `${fmtDef(defizit)} Mrd.`,                                                           pos: defizit >= 0 },
                { label: "Steueraufkommen",     val: `${steuer.toFixed(0)} Mrd.`,                                                          pos: steuer >= 948 },
                { label: "Wirtschaftswachstum", val: fmtW(wachstum),                                                                       pos: wachstum >= 0.8 },
                { label: "CO₂-Emissionen",      val: `${co2Emissionen.toFixed(0)} Mt`,                                                    pos: co2Emissionen < 670 },
                { label: "Mietniveau",          val: `Index ${mietindex.toFixed(0)}`,                                                      pos: mietindex < 100 },
                { label: "Bildungsausgaben",    val: `${bildungsausgaben.toFixed(1)}% BIP`,                                                pos: bildungsausgaben >= 5.0 },
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
                <span className="text-[#f5a623]">Demografischer Druck auf Rentensystem und Gesundheitskosten nicht modelliert. Bildungseffekte wirken langfristig.</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
