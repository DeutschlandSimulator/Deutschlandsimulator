import { Layout } from "@/components/Layout";
import { useEffect, useState } from "react";

const KEY = "diz_cookie_consent";
function storageGet() { try { return localStorage.getItem(KEY); } catch { return null; } }
function storageRemove() { try { localStorage.removeItem(KEY); } catch { /**/ } }

export default function DatenschutzPage() {
  const [consented, setConsented] = useState<null | boolean>(null);

  useEffect(() => {
    const raw = storageGet();
    if (!raw) { setConsented(null); return; }
    try { setConsented(JSON.parse(raw).analytics ?? false); } catch { setConsented(null); }
  }, []);

  function revoke() {
    storageRemove();
    setConsented(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => window.location.reload(), 100);
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-6 py-12 text-[#f0f4f8]">
        <h1 className="text-2xl font-bold text-[#00c8b4] mb-2">Datenschutzerklärung</h1>
        <p className="text-xs text-[#8faabb] mb-8">Stand: Juni 2026</p>

        <Section title="1. Verantwortlicher">
          <p>
            Kian Salem<br />
            Bernkasteler Straße 65A<br />
            50969 Köln<br />
            E-Mail: <a href="mailto:Kian.Salem@gmail.com" className="text-[#00c8b4] hover:underline">Kian.Salem@gmail.com</a>
          </p>
        </Section>

        <Section title="2. Erhobene Daten">
          <p>
            Diese Website erhebt keine personenbezogenen Daten und setzt keine Tracking- oder
            Werbe-Cookies ein. Es werden keine Daten an Dritte weitergegeben.
          </p>
          <p className="mt-3">
            Technisch notwendige Daten (z. B. Server-Logs) werden ausschließlich zur Sicherstellung
            des Betriebs verarbeitet und nach spätestens 7 Tagen gelöscht.
          </p>
        </Section>

        <Section title="3. Cookies und lokaler Speicher">
          <p>
            Diese Website nutzt ausschließlich den <strong className="text-[#f0f4f8]">lokalen Browserspeicher
            (localStorage)</strong> für folgende Zwecke:
          </p>
          <div className="mt-3 space-y-2">
            <div className="border border-[#1e3048] rounded-lg p-3">
              <p className="font-semibold text-[#f0f4f8] text-xs mb-1">Notwendig — immer aktiv</p>
              <p>Speicherung Ihrer Cookie-Einwilligung und Simulator-Einstellungen (z. B. Reglerpositionen).
              Diese Daten verlassen Ihren Browser nicht.</p>
            </div>
            <div className="border border-[#1e3048] rounded-lg p-3">
              <p className="font-semibold text-[#f0f4f8] text-xs mb-1">Analyse — optional</p>
              <p>Anonyme Nutzungsstatistiken (Seitenaufrufe, Regler-Interaktionen).
              Keine IP-Adressen, kein Profiling, keine Weitergabe an Dritte.</p>
            </div>
          </div>
        </Section>

        <Section title="4. Ihre Einwilligung">
          <p>
            Beim ersten Besuch werden Sie um Ihre Einwilligung für optionale Analyse-Cookies gebeten.
            Sie können diese Einwilligung jederzeit widerrufen.
          </p>

          <div className="mt-4 border border-[#1e3048] rounded-lg p-4 bg-[#1a2b3c]">
            <p className="text-xs font-semibold text-[#f0f4f8] mb-1">Aktueller Status</p>
            {consented === null ? (
              <p className="text-[#f5a623]">Keine Einwilligung gespeichert — der Banner wird beim nächsten Laden angezeigt.</p>
            ) : (
              <p className="text-[#4caf82]">
                Analyse-Cookies: <strong>{consented ? "akzeptiert" : "abgelehnt"}</strong>
              </p>
            )}
            {consented !== null && (
              <button
                onClick={revoke}
                className="mt-3 text-xs px-4 py-2 rounded-lg border border-[#e05c5c] text-[#e05c5c] hover:bg-[#e05c5c]/10 transition-colors"
              >
                Einwilligung widerrufen
              </button>
            )}
          </div>
        </Section>

        <Section title="5. Hosting">
          <p>
            Diese Website wird auf Servern von <strong className="text-[#f0f4f8]">Replit, Inc.</strong> gehostet.
            Beim Aufruf der Website können serverseitig technische Daten (IP-Adresse, Zeitstempel,
            aufgerufene URL) verarbeitet werden. Weitere Informationen finden Sie in der{" "}
            <a
              href="https://replit.com/site/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00c8b4] hover:underline"
            >
              Datenschutzerklärung von Replit
            </a>.
          </p>
        </Section>

        <Section title="6. Ihre Rechte">
          <p>
            Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung
            Ihrer personenbezogenen Daten. Da diese Website keine personenbezogenen Daten speichert,
            beschränken sich Ihre Rechte auf die im lokalen Browser gespeicherten Daten — diese können
            Sie jederzeit über die Einstellungen Ihres Browsers löschen.
          </p>
          <p className="mt-3">
            Für Anfragen wenden Sie sich an:{" "}
            <a href="mailto:Kian.Salem@gmail.com" className="text-[#00c8b4] hover:underline">
              Kian.Salem@gmail.com
            </a>
          </p>
        </Section>
      </div>
    </Layout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-[#00c8b4] uppercase tracking-wide mb-2">
        {title}
      </h2>
      <div className="text-sm text-[#8faabb] leading-relaxed border-l-2 border-[#1e3048] pl-4">
        {children}
      </div>
    </div>
  );
}
