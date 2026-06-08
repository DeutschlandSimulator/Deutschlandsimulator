import { useState } from "react";

type Mode = "einfach" | "experte";

export function ErweiterterModusToggle() {
  const [mode, setMode] = useState<Mode>("experte");
  const [activeSection, setActiveSection] = useState<string | null>("steuern");

  return (
    <div style={{ background: "#0d1b2a", minHeight: "100vh", fontFamily: "Inter, sans-serif", color: "#f0f4f8", fontSize: 13 }}>

      {/* ── Top Nav ── */}
      <div style={{ background: "#0d1b2a", borderBottom: "1px solid #1e3048", padding: "0 20px", height: 44, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "#00c8b4", fontWeight: 700, fontSize: 14 }}>DeutschlandSimulator</span>
        <nav style={{ display: "flex", gap: 20 }}>
          {["Simulator", "Quellen & Methodik"].map((l) => (
            <span key={l} style={{ color: "#8faabb", fontSize: 12, cursor: "pointer" }}>{l}</span>
          ))}
          <span style={{ background: "#00c8b4", color: "#0d1b2a", padding: "3px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700 }}>Mitmachen</span>
        </nav>
      </div>

      {/* ── Mode Banner ── */}
      <div style={{
        background: mode === "einfach" ? "rgba(0,200,180,0.08)" : "rgba(245,166,35,0.06)",
        borderBottom: `1px solid ${mode === "einfach" ? "rgba(0,200,180,0.25)" : "rgba(245,166,35,0.2)"}`,
        padding: "8px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, color: mode === "einfach" ? "#00c8b4" : "#f5a623", fontWeight: 600 }}>
            {mode === "einfach" ? "⚡ Einfacher Modus" : "🔬 Expertenmodus"}
          </span>
          <span style={{ fontSize: 11, color: "#8faabb" }}>
            {mode === "einfach"
              ? "5 Kernentscheidungen — kein Fachwissen nötig"
              : "35+ Parameter — vollständige Kontrolle über alle Stellschrauben"}
          </span>
        </div>
        {/* Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#8faabb" }}>Modus:</span>
          <div style={{ background: "#1a2b3c", border: "1px solid #1e3048", borderRadius: 999, padding: "2px" }} className="flex">
            {(["einfach", "experte"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  padding: "4px 14px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                  background: mode === m ? (m === "einfach" ? "#00c8b4" : "#f5a623") : "transparent",
                  color: mode === m ? "#0d1b2a" : "#8faabb",
                  border: "none", cursor: "pointer", transition: "all 0.2s",
                  textTransform: "capitalize",
                }}
              >
                {m === "einfach" ? "Einfach" : "Experte"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Szenario bar ── */}
      <div style={{ background: "#0d1b2a", borderBottom: "1px solid #1e3048", padding: "8px 20px", display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "#8faabb", marginRight: 4 }}>SZENARIO:</span>
        {["Optimistisch", "Realistisch", "Pessimistisch"].map((s) => (
          <button
            key={s}
            style={{
              padding: "4px 14px", borderRadius: 999, fontSize: 11, fontWeight: 600,
              background: s === "Realistisch" ? "#00c8b4" : "#1a2b3c",
              color: s === "Realistisch" ? "#0d1b2a" : "#8faabb",
              border: `1px solid ${s === "Realistisch" ? "#00c8b4" : "#1e3048"}`,
              cursor: "pointer",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ── Main layout ── */}
      <div style={{ display: "flex", height: "calc(100vh - 108px)", overflow: "hidden" }}>

        {/* Left panel */}
        <div style={{ width: 340, borderRight: "1px solid #1e3048", overflowY: "auto", padding: "12px 0" }}>
          <div style={{ padding: "0 16px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#f0f4f8" }}>Politische Parameter</span>
            <button style={{ fontSize: 10, color: "#8faabb", background: "transparent", border: "none", cursor: "pointer" }}>↺ Zurücksetzen</button>
          </div>

          {mode === "einfach" ? (
            /* Simplified left panel */
            <div style={{ padding: "0 12px" }}>
              {[
                { emoji: "💰", label: "Steuern", value: "Status quo" },
                { emoji: "👴", label: "Rente", value: "Status quo" },
                { emoji: "🌍", label: "Klima & Energie", value: "Aktueller Kurs" },
                { emoji: "🎓", label: "Bildung & Kita", value: "Status quo" },
                { emoji: "🌐", label: "Einwanderung", value: "Status quo" },
              ].map((item) => (
                <div key={item.label} style={{ background: "#1a2b3c", border: "1px solid #1e3048", borderRadius: 8, padding: "10px 12px", marginBottom: 8, cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{item.emoji} <span style={{ fontWeight: 600, fontSize: 12 }}>{item.label}</span></span>
                    <span style={{ fontSize: 11, color: "#00c8b4", fontWeight: 600 }}>{item.value}</span>
                  </div>
                  <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                    {["Weniger", "So lassen", "Mehr"].map((btn, i) => (
                      <button
                        key={btn}
                        style={{
                          flex: 1, padding: "4px 0", borderRadius: 5, fontSize: 10, fontWeight: 600,
                          background: i === 1 ? "#00c8b4" : "#0d1b2a",
                          color: i === 1 ? "#0d1b2a" : "#8faabb",
                          border: `1px solid ${i === 1 ? "#00c8b4" : "#1e3048"}`,
                          cursor: "pointer",
                        }}
                      >
                        {btn}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 8, padding: "10px 12px", background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.2)", borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: "#f5a623", fontWeight: 600, marginBottom: 3 }}>🔬 Mehr Kontrolle?</div>
                <div style={{ fontSize: 10, color: "#8faabb", lineHeight: 1.4 }}>Wechsle zum Expertenmodus für 35+ detaillierte Regler.</div>
                <button
                  onClick={() => setMode("experte")}
                  style={{ marginTop: 6, width: "100%", padding: "5px", borderRadius: 5, fontSize: 10, fontWeight: 700, background: "#f5a623", color: "#0d1b2a", border: "none", cursor: "pointer" }}
                >
                  Expertenmodus aktivieren →
                </button>
              </div>
            </div>
          ) : (
            /* Expert left panel — accordion-style */
            <div>
              {[
                { id: "staat",    label: "Staat",          items: ["Beamte", "Ministerien", "Verteidigung", "Entwicklungshilfe"] },
                { id: "migration",label: "Migration",      items: ["Flüchtlinge", "Fachkräfte", "EU-Zuwanderung"] },
                { id: "gesundheit",label:"Gesundheit",     items: ["Einheitsversicherung", "Beitragssatz"] },
                { id: "soziales", label: "Soziales",       items: ["Bürgergeld", "Rentenalter", "Rentenniveau"] },
                { id: "steuern",  label: "Steuern",        items: ["Einkommensteuer", "Unternehmenssteuer", "Vermögenssteuer"] },
                { id: "finanzen", label: "Finanzen",       items: ["Schuldenbremse"] },
                { id: "klima",    label: "Klima & Energie",items: ["CO₂-Preis", "Windausbau", "Solarausbau", "Kohleausstieg"] },
                { id: "wohnen",   label: "Wohnen",         items: ["Sozialwohnungen", "Mietpreisbremse"] },
                { id: "bildung",  label: "Bildung",        items: ["Bildungsausgaben", "Kita-Ausbau", "BAföG"] },
              ].map((section) => (
                <div key={section.id} style={{ borderBottom: "1px solid #1e3048" }}>
                  <button
                    onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                    style={{
                      width: "100%", padding: "9px 16px", background: "transparent", border: "none",
                      color: activeSection === section.id ? "#f0f4f8" : "#8faabb",
                      fontSize: 12, textAlign: "left", cursor: "pointer",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}
                  >
                    {section.label}
                    <span style={{ fontSize: 10 }}>{activeSection === section.id ? "▲" : "▼"}</span>
                  </button>
                  {activeSection === section.id && (
                    <div style={{ padding: "0 16px 12px" }}>
                      {section.items.map((item) => (
                        <div key={item} style={{ marginBottom: 8 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                            <span style={{ color: "#8faabb" }}>{item}</span>
                            <span style={{ color: "#00c8b4", fontWeight: 600 }}>Status quo</span>
                          </div>
                          <div style={{ height: 4, background: "#1e3048", borderRadius: 2, position: "relative" }}>
                            <div style={{ position: "absolute", left: "47%", top: 0, height: 12, width: 12, background: "#00c8b4", borderRadius: "50%", transform: "translateY(-4px)", cursor: "pointer" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div style={{ padding: "10px 12px", margin: "8px 12px", background: "rgba(0,200,180,0.06)", border: "1px solid rgba(0,200,180,0.2)", borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: "#00c8b4", fontWeight: 600, marginBottom: 3 }}>⚡ Lieber einfacher?</div>
                <div style={{ fontSize: 10, color: "#8faabb", lineHeight: 1.4 }}>5 Kernentscheidungen statt 35+ Regler.</div>
                <button
                  onClick={() => setMode("einfach")}
                  style={{ marginTop: 6, width: "100%", padding: "5px", borderRadius: 5, fontSize: 10, fontWeight: 700, background: "#00c8b4", color: "#0d1b2a", border: "none", cursor: "pointer" }}
                >
                  Zum einfachen Modus →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {/* Overview card */}
          <div style={{ background: "#1a2b3c", border: "1px solid #1e3048", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>Auswirkungen deiner Politik</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
              {[
                { icon: "🏛", label: "HAUSHALT",      val: "+0.0 Mrd.", sub: "Finanzierungssaldo" },
                { icon: "📈", label: "WIRTSCHAFT",    val: "+0.00%",   sub: "BIP-Wachstum" },
                { icon: "👷", label: "ARBEITSMARKT",  val: "±0 Jobs",  sub: "ALQ 5.7%" },
                { icon: "🌱", label: "KLIMA",         val: "0 Mt CO₂", sub: "670 Mt gesamt" },
              ].map((k) => (
                <div key={k.label} style={{ background: "#0d1b2a", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 9, color: "#8faabb", fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>
                    {k.icon} {k.label}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: "#00c8b4" }}>{k.val}</div>
                  <div style={{ fontSize: 9, color: "#8faabb", marginTop: 2 }}>{k.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* KPI grid */}
          <div style={{ fontSize: 11, fontWeight: 700, color: "#00c8b4", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
            ● Direkte Fiskalwirkung
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
            {[
              { label: "Haushaltsdefizit",      val: "34.2 Mrd.", color: "#e05c5c" },
              { label: "Steueraufkommen",        val: "948 Mrd.",  color: "#4caf82" },
              { label: "Investitionsspielraum",  val: "Aktive Bremse", color: "#f5a623" },
            ].map((k) => (
              <div key={k.label} style={{ background: "#1a2b3c", border: "1px solid #1e3048", borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ fontSize: 10, color: "#8faabb", marginBottom: 4 }}>{k.label}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: k.color }}>{k.val}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#f5a623", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
            ● Volkswirtschaftliche Wirkung
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
            {[
              { label: "Wirtschaftswachstum", val: "+0.8% BIP", color: "#4caf82" },
              { label: "Arbeitslosenquote",   val: "5.7%",      color: "#f5a623" },
              { label: "Fachkräftemangel",    val: "890k Stellen", color: "#e05c5c" },
            ].map((k) => (
              <div key={k.label} style={{ background: "#1a2b3c", border: "1px solid #1e3048", borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ fontSize: 10, color: "#8faabb", marginBottom: 4 }}>{k.label}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: k.color }}>{k.val}</div>
              </div>
            ))}
          </div>

          {/* Political compass teaser */}
          <div style={{ background: "#1a2b3c", border: "1px solid #1e3048", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Politischer Kompass</div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ width: 80, height: 80, position: "relative", borderRadius: 6, overflow: "hidden", border: "1px solid #1e3048" }}>
                <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr" }}>
                  <div style={{ background: "rgba(0,200,100,0.12)" }} />
                  <div style={{ background: "rgba(255,200,0,0.08)" }} />
                  <div style={{ background: "rgba(220,80,80,0.10)" }} />
                  <div style={{ background: "rgba(80,120,220,0.10)" }} />
                </div>
                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(143,170,187,0.2)" }} />
                <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(143,170,187,0.2)" }} />
                <div style={{ position: "absolute", left: 38, top: 28, width: 12, height: 12, borderRadius: "50%", background: "#00c8b4", boxShadow: "0 0 8px #00c8b4" }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#00c8b4", marginBottom: 2 }}>Liberal-Progressiv</div>
                <div style={{ fontSize: 11, color: "#8faabb" }}>Wirtschaftlich zentristisch · Gesellschaftlich progressiv</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
