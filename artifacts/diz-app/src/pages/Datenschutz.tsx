import { Layout } from "@/components/Layout";

export default function DatenschutzPage() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-6 py-12 text-[#f0f4f8]">
        <h1 className="text-2xl font-bold text-[#00c8b4] mb-1">Datenschutzerklärung</h1>
        <p className="text-xs text-[#8faabb] mb-8">
          Gemäß Art. 13, 14 DSGVO · Stand: Juni 2025
        </p>

        <Section title="1. Verantwortlicher">
          <p>
            Kian Salem<br />
            Bernkasteler Straße 65A<br />
            50969 Köln<br />
            Deutschland<br />
            E-Mail:{" "}
            <a href="mailto:Kian.Salem@gmail.com" className="text-[#00c8b4] hover:underline">
              Kian.Salem@gmail.com
            </a>
          </p>
        </Section>

        <Section title="2. Hosting">
          <p>
            Diese Website wird bei <strong className="text-[#f0f4f8]">Replit Inc.</strong>,
            650 Castro St, Suite 120, Mountain View, CA 94041, USA, gehostet.
            Bei jedem Aufruf der Website werden durch Replit automatisch Server-Zugriffsprotokolle
            erfasst (IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene URL, HTTP-Statuscode,
            übertragene Datenmenge, Referrer-URL, Browser und Betriebssystem).
          </p>
          <p className="mt-3">
            Da Replit in den USA ansässig ist, kann eine Datenübertragung in die USA nicht
            ausgeschlossen werden. Replit hat sich dem EU-US Data Privacy Framework verpflichtet.
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am
            störungsfreien Betrieb der Website).
          </p>
        </Section>

        <Section title="3. Cookies">
          <p>
            Diese Website setzt ausschließlich ein technisch notwendiges Cookie:
          </p>
          <div className="mt-3 rounded border border-[#1e3048] overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1e3048] bg-[#0d1b2a]">
                  <th className="text-left px-3 py-2 text-[#f0f4f8]">Name</th>
                  <th className="text-left px-3 py-2 text-[#f0f4f8]">Zweck</th>
                  <th className="text-left px-3 py-2 text-[#f0f4f8]">Laufzeit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-2 font-mono text-[#00c8b4]">sid</td>
                  <td className="px-3 py-2 text-[#8faabb]">
                    Session-Identifikation nach dem Einloggen
                  </td>
                  <td className="px-3 py-2 text-[#8faabb]">Bis zum Ausloggen / Session-Ende</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3">
            Das Cookie wird <strong className="text-[#f0f4f8]">ausschließlich gesetzt, wenn Sie
            sich aktiv einloggen</strong>, und wird beim Ausloggen gelöscht. Beim bloßen Besuch
            der Website ohne Einloggen wird kein Cookie gesetzt. Es werden keine Tracking-,
            Analyse- oder Werbe-Cookies verwendet.
          </p>
          <p className="mt-3">
            Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Erforderlichkeit zur Bereitstellung
            des angefragten Dienstes) bzw. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse
            an der sicheren Authentifizierung).
          </p>
        </Section>

        <Section title="4. Authentifizierung (Login via Replit)">
          <p>
            Wenn Sie sich einloggen, nutzt diese Website den Authentifizierungsdienst von
            Replit Inc. (OpenID Connect). Dabei werden folgende Daten von Replit übermittelt
            und zur Aufrechterhaltung der Sitzung verarbeitet:
          </p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-[#8faabb]">
            <li>Replit-Benutzername</li>
            <li>Profilbild-URL (falls vorhanden)</li>
            <li>Interne Replit-Benutzer-ID</li>
          </ul>
          <p className="mt-3">
            Diese Daten werden ausschließlich für die Dauer der Sitzung im Arbeitsspeicher
            des Servers gehalten und nicht dauerhaft gespeichert.
            Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.
          </p>
          <p className="mt-3">
            Den Datenschutzhinweis von Replit finden Sie unter:{" "}
            <a
              href="https://replit.com/site/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00c8b4] hover:underline"
            >
              replit.com/site/privacy
            </a>
          </p>
        </Section>

        <Section title="5. Lokaler Speicher (localStorage)">
          <p>
            Die Website speichert folgende Präferenzen lokal in Ihrem Browser (localStorage).
            Diese Daten verlassen Ihr Gerät nicht und werden nicht an Server übertragen:
          </p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-[#8faabb]">
            <li>
              <code className="text-[#00c8b4]">diz-theme</code> — Farbschema-Präferenz (Hell/Dunkel)
            </li>
            <li>
              <code className="text-[#00c8b4]">diz-cookie-consent</code> — Bestätigung dieses
              Cookie-Hinweises
            </li>
          </ul>
          <p className="mt-3">
            Diese Einträge können jederzeit über die Browser-Einstellungen gelöscht werden.
          </p>
        </Section>

        <Section title="6. Ihre Rechte (Art. 15–21 DSGVO)">
          <p>Sie haben gegenüber dem Verantwortlichen folgende Rechte:</p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-[#8faabb]">
            <li>
              <strong className="text-[#f0f4f8]">Auskunft</strong> (Art. 15) — Welche Daten
              werden über Sie verarbeitet?
            </li>
            <li>
              <strong className="text-[#f0f4f8]">Berichtigung</strong> (Art. 16) — Korrektur
              unrichtiger Daten
            </li>
            <li>
              <strong className="text-[#f0f4f8]">Löschung</strong> (Art. 17) — Recht auf
              „Vergessenwerden"
            </li>
            <li>
              <strong className="text-[#f0f4f8]">Einschränkung</strong> (Art. 18) — Einschränkung
              der Verarbeitung
            </li>
            <li>
              <strong className="text-[#f0f4f8]">Widerspruch</strong> (Art. 21) — Widerspruch
              gegen Verarbeitungen auf Basis von Art. 6 Abs. 1 lit. f DSGVO
            </li>
            <li>
              <strong className="text-[#f0f4f8]">Datenübertragbarkeit</strong> (Art. 20) —
              Erhalt Ihrer Daten in maschinenlesbarem Format
            </li>
          </ul>
          <p className="mt-3">
            Zur Geltendmachung Ihrer Rechte wenden Sie sich an:{" "}
            <a href="mailto:Kian.Salem@gmail.com" className="text-[#00c8b4] hover:underline">
              Kian.Salem@gmail.com
            </a>
          </p>
        </Section>

        <Section title="7. Beschwerderecht bei der Aufsichtsbehörde">
          <p>
            Sie haben das Recht, sich bei der zuständigen Datenschutzaufsichtsbehörde zu
            beschweren (Art. 77 DSGVO). Zuständig ist:
          </p>
          <p className="mt-2">
            Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen<br />
            Postfach 20 04 44, 40102 Düsseldorf<br />
            <a
              href="https://www.ldi.nrw.de"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00c8b4] hover:underline"
            >
              www.ldi.nrw.de
            </a>
          </p>
        </Section>

        <Section title="8. Keine Weitergabe an Dritte">
          <p>
            Es werden keine personenbezogenen Daten an Dritte zu Werbe-, Analyse- oder
            Marketingzwecken weitergegeben. Eine Weitergabe erfolgt ausschließlich an
            Replit Inc. als technischen Dienstleister (Hosting und Authentifizierung, siehe
            Abschnitte 2 und 4).
          </p>
        </Section>
      </div>
    </Layout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <h2 className="text-sm font-semibold text-[#00c8b4] uppercase tracking-wide mb-2">
        {title}
      </h2>
      <div className="text-sm text-[#8faabb] leading-relaxed border-l-2 border-[#1e3048] pl-4">
        {children}
      </div>
    </div>
  );
}
