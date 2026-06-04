import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { ChevronRight, TrendingDown, TrendingUp, Minus } from "lucide-react";

// ─── Example simulation card data ────────────────────────────────────────────
const exampleResults = [
  { label: "Staatseinnahmen",   value: "−18 Mrd. €",  dir: "down" },
  { label: "Wirtschaftswachstum", value: "+0,4 %",   dir: "up"   },
  { label: "Staatsverschuldung",  value: "+0,3 %",   dir: "down" },
];

// ─── Popular scenarios ────────────────────────────────────────────────────────
const SZENARIEN = [
  { emoji: "🛒", label: "Mehrwertsteuer senken"        },
  { emoji: "💎", label: "Vermögenssteuer einführen"    },
  { emoji: "👴", label: "Renteneintrittsalter erhöhen"  },
  { emoji: "💶", label: "Bürgergeld reformieren"       },
  { emoji: "🛡️", label: "Verteidigungsausgaben erhöhen" },
];

// ─── Trust points ─────────────────────────────────────────────────────────────
const TRUST_POINTS = [
  "Unabhängiges Privatprojekt",
  "Keine Verbindung zu Parteien, Behörden oder Interessengruppen",
  "Open Source — öffentlich einsehbarer Quellcode",
  "Quellen und Modellannahmen vollständig dokumentiert",
  "Community kann Fehler melden und Verbesserungen vorschlagen",
];

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
            Testen Sie selbst, wie sich Änderungen bei Steuern, Sozialleistungen, Staatsausgaben oder anderen
            politischen Maßnahmen auf Staatshaushalt, Wirtschaft und Gesellschaft auswirken könnten.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/simulator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00c8b4] hover:bg-[#00a896] text-[#0d1b2a] font-bold py-3 px-8 rounded text-base transition-transform hover:-translate-y-0.5 shadow-lg shadow-[#00c8b4]/20"
              data-testid="button-start-sim"
            >
              Simulation starten
              <ChevronRight size={16} />
            </Link>
            <Link
              href="/annahmen"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#1e3048] hover:border-[#00c8b4]/60 text-[#8faabb] hover:text-[#f0f4f8] font-semibold py-3 px-8 rounded text-base transition-colors"
            >
              Methodik ansehen
            </Link>
          </div>
        </div>

        {/* ── Example simulation ───────────────────────────────────────────── */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8faabb] mb-3">
            Beispiel einer Simulation
          </p>
          <div className="bg-[#1a2b3c] border border-[#1e3048] rounded-lg p-5">
            {/* Scenario input */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#1e3048]">
              <div className="w-8 h-8 rounded bg-[#0d1b2a] border border-[#1e3048] flex items-center justify-center text-lg shrink-0">
                📉
              </div>
              <div>
                <p className="text-xs text-[#8faabb] mb-0.5">Parameter</p>
                <p className="text-sm font-semibold text-[#f0f4f8]">Einkommensteuer senken (−3 Prozentpunkte)</p>
              </div>
            </div>
            {/* Results */}
            <div className="grid grid-cols-3 gap-3">
              {exampleResults.map((r) => (
                <div key={r.label} className="bg-[#0d1b2a] rounded p-3 border border-[#1e3048]">
                  <div className="flex items-center gap-1 mb-1">
                    {r.dir === "up"
                      ? <TrendingUp size={11} className="text-[#4caf82]" />
                      : r.dir === "down"
                      ? <TrendingDown size={11} className="text-[#e05c5c]" />
                      : <Minus size={11} className="text-[#8faabb]" />}
                    <span className="text-[9px] text-[#8faabb] uppercase tracking-wider truncate">{r.label}</span>
                  </div>
                  <div className={`text-sm font-bold tabular-nums ${r.dir === "up" ? "text-[#4caf82]" : r.dir === "down" ? "text-[#e05c5c]" : "text-[#f0f4f8]"}`}>
                    {r.value}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-[#8faabb]/60 mt-3">
              Illustrative Beispielwerte · Keine realen Prognosen
            </p>
          </div>
          <div className="mt-3 flex justify-center">
            <Link
              href="/simulator"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#00c8b4] hover:text-[#00a896] border border-[#00c8b4]/40 hover:border-[#00c8b4] rounded-lg px-5 py-2.5 transition-colors"
            >
              Jetzt eigene Szenarien testen
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* ── Popular scenarios ────────────────────────────────────────────── */}
        <div>
          <h2 className="text-base font-bold text-[#f0f4f8] mb-3">Beliebte Szenarien</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {SZENARIEN.map((s) => (
              <Link
                key={s.label}
                href="/simulator"
                className="flex items-center gap-3 bg-[#1a2b3c] border border-[#1e3048] hover:border-[#00c8b4]/50 hover:bg-[#1e3448] rounded-lg px-4 py-3 text-sm text-[#f0f4f8] transition-colors group"
              >
                <span className="text-xl shrink-0">{s.emoji}</span>
                <span className="font-medium leading-snug flex-1">{s.label}</span>
                <ChevronRight size={14} className="text-[#8faabb] group-hover:text-[#00c8b4] shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
          <p className="text-[10px] text-[#8faabb]/60 mt-2 text-center">
            Szenarien-Presets in Entwicklung — öffnet derzeit den Simulator
          </p>
        </div>

        {/* ── Trust section ────────────────────────────────────────────────── */}
        <div className="bg-[#1a2b3c] border border-[#1e3048] rounded-lg px-5 py-5">
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
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00c8b4] hover:text-[#00a896] border border-[#00c8b4]/40 hover:border-[#00c8b4] rounded px-3 py-1.5 transition-colors"
            >
              GitHub →
            </a>
            <Link
              href="/annahmen"
              className="inline-flex items-center gap-1.5 text-xs text-[#8faabb] hover:text-[#f0f4f8] border border-[#1e3048] hover:border-[#00c8b4]/40 rounded px-3 py-1.5 transition-colors"
            >
              Quellen &amp; Methodik →
            </Link>
            <Link
              href="/mitmachen"
              className="inline-flex items-center gap-1.5 text-xs text-[#8faabb] hover:text-[#f0f4f8] border border-[#1e3048] hover:border-[#00c8b4]/40 rounded px-3 py-1.5 transition-colors"
            >
              Mitmachen →
            </Link>
          </div>
        </div>

      </div>
    </Layout>
  );
}
