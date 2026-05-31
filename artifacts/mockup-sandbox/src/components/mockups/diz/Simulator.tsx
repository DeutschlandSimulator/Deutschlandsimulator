import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Info, X, CheckCircle2, AlertTriangle, XCircle, TrendingUp, TrendingDown, Users, Wallet, HeartPulse, Briefcase, ShoppingCart, Building2, ChevronRight } from "lucide-react";

type EvidenzLevel = "hoch" | "mittel" | "gering";
type ScenarioMode = "optimistisch" | "realistisch" | "pessimistisch";

interface SliderInfo {
  titel: string;
  beschreibung: string;
  aktuellerWert: string;
  berechnungslogik: string;
  annahmen: string[];
  quellen: { name: string; url: string; aktualisiert: string }[];
  evidenz: EvidenzLevel;
  evidenzHinweis: string;
}

const SLIDER_INFO: Record<string, SliderInfo> = {
  beamte: {
    titel: "Anzahl Beamte",
    beschreibung: "Gesamtzahl der Beamtinnen und Beamten im Bundesdienst sowie in Landes- und Kommunaldiensten. Beamte sind unkündbar und erhalten Pensionen statt Renten.",
    aktuellerWert: "4.900.000",
    berechnungslogik: "Personalkosten = Anzahl × Ø-Jahresgehalt (58.400 €) + Versorgungsrückstellungen (23%). Einsparungen bei Reduzierung werden mit 3-jähriger Verzögerung wirksam.",
    annahmen: ["Ø-Jahresgehalt konstant bei 58.400 €", "Versorgungsquote 23% des Bruttogehalts", "Keine Neueinstellungen bei Reduzierung", "Natürliche Fluktuation 2,1% p.a."],
    quellen: [
      { name: "Statistisches Bundesamt", url: "https://destatis.de", aktualisiert: "Jan 2024" },
      { name: "Bundesministerium des Innern", url: "https://bmi.bund.de", aktualisiert: "Dez 2023" },
    ],
    evidenz: "hoch",
    evidenzHinweis: "Sehr gut belegte Kostenschätzungen, gestützt durch Destatis-Daten.",
  },
  ministerien: {
    titel: "Anzahl Bundesministerien",
    beschreibung: "Anzahl der Bundesministerien beeinflusst Verwaltungskosten, politische Koordinationsaufwände und bürokratischen Overhead.",
    aktuellerWert: "16",
    berechnungslogik: "Einsparung pro Ministerium: ~120 Mio. € (Personal, Gebäude, IT). Fusionskosten einmalig ~40 Mio. € pro Zusammenlegung.",
    annahmen: ["120 Mio. € Kostendurchschnitt pro Ministerium", "Einmalige Fusionskosten werden über 5 Jahre abgeschrieben"],
    quellen: [
      { name: "Bundeshaushalt.de", url: "https://bundeshaushalt.de", aktualisiert: "Feb 2024" },
    ],
    evidenz: "mittel",
    evidenzHinweis: "Schätzungen basieren auf historischen Fusionen; Effizienzgewinne sind unsicher.",
  },
  verteidigung: {
    titel: "Verteidigungsausgaben (% BIP)",
    beschreibung: "Anteil des Bruttoinlandsprodukts, der für die Bundeswehr und Verteidigungsinfrastruktur ausgegeben wird. NATO-Ziel liegt bei 2% BIP.",
    aktuellerWert: "2,0% BIP = 79,8 Mrd. €",
    berechnungslogik: "BIP Deutschland 2024: ~3,99 Bio. €. 1% BIP entspricht ~39,9 Mrd. €. Zusätzliche Ausgaben wirken sich direkt auf das Haushaltsdefizit aus.",
    annahmen: ["BIP 2024: 3,99 Bio. €", "Lineare Skalierung der Kosten", "Rüstungsindustrie-Multiplikator: 1,3 auf BIP"],
    quellen: [
      { name: "Bundesministerium der Verteidigung", url: "https://bmvg.de", aktualisiert: "Mär 2024" },
      { name: "NATO-Statistik", url: "https://nato.int", aktualisiert: "Feb 2024" },
    ],
    evidenz: "hoch",
    evidenzHinweis: "NATO-Berechnungsmethode ist standardisiert und international vergleichbar.",
  },
  entwicklung: {
    titel: "Entwicklungshilfe (% BIP)",
    beschreibung: "Deutsche Entwicklungszusammenarbeit (ODA). Das UN-Ziel liegt bei 0,7% BIP. Deutschland erfüllt es aktuell nicht vollständig.",
    aktuellerWert: "0,4% BIP = ca. 16 Mrd. €",
    berechnungslogik: "Direkte Haushaltswirkung: linearer Zusammenhang. Indirekte Effekte (Stabilität, Handelschancen) sind nicht modelliert.",
    annahmen: ["Lineare Haushaltswirkung", "Keine Modellierung indirekter Rückflüsse"],
    quellen: [
      { name: "BMZ – Bundesministerium für wirtschaftliche Zusammenarbeit", url: "https://bmz.de", aktualisiert: "Jan 2024" },
      { name: "OECD DAC", url: "https://oecd.org", aktualisiert: "Mär 2024" },
    ],
    evidenz: "hoch",
    evidenzHinweis: "Haushaltswirkung direkt ableitbar; Entwicklungseffekte unsicher.",
  },
  fluechtlinge: {
    titel: "Flüchtlingsaufnahme (pro Jahr)",
    beschreibung: "Anzahl der jährlich aufgenommenen Asylsuchenden. Beeinflusst Integrationskosten, Sozialausgaben, langfristig aber auch Fachkräfteangebot und BIP.",
    aktuellerWert: "180.000 / Jahr (2023)",
    berechnungslogik: "Kosten: ~18.000 € pro Person/Jahr (Unterbringung, Sozialleistungen, Verwaltung). Langfristig: 60% Erwerbsquote nach 5 Jahren, Steuereinnahmen berücksichtigt.",
    annahmen: ["18.000 € Kosten/Person/Jahr", "60% Erwerbsquote nach 5 Jahren", "Ø-Steuer/Sozialbeitrag nach Integration: 9.200 €/Jahr"],
    quellen: [
      { name: "Bundesamt für Migration und Flüchtlinge (BAMF)", url: "https://bamf.de", aktualisiert: "Mär 2024" },
      { name: "IAB-Forschungsbericht", url: "https://iab.de", aktualisiert: "Dez 2023" },
    ],
    evidenz: "mittel",
    evidenzHinweis: "Kurzfristkosten gut belegt; Langfristeffekte stark von Integrationspolitik abhängig.",
  },
  fachkraefte: {
    titel: "Fachkräftezuwanderung (pro Jahr)",
    beschreibung: "Gezielte Einwanderung qualifizierter Arbeitskräfte aus Nicht-EU-Ländern. Fachkräftemangel kostet Deutschland aktuell ~100 Mrd. € jährlich an entgangenem BIP-Wachstum.",
    aktuellerWert: "200.000 / Jahr (Ziel 2024)",
    berechnungslogik: "BIP-Effekt: +0,08% BIP pro 100k Fachkräfte. Steuereinnahmen: Ø 14.500 € pro qualifizierter Arbeitskraft/Jahr. Integrationskosten: ~8.000 € im ersten Jahr.",
    annahmen: ["Ø-Bruttolohn qualifiziert: 52.000 €/Jahr", "Sofortige Erwerbstätigkeit angenommen", "Fachkräftemangel-Gap: 890k Stellen"],
    quellen: [
      { name: "Bundesagentur für Arbeit", url: "https://arbeitsagentur.de", aktualisiert: "Feb 2024" },
      { name: "OECD Migration Outlook", url: "https://oecd.org", aktualisiert: "Jan 2024" },
    ],
    evidenz: "hoch",
    evidenzHinweis: "Starke empirische Basis durch IAB und OECD-Studien.",
  },
  buergergeld: {
    titel: "Bürgergeld (EUR/Monat)",
    beschreibung: "Grundsicherung für Arbeitsuchende. Ersetzt seit 2023 Hartz IV. Beeinflusst Arbeitsanreize, Armut und Staatsausgaben.",
    aktuellerWert: "502 EUR/Monat (Regelsatz 2024)",
    berechnungslogik: "Gesamtkosten: Empfänger × 12 × Regelsatz. Aktuell: 5,5 Mio. Empfänger. Arbeitsangebotseffekt: -0,3% pro 10% Erhöhung (IAB-Schätzung).",
    annahmen: ["5,5 Mio. Empfänger konstant", "Elastizität Arbeitsangebot: -0,3 pro 10% Erhöhung", "Keine Veränderung Vermittlungsquote"],
    quellen: [
      { name: "Bundesagentur für Arbeit", url: "https://arbeitsagentur.de", aktualisiert: "Jan 2024" },
      { name: "IAB – Institut für Arbeitsmarkt- und Berufsforschung", url: "https://iab.de", aktualisiert: "Feb 2024" },
    ],
    evidenz: "mittel",
    evidenzHinweis: "Arbeitsangebotseffekte sind wissenschaftlich umstritten; Schätzband ±50%.",
  },
  rentenalter: {
    titel: "Renteneintrittsalter",
    beschreibung: "Regelaltersgrenze für den Renteneintritt. Beeinflusst Fachkräfteangebot, Rentenkosten und Altersarmut. Derzeit schrittweise Anhebung auf 67.",
    aktuellerWert: "67 Jahre (Regelgrenze 2031)",
    berechnungslogik: "Pro Jahr Erhöhung: ~18,5 Mrd. € weniger Rentenausgaben. Gleichzeitig +200k Erwerbspersonen im Markt, BIP +0,3%.",
    annahmen: ["18,5 Mrd. € Einsparung pro Jahr Anhebung", "Keine Erhöhung der Erwerbsminderungsrenten eingerechnet", "Gesundheitliche Arbeitsfähigkeit bis 70 angenommen"],
    quellen: [
      { name: "Deutsche Rentenversicherung Bund", url: "https://drv-bund.de", aktualisiert: "Mär 2024" },
      { name: "Sachverständigenrat Wirtschaft", url: "https://sachverstaendigenrat-wirtschaft.de", aktualisiert: "Nov 2023" },
    ],
    evidenz: "hoch",
    evidenzHinweis: "Fiskalische Effekte sehr gut modelliert; soziale Verteilungswirkung kontrovers.",
  },
  einkommensteuer: {
    titel: "Einkommensteuer Spitzensatz",
    beschreibung: "Gilt ab einem zu versteuernden Einkommen von 66.761 €/Jahr. Beeinflusst Steueraufkommen, Leistungsanreize und Einkommensverteilung.",
    aktuellerWert: "42% (+ 5,5% Solidaritätszuschlag für Spitzenverdiener)",
    berechnungslogik: "Steueraufkommen-Änderung: ca. 3,2 Mrd. € pro Prozentpunkt. Verhaltensanpassung (Laffer-Effekt) ab ~50% eingerechnet: Elastizität −0,2.",
    annahmen: ["3,2 Mrd. EUR je Prozentpunkt", "Elastizität steuerpflichtiges Einkommen: −0,2", "Laffer-Kurven-Effekt ab 50% modelliert"],
    quellen: [
      { name: "Bundesministerium der Finanzen", url: "https://bundesfinanzministerium.de", aktualisiert: "Feb 2024" },
      { name: "IW Köln – Steuerreportstudie", url: "https://iwkoeln.de", aktualisiert: "Jan 2024" },
    ],
    evidenz: "mittel",
    evidenzHinweis: "Kurzfristeffekte gut belegt; Verhaltensanpassungen langfristig unsicher.",
  },
};

const scenarioMultipliers: Record<ScenarioMode, number> = {
  optimistisch: 1.3,
  realistisch: 1.0,
  pessimistisch: 0.65,
};

const partyProfiles = [
  { name: "CDU/CSU", farbe: "#1d3a6e", abk: "CDU", beamte: 4700, ministerien: 14, verteidigung: 2.5, fachkraefte: 250, buergergeld: 450, rentenalter: 68, einkommensteuer: 40, vermoegenssteuer: false },
  { name: "SPD",     farbe: "#c0392b", abk: "SPD", beamte: 5000, ministerien: 17, verteidigung: 2.0, fachkraefte: 300, buergergeld: 560, rentenalter: 67, einkommensteuer: 45, vermoegenssteuer: false },
  { name: "FDP",     farbe: "#f0c040", abk: "FDP", beamte: 4200, ministerien: 12, verteidigung: 2.0, fachkraefte: 400, buergergeld: 420, rentenalter: 69, einkommensteuer: 35, vermoegenssteuer: false },
  { name: "Grüne",   farbe: "#2ecc71", abk: "GRÜ", beamte: 5200, ministerien: 18, verteidigung: 1.5, fachkraefte: 350, buergergeld: 620, rentenalter: 67, einkommensteuer: 48, vermoegenssteuer: true },
  { name: "AfD",     farbe: "#16a085", abk: "AfD", beamte: 4000, ministerien: 12, verteidigung: 3.0, fachkraefte: 80,  buergergeld: 400, rentenalter: 65, einkommensteuer: 38, vermoegenssteuer: false },
  { name: "Linke",   farbe: "#8e44ad", abk: "LNK", beamte: 5800, ministerien: 20, verteidigung: 1.0, fachkraefte: 200, buergergeld: 700, rentenalter: 63, einkommensteuer: 53, vermoegenssteuer: true },
];

function EvidenzBadge({ level }: { level: EvidenzLevel }) {
  const map = {
    hoch:   { label: "Hohe Evidenz",    cls: "bg-[#1a3d2b] text-[#4caf82] border border-[#4caf82]/40" },
    mittel: { label: "Mittlere Evidenz",cls: "bg-[#3d2d0a] text-[#f5a623] border border-[#f5a623]/40" },
    gering: { label: "Hohe Unsicherheit",cls:"bg-[#3d1515] text-[#e05c5c] border border-[#e05c5c]/40" },
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[level].cls}`}>{map[level].label}</span>;
}

function InfoPanelView({ info, onClose }: { info: SliderInfo; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-[420px] h-full bg-[#1a2b3c] border-l border-[#1e3048] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-[#1e3048] sticky top-0 bg-[#1a2b3c] z-10">
          <h3 className="font-bold text-lg text-[#f0f4f8]">{info.titel}</h3>
          <button onClick={onClose} className="text-[#8faabb] hover:text-[#f0f4f8] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <p className="text-[#8faabb] text-sm leading-relaxed">{info.beschreibung}</p>
          </div>

          <div className="bg-[#0d1b2a] rounded p-4 border border-[#1e3048]">
            <div className="text-xs font-semibold text-[#00c8b4] uppercase tracking-widest mb-1">Aktueller Wert</div>
            <div className="text-xl font-bold text-[#f0f4f8]">{info.aktuellerWert}</div>
          </div>

          <div>
            <div className="text-xs font-semibold text-[#8faabb] uppercase tracking-widest mb-2">Berechnungslogik</div>
            <p className="text-[#f0f4f8] text-sm leading-relaxed bg-[#0d1b2a] rounded p-3 border border-[#1e3048] font-mono">
              {info.berechnungslogik}
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold text-[#8faabb] uppercase tracking-widest mb-2">Annahmen</div>
            <ul className="space-y-1.5">
              {info.annahmen.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#f0f4f8]">
                  <span className="text-[#00c8b4] mt-0.5 shrink-0">›</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-[#8faabb] uppercase tracking-widest mb-2">Datenquellen</div>
            <div className="space-y-2">
              {info.quellen.map((q, i) => (
                <div key={i} className="flex items-center justify-between bg-[#0d1b2a] rounded px-3 py-2 border border-[#1e3048]">
                  <div>
                    <div className="text-sm text-[#f0f4f8] font-medium">{q.name}</div>
                    <div className="text-xs text-[#8faabb]">Aktualisiert: {q.aktualisiert}</div>
                  </div>
                  <ChevronRight size={14} className="text-[#00c8b4]" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-[#8faabb] uppercase tracking-widest mb-2">Evidenz-Level</div>
            <div className="flex items-start gap-3">
              <EvidenzBadge level={info.evidenz} />
              <p className="text-xs text-[#8faabb] leading-relaxed flex-1">{info.evidenzHinweis}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderRow({ label, infoKey, value, min, max, step = 1, unit, onChange, onInfo }: {
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
            <button onClick={() => onInfo(infoKey)} className="text-[#8faabb] hover:text-[#00c8b4] transition-colors">
              <Info size={13} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className="bg-[#243447] text-[#00c8b4] border-[#1e3048] text-xs py-0">{value}{unit}</Badge>
          {info && <EvidenzDot level={info.evidenz} />}
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#00c8b4] h-1.5" />
    </div>
  );
}

function EvidenzDot({ level }: { level: EvidenzLevel }) {
  const colors = { hoch: "bg-[#4caf82]", mittel: "bg-[#f5a623]", gering: "bg-[#e05c5c]" };
  return <span title={level === "hoch" ? "Hohe Evidenz" : level === "mittel" ? "Mittlere Evidenz" : "Hohe Unsicherheit"}
    className={`w-2 h-2 rounded-full shrink-0 ${colors[level]}`} />;
}

function ToggleRow({ label, infoKey, value, onChange, danger, onInfo }: {
  label: string; infoKey?: string; value: boolean; onChange: (v: boolean) => void; danger?: boolean; onInfo: (k: string) => void;
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
        className={`w-10 h-5 rounded-full relative transition-colors ${value ? (danger ? "bg-[#e05c5c]" : "bg-[#00c8b4]") : "bg-[#1e3048]"}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

const barData = [
  { name: "Soziales", einnahmen: 0, ausgaben: 175 },
  { name: "Verteidigung", einnahmen: 0, ausgaben: 52 },
  { name: "Bildung", einnahmen: 0, ausgaben: 21 },
  { name: "Zinsen", einnahmen: 0, ausgaben: 37 },
  { name: "Sonstiges", einnahmen: 460, ausgaben: 191 },
];
const lineData = [
  { year: "2024", statusQuo: 0.2, simulation: 0.2 },
  { year: "2025", statusQuo: 0.5, simulation: 0.9 },
  { year: "2026", statusQuo: 0.8, simulation: 1.3 },
  { year: "2027", statusQuo: 1.0, simulation: 1.6 },
  { year: "2028", statusQuo: 1.1, simulation: 1.9 },
  { year: "2029", statusQuo: 1.2, simulation: 2.2 },
  { year: "2030", statusQuo: 1.2, simulation: 2.5 },
];

function calcPartyMatch(vals: Record<string, number | boolean>, p: typeof partyProfiles[0]) {
  const fields: [keyof typeof p, number | boolean, number, number][] = [
    ["beamte", vals.beamte, 4200, 6000],
    ["ministerien", vals.ministerien, 10, 25],
    ["verteidigung", vals.verteidigung, 1.0, 3.0],
    ["fachkraefte", vals.fachkraefte, 50, 500],
    ["buergergeld", vals.buergergeld, 400, 700],
    ["rentenalter", vals.rentenalter, 63, 70],
    ["einkommensteuer", vals.einkommensteuer, 30, 55],
  ];
  let score = 0;
  for (const [key, userVal, min, max] of fields) {
    const range = max - min;
    const diff = Math.abs(Number(userVal) - Number(p[key]));
    score += Math.max(0, 1 - diff / range);
  }
  const boolMatch = vals.vermoegenssteuer === p.vermoegenssteuer ? 1 : 0;
  return Math.round(((score + boolMatch) / (fields.length + 1)) * 100);
}

export function Simulator() {
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
  const [erbschaftssteuer, setErbschaftssteuer] = useState(400);

  const [infoKey, setInfoKey] = useState<string | null>(null);
  const [scenario, setScenario] = useState<ScenarioMode>("realistisch");

  const sm = scenarioMultipliers[scenario];
  const vals = { beamte, ministerien, verteidigung, fachkraefte, buergergeld, rentenalter, einkommensteuer, vermoegenssteuer };

  const partyMatches = partyProfiles
    .map((p) => ({ ...p, match: calcPartyMatch(vals, p) }))
    .sort((a, b) => b.match - a.match);

  const defizit = -(34.2 + (verteidigung - 2.0) * 39.9 - (einkommensteuer - 42) * 3.2 * sm).toFixed(1);
  const steuer = (916 + (einkommensteuer - 42) * 3.2 + (fachkraefte - 200) * 0.029 + (vermoegenssteuer ? 9 : 0)).toFixed(0);
  const wachstum = ((0.8 + (fachkraefte - 200) * 0.0008 - (verteidigung - 2.0) * 0.1) * sm).toFixed(1);
  const alq = (5.7 - (fachkraefte - 200) * 0.003 + (buergergeld - 502) * 0.001).toFixed(1);
  const rentenKosten = (362 + (rentenniveau - 48) * 4 - (rentenalter - 67) * 18.5).toFixed(0);

  const reformDelta = {
    ausgaben: -((beamte < 4900 ? (4900 - beamte) * 0.012 : 0) + (ministerien < 16 ? (16 - ministerien) * 0.12 : 0)).toFixed(1),
    steuer: ((einkommensteuer - 42) * 3.2 + (vermoegenssteuer ? 9 : 0)).toFixed(1),
    wachstum,
    alq,
    rente: (rentenniveau - 48).toFixed(0),
  };

  return (
    <div className="bg-[#0d1b2a] min-h-screen text-[#f0f4f8] font-sans flex flex-col">
      {infoKey && SLIDER_INFO[infoKey] && (
        <InfoPanelView info={SLIDER_INFO[infoKey]} onClose={() => setInfoKey(null)} />
      )}

      {/* Scenario bar */}
      <div className="bg-[#0d1b2a] border-b border-[#1e3048] px-6 py-2 flex items-center gap-4">
        <span className="text-xs font-semibold text-[#8faabb] uppercase tracking-widest">Szenario:</span>
        {(["optimistisch", "realistisch", "pessimistisch"] as ScenarioMode[]).map((s) => (
          <button
            key={s}
            onClick={() => setScenario(s)}
            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors capitalize ${
              scenario === s
                ? s === "optimistisch" ? "bg-[#1a3d2b] text-[#4caf82] border border-[#4caf82]/60"
                : s === "realistisch" ? "bg-[#243447] text-[#00c8b4] border border-[#00c8b4]/60"
                : "bg-[#3d1515] text-[#e05c5c] border border-[#e05c5c]/60"
                : "bg-[#1a2b3c] text-[#8faabb] border border-[#1e3048] hover:text-[#f0f4f8]"
            }`}
          >
            {s === "optimistisch" ? "Optimistisch" : s === "realistisch" ? "Realistisch" : "Pessimistisch"}
          </button>
        ))}
        <span className="ml-auto text-xs text-[#8faabb]">Alle Prognosen werden entsprechend angepasst</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="w-[360px] bg-[#1a2b3c] p-4 h-[calc(100vh-41px)] overflow-y-auto border-r border-[#1e3048] shrink-0">
          <div className="flex items-center gap-2 mb-5">
            <h2 className="text-lg font-bold border-b-2 border-[#00c8b4] pb-1 inline-block">Politische Parameter</h2>
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
                <SliderRow label="Beamte" infoKey="beamte" value={beamte} min={4200} max={6000} unit="k" onChange={setBeamte} onInfo={setInfoKey} />
                <SliderRow label="Ministerien" infoKey="ministerien" value={ministerien} min={10} max={25} onChange={setMinisterien} onInfo={setInfoKey} />
                <SliderRow label="Verteidigung" infoKey="verteidigung" value={verteidigung} min={1.0} max={3.0} step={0.1} unit="% BIP" onChange={setVerteidigung} onInfo={setInfoKey} />
                <SliderRow label="Entwicklungshilfe" infoKey="entwicklung" value={entwicklung} min={0.2} max={0.8} step={0.1} unit="% BIP" onChange={setEntwicklung} onInfo={setInfoKey} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-[#1e3048]">
              <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8] text-sm">Migration</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <SliderRow label="Flüchtlingsaufnahme" infoKey="fluechtlinge" value={fluechtlinge} min={50} max={400} unit="k/J" onChange={setFluechtlinge} onInfo={setInfoKey} />
                <SliderRow label="Fachkräftezuwanderung" infoKey="fachkraefte" value={fachkraefte} min={50} max={500} unit="k/J" onChange={setFachkraefte} onInfo={setInfoKey} />
                <ToggleRow label="EU-Zuwanderung frei" value={euZuwanderung} onChange={setEuZuwanderung} onInfo={setInfoKey} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-[#1e3048]">
              <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8] text-sm">Gesundheit</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <ToggleRow label="Einheitsversicherung" value={einheitsversicherung} onChange={setEinheitsversicherung} onInfo={setInfoKey} />
                <ToggleRow label="Privatversicherung abschaffen" value={privatAbschaffen} onChange={setPrivatAbschaffen} danger onInfo={setInfoKey} />
                <SliderRow label="Beitragssatz" infoKey="beitragssatz" value={beitragssatz} min={14} max={18} step={0.1} unit="%" onChange={setBeitragssatz} onInfo={setInfoKey} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border-[#1e3048]">
              <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8] text-sm">Soziales</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <SliderRow label="Bürgergeld" infoKey="buergergeld" value={buergergeld} min={400} max={700} unit=" €" onChange={setBuergergeld} onInfo={setInfoKey} />
                <SliderRow label="Renteneintrittsalter" infoKey="rentenalter" value={rentenalter} min={63} max={70} unit=" J." onChange={setRenteneintrittsalter} onInfo={setInfoKey} />
                <SliderRow label="Rentenniveau" value={rentenniveau} infoKey="rentenniveau" min={40} max={55} unit="%" onChange={setRentenniveau} onInfo={setInfoKey} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5" className="border-[#1e3048]">
              <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8] text-sm">Steuern</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <SliderRow label="Spitzensteuersatz" infoKey="einkommensteuer" value={einkommensteuer} min={30} max={55} step={0.5} unit="%" onChange={setEinkommensteuer} onInfo={setInfoKey} />
                <SliderRow label="Unternehmenssteuer" value={unternehmenssteuer} infoKey="unternehmenssteuer" min={10} max={35} step={0.1} unit="%" onChange={setUnternehmenssteuer} onInfo={setInfoKey} />
                <ToggleRow label="Vermögenssteuer einführen" value={vermoegenssteuer} onChange={setVermoegenssteuer} onInfo={setInfoKey} />
                <SliderRow label="Erbschaft-Freibetrag" value={erbschaftssteuer} infoKey="erbschaftssteuer" min={100} max={1000} step={50} unit="k €" onChange={setErbschaftssteuer} onInfo={setInfoKey} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 p-5 h-[calc(100vh-41px)] overflow-y-auto space-y-6">
          {/* KPI row */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-bold">Echtzeit-Simulation</h2>
              <Badge className="bg-[#4caf82] text-white text-xs">LIVE</Badge>
              <span className="text-xs text-[#8faabb] ml-auto">Szenario: <span className="text-[#00c8b4] font-medium capitalize">{scenario}</span></span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Haushaltsdefizit", val: `${defizit} Mrd.`, col: "#e05c5c", src: "BMF", upd: "Mär 2024" },
                { label: "Staatsverschuldung", val: "2.445 Mrd.", col: "#f0f4f8", src: "Bundesbank", upd: "Feb 2024" },
                { label: "Steueraufkommen", val: `${steuer} Mrd.`, col: "#4caf82", src: "Destatis", upd: "Jan 2024" },
                { label: "Gesundheitskosten", val: "468 Mrd.", col: "#f0f4f8", src: "BMG", upd: "Feb 2024" },
                { label: "Rentenkosten", val: `${rentenKosten} Mrd.`, col: "#f0f4f8", src: "DRV Bund", upd: "Jan 2024" },
                { label: "Arbeitslosenquote", val: `${alq}%`, col: Number(alq) > 5.5 ? "#e05c5c" : "#4caf82", src: "BA", upd: "Mär 2024" },
                { label: "Fachkräftemangel", val: `${Math.max(0, 890 - (fachkraefte - 200) * 1.5).toFixed(0)}k`, col: "#f5a623", src: "IW Köln", upd: "Feb 2024" },
                { label: "Wirtschaftswachstum", val: `+${wachstum}% BIP`, col: "#4caf82", src: "SVR Wirtschaft", upd: "Nov 2023" },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]">
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
          <div className="flex gap-4 h-[220px]">
            <div className="flex-1 bg-[#1a2b3c] p-4 rounded border border-[#1e3048]">
              <h3 className="text-[#8faabb] mb-3 text-xs font-semibold uppercase tracking-widest">Bundeshaushalt: Einnahmen vs. Ausgaben</h3>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
                  <XAxis dataKey="name" stroke="#8faabb" fontSize={11} />
                  <YAxis stroke="#8faabb" fontSize={11} />
                  <RechartsTooltip cursor={{ fill: "#243447" }} contentStyle={{ backgroundColor: "#0d1b2a", borderColor: "#1e3048", fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Bar dataKey="einnahmen" fill="#00c8b4" name="Einnahmen" />
                  <Bar dataKey="ausgaben" fill="#e05c5c" name="Ausgaben" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 bg-[#1a2b3c] p-4 rounded border border-[#1e3048]">
              <h3 className="text-[#8faabb] mb-3 text-xs font-semibold uppercase tracking-widest">Wirtschaftswachstum 2024–2030</h3>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
                  <XAxis dataKey="year" stroke="#8faabb" fontSize={11} />
                  <YAxis stroke="#8faabb" fontSize={11} />
                  <RechartsTooltip contentStyle={{ backgroundColor: "#0d1b2a", borderColor: "#1e3048", fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Line type="monotone" dataKey="statusQuo" stroke="#8faabb" name="Status Quo" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="simulation" stroke="#00c8b4" name="Simulation" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Was bedeutet das für Bürger */}
          <div className="bg-[#1a2b3c] rounded border border-[#1e3048] p-5">
            <h3 className="font-bold text-base mb-4 flex items-center gap-2">
              <Users size={16} className="text-[#00c8b4]" />
              Was bedeutet das für Bürgerinnen und Bürger?
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: <Wallet size={20} className="text-[#4caf82]" />, label: "Nettoeinkommen", val: "2.587 €/Monat", delta: einkommensteuer > 42 ? "−" + ((einkommensteuer-42)*12).toFixed(0) + " €/J." : "+"+((42-einkommensteuer)*12).toFixed(0)+" €/J.", pos: einkommensteuer <= 42 },
                { icon: <HeartPulse size={20} className="text-[#e05c5c]" />, label: "KV-Beitrag", val: beitragssatz.toFixed(1) + "% Lohn", delta: beitragssatz > 14.6 ? "+" + ((beitragssatz-14.6)*25).toFixed(0)+" €/Mon." : "−"+((14.6-beitragssatz)*25).toFixed(0)+" €/Mon.", pos: beitragssatz <= 14.6 },
                { icon: <Building2 size={20} className="text-[#f5a623]" />, label: "Rente (Ø)", val: rentenniveau + "% Lohnniveau", delta: rentenniveau >= 48 ? "+" + (rentenniveau-48)*8 + " €/Mon." : (rentenniveau-48)*8 + " €/Mon.", pos: rentenniveau >= 48 },
                { icon: <Briefcase size={20} className="text-[#00c8b4]" />, label: "Arbeitsmarkt", val: alq + "% Quoten", delta: Number(alq) < 5.7 ? "−"+(5.7-Number(alq)).toFixed(1)+"pp" : "+"+(Number(alq)-5.7).toFixed(1)+"pp", pos: Number(alq) < 5.7 },
                { icon: <TrendingUp size={20} className="text-[#4caf82]" />, label: "Kaufkraft", val: "+"+wachstum+"% Reallohn", delta: "Ø +380 €/J.", pos: true },
                { icon: <ShoppingCart size={20} className="text-[#8faabb]" />, label: "Inflation-Schutz", val: "2,3% (Ziel)", delta: "EZB: 2% Ziel", pos: true },
                { icon: <TrendingDown size={20} className="text-[#e05c5c]" />, label: "Schulden/Kopf", val: "29.100 €", delta: "+180 €/J.", pos: false },
                { icon: <Users size={20} className="text-[#00c8b4]" />, label: "Fachkräftelücke", val: Math.max(0, 890 - (fachkraefte-200)*1.5).toFixed(0) + "k Stellen", delta: fachkraefte > 200 ? "↓ " + ((fachkraefte-200)*1.5).toFixed(0)+"k" : "stagniert", pos: fachkraefte > 200 },
              ].map((item) => (
                <div key={item.label} className="bg-[#0d1b2a] p-3 rounded border border-[#1e3048]">
                  <div className="mb-2">{item.icon}</div>
                  <div className="text-xs text-[#8faabb] mb-0.5">{item.label}</div>
                  <div className="text-sm font-bold text-[#f0f4f8]">{item.val}</div>
                  <div className={`text-xs mt-1 font-medium ${item.pos ? "text-[#4caf82]" : "text-[#e05c5c]"}`}>{item.delta}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dein Deutschland + Party match */}
          <div className="grid grid-cols-2 gap-4">
            {/* Reform-Zusammenfassung */}
            <div className="bg-[#1a2b3c] rounded border border-[#1e3048] p-5">
              <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                <span className="text-[#00c8b4]">▣</span> Dein Deutschland
              </h3>
              <div className="space-y-2 mb-4">
                {[
                  { label: "Staatsausgaben", val: `${reformDelta.ausgaben} Mrd. €`, pos: Number(reformDelta.ausgaben) < 0 },
                  { label: "Steueraufkommen", val: `${Number(reformDelta.steuer) >= 0 ? "+" : ""}${reformDelta.steuer} Mrd. €`, pos: Number(reformDelta.steuer) > 0 },
                  { label: "Wirtschaftswachstum", val: `+${wachstum}%`, pos: true },
                  { label: "Arbeitslosenquote", val: `${alq}%`, pos: Number(alq) < 5.7 },
                  { label: "Rentenniveau", val: `${rentenniveau}%`, pos: rentenniveau >= 48 },
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
                <span className="text-[#00c8b4]">⊞</span> Welche Partei liegt am nächsten?
              </h3>
              <div className="space-y-2.5">
                {partyMatches.map((p) => (
                  <div key={p.name} className="flex items-center gap-3">
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
    </div>
  );
}
