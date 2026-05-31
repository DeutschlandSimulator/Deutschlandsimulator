import { Layout } from "@/components/Layout";

export default function ImpressumPage() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-6 py-12 text-[#f0f4f8]">
        <h1 className="text-2xl font-bold text-[#00c8b4] mb-2">Impressum</h1>
        <p className="text-xs text-[#8faabb] mb-8">Angaben gemäß § 5 TMG</p>

        <div className="bg-[#1a2b3c] border border-[#1e3048] rounded-lg p-5 mb-6">
          <p className="font-semibold text-[#f0f4f8]">Kian Salem</p>
          <p className="text-[#8faabb] text-sm mt-1">Bernkasteler Straße 65A</p>
          <p className="text-[#8faabb] text-sm">50969 Köln</p>
          <p className="text-[#8faabb] text-sm">Deutschland</p>
          <p className="text-[#8faabb] text-sm mt-3">
            E-Mail:{" "}
            <a href="mailto:Kian.Salem@gmail.com" className="text-[#00c8b4] hover:underline">
              Kian.Salem@gmail.com
            </a>
          </p>
        </div>

        <Section title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
          <p>Kian Salem<br />Bernkasteler Straße 65A<br />50969 Köln</p>
        </Section>

        <Section title="Haftung für Inhalte">
          <p>
            Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die
            Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr
            übernommen werden.
          </p>
          <p className="mt-3">
            Insbesondere dienen die auf dieser Website dargestellten Simulationen, Berechnungen,
            Prognosen und Szenarien ausschließlich Informations-, Bildungs- und
            Diskussionszwecken. Sie stellen keine politische, rechtliche, steuerliche oder
            finanzielle Beratung dar.
          </p>
          <p className="mt-3">
            Die dargestellten Ergebnisse beruhen auf Modellen, Annahmen und öffentlich
            verfügbaren Datenquellen. Trotz sorgfältiger Prüfung können fehlerhafte Annahmen,
            unvollständige Daten oder Modellierungsfehler zu unzutreffenden Ergebnissen führen.
          </p>
        </Section>

        <Section title="Haftung für Links">
          <p>
            Diese Website kann Links zu externen Websites Dritter enthalten. Auf deren Inhalte
            besteht kein Einfluss. Deshalb kann für diese fremden Inhalte keine Gewähr übernommen
            werden. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
            Betreiber verantwortlich.
          </p>
        </Section>

        <Section title="Urheberrecht">
          <p>
            Die durch den Betreiber erstellten Inhalte und Werke auf dieser Website unterliegen
            dem deutschen Urheberrecht. Jede Art der Verwertung außerhalb der Grenzen des
            Urheberrechts bedarf der vorherigen schriftlichen Zustimmung des jeweiligen
            Rechteinhabers.
          </p>
        </Section>

        <Section title="Hinweis zu KI-generierten Inhalten">
          <p>
            Teile der auf dieser Website veröffentlichten Inhalte, Analysen, Texte,
            Visualisierungen oder Berechnungen können mithilfe künstlicher Intelligenz erstellt
            oder unterstützt worden sein.
          </p>
          <p className="mt-3">
            Trotz sorgfältiger Prüfung können KI-Systeme fehlerhafte, unvollständige oder
            irreführende Informationen erzeugen. Nutzer werden gebeten, wichtige Informationen
            anhand der angegebenen Quellen zu überprüfen.
          </p>
        </Section>

        <Section title="Hinweis zu Simulationen und Annahmen">
          <p>
            Die auf dieser Website dargestellten Auswirkungen politischer, wirtschaftlicher und
            gesellschaftlicher Maßnahmen basieren auf vereinfachten Modellen und Annahmen. Reale
            Entwicklungen sind wesentlich komplexer und können von den dargestellten Ergebnissen
            erheblich abweichen.
          </p>
          <p className="mt-3">
            Die Website erhebt keinen Anspruch darauf, tatsächliche zukünftige Entwicklungen
            vorherzusagen oder politische Empfehlungen auszusprechen.
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
