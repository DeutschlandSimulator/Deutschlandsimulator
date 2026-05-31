import { EvidenzLevel, KPIMeta, ScenarioMode, SliderInfo } from "./types";

export const SLIDER_INFO: Record<string, SliderInfo> = {
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
  euZuwanderung: {
    titel: "EU-Freizügigkeit",
    beschreibung: "Die EU-Freizügigkeit (Art. 45 AEUV) ermöglicht ca. 4,5 Mio. EU-Bürger:innen das Arbeiten in Deutschland. Sie ist ein Grundprinzip des EU-Binnenmarkts und kann von Deutschland nicht einseitig aufgekündigt werden. Das Modell simuliert ein hypothetisches Szenario, um wirtschaftliche Abhängigkeiten zu veranschaulichen.",
    aktuellerWert: "Aktiv (EU-Vertrag Art. 45 AEUV)",
    berechnungslogik: "Bei Abschaffung: ca. −10 Mrd. € Steuer- und Beitragseinnahmen (Ø 10.200 € je EU-Arbeitnehmer × 4,5 Mio.), −0,35 % BIP-Wachstum, +180k offene Fachkraftstellen. Handelswirkungen nicht modelliert.",
    annahmen: [
      "4,5 Mio. EU-Arbeitnehmer in Deutschland",
      "Ø Steuern und Sozialbeiträge: 10.200 €/Jahr",
      "Sofortiger vollständiger Effekt angenommen",
      "Keine Modellierung von Handelsumlenkungen",
    ],
    quellen: [
      { name: "Institut für Arbeitsmarkt- und Berufsforschung (IAB)", url: "https://iab.de", aktualisiert: "Jan 2024" },
      { name: "Eurostat – Arbeitsmigration EU", url: "https://ec.europa.eu/eurostat", aktualisiert: "Feb 2024" },
    ],
    evidenz: "mittel" as EvidenzLevel,
    evidenzHinweis: "Grundeffekte durch IAB-Daten gut belegt; langfristige Verhaltens- und Handelsanpassungen unsicher.",
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

export const scenarioMultipliers: Record<ScenarioMode, number> = {
  optimistisch: 1.3,
  realistisch: 1.0,
  pessimistisch: 0.65,
};

export const partyProfiles = [
  { name: "CDU/CSU", farbe: "#1d3a6e", abk: "CDU", beamte: 4700, ministerien: 14, verteidigung: 2.5, fachkraefte: 250, buergergeld: 450, rentenalter: 68, einkommensteuer: 40, vermoegenssteuer: false },
  { name: "SPD",     farbe: "#c0392b", abk: "SPD", beamte: 5000, ministerien: 17, verteidigung: 2.0, fachkraefte: 300, buergergeld: 560, rentenalter: 67, einkommensteuer: 45, vermoegenssteuer: false },
  { name: "FDP",     farbe: "#f0c040", abk: "FDP", beamte: 4200, ministerien: 12, verteidigung: 2.0, fachkraefte: 400, buergergeld: 420, rentenalter: 69, einkommensteuer: 35, vermoegenssteuer: false },
  { name: "Grüne",   farbe: "#2ecc71", abk: "GRÜ", beamte: 5200, ministerien: 18, verteidigung: 1.5, fachkraefte: 350, buergergeld: 620, rentenalter: 67, einkommensteuer: 48, vermoegenssteuer: true },
  { name: "AfD",     farbe: "#16a085", abk: "AfD", beamte: 4000, ministerien: 12, verteidigung: 3.0, fachkraefte: 80,  buergergeld: 400, rentenalter: 65, einkommensteuer: 38, vermoegenssteuer: false },
  { name: "Linke",   farbe: "#8e44ad", abk: "LNK", beamte: 5800, ministerien: 20, verteidigung: 1.0, fachkraefte: 200, buergergeld: 700, rentenalter: 63, einkommensteuer: 53, vermoegenssteuer: true },
];

export const barData = [
  { name: "Soziales", einnahmen: 0, ausgaben: 175 },
  { name: "Verteidigung", einnahmen: 0, ausgaben: 52 },
  { name: "Bildung", einnahmen: 0, ausgaben: 21 },
  { name: "Zinsen", einnahmen: 0, ausgaben: 37 },
  { name: "Sonstiges", einnahmen: 460, ausgaben: 191 },
];

export const lineData = [
  { year: "2024", statusQuo: 0.2, simulation: 0.2 },
  { year: "2025", statusQuo: 0.5, simulation: 0.9 },
  { year: "2026", statusQuo: 0.8, simulation: 1.3 },
  { year: "2027", statusQuo: 1.0, simulation: 1.6 },
  { year: "2028", statusQuo: 1.1, simulation: 1.9 },
  { year: "2029", statusQuo: 1.2, simulation: 2.2 },
  { year: "2030", statusQuo: 1.2, simulation: 2.5 },
];

export const areaData = [
  { year: "2020", einnahmen: 750, ausgaben: 850 },
  { year: "2021", einnahmen: 780, ausgaben: 860 },
  { year: "2022", einnahmen: 820, ausgaben: 840 },
  { year: "2023", einnahmen: 890, ausgaben: 910 },
  { year: "2024", einnahmen: 916, ausgaben: 950 },
  { year: "2025", einnahmen: 930, ausgaben: 960 },
  { year: "2026", einnahmen: 950, ausgaben: 980 },
  { year: "2027", einnahmen: 970, ausgaben: 990 },
  { year: "2028", einnahmen: 990, ausgaben: 1010 },
  { year: "2029", einnahmen: 1010, ausgaben: 1030 },
  { year: "2030", einnahmen: 1040, ausgaben: 1060 },
];

export const pieData = [
  { name: "Arbeit & Soziales", value: 175 },
  { name: "Verteidigung", value: 52 },
  { name: "Bildung & Forschung", value: 21 },
  { name: "Verkehr", value: 38 },
  { name: "Zinsen", value: 37 },
  { name: "Sonstiges", value: 153.8 },
];
export const COLORS = ["#00c8b4", "#4caf82", "#f5a623", "#8faabb", "#e05c5c", "#243447"];

export const ageData = [
  { age: "0-14", male: -6.5, female: 6.2 },
  { age: "15-24", male: -4.3, female: 4.1 },
  { age: "25-44", male: -11.4, female: 11.1 },
  { age: "45-59", male: -10.2, female: 10.0 },
  { age: "60-74", male: -7.8, female: 8.5 },
  { age: "75+", male: -3.9, female: 5.6 },
];

export const kpis: KPIMeta[] = [
  { label: "Haushaltsdefizit",    value: "-34.2 Mrd.",  color: "#e05c5c", sparkPoints: "0,10 10,12 20,5 30,15 40,8 50,18",  sparkColor: "#e05c5c", source: "Bundesministerium der Finanzen",     updated: "Mär 2024", confidence: "hoch"   },
  { label: "Staatsverschuldung",  value: "2.445 Mrd.",  color: "#f0f4f8", sparkPoints: "0,15 10,14 20,12 30,10 40,8 50,6",   sparkColor: "#8faabb", source: "Deutsche Bundesbank",             updated: "Feb 2024", confidence: "hoch"   },
  { label: "Steueraufkommen",     value: "916 Mrd.",    color: "#4caf82", sparkPoints: "0,15 10,12 20,16 30,8 40,5 50,2",    sparkColor: "#4caf82", source: "Statistisches Bundesamt",         updated: "Jan 2024", confidence: "hoch"   },
  { label: "Gesundheitskosten",   value: "468 Mrd.",    color: "#f0f4f8", sparkPoints: "0,12 10,11 20,13 30,10 40,9 50,11",  sparkColor: "#8faabb", source: "Bundesministerium für Gesundheit", updated: "Feb 2024", confidence: "mittel" },
  { label: "Rentenkosten",        value: "362 Mrd.",    color: "#f0f4f8", sparkPoints: "0,15 10,13 20,11 30,10 40,9 50,8",   sparkColor: "#8faabb", source: "Deutsche Rentenversicherung",     updated: "Jan 2024", confidence: "hoch"   },
  { label: "Arbeitslosenquote",   value: "5.7%",        color: "#e05c5c", sparkPoints: "0,5 10,8 20,6 30,10 40,12 50,14",    sparkColor: "#e05c5c", source: "Bundesagentur für Arbeit",         updated: "Mär 2024", confidence: "hoch"   },
  { label: "Fachkräftemangel",    value: "890k",        color: "#f5a623", sparkPoints: "0,5 10,6 20,8 30,10 40,12 50,14",    sparkColor: "#f5a623", source: "IW Köln / BA",                    updated: "Feb 2024", confidence: "mittel" },
  { label: "Wirtschaftswachstum", value: "+0.8%",       color: "#4caf82", sparkPoints: "0,15 10,12 20,10 30,7 40,4 50,2",    sparkColor: "#4caf82", source: "Sachverständigenrat Wirtschaft",   updated: "Nov 2023", confidence: "mittel" },
];
