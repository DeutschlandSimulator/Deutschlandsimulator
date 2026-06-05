import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { ChevronRight, TrendingDown, TrendingUp, Minus } from "lucide-react";

const API = import.meta.env.BASE_URL.replace(/\/$/, "");

// ─── Trust stats (1) ─────────────────────────────────────────────────────────
const TRUST_STATS = [
  { value: "35+",   label: "Quellen hinterlegt"        },
  { value: "80+",   label: "Annahmen dokumentiert"     },
  { value: "100 %", label: "Open Source"               },
  { value: "✓",    label: "Community-Review möglich"  },
];

// ─── Comparison table ─────────────────────────────────────────────────────────
type Dir = "up" | "down" | "neutral";

interface Massnahme {
  emoji: string;
  label: string;
  effekte: { metric: string; value: string; dir: Dir }[];
}

const MASSNAHMEN: Massnahme[] = [
  {
    emoji: "📉",
    label: "Einkommensteuer senken",
    effekte: [
      { metric: "Staatseinnahmen",     value: "−18 Mrd. €", dir: "down"    },
      { metric: "Wirtschaftswachstum", value: "+0,4 %",     dir: "up"      },
      { metric: "Staatsverschuldung",  value: "+0,3 %",     dir: "neutral" },
    ],
  },
  {
    emoji: "👴",
    label: "Renteneintrittsalter erhöhen",
    effekte: [
      { metric: "Staatseinnahmen",     value: "+12 Mrd. €", dir: "up" },
      { metric: "Wirtschaftswachstum", value: "+0,2 %",     dir: "up" },
      { metric: "Staatsverschuldung",  value: "−0,4 %",     dir: "up" },
    ],
  },
  {
    emoji: "💎",
    label: "Vermögensteuer einführen",
    effekte: [
      { metric: "Staatseinnahmen",     value: "+15 Mrd. €", dir: "up"   },
      { metric: "Wirtschaftswachstum", value: "−0,1 %",     dir: "down" },
      { metric: "Staatsverschuldung",  value: "−0,2 %",     dir: "up"   },
    ],
  },
];

// ─── Currently discussed topics ──────────────────────────────────────────────
const AKTUELLE_THEMEN = [
  { emoji: "💶", label: "Bürgergeld reformieren"                     },
  { emoji: "🛡️", label: "Verteidigungsausgaben auf 3,5 % des BIP"   },
  { emoji: "👴", label: "Renteneintrittsalter auf 69 Jahre anheben" },
  { emoji: "⚡",  label: "Stromsteuer senken"                        },
  { emoji: "🚌", label: "Deutschlandticket abschaffen"              },
];

// ─── Popular scenarios ────────────────────────────────────────────────────────
interface Szenario {
  emoji: string;
  label: string;
  beschreibung: string;
  haupteffekt: { label: string; value: string; positiv: boolean };
}

const SZENARIEN: Szenario[] = [
  {
    emoji: "💎",
    label: "Vermögensteuer einführen",
    beschreibung: "Zusätzliche Besteuerung großer Vermögen zur Finanzierung öffentlicher Ausgaben.",
    haupteffekt: { label: "Staatseinnahmen", value: "+15 Mrd. €", positiv: true },
  },
  {
    emoji: "👴",
    label: "Renteneintrittsalter erhöhen",
    beschreibung: "Schrittweise Anhebung des Rentenalters zur Stabilisierung der Sozialversicherungen.",
    haupteffekt: { label: "Staatsverschuldung", value: "−0,4 %", positiv: true },
  },
  {
    emoji: "🛡️",
    label: "Verteidigungsausgaben erhöhen",
    beschreibung: "Steigerung der Verteidigungsinvestitionen auf das NATO-Ziel.",
    haupteffekt: { label: "Mehrausgaben", value: "+43 Mrd. €", positiv: false },
  },
  {
    emoji: "🛒",
    label: "Mehrwertsteuer senken",
    beschreibung: "Senkung der Mehrwertsteuer zur Entlastung von Konsumenten und Unternehmen.",
    haupteffekt: { label: "Staatseinnahmen", value: "−10 Mrd. €", positiv: false },
  },
  {
    emoji: "💶",
    label: "Bürgergeld reformieren",
    beschreibung: "Anpassung der Grundsicherung für mehr Arbeitsanreize.",
    haupteffekt: { label: "Einsparungen", value: "−5 Mrd. €", positiv: true },
  },
  {
    emoji: "🌱",
    label: "CO₂-Steuer erhöhen",
    beschreibung: "Stärkere Bepreisung von Treibhausgasen für mehr Klimaschutz.",
    haupteffekt: { label: "Mehreinnahmen", value: "+1 Mrd. €", positiv: true },
  },
];

// ─── Trust badges ─────────────────────────────────────────────────────────────
const TRUST_BADGES = [
  { label: "Open Source",            color: "teal"  },
  { label: "Unabhängig",             color: "green" },
  { label: "Transparente Quellen",   color: "blue"  },
  { label: "Dokumentierte Annahmen", color: "blue"  },
];

function TrustBadge({ label, color }: { label: string; color: string }) {
  const styles: Record<string, string> = {
    teal:  "bg-[#00c8b4]/10 text-[#00c8b4]  border-[#00c8b4]/25",
    green: "bg-[#4caf82]/10 text-[#4caf82]  border-[#4caf82]/25",
    blue:  "bg-[#4a90c4]/10 text-[#7ab3d8]  border-[#4a90c4]/25",
  };
  return (
    <span className={`inline-flex items-center text-[10px] font-semibold uppercase tracking-wider border rounded-full px-2.5 py-0.5 ${styles[color]}`}>
      {label}
    </span>
  );
}

// ─── Trust checklist (6) ──────────────────────────────────────────────────────
const TRUST_POINTS = [
  "Unabhängiges Privatprojekt",
  "Keine Verbindung zu Parteien, Behörden oder Interessengruppen",
  "Open Source — öffentlich einsehbarer Quellcode",
  "Quellen und Modellannahmen vollständig dokumentiert",
  "Quellen können von der Community überprüft und verbessert werden",
  "Verbesserungsvorschläge und Korrekturen sind ausdrücklich willkommen",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function DirIcon({ dir }: { dir: Dir }) {
  if (dir === "up")   return <TrendingUp  size={11} className="text-[#4caf82] shrink-0" />;
  if (dir === "down") return <TrendingDown size={11} className="text-[#e05c5c] shrink-0" />;
  return <Minus size={11} className="text-[#8faabb] shrink-0" />;
}

function dirColor(dir: Dir) {
  return dir === "up" ? "text-[#4caf82]" : dir === "down" ? "text-[#e05c5c]" : "text-[#f0f4f8]";
}

// ─── Source verification stats (5) ───────────────────────────────────────────
const ANNAHMEN_TOTAL = 35;

interface SourceStats { human: number; pending: number }

function useSourceStats(): SourceStats {
  const [stats, setStats] = useState<SourceStats>({ human: 0, pending: ANNAHMEN_TOTAL });
  useEffect(() => {
    fetch(`${API}/api/validations/stats`, { credentials: "include" })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data?.stats) return;
        const humanCount = (data.stats as { validationCount: number }[])
          .filter((s) => s.validationCount >= 1).length;
        setStats({ human: humanCount, pending: Math.max(0, ANNAHMEN_TOTAL - humanCount) });
      })
      .catch(() => {});
  }, []);
  return stats;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Landing() {
  const sourceStats = useSourceStats();

  return (
    <Layout>
      <div className="flex-1 max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-14 w-full flex flex-col gap-10">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div className="text-center mt-2 md:mt-6">
          <div className="inline-block text-[10px] font-semibold uppercase tracking-widest text-[#00c8b4] border border-[#00c8b4]/30 rounded-full px-3 py-1 mb-5">
            Politische Simulation · Deutschland
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight leading-tight text-[#f0f4f8]">
            Was würde passieren, wenn politische Entscheidungen anders getroffen würden?
          </h1>
          <p className="text-sm md:text-base text-[#8faabb] mb-8 leading-relaxed max-w-2xl mx-auto">
            Testen Sie selbst, wie sich Änderungen bei Steuern, Sozialleistungen, Staatsausgaben
            oder anderen politischen Maßnahmen auf Staatshaushalt, Wirtschaft und Gesellschaft
            auswirken könnten.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/simulator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00c8b4] hover:bg-[#00a896] active:bg-[#008a7a] text-[#0d1b2a] font-bold py-3 px-8 rounded text-base transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-[#00c8b4]/20 focus-visible:outline-2 focus-visible:outline-[#00c8b4] focus-visible:outline-offset-2"
              data-testid="button-start-sim"
            >
              Simulation starten
              <ChevronRight size={16} />
            </Link>
            <Link
              href="/annahmen"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#1e3048] hover:border-[#00c8b4]/60 text-[#8faabb] hover:text-[#f0f4f8] font-semibold py-3 px-8 rounded text-base transition-all duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[#00c8b4] focus-visible:outline-offset-2"
            >
              Methodik ansehen
            </Link>
          </div>
        </div>

        {/* ── Trust stats bar (1) ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#1e3048] rounded-xl overflow-hidden border border-[#1e3048]">
          {TRUST_STATS.map((s) => (
            <div key={s.label} className="bg-[#1a2b3c] px-4 py-4 text-center">
              <div className="text-2xl font-extrabold text-[#00c8b4] tabular-nums leading-none mb-1">
                {s.value}
              </div>
              <div className="text-[11px] text-[#8faabb] leading-snug">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Transparency claim (2) ───────────────────────────────────────── */}
        <div className="flex items-center gap-2.5 bg-[#1a2b3c]/60 border border-[#1e3048] rounded-lg px-4 py-3 -mt-5">
          <span className="text-base shrink-0" aria-hidden>🔍</span>
          <p className="text-sm text-[#8faabb] leading-snug">
            Alle Ergebnisse basieren auf{" "}
            <Link href="/annahmen" className="text-[#00c8b4] hover:text-[#00a896] underline underline-offset-2 transition-colors">
              öffentlich dokumentierten Quellen und Annahmen
            </Link>
            {" "}— keine Black Box.
          </p>
        </div>

        {/* ── Mission text (4) ─────────────────────────────────────────────── */}
        <div className="border-l-2 border-[#00c8b4]/40 pl-4">
          <h2 className="text-base font-bold text-[#f0f4f8] mb-1.5">
            Politische Entscheidungen besser verstehen
          </h2>
          <p className="text-sm text-[#8faabb] leading-relaxed">
            DeutschlandSimulator hilft dabei, die möglichen Folgen politischer Maßnahmen
            transparent und nachvollziehbar zu untersuchen. Alle Quellen und Modellannahmen
            sind öffentlich dokumentiert und können überprüft werden.
          </p>
        </div>

        {/* ── Comparison example (3) ───────────────────────────────────────── */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8faabb] mb-1">
            Beispiel einer Simulation
          </p>
          <h2 className="text-lg font-extrabold text-[#f0f4f8] mb-1">Was passiert, wenn …?</h2>
          <p className="text-sm text-[#8faabb] mb-4 leading-relaxed">
            Politische Entscheidungen haben unterschiedliche Auswirkungen auf Staat, Wirtschaft und Gesellschaft.
            Vergleiche mehrere Maßnahmen auf einen Blick.
          </p>

          {/* Desktop table — columns are clickable */}
          <div className="hidden sm:block bg-[#1a2b3c] border border-[#1e3048] rounded-xl overflow-hidden">
            <div className="grid grid-cols-4 bg-[#0d1b2a] border-b border-[#1e3048]">
              <div className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#8faabb] flex items-end">
                Kennzahl
              </div>
              {MASSNAHMEN.map((m) => (
                <Link
                  key={m.label}
                  href="/simulator"
                  className="px-4 py-3 text-center border-l border-[#1e3048] hover:bg-[#1a2b3c] transition-colors cursor-pointer group"
                  title={`${m.label} selbst simulieren`}
                >
                  <div className="text-lg mb-0.5">{m.emoji}</div>
                  <div className="text-[11px] font-semibold text-[#f0f4f8] leading-snug group-hover:text-[#00c8b4] transition-colors">
                    {m.label}
                  </div>
                  <div className="text-[9px] text-[#8faabb]/60 mt-0.5 group-hover:text-[#00c8b4]/60 transition-colors">
                    selbst simulieren →
                  </div>
                </Link>
              ))}
            </div>
            {["Staatseinnahmen", "Wirtschaftswachstum", "Staatsverschuldung"].map((metric, ri) => (
              <div key={metric} className={`grid grid-cols-4 ${ri < 2 ? "border-b border-[#1e3048]" : ""}`}>
                <div className="px-4 py-3 text-xs text-[#8faabb] flex items-center">{metric}</div>
                {MASSNAHMEN.map((m) => {
                  const e = m.effekte[ri];
                  return (
                    <Link
                      key={m.label}
                      href="/simulator"
                      className="px-4 py-3 border-l border-[#1e3048] flex items-center justify-center gap-1.5 hover:bg-[#0d1b2a]/60 transition-colors cursor-pointer"
                    >
                      <DirIcon dir={e.dir} />
                      <span className={`text-sm font-bold tabular-nums ${dirColor(e.dir)}`}>{e.value}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Mobile cards — each card is clickable */}
          <div className="sm:hidden flex flex-col gap-2.5">
            {MASSNAHMEN.map((m) => (
              <Link
                key={m.label}
                href="/simulator"
                className="block bg-[#1a2b3c] border border-[#1e3048] hover:border-[#00c8b4]/40 rounded-lg p-4 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-[#1e3048]">
                  <span className="text-xl shrink-0">{m.emoji}</span>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-[#f0f4f8]">{m.label}</span>
                    <span className="ml-2 text-[10px] text-[#00c8b4]">simulieren →</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {m.effekte.map((e) => (
                    <div key={e.metric} className="bg-[#0d1b2a] rounded p-2 border border-[#1e3048]">
                      <div className="flex items-center gap-1 mb-1">
                        <DirIcon dir={e.dir} />
                        <span className="text-[9px] text-[#8faabb] uppercase tracking-wider leading-none truncate">{e.metric}</span>
                      </div>
                      <span className={`text-sm font-bold tabular-nums ${dirColor(e.dir)}`}>{e.value}</span>
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-2.5 flex items-center justify-between gap-2">
            <p className="text-[10px] text-[#8faabb]/50">
              Beispielansicht · Keine echten Berechnungsergebnisse
            </p>
            <p className="text-[10px] text-[#8faabb]/70 italic hidden sm:block">
              Klicke auf eine Maßnahme, um sie selbst zu simulieren.
            </p>
          </div>
          <div className="mt-3 flex justify-center">
            <Link
              href="/simulator"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#00c8b4] hover:text-[#00a896] border border-[#00c8b4]/40 hover:border-[#00c8b4] rounded-lg px-5 py-2.5 transition-all duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[#00c8b4] focus-visible:outline-offset-2"
            >
              Jetzt eigene Szenarien simulieren
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* ── Currently discussed topics ───────────────────────────────────── */}
        <div>
          <h2 className="text-base font-bold text-[#f0f4f8] mb-1">Aktuell diskutierte Themen</h2>
          <p className="text-sm text-[#8faabb] mb-3 leading-relaxed">
            Teste politische Vorschläge, die derzeit öffentlich diskutiert werden.
          </p>
          <div className="flex flex-wrap gap-2">
            {AKTUELLE_THEMEN.map((t) => (
              <Link
                key={t.label}
                href="/simulator"
                className="inline-flex items-center gap-2 bg-[#1a2b3c] border border-[#1e3048] hover:border-[#00c8b4]/50 hover:bg-[#1e3448] rounded-full px-4 py-2 text-sm text-[#f0f4f8] transition-all duration-150 hover:-translate-y-0.5 group focus-visible:outline-2 focus-visible:outline-[#00c8b4] focus-visible:outline-offset-2"
              >
                <span className="text-base leading-none">{t.emoji}</span>
                <span className="font-medium">{t.label}</span>
                <ChevronRight size={13} className="text-[#8faabb] group-hover:text-[#00c8b4] transition-colors duration-150" />
              </Link>
            ))}
          </div>
        </div>

        {/* ── Popular scenarios ────────────────────────────────────────────── */}
        <div>
          <h2 className="text-base font-bold text-[#f0f4f8] mb-3">Beliebte Szenarien</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {SZENARIEN.map((s) => (
              <div
                key={s.label}
                className="bg-[#1a2b3c] border border-[#1e3048] hover:border-[#00c8b4]/50 hover:bg-[#1e3448] rounded-xl p-4 flex flex-col gap-3 transition-all duration-150 hover:-translate-y-0.5 group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0 mt-0.5">{s.emoji}</span>
                  <span className="text-sm font-semibold text-[#f0f4f8] leading-snug">{s.label}</span>
                </div>
                <p className="text-xs text-[#8faabb] leading-relaxed flex-1">{s.beschreibung}</p>
                <div className="bg-[#0d1b2a] border border-[#1e3048] rounded-lg px-3 py-2 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-[#8faabb] uppercase tracking-wider font-semibold">
                    Haupteffekt · {s.haupteffekt.label}
                  </span>
                  <span className={`text-sm font-bold tabular-nums ${s.haupteffekt.positiv ? "text-[#4caf82]" : "text-[#e05c5c]"}`}>
                    {s.haupteffekt.value}
                  </span>
                </div>
                <Link
                  href="/simulator"
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#00c8b4] group-hover:text-[#00a896] border border-[#00c8b4]/30 group-hover:border-[#00c8b4]/60 rounded-lg py-2 px-3 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#00c8b4] focus-visible:outline-offset-2"
                >
                  Szenario starten
                  <ChevronRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* ── Trust section ────────────────────────────────────────────────── */}
        <div className="bg-[#1a2b3c] border border-[#1e3048] rounded-xl px-5 py-5">
          <h2 className="text-base font-bold text-[#f0f4f8] mb-3">Warum diesem Projekt vertrauen?</h2>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {TRUST_BADGES.map((b) => (
              <TrustBadge key={b.label} label={b.label} color={b.color} />
            ))}
          </div>

          {/* Source verification status (5) */}
          <div className="bg-[#0d1b2a] border border-[#1e3048] rounded-lg px-4 py-3 mb-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8faabb] mb-2">
              Quellenstatus · Community-Review
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm">🟢</span>
                <span className="text-xs text-[#f0f4f8]">
                  Menschlich geprüft:{" "}
                  <span className="font-bold text-[#4caf82]">{sourceStats.human}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">🟡</span>
                <span className="text-xs text-[#f0f4f8]">
                  Noch nicht geprüft:{" "}
                  <span className="font-bold text-[#f5a623]">{sourceStats.pending}</span>
                </span>
              </div>
              <Link
                href="/annahmen"
                className="text-[10px] text-[#00c8b4] hover:text-[#00a896] transition-colors ml-auto shrink-0"
                title="Jede Quelle kann von der Community überprüft und verbessert werden."
              >
                Quellen prüfen →
              </Link>
            </div>
            <div className="mt-2 h-1 bg-[#1e3048] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4caf82] rounded-full transition-all duration-500"
                style={{ width: `${ANNAHMEN_TOTAL > 0 ? (sourceStats.human / ANNAHMEN_TOTAL) * 100 : 0}%` }}
              />
            </div>
            <p className="text-[9px] text-[#8faabb]/60 mt-1.5">
              Jede Quelle kann von der Community überprüft und verbessert werden.
            </p>
          </div>

          {/* Checklist (6) */}
          <ul className="space-y-2.5 mb-5">
            {TRUST_POINTS.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm text-[#8faabb]">
                <span className="text-[#4caf82] font-bold mt-px shrink-0">✓</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>

          {/* Links */}
          <div className="flex flex-wrap gap-2 border-t border-[#1e3048] pt-4">
            <a
              href="https://github.com/DeutschlandSimulator"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00c8b4] hover:text-[#00a896] border border-[#00c8b4]/40 hover:border-[#00c8b4] rounded px-3 py-1.5 transition-all duration-150 hover:-translate-y-0.5"
            >
              GitHub →
            </a>
            <Link
              href="/annahmen"
              className="inline-flex items-center gap-1.5 text-xs text-[#8faabb] hover:text-[#f0f4f8] border border-[#1e3048] hover:border-[#00c8b4]/40 rounded px-3 py-1.5 transition-all duration-150"
            >
              Quellen &amp; Methodik →
            </Link>
            <Link
              href="/mitmachen"
              className="inline-flex items-center gap-1.5 text-xs text-[#8faabb] hover:text-[#f0f4f8] border border-[#1e3048] hover:border-[#00c8b4]/40 rounded px-3 py-1.5 transition-all duration-150"
            >
              Mitmachen →
            </Link>
          </div>
        </div>

        {/* ── Closing CTA ──────────────────────────────────────────────────── */}
        <div className="relative rounded-xl border border-[#00c8b4]/20 bg-gradient-to-br from-[#1a2b3c] to-[#0d1b2a] px-6 py-8 text-center overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-xl"
            style={{ background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,200,180,0.08) 0%, transparent 70%)" }}
          />
          <h2 className="relative text-xl md:text-2xl font-extrabold text-[#f0f4f8] mb-2">
            Bereit für Ihr eigenes Szenario?
          </h2>
          <p className="relative text-sm text-[#8faabb] mb-6 max-w-md mx-auto">
            Testen Sie politische Maßnahmen und analysieren Sie deren mögliche Auswirkungen auf Deutschland.
          </p>
          <Link
            href="/simulator"
            className="relative inline-flex items-center gap-2 bg-[#00c8b4] hover:bg-[#00a896] active:bg-[#008a7a] text-[#0d1b2a] font-bold py-3 px-8 rounded text-base transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-[#00c8b4]/25 focus-visible:outline-2 focus-visible:outline-[#00c8b4] focus-visible:outline-offset-2"
          >
            Simulation starten
            <ChevronRight size={16} />
          </Link>
        </div>

      </div>
    </Layout>
  );
}
