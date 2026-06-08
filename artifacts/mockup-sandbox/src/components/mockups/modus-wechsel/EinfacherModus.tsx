import { useState, useEffect } from "react";

/* ─── Types ──────────────────────────────────────────────────────────── */
interface Impact {
  budget: number;
  growth: number;
  cost: number;
  co2: number;
  approval: number;
}
interface PolicyChoice {
  label: string;
  desc: string;
  impact: Impact;
}
interface Policy {
  id: string;
  emoji: string;
  title: string;
  question: string;
  featured?: boolean;
  choices: PolicyChoice[];
}

/* ─── Data ───────────────────────────────────────────────────────────── */
const POLICIES: Policy[] = [
  {
    id: "staatsfinanzen", emoji: "🏛", title: "Staatsfinanzen", featured: true,
    question: "Wie soll Deutschland seinen Haushalt sanieren?",
    choices: [
      { label: "Ausgaben stark kürzen", desc: "Subventionen und Sozialleistungen reduzieren", impact: { budget: 3, growth: -1, cost: -1, co2: 0, approval: -2 } },
      { label: "Neue Schulden aufnehmen", desc: "Investitionen jetzt, Tilgung später", impact: { budget: -3, growth: 2, cost: 0, co2: 0, approval: 1 } },
      { label: "Steuern erhöhen", desc: "Mehr Einnahmen durch höhere Abgaben", impact: { budget: 2, growth: -1, cost: 1, co2: 0, approval: -1 } },
      { label: "Graduelle Konsolidierung", desc: "Langsam und ausgewogen sparen", impact: { budget: 1, growth: 0, cost: 0, co2: 0, approval: 0 } },
    ],
  },
  {
    id: "wirtschaft", emoji: "📈", title: "Wirtschaft", featured: true,
    question: "Wie soll Deutschland als Wirtschaftsstandort gestärkt werden?",
    choices: [
      { label: "Unternehmenssteuern senken", desc: "Mehr Anreize für Investitionen und Jobs", impact: { budget: -2, growth: 2, cost: -1, co2: 1, approval: 0 } },
      { label: "Infrastruktur massiv ausbauen", desc: "Straßen, Schienen, Netze modernisieren", impact: { budget: -2, growth: 2, cost: 0, co2: -1, approval: 2 } },
      { label: "Bürokratie radikal abbauen", desc: "Genehmigungen schneller, weniger Aufwand", impact: { budget: 0, growth: 2, cost: -1, co2: 0, approval: 1 } },
      { label: "Aktueller Kurs", desc: "Keine grundlegenden Änderungen", impact: { budget: 0, growth: 0, cost: 0, co2: 0, approval: 0 } },
    ],
  },
  {
    id: "migration", emoji: "🌐", title: "Migration", featured: true,
    question: "Wie viele Menschen sollen nach Deutschland kommen?",
    choices: [
      { label: "Deutlich weniger Zuwanderung", desc: "Strengere Kontrollen, weniger Aufnahmen", impact: { budget: 1, growth: -1, cost: -1, co2: -1, approval: -1 } },
      { label: "Nur gezielte Fachkräfte", desc: "Punktesystem wie in Kanada oder Australien", impact: { budget: 0, growth: 2, cost: 0, co2: 0, approval: 1 } },
      { label: "Offene Arbeitsmigration", desc: "Wer Arbeit findet, darf bleiben", impact: { budget: -1, growth: 2, cost: 1, co2: 1, approval: 0 } },
      { label: "Wie heute", desc: "Keine Änderung am aktuellen System", impact: { budget: 0, growth: 0, cost: 0, co2: 0, approval: 0 } },
    ],
  },
  {
    id: "steuern", emoji: "💰", title: "Steuern",
    question: "Wer soll mehr zum Gemeinwohl beitragen?",
    choices: [
      { label: "Niedrigere Steuern für alle", desc: "Mehr Netto vom Brutto für jeden Bürger", impact: { budget: -2, growth: 1, cost: -1, co2: 0, approval: 2 } },
      { label: "Mehr Steuern für Reiche", desc: "Höherer Spitzensteuersatz ab 100.000 €", impact: { budget: 2, growth: -1, cost: 0, co2: 0, approval: 1 } },
      { label: "Vermögenssteuer einführen", desc: "Große Vermögen stärker belasten", impact: { budget: 2, growth: -1, cost: 0, co2: 0, approval: 0 } },
      { label: "Unverändert", desc: "Steuersystem bleibt wie heute", impact: { budget: 0, growth: 0, cost: 0, co2: 0, approval: 0 } },
    ],
  },
  {
    id: "rente", emoji: "👴", title: "Rente",
    question: "Wie soll das Rentensystem für die Zukunft gesichert werden?",
    choices: [
      { label: "Rentenalter auf 68 erhöhen", desc: "Länger arbeiten, Rentenkasse entlasten", impact: { budget: 2, growth: 1, cost: 0, co2: 0, approval: -3 } },
      { label: "Mehr staatliche Zuschüsse", desc: "Steuermittel für stabiles Rentenniveau", impact: { budget: -2, growth: 0, cost: 0, co2: 0, approval: 2 } },
      { label: "Aktienrente einführen", desc: "Kapitaldeckung wie in Schweden oder Norwegen", impact: { budget: -1, growth: 1, cost: 0, co2: 0, approval: 0 } },
      { label: "Wie heute", desc: "Umlageverfahren bleibt bestehen", impact: { budget: 0, growth: 0, cost: 0, co2: 0, approval: 0 } },
    ],
  },
  {
    id: "bildung", emoji: "🎓", title: "Bildung",
    question: "Wie soll die Bildung in Deutschland verbessert werden?",
    choices: [
      { label: "10 Mrd. mehr für Schulen", desc: "Sanierungen, mehr Lehrer, bessere Ausstattung", impact: { budget: -2, growth: 1, cost: 0, co2: 0, approval: 2 } },
      { label: "Kostenlose Kitas für alle", desc: "Frühkindliche Bildung als Staatspflicht", impact: { budget: -2, growth: 0, cost: -1, co2: 0, approval: 2 } },
      { label: "Digitalisierung beschleunigen", desc: "Laptops, WLAN und digitale Lehrpläne überall", impact: { budget: -1, growth: 1, cost: 0, co2: -1, approval: 1 } },
      { label: "Unverändert", desc: "Bildungsetat bleibt wie heute", impact: { budget: 0, growth: 0, cost: 0, co2: 0, approval: 0 } },
    ],
  },
  {
    id: "gesundheit", emoji: "🏥", title: "Gesundheit",
    question: "Wie soll die medizinische Versorgung organisiert werden?",
    choices: [
      { label: "Bürgerversicherung für alle", desc: "Alle zahlen ein — gleiche Leistung für jeden", impact: { budget: 0, growth: -1, cost: -1, co2: 0, approval: 1 } },
      { label: "Mehr Ärzte aufs Land", desc: "Landarztprämien und Förderprogramme", impact: { budget: -1, growth: 0, cost: 0, co2: 0, approval: 2 } },
      { label: "Wartezeiten deutlich kürzen", desc: "Mehr Kassensitze, digitale Arzttermine", impact: { budget: -1, growth: 0, cost: 0, co2: 0, approval: 2 } },
      { label: "Wie heute", desc: "Duales Versicherungssystem bleibt", impact: { budget: 0, growth: 0, cost: 0, co2: 0, approval: 0 } },
    ],
  },
  {
    id: "klima", emoji: "🌍", title: "Klima & Energie",
    question: "Wie schnell soll Deutschland aus Kohle und Gas aussteigen?",
    choices: [
      { label: "Sofortiger Kohleausstieg", desc: "2026 aus Kohle, 100% Erneuerbare bis 2035", impact: { budget: -2, growth: -1, cost: 2, co2: -4, approval: -1 } },
      { label: "Schneller als geplant", desc: "Kohleausstieg 2030, mehr Wind & Solar", impact: { budget: -1, growth: 0, cost: 1, co2: -3, approval: 1 } },
      { label: "Wirtschaftlich verträglich", desc: "Kohleausstieg 2038, Kosten niedrig halten", impact: { budget: 1, growth: 0, cost: -1, co2: 1, approval: 0 } },
      { label: "Aktueller Kurs", desc: "Bestehende Pläne unverändert umsetzen", impact: { budget: 0, growth: 0, cost: 0, co2: 0, approval: 0 } },
    ],
  },
  {
    id: "wohnen", emoji: "🏠", title: "Wohnungsbau",
    question: "Wie soll die Wohnungsnot in Städten gelöst werden?",
    choices: [
      { label: "400.000 Wohnungen pro Jahr bauen", desc: "Großes Bauprogramm des Staates", impact: { budget: -3, growth: 1, cost: -2, co2: 1, approval: 2 } },
      { label: "Mietpreisbremse verschärfen", desc: "Härtere Obergrenzen für Mieterhöhungen", impact: { budget: 0, growth: -1, cost: -1, co2: 0, approval: 2 } },
      { label: "Bauen einfacher machen", desc: "Bauvorschriften lockern, schneller genehmigen", impact: { budget: 0, growth: 1, cost: -1, co2: 1, approval: 1 } },
      { label: "Unverändert", desc: "Keine neuen Maßnahmen", impact: { budget: 0, growth: 0, cost: 0, co2: 0, approval: 0 } },
    ],
  },
  {
    id: "sicherheit", emoji: "🚔", title: "Innere Sicherheit",
    question: "Wie soll Deutschland sicherer werden?",
    choices: [
      { label: "30.000 neue Polizisten", desc: "Größere Polizeipräsenz, schnellere Reaktion", impact: { budget: -2, growth: 0, cost: 0, co2: 0, approval: 2 } },
      { label: "Prävention stärken", desc: "Mehr Sozialarbeit, Jugendprogramme", impact: { budget: -1, growth: 0, cost: 0, co2: 0, approval: 1 } },
      { label: "Härtere Strafen", desc: "Mindeststrafen erhöhen, weniger Bewährung", impact: { budget: 0, growth: 0, cost: 0, co2: 0, approval: 0 } },
      { label: "Wie heute", desc: "Kein grundlegender Wandel", impact: { budget: 0, growth: 0, cost: 0, co2: 0, approval: 0 } },
    ],
  },
  {
    id: "verteidigung", emoji: "🛡", title: "Verteidigung",
    question: "Wie stark soll Deutschland militärisch aufrüsten?",
    choices: [
      { label: "3% des BIP", desc: "Stärkste Armee Europas, globale Verantwortung", impact: { budget: -3, growth: 1, cost: 0, co2: 0, approval: -1 } },
      { label: "2% (NATO-Ziel)", desc: "Verpflichtungen erfüllen, Bündnis stärken", impact: { budget: -1, growth: 0, cost: 0, co2: 0, approval: 0 } },
      { label: "Diplomatie statt Aufrüstung", desc: "Weniger Militär, mehr Außenpolitik", impact: { budget: 1, growth: -1, cost: 0, co2: 0, approval: 1 } },
      { label: "Aktueller Kurs", desc: "Bisherige Planung beibehalten", impact: { budget: 0, growth: 0, cost: 0, co2: 0, approval: 0 } },
    ],
  },
  {
    id: "digital", emoji: "💻", title: "Digitalisierung",
    question: "Wie soll Deutschland digital aufholen?",
    choices: [
      { label: "100 Mrd. Investitionspaket", desc: "Glasfaser, KI-Hubs und digitaler Staat", impact: { budget: -3, growth: 3, cost: -1, co2: -2, approval: 2 } },
      { label: "Behörden voll digitalisieren", desc: "Alle Amtsgänge online erledigen", impact: { budget: -1, growth: 1, cost: -1, co2: -1, approval: 2 } },
      { label: "Privaten Sektor stärken", desc: "Regulierung abbauen, Startups fördern", impact: { budget: 0, growth: 2, cost: -1, co2: 0, approval: 0 } },
      { label: "Wie heute", desc: "Aktuelle Digitalpläne fortsetzen", impact: { budget: 0, growth: 0, cost: 0, co2: 0, approval: 0 } },
    ],
  },
];

const TOTAL = POLICIES.length;
const FEATURED_IDS = ["staatsfinanzen", "wirtschaft", "migration"];
const FEATURED = POLICIES.filter((p) => FEATURED_IDS.includes(p.id));
const REST = POLICIES.filter((p) => !FEATURED_IDS.includes(p.id));

/* ─── Archetype logic ────────────────────────────────────────────────── */
function getArchetype(impacts: Impact) {
  const { budget, growth, co2, approval } = impacts;
  if (co2 <= -6) return { label: "Grüner Modernisierer", color: "#4caf82", desc: "Klimaschutz über alles — die Zukunft zählt mehr als kurzfristige Kosten.", icon: "🌱" };
  if (budget >= 5 && growth <= 0) return { label: "Konservativer Konsolidierer", color: "#8faabb", desc: "Solide Finanzen, klare Grenzen — Beständigkeit vor Wandel.", icon: "🏛" };
  if (budget <= -5 && approval >= 3) return { label: "Sozialstaat-Ausbauer", color: "#00c8b4", desc: "Mehr Staat, mehr Solidarität — Investitionen in den Zusammenhalt.", icon: "🤝" };
  if (growth >= 6) return { label: "Wirtschaftsliberaler Reformer", color: "#f5a623", desc: "Wachstum durch Freiheit — der Markt löst mehr als der Staat.", icon: "📈" };
  return { label: "Pragmatischer Ausgleicher", color: "#a78bfa", desc: "Kein Dogma — du suchst den besten Kompromiss für Deutschland.", icon: "⚖️" };
}

/* ─── Helpers ────────────────────────────────────────────────────────── */
function kpiBar(value: number, max: number, posColor: string, negColor: string) {
  const pct = Math.min(Math.abs(value) / max, 1) * 50;
  return (
    <div style={{ height: 4, background: "#1e3048", borderRadius: 2, position: "relative", overflow: "visible" }}>
      <div style={{ position: "absolute", left: "50%", top: -4, bottom: -4, width: 1, background: "#2a3f52" }} />
      {value !== 0 && (
        <div style={{
          position: "absolute",
          [value > 0 ? "left" : "right"]: "50%",
          width: `${pct}%`,
          top: 0, height: 4,
          background: value > 0 ? posColor : negColor,
          borderRadius: 2,
          transition: "width 0.4s ease",
        }} />
      )}
    </div>
  );
}

/* ─── Component ──────────────────────────────────────────────────────── */
export function EinfacherModus() {
  const [decisions, setDecisions] = useState<Record<string, number>>({});
  const [mode, setMode] = useState<"einfach" | "experte">("einfach");
  const [showPopup, setShowPopup] = useState(false);
  const [popupShown, setPopupShown] = useState(false);
  const [view, setView] = useState<"main" | "results">("main");

  const count = Object.keys(decisions).length;

  useEffect(() => {
    if (count === 5 && !popupShown) {
      setShowPopup(true);
      setPopupShown(true);
    }
    if (count === TOTAL) {
      setTimeout(() => setView("results"), 300);
    }
  }, [count, popupShown]);

  const totals: Impact = POLICIES.reduce(
    (acc, p) => {
      const idx = decisions[p.id];
      if (idx === undefined) return acc;
      const imp = p.choices[idx].impact;
      return {
        budget: acc.budget + imp.budget,
        growth: acc.growth + imp.growth,
        cost: acc.cost + imp.cost,
        co2: acc.co2 + imp.co2,
        approval: acc.approval + imp.approval,
      };
    },
    { budget: 0, growth: 0, cost: 0, co2: 0, approval: 0 }
  );

  const select = (policyId: string, choiceIdx: number) => {
    setDecisions((p) => ({ ...p, [policyId]: choiceIdx }));
  };

  const archetype = getArchetype(totals);

  /* ── Popup ── */
  if (showPopup) {
    const positives = [
      totals.growth > 0 && "📈 stärkerem Wirtschaftswachstum",
      totals.co2 < 0 && "🌍 sinkenden CO₂-Emissionen",
      totals.budget > 0 && "🏛 einem ausgeglicheneren Haushalt",
      totals.approval > 0 && "😊 höherer Bürgerzufriedenheit",
    ].filter(Boolean) as string[];
    const negatives = [
      totals.budget < 0 && "📉 einem höheren Staatsdefizit",
      totals.co2 > 0 && "☁️ mehr CO₂-Emissionen",
      totals.growth < 0 && "📉 geringerem Wirtschaftswachstum",
      totals.cost > 0 && "💸 höheren Lebenshaltungskosten",
    ].filter(Boolean) as string[];

    return (
      <div style={{ background: "#0d1b2a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "Inter, sans-serif" }}>
        <div style={{ background: "#1a2b3c", border: "1px solid #00c8b4", borderRadius: 16, padding: 28, maxWidth: 420, width: "100%" }}>
          <div style={{ fontSize: 28, marginBottom: 8, textAlign: "center" }}>🎯</div>
          <h2 style={{ color: "#f0f4f8", fontSize: 16, fontWeight: 700, textAlign: "center", marginBottom: 4 }}>Zwischenauswertung</h2>
          <p style={{ color: "#8faabb", fontSize: 12, textAlign: "center", marginBottom: 20 }}>5 von 12 Entscheidungen getroffen. Deine Politik führt aktuell zu:</p>
          {positives.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              {positives.map((p) => (
                <div key={p} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  <span style={{ color: "#4caf82", fontSize: 13 }}>+</span>
                  <span style={{ color: "#f0f4f8", fontSize: 12 }}>{p}</span>
                </div>
              ))}
            </div>
          )}
          {negatives.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              {negatives.map((n) => (
                <div key={n} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  <span style={{ color: "#e05c5c", fontSize: 13 }}>−</span>
                  <span style={{ color: "#f0f4f8", fontSize: 12 }}>{n}</span>
                </div>
              ))}
            </div>
          )}
          {positives.length === 0 && negatives.length === 0 && (
            <p style={{ color: "#8faabb", fontSize: 12, textAlign: "center", marginBottom: 20 }}>Du hast den Status quo gewählt — keine Veränderung.</p>
          )}
          <button
            onClick={() => setShowPopup(false)}
            style={{ width: "100%", padding: "11px", borderRadius: 10, fontSize: 13, fontWeight: 700, background: "#00c8b4", color: "#0d1b2a", border: "none", cursor: "pointer" }}
          >
            Weiter zu den nächsten Entscheidungen →
          </button>
        </div>
      </div>
    );
  }

  /* ── Results ── */
  if (view === "results") {
    const budgetEur = (totals.budget * 8).toFixed(0);
    const growthPct = (totals.growth * 0.2).toFixed(1);
    const co2Mt = (totals.co2 * 15).toFixed(0);
    const costPct = (totals.cost * 1.5).toFixed(1);

    return (
      <div style={{ background: "#0d1b2a", minHeight: "100vh", fontFamily: "Inter, sans-serif", color: "#f0f4f8", padding: "24px 20px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>{archetype.icon}</div>
          <div style={{ fontSize: 11, color: "#8faabb", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>Dein politisches Profil</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: archetype.color, marginBottom: 8 }}>{archetype.label}</h1>
          <p style={{ fontSize: 13, color: "#8faabb", maxWidth: 360, margin: "0 auto", lineHeight: 1.5 }}>{archetype.desc}</p>
        </div>

        {/* KPI Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[
            { label: "Haushaltswirkung", val: `${Number(budgetEur) >= 0 ? "+" : ""}${budgetEur} Mrd.`, good: Number(budgetEur) >= 0, icon: "🏛", sub: "Finanzierungssaldo" },
            { label: "Wirtschaftswachstum", val: `${Number(growthPct) >= 0 ? "+" : ""}${growthPct}% BIP`, good: Number(growthPct) >= 0, icon: "📈", sub: "vs. Status quo" },
            { label: "CO₂-Emissionen", val: `${Number(co2Mt) <= 0 ? "" : "+"}${co2Mt} Mt`, good: Number(co2Mt) <= 0, icon: "🌍", sub: "vs. Status quo" },
            { label: "Lebenshaltungskosten", val: `${Number(costPct) <= 0 ? "" : "+"}${costPct}%`, good: Number(costPct) <= 0, icon: "🛒", sub: "vs. Status quo" },
          ].map((k) => (
            <div key={k.label} style={{ background: "#1a2b3c", border: "1px solid #1e3048", borderRadius: 10, padding: "14px 14px" }}>
              <div style={{ fontSize: 10, color: "#8faabb", marginBottom: 6 }}>{k.icon} {k.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: k.good ? "#4caf82" : "#e05c5c", marginBottom: 2 }}>{k.val}</div>
              <div style={{ fontSize: 9, color: "#8faabb" }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Summary card */}
        <div style={{ background: "#1a2b3c", border: `1px solid ${archetype.color}40`, borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: archetype.color, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Gesellschaftliche Auswirkungen</div>
          <div className="space-y-2">
            {[
              { label: "Haushalt & Schulden", value: totals.budget, posText: "Finanzierungssaldo verbessert", negText: "Staatsdefizit steigt" },
              { label: "Wirtschaft & Jobs", value: totals.growth, posText: "Wachstum und Beschäftigung steigen", negText: "Wirtschaft verliert Dynamik" },
              { label: "Klimaschutz", value: -totals.co2, posText: "CO₂-Emissionen sinken deutlich", negText: "CO₂-Ausstoß steigt" },
              { label: "Bürgerzufriedenheit", value: totals.approval, posText: "Bevölkerung profitiert spürbar", negText: "Unpopuläre Maßnahmen dominieren" },
            ].map((row) => (
              <div key={row.label} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: "#8faabb" }}>{row.label}</span>
                  <span style={{ color: row.value > 0 ? "#4caf82" : row.value < 0 ? "#e05c5c" : "#8faabb", fontWeight: 600, fontSize: 10 }}>
                    {row.value > 0 ? row.posText : row.value < 0 ? row.negText : "Neutral"}
                  </span>
                </div>
                {kpiBar(row.value, 8, "#4caf82", "#e05c5c")}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => { setView("main"); setDecisions({}); setPopupShown(false); }}
          style={{ width: "100%", padding: "12px", borderRadius: 10, fontSize: 13, fontWeight: 700, background: "#00c8b4", color: "#0d1b2a", border: "none", cursor: "pointer", marginBottom: 8 }}
        >
          Nochmal versuchen
        </button>
        <button
          style={{ width: "100%", padding: "12px", borderRadius: 10, fontSize: 13, fontWeight: 700, background: "#1a2b3c", color: "#00c8b4", border: "1px solid #00c8b4", cursor: "pointer" }}
        >
          Zum Expertenmodus wechseln →
        </button>
      </div>
    );
  }

  /* ── Main ── */
  return (
    <div style={{ background: "#0d1b2a", minHeight: "100vh", fontFamily: "Inter, sans-serif", color: "#f0f4f8" }}>

      {/* ── Nav ── */}
      <div style={{ background: "#0d1b2a", borderBottom: "1px solid #1e3048", padding: "0 18px", height: 44, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "#00c8b4", fontWeight: 700, fontSize: 14 }}>DeutschlandSimulator</span>
        <div style={{ background: "#1a2b3c", border: "1px solid #1e3048", borderRadius: 999, padding: "2px" }} className="flex">
          {(["einfach", "experte"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} style={{
              padding: "4px 14px", borderRadius: 999, fontSize: 11, fontWeight: 600,
              background: mode === m ? "#00c8b4" : "transparent",
              color: mode === m ? "#0d1b2a" : "#8faabb",
              border: "none", cursor: "pointer", transition: "all 0.2s",
            }}>
              {m === "einfach" ? "Bürger-Modus" : "Experten-Modus"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div style={{ background: "#1a2b3c", borderBottom: "1px solid #1e3048", padding: "8px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8faabb", marginBottom: 6 }}>
          <span style={{ fontWeight: 600, color: "#f0f4f8" }}>{count} von {TOTAL} Entscheidungen getroffen</span>
          <span style={{ color: count === TOTAL ? "#4caf82" : "#8faabb" }}>{count === TOTAL ? "✓ Abgeschlossen" : `Noch ${TOTAL - count} offen`}</span>
        </div>
        <div style={{ height: 5, background: "#0d1b2a", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(count / TOTAL) * 100}%`, background: "#00c8b4", borderRadius: 3, transition: "width 0.4s ease" }} />
        </div>
      </div>

      <div style={{ padding: "16px 18px", maxWidth: 900, margin: "0 auto" }}>

        {/* ── Headline KPIs ── */}
        {count > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginBottom: 16 }}>
            {[
              { label: "Haushalt", val: totals.budget > 0 ? `+${totals.budget * 8}Mrd` : `${totals.budget * 8}Mrd`, good: totals.budget >= 0 },
              { label: "Wachstum", val: totals.growth > 0 ? `+${(totals.growth * 0.2).toFixed(1)}%` : `${(totals.growth * 0.2).toFixed(1)}%`, good: totals.growth >= 0 },
              { label: "Lebenskosten", val: totals.cost <= 0 ? `${(totals.cost * 1.5).toFixed(1)}%` : `+${(totals.cost * 1.5).toFixed(1)}%`, good: totals.cost <= 0 },
              { label: "CO₂", val: totals.co2 <= 0 ? `${totals.co2 * 15}Mt` : `+${totals.co2 * 15}Mt`, good: totals.co2 <= 0 },
              { label: "Zufriedenheit", val: totals.approval > 0 ? `+${totals.approval}` : `${totals.approval}`, good: totals.approval >= 0 },
            ].map((k) => (
              <div key={k.label} style={{ background: "#1a2b3c", border: "1px solid #1e3048", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "#8faabb", marginBottom: 2 }}>{k.label}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: k.good ? "#4caf82" : "#e05c5c" }}>{k.val}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── Section 1: Featured ── */}
        <div style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#f5a623", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>
            ★ Wichtigste Herausforderungen
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
            {FEATURED.map((policy) => (
              <PolicyCard key={policy.id} policy={policy} selected={decisions[policy.id]} onSelect={(i) => select(policy.id, i)} featured />
            ))}
          </div>
        </div>

        {/* ── Section 2: Rest ── */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#8faabb", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>
            Weitere Politikfelder
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {REST.map((policy) => (
              <PolicyCard key={policy.id} policy={policy} selected={decisions[policy.id]} onSelect={(i) => select(policy.id, i)} featured={false} />
            ))}
          </div>
        </div>

        {/* Finish CTA */}
        {count === TOTAL && (
          <div style={{ marginTop: 20 }}>
            <button
              onClick={() => setView("results")}
              style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 14, fontWeight: 800, background: "#00c8b4", color: "#0d1b2a", border: "none", cursor: "pointer" }}
            >
              Mein politisches Profil anzeigen →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── PolicyCard ─────────────────────────────────────────────────────── */
function PolicyCard({ policy, selected, onSelect, featured }: {
  policy: Policy;
  selected: number | undefined;
  onSelect: (i: number) => void;
  featured: boolean;
}) {
  const done = selected !== undefined;

  return (
    <div style={{
      background: "#1a2b3c",
      border: `1.5px solid ${done ? "#00c8b4" : featured ? "rgba(245,166,35,0.35)" : "#1e3048"}`,
      borderRadius: 10,
      padding: "14px 14px 12px",
      transition: "border-color 0.2s",
      position: "relative",
    }}>
      {done && (
        <div style={{ position: "absolute", top: 10, right: 10, width: 18, height: 18, borderRadius: "50%", background: "#00c8b4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#0d1b2a", fontWeight: 700 }}>✓</div>
      )}
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: featured ? 20 : 18 }}>{policy.emoji}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: featured ? 13 : 12, color: "#f0f4f8" }}>{policy.title}</div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: "#b0c4d4", lineHeight: 1.4, marginBottom: 10, fontStyle: "italic" }}>
        „{policy.question}"
      </div>
      {/* Choices */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {policy.choices.map((choice, i) => {
          const isActive = selected === i;
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              style={{
                width: "100%", textAlign: "left", padding: "7px 10px", borderRadius: 7, fontSize: 11,
                border: `1.5px solid ${isActive ? "#00c8b4" : "#1e3048"}`,
                background: isActive ? "rgba(0,200,180,0.1)" : "#0d1b2a",
                color: isActive ? "#f0f4f8" : "#8faabb",
                cursor: "pointer", transition: "all 0.15s", lineHeight: 1.3,
              }}
            >
              <span style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: isActive ? "#00c8b4" : "#3a5068", fontSize: 10, marginTop: 1, flexShrink: 0 }}>
                  {isActive ? "●" : "○"}
                </span>
                <span>
                  <span style={{ fontWeight: isActive ? 600 : 400 }}>{choice.label}</span>
                  <span style={{ color: "#8faabb", fontSize: 9.5, display: "block", marginTop: 1 }}>{choice.desc}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
