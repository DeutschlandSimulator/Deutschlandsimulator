import { Layout } from "@/components/Layout";
import { GITHUB } from "@/config/github";

interface ActionCardProps {
  icon: string;
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
}

function ActionCard({ icon, title, description, buttonLabel, href }: ActionCardProps) {
  return (
    <div className="bg-[#1a2b3c] border border-[#1e3048] rounded-lg px-5 py-5 flex flex-col gap-3 hover:border-[#00c8b4]/40 transition-colors">
      <div className="text-2xl">{icon}</div>
      <div>
        <h3 className="text-sm font-bold text-[#f0f4f8] mb-1">{title}</h3>
        <p className="text-xs text-[#8faabb] leading-relaxed">{description}</p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-[#00c8b4] hover:text-[#00a896] border border-[#00c8b4]/40 hover:border-[#00c8b4] rounded px-3 py-1.5 transition-colors w-fit"
      >
        {buttonLabel} →
      </a>
    </div>
  );
}

export default function Mitmachen() {
  return (
    <Layout>
      <div className="flex-1 max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-14 w-full flex flex-col gap-8">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#00c8b4] mb-2">
            Community
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#f0f4f8] mb-3">
            Deutschland gemeinsam verbessern
          </h1>
          <p className="text-sm text-[#8faabb] leading-relaxed">
            Der DeutschlandSimulator ist ein offenes Community-Projekt. Ziel ist maximale
            Transparenz und Nachvollziehbarkeit — durch öffentliche Überprüfung, Diskussion
            und gemeinsame Weiterentwicklung.
          </p>
        </div>

        {/* ── Was du tun kannst ───────────────────────────────────── */}
        <div className="bg-[#1a2b3c] border border-[#1e3048] rounded-lg px-5 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#00c8b4] mb-3">
            Jeder kann mitmachen
          </p>
          <ul className="space-y-2 text-xs text-[#8faabb] leading-relaxed list-none">
            {[
              "Fehler und Ungenauigkeiten melden",
              "Datenquellen ergänzen oder aktualisieren",
              "Modellannahmen diskutieren und hinterfragen",
              "Verbesserungsvorschläge einreichen",
              "Neue Funktionen vorschlagen",
              "Berechnungen unabhängig nachvollziehen",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[#00c8b4] shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Action Cards ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ActionCard
            icon="📂"
            title="Open Source"
            description="Der Quellcode ist öffentlich verfügbar, einsehbar und kann von der Community geprüft und weiterentwickelt werden."
            buttonLabel="Zum GitHub Repository"
            href={GITHUB.repo}
          />
          <ActionCard
            icon="💬"
            title="Diskussionen"
            description="Modellannahmen und Datenquellen können offen diskutiert werden. Alle Diskussionen sind öffentlich einsehbar."
            buttonLabel="Zu den Diskussionen"
            href={GITHUB.discussions}
          />
          <ActionCard
            icon="🐛"
            title="Fehler melden"
            description="Fehler, Ungenauigkeiten oder veraltete Daten können öffentlich gemeldet werden. Jede Meldung hilft, das Projekt zu verbessern."
            buttonLabel="Fehler melden"
            href={GITHUB.newIssue}
          />
        </div>

        {/* ── Transparenzprinzip ─────────────────────────────────── */}
        <div className="bg-[#1a2b3c] border border-[#1e3048] rounded-lg px-5 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#00c8b4] mb-3">
            Transparenzprinzip
          </p>
          <ul className="space-y-2 text-xs text-[#8faabb] leading-relaxed list-none">
            {[
              "Alle Annahmen werden dokumentiert und sind öffentlich einsehbar.",
              "Quellen werden für jede Annahme explizit offengelegt.",
              "Änderungen am Modell können öffentlich nachvollzogen werden.",
              "Diskussionen finden öffentlich auf GitHub statt.",
              "Fehlerkorrekturen und Verbesserungen sind ausdrücklich erwünscht.",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[#00c8b4] shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Community & Qualitätssicherung ─────────────────────── */}
        <div className="bg-[#1a2b3c] border border-[#1e3048] rounded-lg px-5 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#00c8b4] mb-3">
            Community & Qualitätssicherung
          </p>
          <p className="text-xs text-[#8faabb] leading-relaxed mb-4">
            Dieses Projekt wird öffentlich weiterentwickelt. Diskussionen und Änderungen
            werden transparent dokumentiert.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={GITHUB.discussions}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00c8b4] hover:text-[#00a896] border border-[#00c8b4]/40 hover:border-[#00c8b4] rounded px-3 py-1.5 transition-colors"
            >
              Diskussionen →
            </a>
            <a
              href={GITHUB.issues}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#8faabb] hover:text-[#f0f4f8] border border-[#1e3048] hover:border-[#00c8b4]/40 rounded px-3 py-1.5 transition-colors"
            >
              Issues & Fehlerberichte →
            </a>
          </div>
        </div>

        {/* ── Hinweis KI & Open Source ───────────────────────────── */}
        <div className="bg-[#1a2b3c] border border-[#1e3048]/50 rounded-lg px-5 py-4">
          <p className="text-xs text-[#8faabb] leading-relaxed">
            <span className="text-[#f0f4f8] font-semibold">Hinweis: </span>
            Dieses Projekt wurde mit Unterstützung generativer KI entwickelt. Berechnungen,
            Annahmen und Datenquellen können Fehler enthalten. Die Community ist eingeladen,
            alles kritisch zu prüfen. Lizenz: Apache 2.0 (Code) · CC BY 4.0 (Daten).
          </p>
        </div>

      </div>
    </Layout>
  );
}
