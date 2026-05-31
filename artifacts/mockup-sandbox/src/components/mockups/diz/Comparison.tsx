import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: 'Staatsverschuldung', StatusQuo: 2445, Reformmodell: 2189 },
  { name: 'Steuereinnahmen', StatusQuo: 916, Reformmodell: 978 },
  { name: 'Rentenkosten', StatusQuo: 362, Reformmodell: 341 },
  { name: 'Gesundheitskosten', StatusQuo: 468, Reformmodell: 451 },
];

export function Comparison() {
  return (
    <div className="bg-[#0d1b2a] min-h-screen p-6 text-[#f0f4f8] font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#f0f4f8]">Szenario-Vergleich</h1>
        <div className="flex gap-4">
          <select className="bg-[#1a2b3c] border border-[#1e3048] text-[#f0f4f8] p-2 rounded">
            <option>Status Quo 2024</option>
          </select>
          <span className="text-[#8faabb] self-center">vs</span>
          <select className="bg-[#1a2b3c] border border-[#00c8b4] text-[#f0f4f8] p-2 rounded">
            <option>Reformmodell A</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_2fr_1fr] gap-4 mb-4 font-bold text-[#8faabb] text-center">
        <div className="bg-[#1a2b3c] py-2 rounded">Status Quo 2024</div>
        <div></div>
        <div className="bg-[#00c8b4] text-[#0d1b2a] py-2 rounded">Reformmodell A</div>
      </div>

      <div className="space-y-4 mb-12">
        <div className="grid grid-cols-[1fr_2fr_1fr] bg-[#1a2b3c] border border-[#1e3048] p-4 rounded items-center text-center">
          <div className="text-xl">2.445 Mrd</div>
          <div className="flex justify-center flex-col items-center">
            <div className="text-[#8faabb] text-sm mb-1">Staatsverschuldung</div>
            <div className="bg-[#4caf82] text-white px-3 py-1 rounded-full text-sm">-256 Mrd</div>
          </div>
          <div className="text-xl text-[#00c8b4]">2.189 Mrd</div>
        </div>

        <div className="grid grid-cols-[1fr_2fr_1fr] bg-[#1a2b3c] border border-[#1e3048] p-4 rounded items-center text-center">
          <div className="text-xl">916 Mrd</div>
          <div className="flex justify-center flex-col items-center">
            <div className="text-[#8faabb] text-sm mb-1">Steuereinnahmen</div>
            <div className="bg-[#4caf82] text-white px-3 py-1 rounded-full text-sm">+62 Mrd</div>
          </div>
          <div className="text-xl text-[#00c8b4]">978 Mrd</div>
        </div>

        <div className="grid grid-cols-[1fr_2fr_1fr] bg-[#1a2b3c] border border-[#1e3048] p-4 rounded items-center text-center">
          <div className="text-xl">5.7%</div>
          <div className="flex justify-center flex-col items-center">
            <div className="text-[#8faabb] text-sm mb-1">Arbeitslosenquote</div>
            <div className="bg-[#4caf82] text-white px-3 py-1 rounded-full text-sm">-0.8pp</div>
          </div>
          <div className="text-xl text-[#00c8b4]">4.9%</div>
        </div>

        <div className="grid grid-cols-[1fr_2fr_1fr] bg-[#1a2b3c] border border-[#1e3048] p-4 rounded items-center text-center">
          <div className="text-xl">362 Mrd</div>
          <div className="flex justify-center flex-col items-center">
            <div className="text-[#8faabb] text-sm mb-1">Rentenkosten</div>
            <div className="bg-[#4caf82] text-white px-3 py-1 rounded-full text-sm">-21 Mrd</div>
          </div>
          <div className="text-xl text-[#00c8b4]">341 Mrd</div>
        </div>

        <div className="grid grid-cols-[1fr_2fr_1fr] bg-[#1a2b3c] border border-[#1e3048] p-4 rounded items-center text-center">
          <div className="text-xl">468 Mrd</div>
          <div className="flex justify-center flex-col items-center">
            <div className="text-[#8faabb] text-sm mb-1">Gesundheitskosten</div>
            <div className="bg-[#4caf82] text-white px-3 py-1 rounded-full text-sm">-17 Mrd</div>
          </div>
          <div className="text-xl text-[#00c8b4]">451 Mrd</div>
        </div>
      </div>

      <div className="h-[300px] mb-12 bg-[#1a2b3c] p-6 rounded border border-[#1e3048]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
            <XAxis dataKey="name" stroke="#8faabb" />
            <YAxis stroke="#8faabb" />
            <RechartsTooltip cursor={{fill: '#243447'}} contentStyle={{backgroundColor: '#0d1b2a', borderColor: '#1e3048'}} />
            <Legend wrapperStyle={{fontSize: '14px'}} />
            <Bar dataKey="StatusQuo" fill="#8faabb" name="Status Quo" />
            <Bar dataKey="Reformmodell" fill="#00c8b4" name="Reformmodell" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-[#1a2b3c] p-4 border-l-4 border-[#4caf82] rounded-r border-t border-r border-b border-t-[#1e3048] border-r-[#1e3048] border-b-[#1e3048]">
          <h4 className="font-bold text-[#f0f4f8] mb-2">Fiskalischer Spielraum</h4>
          <p className="text-[#8faabb] text-sm">Der Staatshaushalt wird um 256 Mrd entlastet, was massive Investitionen in Infrastruktur ermöglicht.</p>
        </div>
        <div className="bg-[#1a2b3c] p-4 border-l-4 border-[#4caf82] rounded-r border-t border-r border-b border-t-[#1e3048] border-r-[#1e3048] border-b-[#1e3048]">
          <h4 className="font-bold text-[#f0f4f8] mb-2">Arbeitsmarkt Boom</h4>
          <p className="text-[#8faabb] text-sm">Die Arbeitslosenquote sinkt unter 5%, was die Sozialkassen zusätzlich entlastet.</p>
        </div>
        <div className="bg-[#1a2b3c] p-4 border-l-4 border-[#e05c5c] rounded-r border-t border-r border-b border-t-[#1e3048] border-r-[#1e3048] border-b-[#1e3048]">
          <h4 className="font-bold text-[#f0f4f8] mb-2">Soziale Härte</h4>
          <p className="text-[#8faabb] text-sm">Die Kürzungen in der Rente könnten den sozialen Frieden gefährden und Proteste auslösen.</p>
        </div>
      </div>
    </div>
  );
}
