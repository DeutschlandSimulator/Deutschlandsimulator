import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { ChevronRight, TrendingDown, TrendingUp, Minus } from "lucide-react";

// ─── Trust stats ──────────────────────────────────────────────────────────────
const TRUST_STATS = [
  { value: "35+",    label: "Quellen hinterlegt"        },
  { value: "80+",    label: "Modellannahmen dokumentiert" },
  { value: "1.000+", label: "Szenarien simuliert"        },
  { value: "100 %",  label: "Open Source"               },
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
      { metric: "Staatseinnahmen",    value: "−18 Mrd. €", dir: "down"    },
      { metric: "Wirtschaftswachstum", value: "+0,4 %",    dir: "up"      },
      { metric: "Staatsverschuldung",  value: "+0,3 %",    dir: "neutral" },
    ],
  },
  {
    emoji: "👴",
    label: "Renteneintrittsalter erhöhen",
    effekte: [
      { metric: "Staatseinnahmen",    value: "+12 Mrd. €", dir: "up"   },
      { metric: "Wirtschaftswachstum", value: "+0,2 %",    dir: "up"   },
      { metric: "Staatsverschuldung",  value: "−0,4 %",    dir: "up"   },
    ],
  },
  {
    emoji: "💎",
    label: "Vermögensteuer einführen",
    effekte: [
      { metric: "Staatseinnahmen",    value: "+15 Mrd. €", dir: "up"   },
      { metric: "Wirtschaftswachstum", value: "−0,1 %",    dir: "down" },
      { metric: "Staatsverschuldung",  value: "−0,2 %",    dir: "up"   },
    ],
  },
];

// ─── Currently discussed topics ──────────────────────────────────────────────
const AKTUELLE_THEMEN = [
  { emoji: "💶", label: "Bürgergeld reformieren"                        },
  { emoji: "🛡️", label: "Verteidigungsausgaben auf 3,5 % des BIP"      },
  { emoji: "👴", label: "Renteneintrittsalter auf 69 Jahre anheben"    },
  { emoji: "⚡",  label: "Stromsteuer senken"                           },
  { emoji: "🚌", label: "Deutschlandticket abschaffen"                 },
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

// ─── Trust checklist ──────────────────────────────────────────────────────────
const TRUST_POINTS = [
  "Unabhängiges Privatprojekt",
  "Keine Verbindung zu Parteien, Behörden oder Interessengruppen",
  "Open Source — öffentlich einsehbarer Quellcode",
  "Quellen und Modellannahmen vollständig dokumentiert",
  "Community kann Fehler melden und Verbesserungen vorschlagen",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function DirIcon({ dir }: { dir: Dir }) {
  if (dir === "up")      return <TrendingUp  size={11} className="text-[#4caf82] shrink-0" />;
  if (dir === "down")    return <TrendingDown size={11} className="text-[#e05c5c] shrink-0" />;
  return <Minus size={11} className="text-[#8faabb] shrink-0" />;
}

function dirColor(dir: Dir) {
  return dir === "up" ? "text-[#4caf82]" : dir === "down" ? "text-[#e05c5c]" : "text-[#f0f4f8]";
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Landing() {
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

        {/* ── Trust stats bar ──────────────────────────────────────────────── */}
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

        {/* ── Comparison example ───────────────────────────────────────────── */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8faabb] mb-1">
            Beispiel einer Simulation
          </p>
          <h2 className="text-lg font-extrabold text-[#f0f4f8] mb-1">Was passiert, wenn …?</h2>
          <p className="text-sm text-[#8faabb] mb-4 leading-relaxed">
            Politische Entscheidungen haben unterschiedliche Auswirkungen auf Staat, Wirtschaft und Gesellschaft.
            Vergleiche mehrere Maßnahmen auf einen Blick.
          </p>

          {/* Desktop table */}
          <div className="hidden sm:block bg-[#1a2b3c] border border-[#1e3048] rounded-xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-4 bg-[#0d1b2a] border-b border-[#1e3048]">
              <div className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#8faabb]">
                Kennzahl
              </div>
              {MASSNAHMEN.map((m) => (
                <div key={m.label} className="px-4 py-3 text-center border-l border-[#1e3048]">
                  <div className="text-lg mb-0.5">{m.emoji}</div>
                  <div className="text-[11px] font-semibold text-[#f0f4f8] leading-snug">{m.label}</div>
                </div>
              ))}
            </div>
            {/* Rows */}
            {["Staatseinnahmen", "Wirtschaftswachstum", "Staatsverschuldung"].map((metric, ri) => (
              <div
                key={metric}
                className={`grid grid-cols-4 ${ri < 2 ? "border-b border-[#1e3048]" : ""}`}
              >
                <div className="px-4 py-3 text-xs text-[#8faabb] flex items-center">{metric}</div>
                {MASSNAHMEN.map((m) => {
                  const e = m.effekte[ri];
                  return (
                    <div key={m.label} className="px-4 py-3 border-l border-[#1e3048] flex items-center justify-center gap-1.5">
                      <DirIcon dir={e.dir} />
                      <span className={`text-sm font-bold tabular-nums ${dirColor(e.dir)}`}>{e.value}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden flex flex-col gap-2.5">
            {MASSNAHMEN.map((m) => (
              <div key={m.label} className="bg-[#1a2b3c] border border-[#1e3048] rounded-lg p-4">
                <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-[#1e3048]">
                  <span className="text-xl shrink-0">{m.emoji}</span>
                  <span className="text-sm font-semibold text-[#f0f4f8]">{m.label}</span>
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
              </div>
            ))}
          </div>

          <p className="text-[10px] text-[#8faabb]/50 mt-2.5 text-center">
            Beispielansicht eines Simulationsergebnisses · Keine echten Berechnungsergebnisse
          </p>
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
                {/* Icon + title */}
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0 mt-0.5">{s.emoji}</span>
                  <span className="text-sm font-semibold text-[#f0f4f8] leading-snug">{s.label}</span>
                </div>
                {/* Description */}
                <p className="text-xs text-[#8faabb] leading-relaxed flex-1">
                  {s.beschreibung}
                </p>
                {/* Main effect */}
                <div className="bg-[#0d1b2a] border border-[#1e3048] rounded-lg px-3 py-2 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-[#8faabb] uppercase tracking-wider font-semibold">
                    Haupteffekt · {s.haupteffekt.label}
                  </span>
                  <span className={`text-sm font-bold tabular-nums ${s.haupteffekt.positiv ? "text-[#4caf82]" : "text-[#e05c5c]"}`}>
                    {s.haupteffekt.value}
                  </span>
                </div>
                {/* CTA */}
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
          <h2 className="text-base font-bold text-[#f0f4f8] mb-4">Warum diesem Projekt vertrauen?</h2>
          <ul className="space-y-2.5 mb-5">
            {TRUST_POINTS.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm text-[#8faabb]">
                <span className="text-[#4caf82] font-bold mt-px shrink-0">✓</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2 border-t border-[#1e3048] pt-4">
            <a
              href="https://github.com/DeutschlandSimulator"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00c8b4] hover:text-[#00a896] border border-[#00c8b4]/40 hover:border-[#00c8b4] rounded px-3 py-1.5 transition-all duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[#00c8b4] focus-visible:outline-offset-2"
            >
              GitHub →
            </a>
            <Link
              href="/annahmen"
              className="inline-flex items-center gap-1.5 text-xs text-[#8faabb] hover:text-[#f0f4f8] border border-[#1e3048] hover:border-[#00c8b4]/40 rounded px-3 py-1.5 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#00c8b4] focus-visible:outline-offset-2"
            >
              Quellen &amp; Methodik →
            </Link>
            <Link
              href="/mitmachen"
              className="inline-flex items-center gap-1.5 text-xs text-[#8faabb] hover:text-[#f0f4f8] border border-[#1e3048] hover:border-[#00c8b4]/40 rounded px-3 py-1.5 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#00c8b4] focus-visible:outline-offset-2"
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
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,200,180,0.08) 0%, transparent 70%)",
            }}
          />
          <h2 className="relative text-xl md:text-2xl font-extrabold text-[#f0f4f8] mb-2">
            Bereit für Ihr eigenes Szenario?
          </h2>
          <p className="relative text-sm text-[#8faabb] mb-6 max-w-md mx-auto">
            Testen Sie politische Maßnahmen und analysieren Sie deren mögliche Auswirkungen
            auf Deutschland.
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
