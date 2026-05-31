import { Link } from "wouter";
import { Layout } from "@/components/Layout";

const featureCards = [
  {
    icon: "💰",
    title: "Staatshaushalt",
    text: "Verändere Ausgaben, Steuern und Förderungen und analysiere die Auswirkungen auf die öffentlichen Finanzen.",
  },
  {
    icon: "👥",
    title: "Gesellschaft",
    text: "Untersuche mögliche Effekte auf Bevölkerung, Arbeitsmarkt und soziale Sicherungssysteme.",
  },
  {
    icon: "📈",
    title: "Wirtschaft",
    text: "Simuliere Auswirkungen auf Wachstum, Wettbewerbsfähigkeit und Staatsverschuldung.",
  },
];

export default function Landing() {
  return (
    <Layout>
      <div className="flex-1 max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-14 w-full flex flex-col gap-6">

        {/* ── Hero ───────────────────────────────────────────────── */}
        <div className="text-center mt-4 md:mt-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-tight">
            Deutschlandsimulator
          </h1>
          <p className="text-base md:text-lg text-[#8faabb] mb-2 leading-relaxed">
            Simuliere politische Entscheidungen und entdecke ihre möglichen Auswirkungen auf
            Staatshaushalt, Wirtschaft, Sozialsysteme und Gesellschaft.
          </p>
          <p className="text-sm text-[#8faabb]/70 mb-7">
            Ein datenbasiertes und transparentes Werkzeug zur Veranschaulichung politischer Szenarien.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/simulator"
              className="w-full sm:w-auto inline-block bg-[#00c8b4] hover:bg-[#00a896] text-[#0d1b2a] font-bold py-3 px-8 rounded text-base transition-transform hover:-translate-y-0.5 shadow-lg shadow-[#00c8b4]/20"
              data-testid="button-start-sim"
            >
              Simulation starten
            </Link>
            <Link
              href="/annahmen"
              className="w-full sm:w-auto inline-block border border-[#1e3048] hover:border-[#00c8b4]/60 text-[#8faabb] hover:text-[#f0f4f8] font-semibold py-3 px-8 rounded text-base transition-colors"
            >
              Methodik ansehen
            </Link>
          </div>
        </div>

        {/* ── Feature Cards ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {featureCards.map((c) => (
            <div
              key={c.title}
              className="bg-[#1a2b3c] border border-[#1e3048] rounded-lg p-5 hover:border-[#00c8b4]/40 transition-colors"
            >
              <div className="text-2xl mb-2">{c.icon}</div>
              <h3 className="font-bold text-sm mb-1">{c.title}</h3>
              <p className="text-xs text-[#8faabb] leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>

        {/* ── Unabhängiges Privatprojekt ─────────────────────────── */}
        <div className="bg-[#1a2b3c] border border-[#1e3048] rounded-lg px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#00c8b4] mb-1.5">
            Unabhängiges Privatprojekt
          </p>
          <p className="text-xs text-[#8faabb] leading-relaxed">
            Der Deutschlandsimulator ist ein privates, unabhängiges Projekt und steht in keiner
            Verbindung zu Parteien, Behörden oder Interessengruppen.
          </p>
        </div>

        {/* ── Daten & Methodik ───────────────────────────────────── */}
        <div className="bg-[#1a2b3c] border border-[#1e3048] rounded-lg px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#00c8b4] mb-1.5">
            Daten &amp; Methodik
          </p>
          <p className="text-xs text-[#8faabb] leading-relaxed mb-3">
            Die Simulation basiert auf öffentlich zugänglichen Datenquellen, wissenschaftlichen
            Veröffentlichungen und modellbasierten Annahmen. Ergebnisse dienen der Veranschaulichung
            möglicher Entwicklungen und stellen keine Prognosen dar.
          </p>
          <Link
            href="/annahmen"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00c8b4] hover:text-[#00a896] border border-[#00c8b4]/40 hover:border-[#00c8b4] rounded px-3 py-1.5 transition-colors"
          >
            Quellen &amp; Methodik →
          </Link>
        </div>

        {/* ── Transparenz ────────────────────────────────────────── */}
        <div className="bg-[#1a2b3c] border border-[#1e3048] rounded-lg px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#00c8b4] mb-1.5">
            Transparenz
          </p>
          <p className="text-xs text-[#8faabb] leading-relaxed">
            Politische und wirtschaftliche Zusammenhänge sind komplex. Die dargestellten Ergebnisse
            beruhen auf Annahmen und vereinfachten Modellen. Trotz sorgfältiger Recherche können
            Fehler, Ungenauigkeiten oder unvollständige Daten enthalten sein.
          </p>
        </div>

      </div>
    </Layout>
  );
}
