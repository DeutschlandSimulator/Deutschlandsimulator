import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Badge } from "@/components/ui/badge";

const barData = [
  { name: 'Soziales', einnahmen: 0, ausgaben: 175 },
  { name: 'Verteidigung', einnahmen: 0, ausgaben: 52 },
  { name: 'Bildung', einnahmen: 0, ausgaben: 21 },
  { name: 'Zinsen', einnahmen: 0, ausgaben: 37 },
  { name: 'Sonstiges', einnahmen: 460, ausgaben: 191 },
];

const lineData = [
  { year: '2024', statusQuo: 0.2, simulation: 0.2 },
  { year: '2025', statusQuo: 0.5, simulation: 0.8 },
  { year: '2026', statusQuo: 0.8, simulation: 1.2 },
  { year: '2027', statusQuo: 1.0, simulation: 1.5 },
  { year: '2028', statusQuo: 1.1, simulation: 1.8 },
  { year: '2029', statusQuo: 1.2, simulation: 2.1 },
  { year: '2030', statusQuo: 1.2, simulation: 2.4 },
];

export function Simulator() {
  const [beamte, setBeamte] = useState(4900);
  const [ministerien, setMinisterien] = useState(16);
  const [verteidigung, setVerteidigung] = useState(2.0);
  const [entwicklung, setEntwicklung] = useState(0.4);

  const [fluechtlinge, setFluechtlinge] = useState(180);
  const [fachkraefte, setFachkraefte] = useState(200);
  const [euZuwanderung, setEuZuwanderung] = useState(true);

  const [einheitsversicherung, setEinheitsversicherung] = useState(false);
  const [privatAbschaffen, setPrivatAbschaffen] = useState(false);
  const [beitragssatz, setBeitragssatz] = useState(14.6);

  const [buergergeld, setBuergergeld] = useState(502);
  const [rentenalter, setRenteneintrittsalter] = useState(67);
  const [rentenniveau, setRentenniveau] = useState(48);

  const [einkommensteuer, setEinkommensteuer] = useState(42);
  const [unternehmenssteuer, setUnternehmenssteuer] = useState(29.9);
  const [vermoegenssteuer, setVermoegenssteuer] = useState(false);
  const [erbschaftssteuer, setErbschaftssteuer] = useState(400);

  return (
    <div className="bg-[#0d1b2a] min-h-screen text-[#f0f4f8] font-sans flex">
      <div className="w-[360px] bg-[#1a2b3c] p-4 h-screen overflow-y-auto border-r border-[#1e3048]">
        <h2 className="text-xl font-bold mb-6 border-b-2 border-[#00c8b4] pb-2 inline-block">Politische Parameter</h2>
        
        <Accordion type="multiple" defaultValue={["item-1"]} className="w-full">
          <AccordionItem value="item-1" className="border-[#1e3048]">
            <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8]">Staat</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Beamte</span>
                  <Badge variant="outline" className="bg-[#243447] text-[#00c8b4] border-[#1e3048]">{beamte}k</Badge>
                </div>
                <input type="range" min="4200" max="6000" value={beamte} onChange={(e) => setBeamte(Number(e.target.value))} className="w-full accent-[#00c8b4]" />
              </div>
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Ministerien</span>
                  <Badge variant="outline" className="bg-[#243447] text-[#00c8b4] border-[#1e3048]">{ministerien}</Badge>
                </div>
                <input type="range" min="10" max="25" value={ministerien} onChange={(e) => setMinisterien(Number(e.target.value))} className="w-full accent-[#00c8b4]" />
              </div>
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Verteidigungsausgaben</span>
                  <Badge variant="outline" className="bg-[#243447] text-[#00c8b4] border-[#1e3048]">{verteidigung}%</Badge>
                </div>
                <input type="range" min="1.0" max="3.0" step="0.1" value={verteidigung} onChange={(e) => setVerteidigung(Number(e.target.value))} className="w-full accent-[#00c8b4]" />
              </div>
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Entwicklungshilfe</span>
                  <Badge variant="outline" className="bg-[#243447] text-[#00c8b4] border-[#1e3048]">{entwicklung}%</Badge>
                </div>
                <input type="range" min="0.2" max="0.8" step="0.1" value={entwicklung} onChange={(e) => setEntwicklung(Number(e.target.value))} className="w-full accent-[#00c8b4]" />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" className="border-[#1e3048]">
            <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8]">Migration</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Flüchtlingsaufnahme</span>
                  <Badge variant="outline" className="bg-[#243447] text-[#00c8b4] border-[#1e3048]">{fluechtlinge}k</Badge>
                </div>
                <input type="range" min="50" max="400" value={fluechtlinge} onChange={(e) => setFluechtlinge(Number(e.target.value))} className="w-full accent-[#00c8b4]" />
              </div>
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Fachkräftezuwanderung</span>
                  <Badge variant="outline" className="bg-[#243447] text-[#00c8b4] border-[#1e3048]">{fachkraefte}k</Badge>
                </div>
                <input type="range" min="50" max="500" value={fachkraefte} onChange={(e) => setFachkraefte(Number(e.target.value))} className="w-full accent-[#00c8b4]" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">EU-Zuwanderung</span>
                <input type="checkbox" checked={euZuwanderung} onChange={(e) => setEuZuwanderung(e.target.checked)} className="accent-[#00c8b4]" />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border-[#1e3048]">
            <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8]">Gesundheit</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Einheitsversicherung</span>
                <input type="checkbox" checked={einheitsversicherung} onChange={(e) => setEinheitsversicherung(e.target.checked)} className="accent-[#00c8b4]" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Privatversicherung abschaffen</span>
                <input type="checkbox" checked={privatAbschaffen} onChange={(e) => setPrivatAbschaffen(e.target.checked)} className="accent-[#e05c5c]" />
              </div>
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Beitragssatz</span>
                  <Badge variant="outline" className="bg-[#243447] text-[#00c8b4] border-[#1e3048]">{beitragssatz}%</Badge>
                </div>
                <input type="range" min="14" max="18" step="0.1" value={beitragssatz} onChange={(e) => setBeitragssatz(Number(e.target.value))} className="w-full accent-[#00c8b4]" />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-[#1e3048]">
            <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8]">Soziales</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Bürgergeld</span>
                  <Badge variant="outline" className="bg-[#243447] text-[#00c8b4] border-[#1e3048]">{buergergeld} EUR</Badge>
                </div>
                <input type="range" min="400" max="700" value={buergergeld} onChange={(e) => setBuergergeld(Number(e.target.value))} className="w-full accent-[#00c8b4]" />
              </div>
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Renteneintrittsalter</span>
                  <Badge variant="outline" className="bg-[#243447] text-[#00c8b4] border-[#1e3048]">{rentenalter}</Badge>
                </div>
                <input type="range" min="63" max="70" value={rentenalter} onChange={(e) => setRenteneintrittsalter(Number(e.target.value))} className="w-full accent-[#00c8b4]" />
              </div>
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Rentenniveau</span>
                  <Badge variant="outline" className="bg-[#243447] text-[#00c8b4] border-[#1e3048]">{rentenniveau}%</Badge>
                </div>
                <input type="range" min="40" max="55" value={rentenniveau} onChange={(e) => setRentenniveau(Number(e.target.value))} className="w-full accent-[#00c8b4]" />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border-[#1e3048]">
            <AccordionTrigger className="text-[#8faabb] hover:text-[#f0f4f8]">Steuern</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Einkommensteuer Spitzensatz</span>
                  <Badge variant="outline" className="bg-[#243447] text-[#00c8b4] border-[#1e3048]">{einkommensteuer}%</Badge>
                </div>
                <input type="range" min="30" max="55" step="0.1" value={einkommensteuer} onChange={(e) => setEinkommensteuer(Number(e.target.value))} className="w-full accent-[#00c8b4]" />
              </div>
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Unternehmenssteuer</span>
                  <Badge variant="outline" className="bg-[#243447] text-[#00c8b4] border-[#1e3048]">{unternehmenssteuer}%</Badge>
                </div>
                <input type="range" min="10" max="35" step="0.1" value={unternehmenssteuer} onChange={(e) => setUnternehmenssteuer(Number(e.target.value))} className="w-full accent-[#00c8b4]" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Vermögenssteuer</span>
                <input type="checkbox" checked={vermoegenssteuer} onChange={(e) => setVermoegenssteuer(e.target.checked)} className="accent-[#00c8b4]" />
              </div>
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Erbschaftssteuer Freibetrag</span>
                  <Badge variant="outline" className="bg-[#243447] text-[#00c8b4] border-[#1e3048]">{erbschaftssteuer}k</Badge>
                </div>
                <input type="range" min="100" max="1000" step="50" value={erbschaftssteuer} onChange={(e) => setErbschaftssteuer(Number(e.target.value))} className="w-full accent-[#00c8b4]" />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      <div className="flex-1 p-6 h-screen overflow-y-auto">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold">Echtzeit-Simulation</h2>
          <Badge className="bg-[#4caf82] text-white">LIVE</Badge>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1a2b3c] p-4 rounded border border-[#1e3048]">
            <div className="text-[#8faabb] text-sm mb-1">Haushaltsdefizit</div>
            <div className="text-xl font-bold text-[#e05c5c]">-34.2 Mrd EUR</div>
          </div>
          <div className="bg-[#1a2b3c] p-4 rounded border border-[#1e3048]">
            <div className="text-[#8faabb] text-sm mb-1">Staatsverschuldung</div>
            <div className="text-xl font-bold text-[#f0f4f8]">2.445 Mrd EUR</div>
          </div>
          <div className="bg-[#1a2b3c] p-4 rounded border border-[#1e3048]">
            <div className="text-[#8faabb] text-sm mb-1">Steueraufkommen</div>
            <div className="text-xl font-bold text-[#4caf82]">916 Mrd EUR <span className="text-xs">(+18 Mrd)</span></div>
          </div>
          <div className="bg-[#1a2b3c] p-4 rounded border border-[#1e3048]">
            <div className="text-[#8faabb] text-sm mb-1">Gesundheitskosten</div>
            <div className="text-xl font-bold text-[#f0f4f8]">468 Mrd EUR</div>
          </div>
          <div className="bg-[#1a2b3c] p-4 rounded border border-[#1e3048]">
            <div className="text-[#8faabb] text-sm mb-1">Rentenkosten</div>
            <div className="text-xl font-bold text-[#f0f4f8]">362 Mrd EUR</div>
          </div>
          <div className="bg-[#1a2b3c] p-4 rounded border border-[#1e3048]">
            <div className="text-[#8faabb] text-sm mb-1">Arbeitslosenquote</div>
            <div className="text-xl font-bold text-[#e05c5c]">5.7% ↑</div>
          </div>
          <div className="bg-[#1a2b3c] p-4 rounded border border-[#1e3048]">
            <div className="text-[#8faabb] text-sm mb-1">Fachkräftemangel</div>
            <div className="text-xl font-bold text-[#f5a623]">890k Stellen</div>
          </div>
          <div className="bg-[#1a2b3c] p-4 rounded border border-[#1e3048]">
            <div className="text-[#8faabb] text-sm mb-1">Wirtschaftswachstum</div>
            <div className="text-xl font-bold text-[#4caf82]">+0.8% BIP</div>
          </div>
        </div>

        <div className="flex gap-6 h-[300px]">
          <div className="flex-1 bg-[#1a2b3c] p-4 rounded border border-[#1e3048]">
            <h3 className="text-[#8faabb] mb-4 text-sm font-semibold">Bundeshaushalt Einnahmen vs Ausgaben</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
                <XAxis dataKey="name" stroke="#8faabb" fontSize={12} />
                <YAxis stroke="#8faabb" fontSize={12} />
                <RechartsTooltip cursor={{fill: '#243447'}} contentStyle={{backgroundColor: '#0d1b2a', borderColor: '#1e3048'}} />
                <Legend wrapperStyle={{fontSize: '12px'}} />
                <Bar dataKey="einnahmen" fill="#00c8b4" name="Einnahmen" />
                <Bar dataKey="ausgaben" fill="#e05c5c" name="Ausgaben" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 bg-[#1a2b3c] p-4 rounded border border-[#1e3048]">
            <h3 className="text-[#8faabb] mb-4 text-sm font-semibold">Wirtschaftswachstum Prognose 2024-2030</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
                <XAxis dataKey="year" stroke="#8faabb" fontSize={12} />
                <YAxis stroke="#8faabb" fontSize={12} />
                <RechartsTooltip contentStyle={{backgroundColor: '#0d1b2a', borderColor: '#1e3048'}} />
                <Legend wrapperStyle={{fontSize: '12px'}} />
                <Line type="monotone" dataKey="statusQuo" stroke="#8faabb" name="Status Quo" strokeWidth={2} />
                <Line type="monotone" dataKey="simulation" stroke="#00c8b4" name="Simulation" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
