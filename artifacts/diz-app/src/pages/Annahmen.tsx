import { Layout } from "@/components/Layout";

interface Annahme {
  parameter: string;
  wert: string;
  quelle?: string;
  evidenz?: "hoch" | "mittel" | "gering";
}

interface Gruppe {
  titel: string;
  farbe: string;
  annahmen: Annahme[];
}

const EvidenzBadge = ({ level }: { level?: "hoch" | "mittel" | "gering" }) => {
  if (!level) return null;
  const map = {
    hoch:   { label: "🟢 Hoch",   cls: "text-[#4caf82]" },
    mittel: { label: "🟡 Mittel", cls: "text-[#f5a623]" },
    gering: { label: "🔴 Gering", cls: "text-[#e05c5c]" },
  };
  const { label, cls } = map[level];
  return <span className={`text-[10px] font-medium ${cls}`}>{label}</span>;
};

const gruppen: Gruppe[] = [
  {
    titel: "Basiswerte (Baseline 2024)",
    farbe: "#00c8b4",
    annahmen: [
      { parameter: "BIP Deutschland",               wert: "3.990 Mrd. € (3,99 Bio.)",  quelle: "Statistisches Bundesamt", evidenz: "hoch" },
      { parameter: "Haushaltsdefizit (Baseline)",    wert: "−34,2 Mrd. €",              quelle: "Bundesministerium der Finanzen", evidenz: "hoch" },
      { parameter: "Steueraufkommen (Baseline)",     wert: "916 Mrd. €",                quelle: "Statistisches Bundesamt", evidenz: "hoch" },
      { parameter: "Staatsverschuldung",             wert: "2.445 Mrd. €",              quelle: "Deutsche Bundesbank", evidenz: "hoch" },
      { parameter: "Wirtschaftswachstum (Baseline)", wert: "+0,8% BIP",                 quelle: "Sachverständigenrat Wirtschaft", evidenz: "mittel" },
      { parameter: "Arbeitslosenquote (Baseline)",   wert: "5,7%",                      quelle: "Bundesagentur für Arbeit", evidenz: "hoch" },
      { parameter: "Rentenkosten (Baseline)",        wert: "362 Mrd. €",                quelle: "Deutsche Rentenversicherung Bund", evidenz: "hoch" },
      { parameter: "Fachkräftemangel (Baseline)",    wert: "890.000 offene Stellen",    quelle: "IW Köln / Bundesagentur für Arbeit", evidenz: "mittel" },
      { parameter: "Gesundheitskosten (Baseline)",   wert: "468 Mrd. €",                quelle: "Bundesministerium für Gesundheit", evidenz: "mittel" },
    ],
  },
  {
    titel: "Szenarien-Multiplikatoren",
    farbe: "#4caf82",
    annahmen: [
      { parameter: "Optimistisch", wert: "×1,3 auf alle fiskalischen und Wachstumseffekte", evidenz: "mittel" },
      { parameter: "Realistisch",  wert: "×1,0 (Basis)",                                    evidenz: "hoch"   },
      { parameter: "Pessimistisch",wert: "×0,65 auf alle fiskalischen und Wachstumseffekte", evidenz: "mittel" },
    ],
  },
  {
    titel: "Beamte (mit Verzögerungsfaktor)",
    farbe: "#f5a623",
    annahmen: [
      { parameter: "Ø-Jahresgehalt",                 wert: "58.400 €",                      quelle: "Statistisches Bundesamt", evidenz: "hoch" },
      { parameter: "Versorgungsquote",               wert: "23% des Bruttogehalts",          evidenz: "hoch" },
      { parameter: "Verzögerungsfaktor",             wert: "30% Wirkung im Nahzeitraum (Jahr 1)",   evidenz: "mittel" },
      { parameter: "Modell-Zeitpfad",                wert: "Jahr 1 = 10% | Jahr 5 = 50% | Jahr 10 = 100% (Pensionsschutz, Kündigungsschutz)", evidenz: "mittel" },
      { parameter: "Kosten-Koeffizient (effektiv)",  wert: "0,072 Mrd. € × 0,30 = 0,0216 Mrd. € pro 1.000 Beamte (Nahzeitraum)", evidenz: "mittel" },
      { parameter: "Natürliche Fluktuation",         wert: "2,1% p.a.",                     evidenz: "hoch" },
    ],
  },
  {
    titel: "Bundesministerien",
    farbe: "#8faabb",
    annahmen: [
      { parameter: "Kosten pro Ministerium",         wert: "800 Mio. € (Personal, Gebäude, IT)", quelle: "Bundeshaushalt.de", evidenz: "mittel" },
      { parameter: "Koeffizient",                    wert: "0,8 Mrd. € pro Ministerium",     evidenz: "mittel" },
      { parameter: "Modell-Vereinfachung",           wert: "Einmalige Fusionskosten nicht explizit modelliert" },
    ],
  },
  {
    titel: "Verteidigung & Entwicklungshilfe",
    farbe: "#8faabb",
    annahmen: [
      { parameter: "Skalierung",                     wert: "1% BIP = 39,9 Mrd. €",          quelle: "Bundesministerium der Verteidigung", evidenz: "hoch" },
      { parameter: "Wachstumseffekt (Verteidigung)",
        wert: "Szenarienabhängig: Optimistisch +0,3pp / Realistisch ±0 / Pessimistisch −0,2pp pro % BIP-Delta",
        evidenz: "gering" },
      { parameter: "Entwicklungshilfe-Skala",        wert: "Identisch: 1% BIP = 39,9 Mrd. €", quelle: "BMZ / OECD DAC", evidenz: "hoch" },
      { parameter: "Indirekte Rückflüsse",           wert: "Nicht modelliert",                evidenz: "gering" },
    ],
  },
  {
    titel: "Migration – Flüchtlinge",
    farbe: "#8faabb",
    annahmen: [
      { parameter: "Kosten pro Person/Jahr",         wert: "18.000 € (Unterbringung, Sozialleistungen, Verwaltung)", quelle: "BAMF / IAB", evidenz: "mittel" },
      { parameter: "Koeffizient",                    wert: "0,018 Mrd. € pro 1.000 Personen", evidenz: "mittel" },
      { parameter: "Langfristeffekte",               wert: "Jahr 1–3: netto negativ | Jahr 5–10: Rückflüsse durch 60% Erwerbsquote | nur Kurzfristkosten modelliert", evidenz: "gering" },
      { parameter: "Modell-Vereinfachung",           wert: "Nur Kurzfristkosten; Langfristeffekte (Konsum, Sozialbeiträge) ausgeblendet" },
    ],
  },
  {
    titel: "Migration – Fachkräfte (mit Integrationsfaktor)",
    farbe: "#f5a623",
    annahmen: [
      { parameter: "Integrationsfaktor",             wert: "Jahr 1 = 60% | Jahr 2 = 80% | Jahr 3 = 100% → Modell nutzt Ø 80%", evidenz: "mittel" },
      { parameter: "Steuereinnahmen pro Fachkraft",  wert: "14.500 €/Jahr × 0,80 = 11.600 € (effektiv)", quelle: "BA / OECD", evidenz: "mittel" },
      { parameter: "Koeffizient Einnahmen (effektiv)", wert: "0,0145 Mrd. × 0,80 = 0,0116 Mrd. € pro 1.000 Fachkräfte", evidenz: "mittel" },
      { parameter: "BIP-Effekt",                     wert: "+0,0008% BIP pro 1.000 Fachkräfte",  evidenz: "mittel" },
      { parameter: "Fachkräftelücke schließt sich",  wert: "1.500 Stellen pro 1.000 Zuwanderer", evidenz: "mittel" },
    ],
  },
  {
    titel: "Bürgergeld",
    farbe: "#8faabb",
    annahmen: [
      { parameter: "Anzahl Empfänger (konstant)",    wert: "5,5 Mio.",                      quelle: "Bundesagentur für Arbeit", evidenz: "mittel" },
      { parameter: "Koeffizient",                    wert: "0,066 Mrd. € pro 1 €/Monat Änderung", evidenz: "mittel" },
      { parameter: "Arbeitsangebots-Elastizität",    wert: "−0,3% Beschäftigung pro 10% Erhöhung (IAB)", quelle: "IAB", evidenz: "mittel" },
      { parameter: "ALQ-Koeffizient",                wert: "+0,0015 Prozentpunkte pro 1 €/Monat", evidenz: "mittel" },
    ],
  },
  {
    titel: "Rentensystem (mit Risikofaktor)",
    farbe: "#f5a623",
    annahmen: [
      { parameter: "Risikofaktor Rentenalter",       wert: "18% Abschlag auf Nettoeinsparung (Erwerbsminderungsrenten, körperlich belastende Berufe, Krankheitsausfälle)", evidenz: "mittel" },
      { parameter: "Einsparung pro Jahr (brutto)",   wert: "18,5 Mrd. €",                   quelle: "Deutsche Rentenversicherung Bund", evidenz: "hoch" },
      { parameter: "Einsparung pro Jahr (netto)",    wert: "18,5 Mrd. × 0,82 = 15,2 Mrd. €", evidenz: "mittel" },
      { parameter: "Mehrkosten pro Prozentpunkt Rentenniveau", wert: "4,0 Mrd. €",           evidenz: "hoch" },
      { parameter: "ALQ-Effekt Rentenalter",         wert: "+0,05 Prozentpunkte pro Jahr Anhebung", evidenz: "mittel" },
    ],
  },
  {
    titel: "Gesundheit",
    farbe: "#8faabb",
    annahmen: [
      { parameter: "GKV-Beitragssatz (Baseline)",    wert: "14,6%",                         evidenz: "hoch" },
      { parameter: "Bundeszuschuss-Koeffizient",     wert: "−4 Mrd. € pro 1%-Punkt Erhöhung (höher = weniger Bundeszuschuss nötig)", evidenz: "mittel" },
      { parameter: "Einheitsversicherung – Mehrausgaben", wert: "+18 Mrd. €",               evidenz: "gering" },
      { parameter: "Einheitsversicherung – Mehreinnahmen", wert: "+22 Mrd. €",              evidenz: "gering" },
      { parameter: "Einheitsversicherung – Nettoeffekt",   wert: "+4 Mrd. € Haushaltsverbesserung", evidenz: "gering" },
      { parameter: "Privatversicherung abschaffen – Mehrausgaben", wert: "+11 Mrd. €",     evidenz: "gering" },
      { parameter: "Privatversicherung abschaffen – Mehreinnahmen", wert: "+7 Mrd. €",     evidenz: "gering" },
    ],
  },
  {
    titel: "Steuern",
    farbe: "#8faabb",
    annahmen: [
      { parameter: "Spitzensteuersatz – Koeffizient",wert: "3,2 Mrd. € pro Prozentpunkt",  quelle: "BMF / IW Köln", evidenz: "mittel" },
      { parameter: "Spitzensteuersatz – Laffer-Effekt", wert: "Elastizität −0,2 ab 50%; vereinfacht linear modelliert", evidenz: "mittel" },
      { parameter: "Unternehmenssteuer – Koeffizient", wert: "3,0 Mrd. € pro Prozentpunkt", evidenz: "mittel" },
      { parameter: "Unternehmenssteuer – Wachstumseffekt", wert: "−0,015% BIP pro Prozentpunkt", evidenz: "mittel" },
      { parameter: "Vermögenssteuer – Einnahmen",    wert: "Pessimistisch: 4 Mrd. | Realistisch: 8 Mrd. | Optimistisch: 15 Mrd. (Kapitalflucht-Varianz)", evidenz: "gering" },
      { parameter: "Erbschaft-Freibetrag – Koeffizient", wert: "−0,005 Mrd. € pro 1.000 € Freibetrag", evidenz: "mittel" },
    ],
  },
  {
    titel: "Wirtschaftswachstum – Formel",
    farbe: "#f5a623",
    annahmen: [
      { parameter: "Formel", wert: "Wachstum = (0,8 + Fachkräfte-Δ + Verteidigungs-Δ − ESt-Δ − KSt-Δ − Beamte-Δ) × Szenario-Multiplikator", evidenz: "gering" },
      { parameter: "Basispfad",                      wert: "+0,8% BIP",                     evidenz: "mittel" },
      { parameter: "+ Fachkräfteeffekt",             wert: "+0,0008 Prozentpunkte pro 1.000 Fachkräfte", evidenz: "mittel" },
      { parameter: "± Verteidigungseffekt",          wert: "Szenarienabhängig (opt.: +0,3 | real.: ±0 | pess.: −0,2 pp pro % BIP-Δ)", evidenz: "gering" },
      { parameter: "− Einkommensteuereffekt",        wert: "−0,008 Prozentpunkte pro Prozentpunkt Spitzensatz", evidenz: "mittel" },
      { parameter: "− Unternehmenssteuereffekt",     wert: "−0,015 Prozentpunkte pro Prozentpunkt", evidenz: "mittel" },
      { parameter: "− Beamteneffekt",                wert: "−0,00002 Prozentpunkte pro 1.000 Beamte", evidenz: "gering" },
      { parameter: "Untergrenze",                    wert: "Keine — negative Wachstumsraten (Rezessionen) sind möglich", evidenz: "hoch" },
    ],
  },
  {
    titel: "Arbeitslosenquote – Formel",
    farbe: "#f5a623",
    annahmen: [
      { parameter: "Formel", wert: "ALQ = 5,7 − Fachkräfte-Δ + Bürgergeld-Δ + Rentenalter-Δ", evidenz: "gering" },
      { parameter: "Basispfad",                      wert: "5,7%",                          evidenz: "hoch" },
      { parameter: "− Fachkräfteeffekt",             wert: "−0,003 Prozentpunkte pro 1.000 Fachkräfte", evidenz: "mittel" },
      { parameter: "+ Bürgergeldeffekt",             wert: "+0,0015 Prozentpunkte pro 1 €/Monat Erhöhung", evidenz: "mittel" },
      { parameter: "+ Rentenaltereffekt",            wert: "+0,05 Prozentpunkte pro Jahr Anhebung", evidenz: "mittel" },
      { parameter: "Kein Szenario-Multiplikator",    wert: "ALQ reagiert verhaltensbasiert, kein Multiplikator", evidenz: "mittel" },
    ],
  },
  {
    titel: "Kettenmodell – Rückkopplungen",
    farbe: "#00c8b4",
    annahmen: [
      { parameter: "Wachstum → Steuereinnahmen",     wert: "+20 Mrd. € pro +1 Prozentpunkt Wachstum (über Baseline)",  evidenz: "mittel" },
      { parameter: "ALQ → Steuereinnahmen",          wert: "−15 Mrd. € pro +1 Prozentpunkt Arbeitslosigkeit",          evidenz: "mittel" },
      { parameter: "Fachkräfte → Fachkräftelücke",   wert: "−1.500 offene Stellen pro 1.000 Fachkräfte",              evidenz: "mittel" },
      { parameter: "Vereinfachung",                  wert: "Effekte werden additiv summiert — keine nichtlinearen Wechselwirkungen", evidenz: "gering" },
    ],
  },
  {
    titel: "Vertrauensindex",
    farbe: "#8faabb",
    annahmen: [
      { parameter: "Berechnungslogik",               wert: "Start: 100 Punkte. Abzug je verändertem Parameter: Hohe Evidenz −2 | Mittlere −6 | Geringe −15", evidenz: "mittel" },
      { parameter: "Untergrenze",                    wert: "10 Punkte (nie 0)",             evidenz: "mittel" },
      { parameter: "Interpretation",                 wert: "≥70: überwiegend belastbar | 40–69: mit Vorsicht | <40: stark spekulativ" },
    ],
  },
  {
    titel: "Nicht modellierte Effekte",
    farbe: "#e05c5c",
    annahmen: [
      { parameter: "Digitalisierung / KI",           wert: "Kein Produktivitäts- oder Beschäftigungseffekt", evidenz: "gering" },
      { parameter: "Klimapolitik",                   wert: "Transformationskosten und -erlöse ausgeblendet", evidenz: "gering" },
      { parameter: "Zinsentwicklung",                wert: "Schuldendienstkosten statisch gehalten",          evidenz: "gering" },
      { parameter: "Außenhandel / Export",           wert: "Keine Handelspolitik-Rückkopplung auf BIP",       evidenz: "gering" },
      { parameter: "EU-Transfers",                   wert: "Nettobeitrag als konstant angenommen",            evidenz: "gering" },
      { parameter: "Demographischer Wandel",         wert: "Bevölkerungsstruktur eingefroren",                evidenz: "gering" },
      { parameter: "Geldpolitik / EZB",              wert: "Inflation und Zinsen exogen",                     evidenz: "gering" },
      { parameter: "Langfristeffekte Flüchtlingszuwanderung", wert: "Nur Kurzfristkosten modelliert — Rückflüsse nach 5–10 Jahren nicht enthalten", evidenz: "gering" },
    ],
  },
];

export default function AnnahmenPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-[#00c8b4] mb-2">Modellannahmen & Quellen</h1>
          <p className="text-[#8faabb] text-sm leading-relaxed mb-4">
            Alle im Simulator verwendeten Formeln, Koeffizienten, Verzögerungsfaktoren und Vereinfachungen.
            Die Simulation ist ein vereinfachtes Modell — reale wirtschaftliche Zusammenhänge sind deutlich komplexer.
          </p>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-[#4caf82]"><span className="w-2 h-2 rounded-full bg-[#4caf82]" /> Hohe Evidenz — gut belegt</span>
            <span className="flex items-center gap-1.5 text-[#f5a623]"><span className="w-2 h-2 rounded-full bg-[#f5a623]" /> Mittlere Evidenz — plausibel, aber unsicher</span>
            <span className="flex items-center gap-1.5 text-[#e05c5c]"><span className="w-2 h-2 rounded-full bg-[#e05c5c]" /> Geringe Evidenz — stark vereinfacht</span>
          </div>
        </div>

        {gruppen.map((g) => (
          <section key={g.titel}>
            <h2
              className="text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b"
              style={{ color: g.farbe, borderColor: g.farbe + "40" }}
            >
              {g.titel}
            </h2>
            <div className="bg-[#1a2b3c] rounded border border-[#1e3048] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1e3048] bg-[#0d1b2a]">
                    <th className="text-left px-4 py-2 text-[#8faabb] font-medium w-[30%]">Parameter / Annahme</th>
                    <th className="text-left px-4 py-2 text-[#8faabb] font-medium w-[42%]">Wert / Beschreibung</th>
                    <th className="text-left px-4 py-2 text-[#8faabb] font-medium w-[18%]">Quelle</th>
                    <th className="text-left px-4 py-2 text-[#8faabb] font-medium w-[10%]">Evidenz</th>
                  </tr>
                </thead>
                <tbody>
                  {g.annahmen.map((a, i) => (
                    <tr key={i} className={`border-b border-[#1e3048] last:border-0 ${i % 2 === 0 ? "" : "bg-[#243447]/30"}`}>
                      <td className="px-4 py-2.5 text-[#f0f4f8] align-top">{a.parameter}</td>
                      <td className="px-4 py-2.5 font-mono text-xs align-top" style={{ color: g.farbe }}>{a.wert}</td>
                      <td className="px-4 py-2.5 text-[#8faabb] text-xs align-top">{a.quelle ?? "—"}</td>
                      <td className="px-4 py-2.5 align-top"><EvidenzBadge level={a.evidenz} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        <div className="bg-[#1a2b3c] border border-[#e05c5c]/30 rounded p-4 text-sm text-[#8faabb] leading-relaxed">
          <span className="text-[#e05c5c] font-semibold">Wichtig: </span>
          Dieses Modell dient ausschließlich der Bildung und Veranschaulichung. Für politische Entscheidungen
          sind detaillierte Wirkungsanalysen durch Fachbehörden (IMK, IWH, Sachverständigenrat, BMF) unerlässlich.
          Viele Effekte wirken nichtlinear, zeitverzögert und in Wechselwirkung — das Modell vereinfacht diese Komplexität erheblich.
        </div>
      </div>
    </Layout>
  );
}
