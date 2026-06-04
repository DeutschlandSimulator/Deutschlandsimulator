import { Link } from "wouter";
import { ExternalLink } from "lucide-react";
import { Layout } from "@/components/Layout";
import { GITHUB } from "@/config/github";
import { ANNAHMEN } from "@/pages/Annahmen";

// ─── Derived lists ─────────────────────────────────────────────────────────────
const NICHT_VERIFIZIERT = ANNAHMEN.filter((a) => a.verifizierung === "nicht");
const TEILWEISE         = ANNAHMEN.filter((a) => a.verifizierung === "teilweise");
const KI_GEPRUEFT       = ANNAHMEN.filter((a) => a.verifizierung === "ki");
const MENSCH_GEPRUEFT   = ANNAHMEN.filter((a) => a.verifizierung === "mensch");

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

// ─── Unverified source row ─────────────────────────────────────────────────────
function QuellenZeile({ parameter, quelle, quellUrl, kategorie, evidenz, unsicherheiten }: {
  parameter: string; quelle: string; quellUrl?: string; kategorie: string;
  evidenz: string; unsicherheiten?: string;
}) {
  const evidenzColor = evidenz === "hoch" ? "#4caf82" : evidenz === "mittel" ? "#f5a623" : "#e05c5c";
  const evidenzLabel = evidenz === "hoch" ? "🟢 Hoch" : evidenz === "mittel" ? "🟡 Mittel" : "🔴 Gering";
  return (
    <div className="bg-[#0d1b2a] border border-[#1e3048] rounded px-3 py-2.5">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
        <div className="flex-1 min-w-0">
          <span className="text-[9px] text-[#8faabb] uppercase tracking-wider">{kategorie}</span>
          <p className="text-xs font-semibold text-[#f0f4f8] leading-snug">{parameter}</p>
        </div>
        <span className="text-[9px] font-semibold shrink-0" style={{ color: evidenzColor }}>
          {evidenzLabel}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-[10px] text-[#8faabb]">
        <span className="text-[#8faabb]/50">Quelle:</span>
        {quellUrl ? (
          <a href={quellUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-0.5 hover:text-[#00c8b4] transition-colors">
            {quelle} <ExternalLink size={9} />
          </a>
        ) : <span>{quelle}</span>}
      </div>
      {unsicherheiten && (
        <p className="text-[9px] text-[#f5a623]/70 mt-1 leading-snug">{unsicherheiten}</p>
      )}
      <div className="mt-2">
        <a
          href={`${GITHUB.discussions}?discussions_q=${encodeURIComponent(parameter)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[9px] font-semibold text-[#00c8b4] hover:text-[#00a896] transition-colors"
        >
          Auf GitHub diskutieren →
        </a>
      </div>
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

        {/* ── Prüfstatus Übersicht ────────────────────────────────── */}
        <section className="bg-[#1a2b3c] border border-[#1e3048] rounded-lg px-5 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#00c8b4] mb-1">
            Prüfstatus aller Annahmen
          </p>
          <p className="text-xs text-[#8faabb] leading-relaxed mb-4">
            Jede Annahme trägt einen Prüfstatus. <span className="text-[#4caf82] font-semibold">Menschlich geprüft</span> bedeutet unabhängige Verifikation durch Fachleute oder die Community.{" "}
            <span className="text-[#60a5fa] font-semibold">KI-recherchiert</span> bedeutet, die Quelle wurde von der KI gefunden und eingetragen — aber noch von keinem Menschen bestätigt.
          </p>
          {/* Status bar */}
          <div className="flex rounded-full overflow-hidden h-2.5 mb-2">
            <div className="bg-[#4caf82] transition-all" style={{ width: `${MENSCH_GEPRUEFT.length / ANNAHMEN.length * 100}%` }} title="Menschlich geprüft" />
            <div className="bg-[#60a5fa] transition-all" style={{ width: `${KI_GEPRUEFT.length / ANNAHMEN.length * 100}%` }} title="KI-recherchiert" />
            <div className="bg-[#f5a623] transition-all" style={{ width: `${TEILWEISE.length / ANNAHMEN.length * 100}%` }} title="Teilweise" />
            <div className="bg-[#e05c5c] transition-all" style={{ width: `${NICHT_VERIFIZIERT.length / ANNAHMEN.length * 100}%` }} title="Nicht verifiziert" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {[
              { icon: "👤", label: "Menschlich geprüft", count: MENSCH_GEPRUEFT.length,   col: "#4caf82", bg: "bg-[#4caf82]/10 border-[#4caf82]/20" },
              { icon: "🤖", label: "KI-recherchiert",    count: KI_GEPRUEFT.length,        col: "#60a5fa", bg: "bg-[#60a5fa]/10 border-[#60a5fa]/20" },
              { icon: "⚠️", label: "Teilweise",          count: TEILWEISE.length,          col: "#f5a623", bg: "bg-[#f5a623]/10 border-[#f5a623]/20" },
              { icon: "❌", label: "Nicht verifiziert",  count: NICHT_VERIFIZIERT.length,  col: "#e05c5c", bg: "bg-[#e05c5c]/10 border-[#e05c5c]/20" },
            ].map((s) => (
              <div key={s.label} className={`rounded border ${s.bg} px-3 py-2 text-center`}>
                <div className="text-lg font-bold" style={{ color: s.col }}>{s.count}</div>
                <div className="text-[9px] text-[#8faabb] leading-tight">{s.icon} {s.label}</div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[#f5a623] bg-[#f5a623]/5 border border-[#f5a623]/20 rounded px-3 py-2">
            <span className="font-semibold">Hinweis:</span> Aktuell gibt es {MENSCH_GEPRUEFT.length === 0 ? "noch keine" : MENSCH_GEPRUEFT.length} menschlich verifizierten Annahmen. Alle {KI_GEPRUEFT.length} KI-recherchierten Einträge warten auf unabhängige Bestätigung.
          </p>
        </section>

        {/* ── Noch nicht bestätigte Quellen ──────────────────────── */}
        <section className="bg-[#1a2b3c] border border-[#e05c5c]/30 rounded-lg px-5 py-5">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#e05c5c] mb-1">
                Hilfe benötigt · Noch nicht bestätigt
              </p>
              <p className="text-xs text-[#8faabb] leading-relaxed">
                Diese Annahmen wurden noch nicht unabhängig überprüft. Kenntnisse in diesen
                Bereichen sind besonders wertvoll — jede Prüfung hilft.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold bg-[#e05c5c]/10 text-[#e05c5c] border border-[#e05c5c]/20 rounded-full px-2.5 py-0.5">
                ❌ {NICHT_VERIFIZIERT.length} nicht verifiziert
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold bg-[#f5a623]/10 text-[#f5a623] border border-[#f5a623]/20 rounded-full px-2.5 py-0.5">
                ⚠️ {TEILWEISE.length} teilweise
              </span>
            </div>
          </div>

          {/* Nicht verifiziert */}
          {NICHT_VERIFIZIERT.length > 0 && (
            <div className="mb-4">
              <p className="text-[9px] font-semibold uppercase tracking-widest text-[#e05c5c]/80 mb-2">
                Nicht verifiziert — Überprüfung dringend erwünscht
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {NICHT_VERIFIZIERT.map((a) => (
                  <QuellenZeile key={a.id} {...a} />
                ))}
              </div>
            </div>
          )}

          {/* Teilweise verifiziert */}
          {TEILWEISE.length > 0 && (
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-[#f5a623]/80 mb-2">
                Teilweise verifiziert — Detailprüfung hilfreich
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TEILWEISE.map((a) => (
                  <QuellenZeile key={a.id} {...a} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-[#1e3048] flex flex-wrap gap-2">
            <Link
              href="/annahmen"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00c8b4] hover:text-[#00a896] border border-[#00c8b4]/40 hover:border-[#00c8b4] rounded px-3 py-1.5 transition-colors"
            >
              Alle Annahmen ansehen →
            </Link>
            <a
              href={GITHUB.discussions}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#8faabb] hover:text-[#f0f4f8] border border-[#1e3048] hover:border-[#00c8b4]/40 rounded px-3 py-1.5 transition-colors"
            >
              GitHub Diskussionen →
            </a>
          </div>
        </section>

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
