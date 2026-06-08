import { useState, useEffect } from "react";
import { Link } from "wouter";
import { X } from "lucide-react";

const STORAGE_KEY = "diz-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie-Hinweis"
      className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3 md:px-6"
    >
      <div className="max-w-3xl mx-auto flex items-start gap-3 rounded-lg border border-[#1e3048] bg-[#1a2b3c]/95 backdrop-blur shadow-xl px-4 py-3 md:items-center">
        <div className="flex-1 text-xs text-[#8faabb] leading-relaxed">
          Diese Website setzt ein technisch notwendiges <strong className="text-[#f0f4f8] font-medium">Session-Cookie</strong> (<code className="text-[#00c8b4]">sid</code>),
          das ausschließlich beim Einloggen gespeichert wird und nach dem Ausloggen gelöscht wird.
          Es werden keine Tracking- oder Werbe-Cookies verwendet.{" "}
          <Link href="/impressum" className="text-[#00c8b4] hover:underline">
            Datenschutz
          </Link>
        </div>
        <button
          onClick={accept}
          className="shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded border border-[#00c8b4] text-[#00c8b4] hover:bg-[#00c8b4] hover:text-[#0d1b2a] transition-colors"
        >
          Verstanden
        </button>
        <button
          onClick={accept}
          aria-label="Schließen"
          className="shrink-0 p-1 text-[#8faabb] hover:text-[#f0f4f8] transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
