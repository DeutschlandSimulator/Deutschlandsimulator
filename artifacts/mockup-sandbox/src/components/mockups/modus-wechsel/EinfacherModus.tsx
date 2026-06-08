import { useState } from "react";

type Choice = -1 | 0 | 1;

interface PolicyCard {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  labels: [string, string, string];
  descriptions: [string, string, string];
}

const POLICIES: PolicyCard[] = [
  {
    id: "steuern",
    emoji: "💰",
    title: "Steuern",
    subtitle: "Wer zahlt wie viel?",
    labels: ["Senken", "So lassen", "Erhöhen"],
    descriptions: [
      "Weniger Steuern für alle — mehr Geld im Portemonnaie, aber weniger für den Staat",
      "Steuern bleiben wie heute",
      "Höhere Steuern auf große Einkommen und Vermögen — mehr Geld für Investitionen",
    ],
  },
  {
    id: "rente",
    emoji: "👴",
    title: "Rente",
    subtitle: "Wie sicher ist das Alter?",
    labels: ["Einsparen", "So lassen", "Stärken"],
    descriptions: [
      "Rentenalter heraufsetzen, Niveau leicht senken — spart Geld",
      "Rentensystem bleibt wie heute",
      "Stabiles Rentenniveau sichern — kostet mehr, entlastet Rentner",
    ],
  },
  {
    id: "klima",
    emoji: "🌍",
    title: "Klima & Energie",
    subtitle: "Wie schnell umsteigen?",
    labels: ["Langsamer", "Aktueller Kurs", "Schneller"],
    descriptions: [
      "Kohle länger nutzen, Erneuerbare langsamer ausbauen — billiger kurzfristig",
      "Energiewende im aktuellen Tempo fortsetzen",
      "Kohle schnell raus, viel mehr Wind & Solar — teurer heute, billiger morgen",
    ],
  },
  {
    id: "bildung",
    emoji: "🎓",
    title: "Bildung & Kita",
    subtitle: "Investition in die Zukunft",
    labels: ["Kürzen", "So lassen", "Investieren"],
    descriptions: [
      "Bildungsausgaben reduzieren — kurzfristig spart es Geld",
      "Bildungsetat bleibt wie heute",
      "Mehr Geld für Schulen, Kitas und Hochschulen — wirkt in 10 Jahren",
    ],
  },
  {
    id: "einwanderung",
    emoji: "🌐",
    title: "Einwanderung",
    subtitle: "Wer kommt, wer bleibt?",
    labels: ["Bremsen", "So lassen", "Öffnen"],
    descriptions: [
      "Weniger Zuwanderung — niedrigere Kosten, aber auch weniger Fachkräfte",
      "Einwanderungspolitik bleibt wie heute",
      "Mehr Fachkräfte und EU-Zuwanderung — füllt den Arbeitsmarkt",
    ],
  },
];

const CHOICE_COLORS: Record<string, string> = {
  "-1": "border-[#e05c5c] bg-[#e05c5c]/10 text-[#e05c5c]",
  "0":  "border-[#00c8b4] bg-[#00c8b4]/10 text-[#00c8b4]",
  "1":  "border-[#4caf82] bg-[#4caf82]/10 text-[#4caf82]",
};

const IDLE_COLOR = "border-[#1e3048] bg-[#1a2b3c] text-[#8faabb] hover:border-[#00c8b4]/50 hover:text-[#f0f4f8]";

export function EinfacherModus() {
  const [choices, setChoices] = useState<Record<string, Choice>>({
    steuern: 0, rente: 0, klima: 0, bildung: 0, einwanderung: 0,
  });
  const [mode, setMode] = useState<"einfach" | "experte">("einfach");

  const sum = Object.values(choices).reduce((a, b) => a + b, 0);
  const haushalt = sum * -0.8;
  const wachstum = sum * 0.15;
  const co2     = sum * -8;

  return (
    <div className="min-h-screen" style={{ background: "#0d1b2a", fontFamily: "Inter, sans-serif", color: "#f0f4f8" }}>
      {/* ── Nav ── */}
      <div style={{ background: "#0d1b2a", borderBottom: "1px solid #1e3048" }} className="px-6 py-3 flex items-center justify-between">
        <span style={{ color: "#00c8b4", fontWeight: 700, fontSize: 15 }}>DeutschlandSimulator</span>
        {/* Mode toggle */}
        <div style={{ background: "#1a2b3c", border: "1px solid #1e3048", borderRadius: 999, padding: "3px" }} className="flex items-center gap-1">
          <button
            onClick={() => setMode("einfach")}
            style={{
              padding: "5px 16px", borderRadius: 999, fontSize: 12, fontWeight: 600,
              background: mode === "einfach" ? "#00c8b4" : "transparent",
              color: mode === "einfach" ? "#0d1b2a" : "#8faabb",
              border: "none", cursor: "pointer", transition: "all 0.2s",
            }}
          >
            Einfach
          </button>
          <button
            onClick={() => setMode("experte")}
            style={{
              padding: "5px 16px", borderRadius: 999, fontSize: 12, fontWeight: 600,
              background: mode === "experte" ? "#00c8b4" : "transparent",
              color: mode === "experte" ? "#0d1b2a" : "#8faabb",
              border: "none", cursor: "pointer", transition: "all 0.2s",
            }}
          >
            Experte
          </button>
        </div>
      </div>

      <div className="px-6 py-5 max-w-3xl mx-auto">
        {/* ── Intro ── */}
        <div className="mb-5">
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Was würdest du anders machen?</h1>
          <p style={{ color: "#8faabb", fontSize: 13 }}>5 Entscheidungen — kein Fachwissen nötig. Die Auswirkungen siehst du sofort.</p>
        </div>

        {/* ── Policy cards ── */}
        <div className="space-y-3">
          {POLICIES.map((policy) => {
            const current = choices[policy.id];
            return (
              <div
                key={policy.id}
                style={{ background: "#1a2b3c", border: "1px solid #1e3048", borderRadius: 10, padding: "14px 16px" }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span style={{ fontSize: 22, lineHeight: 1 }}>{policy.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{policy.title}</div>
                    <div style={{ color: "#8faabb", fontSize: 12 }}>{policy.subtitle}</div>
                  </div>
                </div>
                {/* Three choices */}
                <div className="grid grid-cols-3 gap-2">
                  {([-1, 0, 1] as Choice[]).map((val) => {
                    const idx = val + 1;
                    const isActive = current === val;
                    return (
                      <button
                        key={val}
                        onClick={() => setChoices((p) => ({ ...p, [policy.id]: val }))}
                        style={{
                          borderRadius: 8, padding: "8px 6px", fontSize: 11, fontWeight: 600,
                          border: `1.5px solid`, cursor: "pointer", transition: "all 0.15s",
                          textAlign: "center", lineHeight: 1.3,
                        }}
                        className={isActive ? CHOICE_COLORS[String(val)] : IDLE_COLOR}
                      >
                        <div style={{ fontSize: 13, marginBottom: 2 }}>{policy.labels[idx]}</div>
                        <div style={{ fontWeight: 400, fontSize: 10, opacity: 0.75 }}>{policy.descriptions[idx]}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── KPI summary ── */}
        <div style={{ background: "#1a2b3c", border: "1px solid #1e3048", borderRadius: 10, padding: "14px 16px", marginTop: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#8faabb", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
            Auswirkungen deiner Entscheidungen
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Staatshaushalt", value: haushalt >= 0 ? `+${haushalt.toFixed(1)} Mrd.` : `${haushalt.toFixed(1)} Mrd.`, pos: haushalt >= 0, hint: "Überschuss / Defizit" },
              { label: "Wirtschaftswachstum", value: wachstum >= 0 ? `+${wachstum.toFixed(2)}% BIP` : `${wachstum.toFixed(2)}% BIP`, pos: wachstum >= 0, hint: "vs. Status quo" },
              { label: "CO₂-Emissionen", value: co2 <= 0 ? `${co2.toFixed(0)} Mt` : `+${co2.toFixed(0)} Mt`, pos: co2 <= 0, hint: "vs. Status quo" },
            ].map((k) => (
              <div key={k.label} style={{ background: "#0d1b2a", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, color: "#8faabb", marginBottom: 3 }}>{k.label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: k.pos ? "#4caf82" : "#e05c5c" }}>{k.value}</div>
                <div style={{ fontSize: 9, color: "#8faabb", marginTop: 1 }}>{k.hint}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <button
              style={{
                width: "100%", padding: "10px", borderRadius: 8, fontSize: 13, fontWeight: 700,
                background: "#00c8b4", color: "#0d1b2a", border: "none", cursor: "pointer",
              }}
            >
              Detaillierte Analyse anzeigen →
            </button>
          </div>
        </div>

        <div style={{ fontSize: 10, color: "#8faabb", textAlign: "center", marginTop: 10 }}>
          Vereinfachtes Modell — für volle Kontrolle: Expertenmodus aktivieren
        </div>
      </div>
    </div>
  );
}
