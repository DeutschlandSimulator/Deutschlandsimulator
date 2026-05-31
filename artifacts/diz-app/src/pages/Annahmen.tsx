import { Layout } from "@/components/Layout";

interface Annahme {
  parameter: string;
  wert: string;
  quelle?: string;
}

interface Gruppe {
  titel: string;
  farbe: string;
  annahmen: Annahme[];
}

const gruppen: Gruppe[] = [
  {
    titel: "Basiswerte (Baseline 2024)",
    farbe: "#00c8b4",
    annahmen: [
      { parameter: "BIP Deutschland", wert: "3.990 Mrd. € (3,99 Bio.)", quelle: "Statistisches Bundesamt" },
      { parameter: "Haushaltsdefizit (Baseline)", wert: "−34,2 Mrd. €", quelle: "Bundesministerium der Finanzen" },
      { parameter: "Steueraufkommen (Baseline)", wert: "916 Mrd. €", quelle: "Statistisches Bundesamt" },
      { parameter: "Staatsverschuldung", wert: "2.445 Mrd. €", quelle: "Deutsche Bundesbank" },
      { parameter: "Wirtschaftswachstum (Baseline)", wert: "+0,8% BIP", quelle: "Sachverständigenrat Wirtschaft" },
      { parameter: "Arbeitslosenquote (Baseline)", wert: "5,7%", quelle: "Bundesagentur für Arbeit" },
      { parameter: "Rentenkosten (Baseline)", wert: "362 Mrd. €", quelle: "Deutsche Rentenversicherung Bund" },
      { parameter: "Fachkräftemangel (Baseline)", wert: "890.000 offene Stellen", quelle: "IW Köln / Bundesagentur für Arbeit" },
      { parameter: "Gesundheitskosten (Baseline)", wert: "468 Mrd. €", quelle: "Bundesministerium für Gesundheit" },
    ],
  },
  {
    titel: "Szenarien-Multiplikatoren",
    farbe: "#4caf82",
    annahmen: [
      { parameter: "Optimistisch", wert: "×1,3 auf alle Effekte" },
      { parameter: "Realistisch", wert: "×1,0 (Basis)" },
      { parameter: "Pessimistisch", wert: "×0,65 auf alle Effekte" },
    ],
  },
  {
    titel: "Beamte",
    farbe: "#8faabb",
    annahmen: [
      { parameter: "Ø-Jahresgehalt", wert: "58.400 €", quelle: "Statistisches Bundesamt" },
      { parameter: "Versorgungsquote", wert: "23% des Bruttogehalts" },
      { parameter: "Kosten-Koeffizient", wert: "0,072 Mrd. € pro 1.000 Beamte" },
      { parameter: "Natürliche Fluktuation", wert: "2,1% p.a." },
      { parameter: "Modell-Vereinfachung", wert: "Keine Neueinstellungen bei Reduzierung; Einsparungen sofort wirksam (kein 3-Jahres-Lag)" },
    ],
  },
  {
    titel: "Bundesministerien",
    farbe: "#8faabb",
    annahmen: [
      { parameter: "Kosten pro Ministerium", wert: "800 Mio. € (Personal, Gebäude, IT)", quelle: "Bundeshaushalt.de" },
      { parameter: "Koeffizient", wert: "0,8 Mrd. € pro Ministerium" },
      { parameter: "Modell-Vereinfachung", wert: "Einmalige Fusionskosten nicht explizit modelliert" },
    ],
  },
  {
    titel: "Verteidigung & Entwicklungshilfe",
    farbe: "#8faabb",
    annahmen: [
      { parameter: "Skalierung", wert: "1% BIP = 39,9 Mrd. €", quelle: "Bundesministerium der Verteidigung" },
      { parameter: "Rüstungsmultiplikator", wert: "1,3 auf BIP (nicht explizit in KPIs)" },
      { parameter: "Entwicklungshilfe-Skala", wert: "Identisch: 1% BIP = 39,9 Mrd. €", quelle: "BMZ / OECD DAC" },
      { parameter: "Indirekte Rückflüsse", wert: "Nicht modelliert" },
    ],
  },
  {
    titel: "Migration – Flüchtlinge",
    farbe: "#8faabb",
    annahmen: [
      { parameter: "Kosten pro Person/Jahr", wert: "18.000 € (Unterbringung, Sozialleistungen, Verwaltung)", quelle: "BAMF / IAB" },
      { parameter: "Koeffizient", wert: "0,018 Mrd. € pro 1.000 Personen" },
      { parameter: "Erwerbsquote nach Integration", wert: "60% nach 5 Jahren" },
      { parameter: "Steuer-/Sozialbeitrag nach Integration", wert: "Ø 9.200 €/Jahr (nicht in Kurzfristformel)" },
      { parameter: "Modell-Vereinfachung", wert: "Nur Kurzfristkosten modelliert; Langfristeffekte ausgeblendet" },
    ],
  },
  {
    titel: "Migration – Fachkräfte",
    farbe: "#8faabb",
    annahmen: [
      { parameter: "Steuereinnahmen pro Fachkraft", wert: "14.500 €/Jahr", quelle: "Bundesagentur für Arbeit / OECD" },
      { parameter: "Koeffizient Einnahmen", wert: "0,0145 Mrd. € pro 1.000 Fachkräfte" },
      { parameter: "BIP-Effekt", wert: "+0,0008% BIP pro 1.000 Fachkräfte" },
      { parameter: "Fachkräftelücke schließt sich", wert: "1.500 Stellen pro 1.000 Zuwanderer" },
      { parameter: "Ø-Bruttolohn (qualifiziert)", wert: "52.000 €/Jahr" },
      { parameter: "Modell-Vereinfachung", wert: "Sofortige Vollbeschäftigung angenommen" },
    ],
  },
  {
    titel: "Bürgergeld",
    farbe: "#8faabb",
    annahmen: [
      { parameter: "Anzahl Empfänger (konstant)", wert: "5,5 Mio.", quelle: "Bundesagentur für Arbeit" },
      { parameter: "Koeffizient", wert: "0,066 Mrd. € pro 1 €/Monat Änderung" },
      { parameter: "Arbeitsangebots-Elastizität", wert: "−0,3% Beschäftigung pro 10% Erhöhung (IAB)" },
      { parameter: "ALQ-Koeffizient", wert: "+0,0015 Prozentpunkte pro 1 €/Monat" },
      { parameter: "Modell-Vereinfachung", wert: "Empfängeranzahl fix; keine Veränderung der Vermittlungsquote" },
    ],
  },
  {
    titel: "Rentensystem",
    farbe: "#8faabb",
    annahmen: [
      { parameter: "Einsparung pro Jahr Rentenalter-Anhebung", wert: "18,5 Mrd. €", quelle: "Deutsche Rentenversicherung Bund" },
      { parameter: "Mehrkosten pro Prozentpunkt Rentenniveau", wert: "4,0 Mrd. €" },
      { parameter: "ALQ-Effekt Rentenalter", wert: "+0,05 Prozentpunkte pro Jahr Anhebung" },
      { parameter: "Modell-Vereinfachung", wert: "Keine Modellierung höherer Erwerbsminderungsrenten" },
      { parameter: "Modell-Vereinfachung", wert: "Gesundheitliche Arbeitsfähigkeit bis 70 unterstellt" },
    ],
  },
  {
    titel: "Gesundheit",
    farbe: "#8faabb",
    annahmen: [
      { parameter: "GKV-Beitragssatz (Baseline)", wert: "14,6%" },
      { parameter: "Einheitsversicherung – Mehrausgaben", wert: "+18 Mrd. € (höhere Versorgungskosten)" },
      { parameter: "Einheitsversicherung – Mehreinnahmen", wert: "+22 Mrd. € (Besserverdienende zahlen mehr)" },
      { parameter: "Einheitsversicherung – Nettoeffekt", wert: "+4 Mrd. € (Haushaltsverbesserung)" },
      { parameter: "Privatversicherung abschaffen – Mehrausgaben", wert: "+11 Mrd. € (Umstellungskosten)" },
      { parameter: "Privatversicherung abschaffen – Mehreinnahmen", wert: "+7 Mrd. € (höhere GKV-Beiträge)" },
      { parameter: "Privatversicherung abschaffen – Nettoeffekt", wert: "−4 Mrd. € (Haushaltsbelastung)" },
      { parameter: "Bundeszuschuss-Koeffizient (Beitragssatz)", wert: "−4 Mrd. € pro 1%-Punkt Erhöhung" },
      { parameter: "Ø-Beitragsgrundlage für Bürgereffekt", wert: "2.500 €/Monat → 25 €/Monat pro 0,1%-Punkt" },
    ],
  },
  {
    titel: "Steuern",
    farbe: "#8faabb",
    annahmen: [
      { parameter: "Spitzensteuersatz – Koeffizient", wert: "3,2 Mrd. € pro Prozentpunkt", quelle: "BMF / IW Köln" },
      { parameter: "Spitzensteuersatz – Laffer-Effekt", wert: "Elastizität −0,2 ab 50% (vereinfacht linear)" },
      { parameter: "Unternehmenssteuer – Koeffizient", wert: "3,0 Mrd. € pro Prozentpunkt" },
      { parameter: "Unternehmenssteuer – Wachstumseffekt", wert: "−0,015% BIP pro Prozentpunkt" },
      { parameter: "Vermögenssteuer", wert: "+9 Mrd. € Einnahmen (pauschal)" },
      { parameter: "Erbschaft-Freibetrag – Koeffizient", wert: "−0,005 Mrd. € pro 1.000 € Freibetrag (höher = weniger Einnahmen)" },
      { parameter: "Einkommensteuer – Wachstumseffekt", wert: "−0,008% BIP pro Prozentpunkt Spitzensatz" },
    ],
  },
  {
    titel: "Wirtschaftswachstum – Formel",
    farbe: "#f5a623",
    annahmen: [
      { parameter: "Basispfad", wert: "+0,8% BIP" },
      { parameter: "+ Fachkräfteeffekt", wert: "+0,0008 Prozentpunkte pro 1.000 Fachkräfte" },
      { parameter: "− Verteidigungseffekt", wert: "−0,08 Prozentpunkte pro 0,1%-Punkt BIP über Baseline" },
      { parameter: "− Einkommensteuereffekt", wert: "−0,008 Prozentpunkte pro Prozentpunkt Spitzensatz" },
      { parameter: "− Unternehmenssteuereffekt", wert: "−0,015 Prozentpunkte pro Prozentpunkt" },
      { parameter: "− Beamteneffekt", wert: "−0,00002 Prozentpunkte pro 1.000 Beamte" },
      { parameter: "Untergrenze", wert: "0% (kein negatives Wachstum modelliert)" },
      { parameter: "Szenario-Multiplikator", wert: "Wird auf gesamtes Ergebnis angewendet" },
    ],
  },
  {
    titel: "Arbeitslosenquote – Formel",
    farbe: "#f5a623",
    annahmen: [
      { parameter: "Basispfad", wert: "5,7%" },
      { parameter: "− Fachkräfteeffekt", wert: "−0,003 Prozentpunkte pro 1.000 Fachkräfte" },
      { parameter: "+ Bürgergeldeffekt", wert: "+0,0015 Prozentpunkte pro 1 €/Monat Erhöhung" },
      { parameter: "+ Rentenaltereffekt", wert: "+0,05 Prozentpunkte pro Jahr Anhebung" },
      { parameter: "Untergrenze", wert: "0%" },
      { parameter: "Modell-Vereinfachung", wert: "Kein Szenario-Multiplikator auf ALQ" },
    ],
  },
  {
    titel: "Nicht modellierte Effekte",
    farbe: "#e05c5c",
    annahmen: [
      { parameter: "Digitalisierung / KI", wert: "Kein Effekt auf Produktivität oder Beschäftigung modelliert" },
      { parameter: "Klimapolitik", wert: "Transformationskosten und -erlöse ausgeblendet" },
      { parameter: "Zinsentwicklung", wert: "Schuldendienstkosten statisch gehalten" },
      { parameter: "Außenhandel / Export", wert: "Keine Rückkopplung auf BIP durch Handelspolitik" },
      { parameter: "EU-Transfers", wert: "Nettobeitrag als konstant angenommen" },
      { parameter: "Demographischer Wandel", wert: "Bevölkerungsstruktur über Simulationshorizont eingefroren" },
      { parameter: "Geldpolitik / EZB", wert: "Inflation und Zinsen als exogen angenommen" },
      { parameter: "Schwarzmarkt / Schattenwirtschaft", wert: "Keine Modellierung von Verhaltensausweichungen" },
      { parameter: "Wechselwirkungen zwischen Parametern", wert: "Effekte werden additiv summiert, keine nichtlinearen Wechselwirkungen" },
    ],
  },
];

export default function AnnahmenPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-[#00c8b4] mb-2">Modellannahmen</h1>
          <p className="text-[#8faabb] text-sm leading-relaxed">
            Alle im Simulator verwendeten Annahmen, Koeffizienten und Vereinfachungen auf einen Blick.
            Die Simulation ist ein vereinfachtes Modell — reale wirtschaftliche Zusammenhänge sind deutlich komplexer.
            Nicht modellierte Wechselwirkungen und externe Schocks können die tatsächlichen Ergebnisse erheblich abweichen lassen.
          </p>
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
                    <th className="text-left px-4 py-2 text-[#8faabb] font-medium w-2/5">Parameter / Annahme</th>
                    <th className="text-left px-4 py-2 text-[#8faabb] font-medium w-2/5">Wert / Beschreibung</th>
                    <th className="text-left px-4 py-2 text-[#8faabb] font-medium w-1/5">Quelle</th>
                  </tr>
                </thead>
                <tbody>
                  {g.annahmen.map((a, i) => (
                    <tr
                      key={i}
                      className={`border-b border-[#1e3048] last:border-0 ${i % 2 === 0 ? "" : "bg-[#243447]/30"}`}
                    >
                      <td className="px-4 py-2.5 text-[#f0f4f8]">{a.parameter}</td>
                      <td className="px-4 py-2.5 font-mono text-xs" style={{ color: g.farbe }}>{a.wert}</td>
                      <td className="px-4 py-2.5 text-[#8faabb] text-xs">{a.quelle ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        <div className="bg-[#1a2b3c] border border-[#e05c5c]/30 rounded p-4 text-sm text-[#8faabb] leading-relaxed">
          <span className="text-[#e05c5c] font-semibold">Wichtig: </span>
          Dieses Modell dient ausschließlich der Bildung und Veranschaulichung. Die Koeffizienten sind
          vereinfacht und basieren auf publizierten Schätzungen aus Forschungsinstituten und Behörden.
          Für politische Entscheidungen sind detaillierte Wirkungsanalysen durch Fachbehörden (z.B. IMK,
          IWH, Sachverständigenrat, BMF) unerlässlich.
        </div>
      </div>
    </Layout>
  );
}
