import { useState, useEffect } from "react";

type ConsentState = { necessary: true; analytics: boolean; timestamp: number };
const KEY = "diz_cookie_consent";

function get(): string | null { try { return localStorage.getItem(KEY); } catch { return null; } }
function set(v: string): void { try { localStorage.setItem(KEY, v); } catch { /* */ } }
function del(): void { try { localStorage.removeItem(KEY); } catch { /* */ } }

export function useCookieConsent(): ConsentState | null {
  const raw = get();
  if (!raw) return null;
  try { return JSON.parse(raw) as ConsentState; } catch { return null; }
}

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => { if (!get()) setShow(true); }, []);

  function accept(analytics: boolean) {
    set(JSON.stringify({ necessary: true as const, analytics, timestamp: Date.now() }));
    setShow(false);
  }

  if (!show) return null;

  return (
    <div style={{
      position: "fixed", bottom: "1rem", left: "50%",
      transform: "translateX(-50%)", zIndex: 9999,
      width: "min(660px, calc(100vw - 2rem))",
      background: "rgba(15,34,54,0.97)",
      border: "1px solid #1e3a52",
      borderRadius: "0.75rem",
      padding: "1rem 1.25rem",
      boxShadow: "0 25px 50px rgba(0,0,0,.5)",
      color: "#f0f4f8",
      fontFamily: "inherit",
    }}>
      <p style={{ margin: "0 0 .5rem", fontSize: ".875rem", fontWeight: 600 }}>
        Diese Seite verwendet Cookies
      </p>
      <p style={{ margin: "0 0 .75rem", fontSize: ".75rem", color: "#8faabb", lineHeight: 1.6 }}>
        Notwendige Cookies sind immer aktiv. Mit deiner Zustimmung setzen wir anonyme Analyse-Cookies (kein Profiling, keine Weitergabe).
      </p>
      <div style={{ display: "flex", gap: ".5rem" }}>
        <button
          onClick={() => accept(false)}
          style={{
            flex: 1, padding: ".45rem .75rem", fontSize: ".75rem",
            border: "1px solid #1e3a52", borderRadius: ".5rem",
            background: "none", color: "#8faabb", cursor: "pointer",
          }}
        >
          Nur notwendige
        </button>
        <button
          onClick={() => accept(true)}
          style={{
            flex: 1, padding: ".45rem .75rem", fontSize: ".75rem", fontWeight: 600,
            border: "none", borderRadius: ".5rem",
            background: "#00c8b4", color: "#0d1b2a", cursor: "pointer",
          }}
        >
          Alle akzeptieren
        </button>
      </div>
      <p style={{ margin: ".6rem 0 0", fontSize: ".625rem", color: "#4a6278", textAlign: "center" }}>
        Einwilligung jederzeit unter{" "}
        <button
          onClick={() => { del(); setShow(true); }}
          style={{ background: "none", border: "none", textDecoration: "underline", color: "inherit", fontSize: "inherit", cursor: "pointer" }}
        >
          Datenschutzeinstellungen
        </button>
        {" "}widerrufbar.
      </p>
    </div>
  );
}
