import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, X, ChevronDown, ChevronUp } from "lucide-react";

type ConsentState = {
  necessary: true;
  analytics: boolean;
  timestamp: number;
};

const STORAGE_KEY = "diz_cookie_consent";

export function useCookieConsent() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  function save(analytics: boolean) {
    const consent: ConsentState = { necessary: true, analytics, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          exit={{   y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(680px,calc(100vw-2rem))]"
          role="dialog"
          aria-label="Cookie-Einstellungen"
        >
          <div className="rounded-xl border border-[#1e3a52] bg-[#0f2236]/95 backdrop-blur shadow-2xl px-5 py-4 space-y-3">

            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Cookie size={16} className="text-[#00c8b4] shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-[#f0f4f8]">
                  Diese Seite verwendet Cookies
                </p>
              </div>
              <button
                onClick={() => save(false)}
                aria-label="Ablehnen und schließen"
                className="p-1 rounded text-[#8faabb] hover:text-[#f0f4f8] transition-colors shrink-0"
              >
                <X size={14} />
              </button>
            </div>

            {/* Short description */}
            <p className="text-xs text-[#8faabb] leading-relaxed">
              Wir setzen notwendige Cookies für den Betrieb und — mit deiner Zustimmung —
              anonyme Analyse-Cookies (keine personenbezogenen Daten, keine Weitergabe an Dritte).
            </p>

            {/* Expandable detail */}
            <div>
              <button
                onClick={() => setExpanded((e) => !e)}
                className="flex items-center gap-1 text-[11px] text-[#00c8b4] hover:text-[#00e5ce] transition-colors"
              >
                {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                {expanded ? "Weniger anzeigen" : "Details anzeigen"}
              </button>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                        <div
                          key={c.name}
                          className="rounded-lg border border-[#1e3a52] bg-[#0d1b2a]/60 px-3 py-2.5 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#f0f4f8]">{c.name}</span>
                            {c.always ? (
                              <span className="text-[10px] text-[#4caf82] font-medium">Immer aktiv</span>
                            ) : (
                              <span className="text-[10px] text-[#8faabb]">Optional</span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#8faabb] leading-relaxed">{c.desc}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                onClick={() => save(false)}
                className="flex-1 text-xs font-medium px-4 py-2 rounded-lg border border-[#1e3a52] text-[#8faabb] hover:border-[#00c8b4]/50 hover:text-[#f0f4f8] transition-colors"
              >
                Nur notwendige
              </button>
              <button
                onClick={() => save(true)}
                className="flex-1 text-xs font-semibold px-4 py-2 rounded-lg bg-[#00c8b4] text-[#0d1b2a] hover:bg-[#00e5ce] transition-colors"
              >
                Alle akzeptieren
              </button>
            </div>

            <p className="text-[10px] text-[#4a6278] text-center">
              Einwilligung jederzeit in den{" "}
              <button
                onClick={() => {
                  localStorage.removeItem(STORAGE_KEY);
                  setVisible(true);
                  setExpanded(true);
                }}
                className="underline hover:text-[#8faabb] transition-colors"
              >
                Datenschutzeinstellungen
              </button>{" "}
              widerrufbar.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
