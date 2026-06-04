import { Layout } from "@/components/Layout";
import { Link } from "wouter";

export default function Haftungsausschluss() {
  return (
    <Layout>
      <div className="flex-1 max-w-2xl mx-auto px-4 md:px-6 py-10 md:py-14 w-full flex flex-col gap-6">

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#00c8b4] mb-2">
            Rechtliches
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#f0f4f8] mb-2">
            Haftungsausschluss
          </h1>
          <p className="text-sm text-[#8faabb]">
            Dieses Dokument erläutert die Grenzen und den Zweck dieses Projekts.
          </p>
        </div>

        <div className="bg-[#1a2b3c] border border-[#f5a623]/30 rounded-lg px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#f5a623] mb-1.5">
            Wichtiger Hinweis
          </p>
          <p className="text-xs text-[#8faabb] leading-relaxed">
            Dieser Simulator dient ausschließlich der Veranschaulichung möglicher Auswirkungen
            politischer Entscheidungen. Die Ergebnisse sind keine Prognosen oder Beratungsleistungen.
          </p>
        </div>

        <section className="bg-[#1a2b3c] border border-[#1e3048] rounded-lg px-5 py-5 space-y-3">
          <h2 className="text-sm font-bold text-[#f0f4f8]">Haftungsausschluss für Inhalte</h2>
          <ul className="space-y-2 text-xs text-[#8faabb] leading-relaxed list-none">
            {[
              "Die dargestellten Ergebnisse basieren auf öffentlich verfügbaren Daten, Modellannahmen und Berechnungen.",
              "Trotz sorgfältiger Recherche können Fehler, Ungenauigkeiten oder veraltete Daten enthalten sein.",
              "Die Ergebnisse stellen keine Prognosen, Finanzberatung, Steuerberatung, Rechtsberatung oder Wahlempfehlung dar.",
              "Es wird keine Gewähr für Richtigkeit, Vollständigkeit oder Aktualität der dargestellten Informationen übernommen.",
              "Bei wichtigen Fragestellungen sollten die angegebenen Originalquellen geprüft und Fachleute konsultiert werden.",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[#00c8b4] shrink-0 mt-0.5">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-[#1a2b3c] border border-[#1e3048] rounded-lg px-5 py-5 space-y-3">
          <h2 className="text-sm font-bold text-[#f0f4f8]">Politische Neutralität</h2>
          <ul className="space-y-2 text-xs text-[#8faabb] leading-relaxed list-none">
            {[
              "Das Projekt wird privat betrieben und ist parteipolitisch unabhängig.",
              "Es besteht keine Verbindung zu politischen Parteien, Behörden, Interessenverbänden oder anderen Organisationen.",
              "Die dargestellten Positionen beruhen auf öffentlich verfügbaren Informationen und können unvollständig oder missverständlich sein.",
              "Das Projekt nimmt keine Wahlempfehlung vor und bewertet keine politischen Parteien.",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[#00c8b4] shrink-0 mt-0.5">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-[#1a2b3c] border border-[#1e3048] rounded-lg px-5 py-5 space-y-3">
          <h2 className="text-sm font-bold text-[#f0f4f8]">Modellgrenzen</h2>
          <p className="text-xs text-[#8faabb] leading-relaxed">
            Politische und wirtschaftliche Zusammenhänge sind komplex und nicht vollständig modellierbar.
            Die verwendeten Modelle sind stark vereinfacht und bilden die Realität nur näherungsweise ab.
            Wechselwirkungen, Zeitverzögerungen und Rückkopplungseffekte können nur teilweise berücksichtigt werden.
          </p>
        </section>

        <section className="bg-[#1a2b3c] border border-[#1e3048] rounded-lg px-5 py-5 space-y-3">
          <h2 className="text-sm font-bold text-[#f0f4f8]">Externe Links</h2>
          <p className="text-xs text-[#8faabb] leading-relaxed">
            Dieses Projekt enthält Links zu externen Websites. Für die Inhalte externer Seiten wird
            keine Haftung übernommen. Die Betreiber der verlinkten Seiten sind für deren Inhalte
            selbst verantwortlich.
          </p>
        </section>

        <div className="pt-2 flex flex-wrap gap-3 text-xs">
          <Link href="/impressum" className="text-[#8faabb] hover:text-[#00c8b4] transition-colors">
            ← Impressum
          </Link>
          <Link href="/annahmen" className="text-[#8faabb] hover:text-[#00c8b4] transition-colors">
            Transparenz & Methodik
          </Link>
        </div>

      </div>
    </Layout>
  );
}
