import { Layout } from "@/components/Layout";
import { partyProfiles } from "@/components/simulator/data";

const policies = [
  { key: "beamte",         label: "Beamte (Tsd.)",        min: 4000, max: 6000, unit: "k",     status: 4900 },
  { key: "ministerien",    label: "Ministerien",           min: 10,   max: 22,   unit: "",      status: 16   },
  { key: "verteidigung",   label: "Verteidigung (% BIP)",  min: 1.0,  max: 3.0,  unit: "%",     status: 2.0  },
  { key: "fachkraefte",    label: "Fachkräfte (k/J.)",     min: 50,   max: 500,  unit: "k",     status: 200  },
  { key: "buergergeld",    label: "Bürgergeld (€/Mon.)",   min: 400,  max: 700,  unit: "€",     status: 502  },
  { key: "rentenalter",    label: "Rentenalter (J.)",      min: 63,   max: 70,   unit: "J.",    status: 67   },
  { key: "einkommensteuer",label: "Spitzensteuersatz (%)", min: 30,   max: 55,   unit: "%",     status: 42   },
];

function normalize(val: number, min: number, max: number) {
  return Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
}

export default function VergleichPage() {
  return (
    <Layout>
      <div className="p-6 max-w-[1200px] mx-auto w-full">
        <div className="mb-6">
          <div className="text-[#8faabb] text-sm mb-1">
            <span>Startseite</span>
            <span className="mx-1">›</span>
            <span className="text-[#00c8b4]">Vergleich</span>
          </div>
          <h1 className="text-2xl font-bold">Partei-Positionen im Vergleich</h1>
          <p className="text-[#8faabb] text-sm mt-1">Positionen der Parteien zu 7 Schlüsselpolitikfeldern, Stand Bundestagswahl 2025.</p>
        </div>

        {/* Desktop table */}
        <div className="bg-[#1a2b3c] rounded border border-[#1e3048] overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-[#0d1b2a]">
                <tr>
                  <th className="p-4 text-[#8faabb] font-medium text-sm w-44">Politikfeld</th>
                  <th className="p-3 text-[#8faabb] font-medium text-xs text-center">Status Quo</th>
                  {partyProfiles.map((p) => (
                    <th key={p.abk} className="p-3 font-bold text-xs text-center" style={{ color: p.farbe }}>
                      {p.abk}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e3048]">
                {policies.map((pol) => (
                  <tr key={pol.key} className="hover:bg-[#243447] transition-colors">
                    <td className="p-4 text-sm font-medium text-[#f0f4f8]">{pol.label}</td>
                    <td className="p-3 text-center">
                      <span className="text-xs font-bold text-[#8faabb]">
                        {pol.status}{pol.unit}
                      </span>
                    </td>
                    {partyProfiles.map((p) => {
                      const val = Number((p as Record<string, unknown>)[pol.key]);
                      const sqNorm = normalize(pol.status, pol.min, pol.max);
                      const pNorm = normalize(val, pol.min, pol.max);
                      const diff = Math.abs(pNorm - sqNorm);
                      const color = diff < 15 ? "#4caf82" : diff < 30 ? "#f5a623" : "#e05c5c";
                      return (
                        <td key={p.abk} className="p-3 text-center" data-testid={`cell-${pol.key}-${p.abk}`}>
                          <span className="text-xs font-bold" style={{ color }}>
                            {val}{pol.unit}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="hover:bg-[#243447] transition-colors border-t-2 border-[#1e3048]">
                  <td className="p-4 text-sm font-medium text-[#f0f4f8]">Vermögenssteuer</td>
                  <td className="p-3 text-center"><span className="text-xs text-[#e05c5c] font-bold">Nein</span></td>
                  {partyProfiles.map((p) => (
                    <td key={p.abk} className="p-3 text-center">
                      <span className={`text-xs font-bold ${p.vermoegenssteuer ? "text-[#4caf82]" : "text-[#e05c5c]"}`}>
                        {p.vermoegenssteuer ? "Ja" : "Nein"}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Party cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {partyProfiles.map((p) => (
            <div key={p.name} className="bg-[#1a2b3c] rounded border border-[#1e3048] p-5 hover:border-[#00c8b4]/30 transition-colors" data-testid={`card-party-${p.abk}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black" style={{ backgroundColor: p.farbe + "33", color: p.farbe, border: `1px solid ${p.farbe}44` }}>
                  {p.abk}
                </div>
                <span className="font-bold text-sm">{p.name}</span>
              </div>
              <div className="space-y-2">
                {policies.slice(0, 5).map((pol) => {
                  const val = Number((p as Record<string, unknown>)[pol.key]);
                  const sqNorm = normalize(pol.status, pol.min, pol.max);
                  const pNorm = normalize(val, pol.min, pol.max);
                  const diff = Math.abs(pNorm - sqNorm);
                  const color = diff < 15 ? "#4caf82" : diff < 30 ? "#f5a623" : "#e05c5c";
                  return (
                    <div key={pol.key} className="flex justify-between text-xs">
                      <span className="text-[#8faabb]">{pol.label}</span>
                      <span className="font-bold" style={{ color }}>{val}{pol.unit}</span>
                    </div>
                  );
                })}
                <div className="flex justify-between text-xs">
                  <span className="text-[#8faabb]">Vermögenssteuer</span>
                  <span className={`font-bold ${p.vermoegenssteuer ? "text-[#4caf82]" : "text-[#e05c5c]"}`}>
                    {p.vermoegenssteuer ? "Ja" : "Nein"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-[#8faabb]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#4caf82] inline-block" /> Nah am Status Quo (&lt;15pp)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f5a623] inline-block" /> Moderate Abweichung</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#e05c5c] inline-block" /> Starke Abweichung (&gt;30pp)</span>
        </div>

        <p className="text-[10px] text-[#8faabb] mt-3">
          Quellen: Parteiprogramme zur Bundestagswahl 2025. Vereinfachte Positionen für Vergleichszwecke.
        </p>
      </div>
    </Layout>
  );
}
