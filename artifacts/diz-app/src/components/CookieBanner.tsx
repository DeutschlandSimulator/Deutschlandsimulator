import { useState, useEffect, useRef } from "react";
import { Cookie, X, ChevronDown, ChevronUp } from "lucide-react";

type ConsentState = {
  necessary: true;
  analytics: boolean;
  timestamp: number;
};

const STORAGE_KEY = "diz_cookie_consent";

function storageGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function storageSet(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* ignore */ }
}
function storageRemove(key: string): void {
  try { localStorage.removeItem(key); } catch { /* ignore */ }
}

export function useCookieConsent(): ConsentState | null {
  const raw = storageGet(STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as ConsentState; } catch { return null; }
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!storageGet(STORAGE_KEY)) {
      setVisible(true);
      timerRef.current = setTimeout(() => setMounted(true), 10);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  function save(analytics: boolean) {
    storageSet(STORAGE_KEY, JSON.stringify({ necessary: true, analytics, timestamp: Date.now() }));
    setMounted(false);
    setTimeout(() => setVisible(false), 320);
  }

  function reopen() {
    storageRemove(STORAGE_KEY);
    setVisible(true);
    setExpanded(true);
    timerRef.current = setTimeout(() => setMounted(true), 10);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie-Einstellungen"
      style={{
        position: "fixed",
        bottom: "1rem",
        left: "50%",
        transform: `translateX(-50%) translateY(${mounted ? "0" : "120px"})`,
        opacity: mounted ? 1 : 0,
        transition: "transform 0.32s cubic-bezier(0.34,1.56,0.64,1), opacity 0.32s ease",
        zIndex: 9999,
        width: "min(680px, calc(100vw - 2rem))",
      }}
    >
      <div style={{
        borderRadius: "0.75rem",
        border: "1px solid #1e3a52",
        background: "rgba(15,34,54,0.97)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
        padding: "1rem 1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Cookie size={16} color="#00c8b4" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "#f0f4f8" }}>
              Diese Seite verwendet Cookies
            </p>
          </div>
          <button
            onClick={() => save(false)}
            aria-label="Ablehnen und schließen"
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "0.25rem", borderRadius: "0.25rem",
              color: "#8faabb", flexShrink: 0,
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Description */}
        <p style={{ margin: 0, fontSize: "0.75rem", color: "#8faabb", lineHeight: 1.6 }}>
          Wir setzen notwendige Cookies für den Betrieb und — mit deiner Zustimmung —
          anonyme Analyse-Cookies (keine personenbezogenen Daten, keine Weitergabe an Dritte).
        </p>

        {/* Expand toggle */}
        <div>
          <button
            onClick={() => setExpanded((e) => !e)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "0.25rem",
              fontSize: "0.6875rem", color: "#00c8b4", padding: 0,
            }}
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {expanded ? "Weniger anzeigen" : "Details anzeigen"}
          </button>

          <div style={{
            overflow: "hidden",
            maxHeight: expanded ? "300px" : "0",
            opacity: expanded ? 1 : 0,
            transition: "max-height 0.25s ease, opacity 0.2s ease",
          }}>
            <div style={{
              marginTop: "0.75rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "0.5rem",
            }}>
              {[
                {
                  name: "Notwendig",
                  always: true,
                  desc: "Speichern deiner Cookie-Einwilligung und Simulator-Einstellungen (localStorage). Kein Tracking.",
                },
                {
                  name: "Analyse",
                  always: false,
                  desc: "Anonyme Nutzungsstatistiken (Seitenaufrufe, Regler-Interaktionen). Keine IP-Speicherung, kein Profiling.",
                },
              ].map((c) => (
                <div key={c.name} style={{
                  borderRadius: "0.5rem",
                  border: "1px solid #1e3a52",
                  background: "rgba(13,27,42,0.6)",
                  padding: "0.625rem 0.75rem",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#f0f4f8" }}>{c.name}</span>
                    <span style={{ fontSize: "0.625rem", color: c.always ? "#4caf82" : "#8faabb", fontWeight: c.always ? 500 : 400 }}>
                      {c.always ? "Immer aktiv" : "Optional"}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.6875rem", color: "#8faabb", lineHeight: 1.5 }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "0.5rem", paddingTop: "0.25rem", flexWrap: "wrap" }}>
          <button
            onClick={() => save(false)}
            style={{
              flex: 1, minWidth: 120,
              fontSize: "0.75rem", fontWeight: 500,
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #1e3a52",
              background: "none", cursor: "pointer",
              color: "#8faabb",
            }}
          >
            Nur notwendige
          </button>
          <button
            onClick={() => save(true)}
            style={{
              flex: 1, minWidth: 120,
              fontSize: "0.75rem", fontWeight: 600,
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              border: "none", cursor: "pointer",
              background: "#00c8b4",
              color: "#0d1b2a",
            }}
          >
            Alle akzeptieren
          </button>
        </div>

        <p style={{ margin: 0, fontSize: "0.625rem", color: "#4a6278", textAlign: "center" }}>
          Einwilligung jederzeit in den{" "}
          <button
            onClick={reopen}
            style={{
              background: "none", border: "none", cursor: "pointer",
              textDecoration: "underline", color: "inherit", fontSize: "inherit", padding: 0,
            }}
          >
            Datenschutzeinstellungen
          </button>{" "}
          widerrufbar.
        </p>
      </div>
    </div>
  );
}
