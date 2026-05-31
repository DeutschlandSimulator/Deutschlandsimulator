import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell,
} from "recharts";
import { ChevronDown, ChevronUp, Search, ExternalLink, Filter } from "lucide-react";
import { Layout } from "@/components/Layout";

// ─── Types ────────────────────────────────────────────────────────────────────
type Evidenz       = "hoch" | "mittel" | "gering";
type Verifizierung = "verifiziert" | "teilweise" | "nicht";
type Kategorie     = "Basiswerte" | "Beamte" | "Ministerien" | "Verteidigung" | "Migration" | "Gesundheit" | "Soziales" | "Steuern" | "Wachstum" | "Sonstiges";

interface Sensitivitaet { wert: string; ergebnis: number; einheit: string; }

interface Annahme {
  id: string;
  parameter: string;
  wert: string;
  kategorie: Kategorie;
  quelle: string;
  quellUrl?: string;
  jahr: string;
  letzteUeberpruefung: string;
  datenherkunft: string;
  evidenz: Evidenz;
  verifizierung: Verifizierung;
  erklaerung: string;
  unsicherheiten?: string;
  sensitivitaet?: Sensitivitaet[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const ANNAHMEN: Annahme[] = [
  {
    id: "basis-bip",
    parameter: "BIP Deutschland",
    wert: "3.990 Mrd. €",
    kategorie: "Basiswerte",
    quelle: "Statistisches Bundesamt",
    quellUrl: "https://destatis.de",
    jahr: "2024",
    letzteUeberpruefung: "31.05.2026",
    datenherkunft: "Offizielle Volkswirtschaftliche Gesamtrechnung",
    evidenz: "hoch",
    verifizierung: "verifiziert",
    erklaerung: "Das BIP ist die Summe aller in Deutschland erbrachten Wirtschaftsleistungen in einem Jahr. Es dient als Skalierungsbasis für alle prozentualen Ausgabenpositionen (z.B. Verteidigung 2% BIP = 79,8 Mrd. €). Der Wert basiert auf der amtlichen Erstschätzung für 2024.",
    unsicherheiten: "Revisionen des Statistischen Bundesamts können den Wert um ±0,2–0,5% verschieben.",
  },
  {
    id: "basis-defizit",
    parameter: "Haushaltsdefizit (Baseline)",
    wert: "−34,2 Mrd. €",
    kategorie: "Basiswerte",
    quelle: "Bundesministerium der Finanzen",
    quellUrl: "https://bundesfinanzministerium.de",
    jahr: "2024",
    letzteUeberpruefung: "31.05.2026",
    datenherkunft: "Bundeshaushalt Soll/Ist-Vergleich",
    evidenz: "hoch",
    verifizierung: "verifiziert",
    erklaerung: "Ausgangswert des Simulators. Alle Schieberegler messen Abweichungen von diesem Baseline-Wert. Positive Abweichungen (Überschuss) werden grün dargestellt, negative (Defizit) rot.",
    unsicherheiten: "Unterjährige Steuereinnahmen und Konjunkturschwankungen können den Ist-Wert erheblich abweichen lassen.",
    sensitivitaet: [
      { wert: "Status quo", ergebnis: -34.2, einheit: "Mrd. €" },
      { wert: "+10% Steuern", ergebnis: -25.8, einheit: "Mrd. €" },
      { wert: "−5% Ausgaben", ergebnis: -15.2, einheit: "Mrd. €" },
      { wert: "Beide", ergebnis: -6.8, einheit: "Mrd. €" },
    ],
  },
  {
    id: "basis-steuer",
    parameter: "Steueraufkommen (Baseline)",
    wert: "916 Mrd. €",
    kategorie: "Basiswerte",
    quelle: "Statistisches Bundesamt",
    quellUrl: "https://destatis.de",
    jahr: "2024",
    letzteUeberpruefung: "31.05.2026",
    datenherkunft: "Steuerstatistik, monatliche Kassenergebnisse",
    evidenz: "hoch",
    verifizierung: "verifiziert",
    erklaerung: "Gesamtsteueraufkommen von Bund, Ländern und Gemeinden. Wird als Baseline für alle Einnahmenberechnungen genutzt. Änderungen durch Steuersatzanpassungen werden additiv hinzugerechnet.",
  },
  {
    id: "beamte-kosten",
    parameter: "Ø-Jahresgehalt Beamte",
    wert: "58.400 € / Jahr",
    kategorie: "Beamte",
    quelle: "Statistisches Bundesamt",
    quellUrl: "https://destatis.de",
    jahr: "2024",
    letzteUeberpruefung: "31.05.2026",
    datenherkunft: "Personalstandstatistik des öffentlichen Dienstes",
    evidenz: "hoch",
    verifizierung: "verifiziert",
    erklaerung: "Durchschnittliches Bruttogehalt über alle Laufbahngruppen (einfach bis höherer Dienst) auf Bundes-, Landes- und Kommunalebene. Versorgungsrückstellungen in Höhe von 23% des Bruttogehalts sind separat berücksichtigt.",
    unsicherheiten: "Regionale Unterschiede (Bayern vs. ostdeutsche Länder) können ±15% abweichen.",
    sensitivitaet: [
      { wert: "50.000 €", ergebnis: -0.16, einheit: "Mrd. €/1k" },
      { wert: "58.400 €", ergebnis: -0.022, einheit: "Mrd. €/1k" },
      { wert: "70.000 €", ergebnis: 0.025, einheit: "Mrd. €/1k" },
    ],
  },
  {
    id: "beamte-delay",
    parameter: "Beamtenabbau – Verzögerungsfaktor",
    wert: "30% Wirkung im Nahzeitraum",
    kategorie: "Beamte",
    quelle: "Bundesministerium des Innern",
    quellUrl: "https://bmi.bund.de",
    jahr: "2023",
    letzteUeberpruefung: "31.05.2026",
    datenherkunft: "Berichte zur Personalentwicklung im öffentlichen Dienst",
    evidenz: "mittel",
    verifizierung: "teilweise",
    erklaerung: "Beamte genießen verfassungsrechtlich garantierten Kündigungsschutz (Art. 33 GG). Einsparungen entstehen daher fast ausschließlich durch natürliche Fluktuation (Pensionierungen, freiwillige Abgänge). Das Modell vereinfacht den Zeitpfad: Jahr 1 = 10%, Jahr 5 = 50%, Jahr 10 = 100%. Im Simulator wird ein Ø-Faktor von 30% für den Nahzeitraum angewandt.",
    unsicherheiten: "Der tatsächliche Zeitpfad hängt stark von der Altersstruktur des jeweiligen Dienstherrn ab.",
  },
  {
    id: "verteidigung-skala",
    parameter: "Verteidigungsausgaben – Koeffizient",
    wert: "1% BIP = 39,9 Mrd. €",
    kategorie: "Verteidigung",
    quelle: "Bundesministerium der Verteidigung / NATO",
    quellUrl: "https://nato.int",
    jahr: "2024",
    letzteUeberpruefung: "31.05.2026",
    datenherkunft: "NATO-Berechnungsmethode, standardisiert",
    evidenz: "hoch",
    verifizierung: "verifiziert",
    erklaerung: "Direkt abgeleitet aus BIP-Baseline (3.990 Mrd. × 1%). Die NATO verwendet eine standardisierte Berechnungsmethode, die nur bestimmte Ausgabenkategorien einschließt.",
    sensitivitaet: [
      { wert: "1,0% BIP", ergebnis: -39.9, einheit: "Mrd. vs. 2%" },
      { wert: "2,0% BIP", ergebnis: 0, einheit: "Mrd. vs. 2%" },
      { wert: "3,0% BIP", ergebnis: 39.9, einheit: "Mrd. vs. 2%" },
    ],
  },
  {
    id: "verteidigung-wachstum",
    parameter: "Verteidigung – Wachstumseffekt",
    wert: "Opt.: +0,03pp | Real.: ±0 | Pess.: −0,02pp pro % BIP-Δ",
    kategorie: "Verteidigung",
    quelle: "IWF / SIPRI",
    quellUrl: "https://sipri.org",
    jahr: "2023",
    letzteUeberpruefung: "31.05.2026",
    datenherkunft: "Metaanalyse militärischer Ausgaben und BIP-Wachstum",
    evidenz: "gering",
    verifizierung: "teilweise",
    erklaerung: "Kurzfristig wirken Verteidigungsausgaben als Nachfrageimpuls (Multiplikator ~1,0–1,5). Langfristig verdrängen sie zivile Investitionen (Crowding-out). Der Nettoeffekt ist stark kontextabhängig. Das Modell differenziert nach Szenario: optimistisch nimmt kurzfristigen Nachfrageeffekt an, pessimistisch langfristige Produktivitätseffekte.",
    unsicherheiten: "Empirische Literatur zeigt sehr heterogene Ergebnisse je nach Land und Zeitraum (Hicks, 2022; IMF WP 2023).",
  },
  {
    id: "fluechtlinge-kosten",
    parameter: "Flüchtlingsaufnahme – Kosten pro Person/Jahr",
    wert: "18.000 € / Person / Jahr",
    kategorie: "Migration",
    quelle: "Bundesamt für Migration und Flüchtlinge (BAMF)",
    quellUrl: "https://bamf.de",
    jahr: "2023",
    letzteUeberpruefung: "31.05.2026",
    datenherkunft: "BAMF-Jahresbericht / IAB-Forschungsbericht",
    evidenz: "mittel",
    verifizierung: "teilweise",
    erklaerung: "Durchschnittliche Kosten je aufgenommener Person für Unterbringung (~6.000 €), Sozialleistungen (~8.000 €) und Verwaltung (~4.000 €). Langfristig (5–10 Jahre) entstehen Rückflüsse durch 60% Erwerbsquote und Steuer-/Sozialbeiträge (~9.200 €/Jahr). Das Modell berücksichtigt nur Kurzfristkosten.",
    unsicherheiten: "Kosten variieren stark je nach Herkunftsland, Bildungsstand und Integrationsmaßnahmen (±40%).",
    sensitivitaet: [
      { wert: "100k/J.", ergebnis: -1.44, einheit: "Mrd. Δ zu 180k" },
      { wert: "180k/J.", ergebnis: 0, einheit: "Mrd. Δ zu 180k" },
      { wert: "300k/J.", ergebnis: 2.16, einheit: "Mrd. Δ zu 180k" },
      { wert: "400k/J.", ergebnis: 3.96, einheit: "Mrd. Δ zu 180k" },
    ],
  },
  {
    id: "fachkraefte-steuer",
    parameter: "Fachkräftezuwanderung – Steuereinnahmen",
    wert: "Ø 11.600 € / Person / Jahr (nach Integrationsfaktor 80%)",
    kategorie: "Migration",
    quelle: "Bundesagentur für Arbeit / OECD",
    quellUrl: "https://arbeitsagentur.de",
    jahr: "2024",
    letzteUeberpruefung: "31.05.2026",
    datenherkunft: "OECD Migration Outlook / IAB-Kurzbericht",
    evidenz: "mittel",
    verifizierung: "teilweise",
    erklaerung: "Ø-Bruttolohn qualifizierter Zuwanderer: 52.000 €/Jahr. Steuer + Sozialbeiträge: ~14.500 €/Jahr (Bruttowert). Integrationsfaktor: Jahr 1 = 60%, Jahr 2 = 80%, Jahr 3 = 100% → Ø 80% = 11.600 €. BIP-Effekt: +0,0008% pro 1.000 Fachkräfte.",
    unsicherheiten: "Sofortige Vollbeschäftigung nicht realistisch. Tatsächliche Erwerbsquote im ersten Jahr liegt oft bei 50–70%.",
    sensitivitaet: [
      { wert: "50k/J.", ergebnis: -2.18, einheit: "Mrd. Δ zu 200k" },
      { wert: "200k/J.", ergebnis: 0, einheit: "Mrd. Δ zu 200k" },
      { wert: "350k/J.", ergebnis: 1.74, einheit: "Mrd. Δ zu 200k" },
      { wert: "500k/J.", ergebnis: 3.48, einheit: "Mrd. Δ zu 200k" },
    ],
  },
  {
    id: "buergergeld-empfaenger",
    parameter: "Bürgergeld – Empfängeranzahl",
    wert: "5,5 Mio. (konstant)",
    kategorie: "Soziales",
    quelle: "Bundesagentur für Arbeit",
    quellUrl: "https://arbeitsagentur.de",
    jahr: "2024",
    letzteUeberpruefung: "31.05.2026",
    datenherkunft: "Statistik Grundsicherung für Arbeitsuchende",
    evidenz: "hoch",
    verifizierung: "verifiziert",
    erklaerung: "Modell hält Empfängeranzahl konstant. Änderungen des Regelsatzes beeinflussen die Gesamtkosten linear (5,5 Mio. × 12 Monate × Δ€). IAB schätzt Arbeitsangebotseffekt bei −0,3% Beschäftigung pro 10% Erhöhung.",
    unsicherheiten: "Empfängeranzahl ist konjunkturabhängig. Bei Rezession kann sie auf 6–7 Mio. steigen.",
    sensitivitaet: [
      { wert: "400 €/Mon.", ergebnis: -6.8, einheit: "Mrd. Δ zu 502 €" },
      { wert: "502 €/Mon.", ergebnis: 0, einheit: "Mrd. Δ zu 502 €" },
      { wert: "600 €/Mon.", ergebnis: 6.5, einheit: "Mrd. Δ zu 502 €" },
      { wert: "700 €/Mon.", ergebnis: 13.0, einheit: "Mrd. Δ zu 502 €" },
    ],
  },
  {
    id: "rentenalter-einsparung",
    parameter: "Renteneintrittsalter – Nettoeinsparung",
    wert: "15,2 Mrd. € / Jahr (nach Risikofaktor 18%)",
    kategorie: "Soziales",
    quelle: "Deutsche Rentenversicherung Bund",
    quellUrl: "https://drv-bund.de",
    jahr: "2024",
    letzteUeberpruefung: "31.05.2026",
    datenherkunft: "Rentenversicherungsbericht / Sachverständigenrat",
    evidenz: "mittel",
    verifizierung: "teilweise",
    erklaerung: "Brutto-Einsparung: 18,5 Mrd. € pro Jahr Anhebung (weniger Rentner). Risikofaktor 18%: Höheres Rentenalter führt zu mehr Erwerbsminderungsrenten, krankheitsbedingten Ausfällen und Frühverrentungen in körperlich belastenden Berufen. Nettoeffekt: 18,5 × 0,82 = 15,2 Mrd. €.",
    unsicherheiten: "Risikofaktor stark branchenabhängig. In Bau/Pflege können bis zu 40% der Beschäftigten das höhere Rentenalter nicht erreichen.",
    sensitivitaet: [
      { wert: "Alter 65", ergebnis: -30.4, einheit: "Mrd. Δ zu 67" },
      { wert: "Alter 67", ergebnis: 0, einheit: "Mrd. Δ zu 67" },
      { wert: "Alter 69", ergebnis: 30.4, einheit: "Mrd. Δ zu 67" },
    ],
  },
  {
    id: "einkommensteuer-koeff",
    parameter: "Spitzensteuersatz – Koeffizient",
    wert: "3,2 Mrd. € pro Prozentpunkt",
    kategorie: "Steuern",
    quelle: "Bundesministerium der Finanzen / IW Köln",
    quellUrl: "https://bundesfinanzministerium.de",
    jahr: "2024",
    letzteUeberpruefung: "31.05.2026",
    datenherkunft: "Lohn- und Einkommensteuerstatistik, Aufkommensschätzung",
    evidenz: "mittel",
    verifizierung: "teilweise",
    erklaerung: "Schätzung basiert auf der Einkommensverteilung der Steuerpflichtigen ab dem Spitzensteuersatz-Grenzwert (66.761 €). Elastizität des steuerpflichtigen Einkommens: −0,2 (Laffer-Effekt). Ab 50% Spitzensatz wird Verhaltensanpassung (Kapitalverlagerung, Leistungsreduktion) stärker gewichtet.",
    unsicherheiten: "Laffer-Kurve ist empirisch umstritten. Internationale Studien zeigen Elastizitäten von −0,1 bis −0,5.",
    sensitivitaet: [
      { wert: "35%", ergebnis: -22.4, einheit: "Mrd. Δ zu 42%" },
      { wert: "42%", ergebnis: 0, einheit: "Mrd. Δ zu 42%" },
      { wert: "50%", ergebnis: 19.2, einheit: "Mrd. Δ zu 42%" },
    ],
  },
  {
    id: "vermoegenssteuer",
    parameter: "Vermögenssteuer – Einnahmen",
    wert: "Pess.: 4 Mrd. | Real.: 8 Mrd. | Opt.: 15 Mrd. €",
    kategorie: "Steuern",
    quelle: "IMK / DIW Berlin",
    quellUrl: "https://diw.de",
    jahr: "2023",
    letzteUeberpruefung: "31.05.2026",
    datenherkunft: "Forschungsberichte Vermögensbesteuerung Deutschland",
    evidenz: "gering",
    verifizierung: "nicht",
    erklaerung: "Die Vermögenssteuer wurde 1997 ausgesetzt. Schätzungen für eine Wiedereinführung variieren stark je nach Steuersatz, Freibeträgen und angenommener Kapitalflucht. Optimistisch: geringe Kapitalflucht (+15 Mrd.). Realistisch: moderate Verhaltensanpassung (+8 Mrd.). Pessimistisch: erhebliche Kapitalverlagerung ins Ausland (+4 Mrd.).",
    unsicherheiten: "Sehr hohe Unsicherheit. Keine aktuellen empirischen Daten verfügbar. Verfassungsrechtliche Fragen ungeklärt.",
  },
  {
    id: "unternehmenssteuer-koeff",
    parameter: "Unternehmenssteuer – Koeffizient",
    wert: "3,0 Mrd. € pro Prozentpunkt",
    kategorie: "Steuern",
    quelle: "Bundesministerium der Finanzen",
    quellUrl: "https://bundesfinanzministerium.de",
    jahr: "2024",
    letzteUeberpruefung: "31.05.2026",
    datenherkunft: "Körperschaftsteuerstatistik",
    evidenz: "mittel",
    verifizierung: "teilweise",
    erklaerung: "Kombinierter Effekt aus Körperschaftsteuer und Gewerbesteuer. Wachstumseffekt: −0,015% BIP pro Prozentpunkt höhere Steuer (Investitionshemmnis). Niedrigere Unternehmenssteuern können durch Investitionsanreize langfristig höhere Steuereinnahmen generieren.",
    unsicherheiten: "Verhaltensanpassungen von Unternehmen (Gewinnverlagerung, Investitionsstandort) stark unsicher.",
  },
  {
    id: "wachstum-baseline",
    parameter: "Wirtschaftswachstum – Basispfad",
    wert: "+0,8% BIP",
    kategorie: "Wachstum",
    quelle: "Sachverständigenrat Wirtschaft",
    quellUrl: "https://sachverstaendigenrat-wirtschaft.de",
    jahr: "2023",
    letzteUeberpruefung: "31.05.2026",
    datenherkunft: "Jahresgutachten 2023/24",
    evidenz: "mittel",
    verifizierung: "teilweise",
    erklaerung: "Konsens-Prognose für strukturelles Wachstum. Alle Schiebregler berechnen Abweichungen von diesem Wert. Negative Wachstumsraten sind möglich (keine Untergrenze im Modell). Ketteneffekte: Höheres Wachstum generiert +20 Mrd. € Steuereinnahmen pro Prozentpunkt.",
    unsicherheiten: "Wachstumsprognosen haben eine durchschnittliche Prognosefehler von ±1,5pp auf Jahressicht.",
  },
  {
    id: "kette-wachstum-steuer",
    parameter: "Ketteneffekt: Wachstum → Steuereinnahmen",
    wert: "+20 Mrd. € pro +1 Prozentpunkt BIP-Wachstum",
    kategorie: "Wachstum",
    quelle: "Bundesministerium der Finanzen",
    quellUrl: "https://bundesfinanzministerium.de",
    jahr: "2024",
    letzteUeberpruefung: "31.05.2026",
    datenherkunft: "Steuerschätzerkreis / Stabilitätsprogramm",
    evidenz: "mittel",
    verifizierung: "teilweise",
    erklaerung: "Wachstumsbedingte Steuermehrereinnahmen entstehen durch höhere Unternehmensgewinne, Lohnsteigerungen und Mehrwertsteuereinnahmen. Grobe Schätzung: 1% BIP-Wachstum generiert ~2% Steuermehreinnahmen. Bei 916 Mrd. Baseline ≈ 18–22 Mrd. €.",
    unsicherheiten: "Multiplikator variiert mit Konjunkturphase und Steuerstruktur.",
  },
  {
    id: "szenario-multiplier",
    parameter: "Szenario-Multiplikatoren",
    wert: "Optimistisch ×1,3 | Realistisch ×1,0 | Pessimistisch ×0,65",
    kategorie: "Sonstiges",
    quelle: "Modellannahme",
    jahr: "2024",
    letzteUeberpruefung: "31.05.2026",
    datenherkunft: "Eigene Modellentscheidung",
    evidenz: "gering",
    verifizierung: "nicht",
    erklaerung: "Vereinfachte Skalierung aller Fiskal- und Wachstumseffekte. Bildet unterschiedliche Rahmenbedingungen ab (günstige vs. ungünstige gesamtwirtschaftliche Lage, politische Umsetzungserfolge). Kein empirisch belegtes Modell — reine Illustrationshilfe.",
    unsicherheiten: "Reale Effekte sind nicht linear skalierbar. Einige Maßnahmen wirken in Rezessionen stärker, andere schwächer.",
  },
];

// ─── Helper Components ────────────────────────────────────────────────────────
const EvidenzBadge = ({ level }: { level: Evidenz }) => {
  const map = {
    hoch:   { icon: "🟢", label: "Hoch",   cls: "text-[#4caf82] bg-[#4caf82]/10 border-[#4caf82]/30" },
    mittel: { icon: "🟡", label: "Mittel", cls: "text-[#f5a623] bg-[#f5a623]/10 border-[#f5a623]/30" },
    gering: { icon: "🔴", label: "Gering", cls: "text-[#e05c5c] bg-[#e05c5c]/10 border-[#e05c5c]/30" },
  };
  const { icon, label, cls } = map[level];
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${cls}`}>
      {icon} {label}
    </span>
  );
};

const VerifizierungBadge = ({ status }: { status: Verifizierung }) => {
  const map = {
    verifiziert: { icon: "✅", label: "Verifiziert",          cls: "text-[#4caf82] bg-[#4caf82]/10 border-[#4caf82]/30" },
    teilweise:   { icon: "⚠️", label: "Teilweise verifiziert", cls: "text-[#f5a623] bg-[#f5a623]/10 border-[#f5a623]/30" },
    nicht:       { icon: "❌", label: "Nicht verifiziert",     cls: "text-[#e05c5c] bg-[#e05c5c]/10 border-[#e05c5c]/30" },
  };
  const { icon, label, cls } = map[status];
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${cls}`}>
      {icon} {label}
    </span>
  );
};

// ─── Sensitivity Mini Chart ───────────────────────────────────────────────────
function SensitivitaetsChart({ data }: { data: Sensitivitaet[] }) {
  const maxAbs = Math.max(...data.map((d) => Math.abs(d.ergebnis)), 0.1);
  return (
    <div className="mt-3">
      <p className="text-[10px] text-[#8faabb] mb-2 font-semibold uppercase tracking-wider">Sensitivitätsanalyse</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0d1b2a] rounded p-2">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1e3048]">
                <th className="text-left text-[#8faabb] pb-1">Wert</th>
                <th className="text-right text-[#8faabb] pb-1">Ergebnis</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-b border-[#1e3048]/50 last:border-0">
                  <td className="py-1 text-[#f0f4f8]">{row.wert}</td>
                  <td className={`py-1 text-right font-mono font-bold ${
                    row.ergebnis > 0 ? "text-[#e05c5c]" : row.ergebnis < 0 ? "text-[#4caf82]" : "text-[#8faabb]"
                  }`}>
                    {row.ergebnis > 0 ? "+" : ""}{row.ergebnis} {row.einheit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="h-[100px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis dataKey="wert" stroke="#8faabb" fontSize={8} />
              <YAxis stroke="#8faabb" fontSize={8} />
              <RechartsTooltip
                contentStyle={{ backgroundColor: "#0d1b2a", borderColor: "#1e3048", fontSize: 10 }}
                formatter={(v: number, _: string, entry: { payload?: Sensitivitaet }) => [
                  `${v} ${entry?.payload?.einheit ?? ""}`, "Ergebnis"
                ]}
              />
              <Bar dataKey="ergebnis" radius={[2, 2, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.ergebnis < 0 ? "#4caf82" : entry.ergebnis === 0 ? "#8faabb" : "#e05c5c"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── Annahme Card ─────────────────────────────────────────────────────────────
function AnnahmeKarte({ a }: { a: Annahme }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#1a2b3c] rounded border border-[#1e3048] overflow-hidden">
      <div className="px-4 py-3">
        {/* Header row */}
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-[#8faabb] uppercase tracking-wider">{a.kategorie}</span>
            <h3 className="text-sm font-semibold text-[#f0f4f8] mt-0.5">{a.parameter}</h3>
          </div>
          <div className="flex flex-wrap gap-1.5 shrink-0">
            <EvidenzBadge level={a.evidenz} />
            <VerifizierungBadge status={a.verifizierung} />
          </div>
        </div>

        {/* Value */}
        <div className="font-mono text-xs text-[#00c8b4] mb-2 leading-relaxed">{a.wert}</div>

        {/* Source */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#8faabb]">
          <span className="flex items-center gap-1">
            {a.quellUrl ? (
              <a href={a.quellUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#8faabb] hover:text-[#00c8b4] transition-colors">
                {a.quelle} <ExternalLink size={9} />
              </a>
            ) : a.quelle}
          </span>
          <span className="text-[#1e3048]">·</span>
          <span>{a.datenherkunft}</span>
          <span className="text-[#1e3048]">·</span>
          <span>Stand: {a.jahr}</span>
          <span className="text-[#1e3048]">·</span>
          <span>Geprüft: {a.letzteUeberpruefung}</span>
        </div>

        {/* Expand button */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-3 flex items-center gap-1.5 text-[10px] text-[#8faabb] hover:text-[#00c8b4] transition-colors border border-[#1e3048] hover:border-[#00c8b4]/40 rounded px-2 py-1"
        >
          {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          Warum verwenden wir diesen Wert?
        </button>
      </div>

      {/* Expandable section */}
      {open && (
        <div className="border-t border-[#1e3048] bg-[#0d1b2a]/50 px-4 py-3 space-y-2">
          <div>
            <p className="text-[10px] text-[#8faabb] font-semibold uppercase tracking-wider mb-1">Herleitung & wissenschaftliche Grundlage</p>
            <p className="text-xs text-[#f0f4f8] leading-relaxed">{a.erklaerung}</p>
          </div>
          {a.unsicherheiten && (
            <div className="bg-[#3d2d0a] border border-[#f5a623]/20 rounded px-3 py-2">
              <p className="text-[10px] text-[#f5a623] font-semibold uppercase tracking-wider mb-1">⚠ Bekannte Unsicherheiten</p>
              <p className="text-xs text-[#f5a623]/80 leading-relaxed">{a.unsicherheiten}</p>
            </div>
          )}
          {a.sensitivitaet && <SensitivitaetsChart data={a.sensitivitaet} />}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AnnahmenPage() {
  const [search,        setSearch]        = useState("");
  const [filterEvidenz, setFilterEvidenz] = useState<Evidenz | "alle">("alle");
  const [filterVerif,   setFilterVerif]   = useState<Verifizierung | "alle">("alle");
  const [filterKat,     setFilterKat]     = useState<Kategorie | "alle">("alle");

  const kategorien = [...new Set(ANNAHMEN.map((a) => a.kategorie))] as Kategorie[];

  const gefiltert = useMemo(() => {
    const q = search.toLowerCase();
    return ANNAHMEN.filter((a) => {
      if (filterEvidenz !== "alle" && a.evidenz      !== filterEvidenz) return false;
      if (filterVerif   !== "alle" && a.verifizierung !== filterVerif)  return false;
      if (filterKat     !== "alle" && a.kategorie     !== filterKat)    return false;
      if (q && !`${a.parameter} ${a.quelle} ${a.erklaerung} ${a.kategorie} ${a.wert}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, filterEvidenz, filterVerif, filterKat]);

  // Stats
  const total      = ANNAHMEN.length;
  const verified   = ANNAHMEN.filter((a) => a.verifizierung === "verifiziert").length;
  const partial    = ANNAHMEN.filter((a) => a.verifizierung === "teilweise").length;
  const none       = ANNAHMEN.filter((a) => a.verifizierung === "nicht").length;
  const sources    = [...new Set(ANNAHMEN.map((a) => a.quelle))].length;
  const avgTrust   = Math.round(
    (ANNAHMEN.filter((a) => a.evidenz === "hoch").length * 100 +
     ANNAHMEN.filter((a) => a.evidenz === "mittel").length * 50 +
     ANNAHMEN.filter((a) => a.evidenz === "gering").length * 10) / total
  );

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 space-y-8">

        {/* Scientific disclaimer */}
        <div className="bg-[#243447] border border-[#00c8b4]/30 rounded-lg p-4">
          <p className="text-sm text-[#f0f4f8] leading-relaxed">
            <span className="font-bold text-[#00c8b4]">Wissenschaftlicher Hinweis: </span>
            Der Deutschland-Simulator ist ein Analyse- und Bildungswerkzeug. Die Ergebnisse stellen keine Vorhersagen dar,
            sondern zeigen mögliche Auswirkungen auf Basis der zugrunde liegenden Annahmen. Alle Annahmen, Quellen und
            Unsicherheiten werden transparent dargestellt. Für politische Entscheidungen sind detaillierte Wirkungsanalysen
            durch Fachbehörden (Sachverständigenrat, IMK, IWH, BMF) unerlässlich.
          </p>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#00c8b4] mb-1">Modellannahmen & Quellen</h1>
          <p className="text-[#8faabb] text-sm">Vollständige Transparenz über alle verwendeten Daten, Formeln und Unsicherheiten.</p>
        </div>

        {/* Transparency Dashboard */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#8faabb] mb-3">Datenqualität</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: "Annahmen gesamt",         val: total,           col: "#f0f4f8" },
              { label: "Verifiziert",              val: `${Math.round(verified/total*100)}%`, col: "#4caf82" },
              { label: "Teilweise verifiziert",    val: `${Math.round(partial/total*100)}%`,  col: "#f5a623" },
              { label: "Nicht verifiziert",        val: `${Math.round(none/total*100)}%`,     col: "#e05c5c" },
              { label: "Ø Vertrauensniveau",       val: `${avgTrust}%`, col: avgTrust >= 60 ? "#4caf82" : avgTrust >= 40 ? "#f5a623" : "#e05c5c" },
            ].map((s) => (
              <div key={s.label} className="bg-[#1a2b3c] rounded border border-[#1e3048] p-3 text-center">
                <div className="text-xl font-bold mb-1" style={{ color: s.col }}>{s.val}</div>
                <div className="text-[10px] text-[#8faabb]">{s.label}</div>
              </div>
            ))}
          </div>
          {/* Verification bar */}
          <div className="mt-3 flex rounded-full overflow-hidden h-2">
            <div className="bg-[#4caf82] transition-all" style={{ width: `${verified/total*100}%` }} title={`Verifiziert: ${verified}`} />
            <div className="bg-[#f5a623] transition-all" style={{ width: `${partial/total*100}%` }} title={`Teilweise: ${partial}`} />
            <div className="bg-[#e05c5c] transition-all" style={{ width: `${none/total*100}%` }} title={`Nicht: ${none}`} />
          </div>
          <div className="flex gap-4 mt-1.5 text-[10px] text-[#8faabb]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#4caf82]" />Verifiziert ({verified})</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f5a623]" />Teilweise ({partial})</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#e05c5c]" />Nicht ({none})</span>
            <span className="ml-auto">{sources} verschiedene Quellen</span>
          </div>
        </section>

        {/* Evidenz legend */}
        <div className="flex flex-wrap gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-[#4caf82]"><span className="w-2 h-2 rounded-full bg-[#4caf82]" /> 🟢 Hoch — amtliche Statistik, Bundesbehörden, OECD</span>
          <span className="flex items-center gap-1.5 text-[#f5a623]"><span className="w-2 h-2 rounded-full bg-[#f5a623]" /> 🟡 Mittel — Studien, wissenschaftliche Schätzungen</span>
          <span className="flex items-center gap-1.5 text-[#e05c5c]"><span className="w-2 h-2 rounded-full bg-[#e05c5c]" /> 🔴 Gering — Verhaltensannahmen, politische Prognosen</span>
        </div>

        {/* Search + Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8faabb]" />
            <input
              type="text"
              placeholder="Annahmen, Quellen, Beschreibungen durchsuchen…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1a2b3c] border border-[#1e3048] rounded pl-8 pr-3 py-2 text-sm text-[#f0f4f8] placeholder-[#8faabb] focus:outline-none focus:border-[#00c8b4]"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center text-xs">
            <Filter size={12} className="text-[#8faabb]" />
            <span className="text-[#8faabb]">Filter:</span>
            {/* Evidenz */}
            {(["alle", "hoch", "mittel", "gering"] as const).map((v) => (
              <button key={v} onClick={() => setFilterEvidenz(v)}
                className={`px-2 py-0.5 rounded border transition-colors ${filterEvidenz === v ? "border-[#00c8b4] text-[#00c8b4] bg-[#00c8b4]/10" : "border-[#1e3048] text-[#8faabb] hover:text-[#f0f4f8]"}`}>
                {v === "alle" ? "Alle Evidenz" : v === "hoch" ? "🟢 Hoch" : v === "mittel" ? "🟡 Mittel" : "🔴 Gering"}
              </button>
            ))}
            <span className="text-[#1e3048]">|</span>
            {(["alle", "verifiziert", "teilweise", "nicht"] as const).map((v) => (
              <button key={v} onClick={() => setFilterVerif(v)}
                className={`px-2 py-0.5 rounded border transition-colors ${filterVerif === v ? "border-[#00c8b4] text-[#00c8b4] bg-[#00c8b4]/10" : "border-[#1e3048] text-[#8faabb] hover:text-[#f0f4f8]"}`}>
                {v === "alle" ? "Alle Status" : v === "verifiziert" ? "✅ Verifiziert" : v === "teilweise" ? "⚠️ Teilweise" : "❌ Nicht verifiziert"}
              </button>
            ))}
            <span className="text-[#1e3048]">|</span>
            <select value={filterKat} onChange={(e) => setFilterKat(e.target.value as Kategorie | "alle")}
              className="bg-[#1a2b3c] border border-[#1e3048] text-[#8faabb] rounded px-2 py-0.5 text-xs focus:outline-none focus:border-[#00c8b4]">
              <option value="alle">Alle Themen</option>
              {kategorien.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <p className="text-[10px] text-[#8faabb]">{gefiltert.length} von {total} Annahmen angezeigt</p>
        </div>

        {/* Assumption cards */}
        <div className="space-y-3">
          {gefiltert.length === 0 ? (
            <div className="text-center py-12 text-[#8faabb]">Keine Annahmen gefunden.</div>
          ) : (
            gefiltert.map((a) => <AnnahmeKarte key={a.id} a={a} />)
          )}
        </div>

        {/* Footer note */}
        <div className="bg-[#1a2b3c] border border-[#e05c5c]/20 rounded p-4 text-xs text-[#8faabb] leading-relaxed">
          <span className="text-[#e05c5c] font-semibold">Modellgrenzen: </span>
          Viele wirtschaftliche Effekte sind nichtlinear, zeitverzögert und abhängig von nicht modellierten Faktoren
          (Konjunktur, geopolitische Lage, technologischer Wandel, demographischer Wandel, EZB-Geldpolitik).
          Das Modell ist eine stark vereinfachte Abstraktion der Realität und ersetzt keine professionelle Politikfolgenabschätzung.
        </div>
      </div>
    </Layout>
  );
}
