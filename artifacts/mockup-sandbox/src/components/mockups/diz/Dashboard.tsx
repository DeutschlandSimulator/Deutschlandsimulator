import React from "react";
import { AreaChart, Area, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";

const areaData = [
  { year: '2020', einnahmen: 750, ausgaben: 850 },
  { year: '2021', einnahmen: 780, ausgaben: 860 },
  { year: '2022', einnahmen: 820, ausgaben: 840 },
  { year: '2023', einnahmen: 890, ausgaben: 910 },
  { year: '2024', einnahmen: 916, ausgaben: 950 },
  { year: '2025', einnahmen: 930, ausgaben: 960 },
  { year: '2026', einnahmen: 950, ausgaben: 980 },
  { year: '2027', einnahmen: 970, ausgaben: 990 },
  { year: '2028', einnahmen: 990, ausgaben: 1010 },
  { year: '2029', einnahmen: 1010, ausgaben: 1030 },
  { year: '2030', einnahmen: 1040, ausgaben: 1060 },
];

const pieData = [
  { name: 'Arbeit & Soziales', value: 175 },
  { name: 'Verteidigung', value: 52 },
  { name: 'Bildung & Forschung', value: 21 },
  { name: 'Verkehr', value: 38 },
  { name: 'Zinsen', value: 37 },
  { name: 'Sonstiges', value: 153.8 },
];
const COLORS = ['#00c8b4', '#4caf82', '#f5a623', '#8faabb', '#e05c5c', '#243447'];

const ageData = [
  { age: '0-14', male: -6.5, female: 6.2 },
  { age: '15-24', male: -4.3, female: 4.1 },
  { age: '25-44', male: -11.4, female: 11.1 },
  { age: '45-59', male: -10.2, female: 10.0 },
  { age: '60-74', male: -7.8, female: 8.5 },
  { age: '75+', male: -3.9, female: 5.6 },
];

export function Dashboard() {
  return (
    <div className="bg-[#0d1b2a] min-h-screen p-6 text-[#f0f4f8] font-sans">
      <div className="flex justify-between items-center mb-6">
        <div className="text-[#8faabb]">Startseite &gt; <span className="text-[#00c8b4]">Ergebnisse</span></div>
        <div className="flex gap-4">
          <button className="bg-[#1a2b3c] hover:bg-[#243447] text-[#f0f4f8] py-2 px-4 rounded border border-[#1e3048]">Share</button>
          <button className="bg-[#00c8b4] hover:bg-[#00a896] text-[#0d1b2a] font-bold py-2 px-4 rounded">PDF Export</button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1a2b3c] p-6 rounded border border-[#1e3048] relative">
          <div className="text-[#8faabb] mb-2">Haushaltsdefizit</div>
          <div className="text-3xl font-bold text-[#e05c5c]">-34.2 Mrd</div>
          <svg className="absolute top-6 right-6 w-12 h-6" viewBox="0 0 50 20">
            <polyline points="0,10 10,12 20,5 30,15 40,8 50,18" fill="none" stroke="#e05c5c" strokeWidth="2"/>
          </svg>
        </div>
        <div className="bg-[#1a2b3c] p-6 rounded border border-[#1e3048] relative">
          <div className="text-[#8faabb] mb-2">Staatsverschuldung</div>
          <div className="text-3xl font-bold">2.445 Mrd</div>
          <svg className="absolute top-6 right-6 w-12 h-6" viewBox="0 0 50 20">
            <polyline points="0,15 10,14 20,12 30,10 40,8 50,6" fill="none" stroke="#8faabb" strokeWidth="2"/>
          </svg>
        </div>
        <div className="bg-[#1a2b3c] p-6 rounded border border-[#1e3048] relative">
          <div className="text-[#8faabb] mb-2">Steueraufkommen</div>
          <div className="text-3xl font-bold text-[#4caf82]">916 Mrd</div>
          <svg className="absolute top-6 right-6 w-12 h-6" viewBox="0 0 50 20">
            <polyline points="0,15 10,12 20,16 30,8 40,5 50,2" fill="none" stroke="#4caf82" strokeWidth="2"/>
          </svg>
        </div>
        <div className="bg-[#1a2b3c] p-6 rounded border border-[#1e3048] relative">
          <div className="text-[#8faabb] mb-2">Gesundheitskosten</div>
          <div className="text-3xl font-bold">468 Mrd</div>
          <svg className="absolute top-6 right-6 w-12 h-6" viewBox="0 0 50 20">
            <polyline points="0,15 10,12 20,16 30,8 40,5 50,2" fill="none" stroke="#8faabb" strokeWidth="2"/>
          </svg>
        </div>
        <div className="bg-[#1a2b3c] p-6 rounded border border-[#1e3048] relative">
          <div className="text-[#8faabb] mb-2">Rentenkosten</div>
          <div className="text-3xl font-bold">362 Mrd</div>
          <svg className="absolute top-6 right-6 w-12 h-6" viewBox="0 0 50 20">
            <polyline points="0,15 10,12 20,16 30,8 40,5 50,2" fill="none" stroke="#8faabb" strokeWidth="2"/>
          </svg>
        </div>
        <div className="bg-[#1a2b3c] p-6 rounded border border-[#1e3048] relative">
          <div className="text-[#8faabb] mb-2">Arbeitslosenquote</div>
          <div className="text-3xl font-bold text-[#e05c5c]">5.7%</div>
          <svg className="absolute top-6 right-6 w-12 h-6" viewBox="0 0 50 20">
            <polyline points="0,15 10,12 20,16 30,8 40,5 50,2" fill="none" stroke="#e05c5c" strokeWidth="2"/>
          </svg>
        </div>
        <div className="bg-[#1a2b3c] p-6 rounded border border-[#1e3048] relative">
          <div className="text-[#8faabb] mb-2">Fachkräftemangel</div>
          <div className="text-3xl font-bold text-[#f5a623]">890k</div>
          <svg className="absolute top-6 right-6 w-12 h-6" viewBox="0 0 50 20">
            <polyline points="0,15 10,12 20,16 30,8 40,5 50,2" fill="none" stroke="#f5a623" strokeWidth="2"/>
          </svg>
        </div>
        <div className="bg-[#1a2b3c] p-6 rounded border border-[#1e3048] relative">
          <div className="text-[#8faabb] mb-2">Wirtschaftswachstum</div>
          <div className="text-3xl font-bold text-[#4caf82]">+0.8%</div>
          <svg className="absolute top-6 right-6 w-12 h-6" viewBox="0 0 50 20">
            <polyline points="0,15 10,12 20,16 30,8 40,5 50,2" fill="none" stroke="#4caf82" strokeWidth="2"/>
          </svg>
        </div>
      </div>

      <div className="bg-[#1a2b3c] p-6 rounded border border-[#1e3048] mb-8 h-[300px]">
        <h3 className="text-lg font-bold mb-4">Einnahmen vs Ausgaben 2020-2030</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={areaData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
            <XAxis dataKey="year" stroke="#8faabb" />
            <YAxis stroke="#8faabb" />
            <RechartsTooltip contentStyle={{backgroundColor: '#0d1b2a', borderColor: '#1e3048'}} />
            <Area type="monotone" dataKey="ausgaben" stackId="2" stroke="#e05c5c" fill="#e05c5c" fillOpacity={0.3} />
            <Area type="monotone" dataKey="einnahmen" stackId="1" stroke="#00c8b4" fill="#00c8b4" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-6 mb-8 h-[300px]">
        <div className="flex-1 bg-[#1a2b3c] p-6 rounded border border-[#1e3048]">
          <h3 className="text-lg font-bold mb-4">Haushaltsaufteilung</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip contentStyle={{backgroundColor: '#0d1b2a', borderColor: '#1e3048'}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 bg-[#1a2b3c] p-6 rounded border border-[#1e3048]">
          <h3 className="text-lg font-bold mb-4">Altersstruktur Deutschland 2024</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={ageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
              <XAxis type="number" stroke="#8faabb" />
              <YAxis dataKey="age" type="category" stroke="#8faabb" />
              <RechartsTooltip contentStyle={{backgroundColor: '#0d1b2a', borderColor: '#1e3048'}} />
              <Bar dataKey="male" fill="#4a90e2" name="Männlich" />
              <Bar dataKey="female" fill="#00c8b4" name="Weiblich" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#1a2b3c] rounded border border-[#1e3048] overflow-hidden">
        <div className="p-4 border-b border-[#1e3048]">
          <h3 className="text-lg font-bold">Reformmaßnahmen Übersicht</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-[#0d1b2a]">
            <tr>
              <th className="p-4 text-[#8faabb] font-medium">Maßnahme</th>
              <th className="p-4 text-[#8faabb] font-medium">Auswirkung</th>
              <th className="p-4 text-[#8faabb] font-medium">Einsparung/Kosten</th>
              <th className="p-4 text-[#8faabb] font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3048]">
            <tr className="hover:bg-[#243447]">
              <td className="p-4">Bürgergeld Anpassung</td>
              <td className="p-4">Arbeitsanreize +2.1%</td>
              <td className="p-4 text-[#4caf82]">+4.2 Mrd EUR</td>
              <td className="p-4"><span className="px-2 py-1 rounded text-xs bg-[#243447] text-[#00c8b4]">Simuliert</span></td>
            </tr>
            <tr className="hover:bg-[#243447]">
              <td className="p-4">Renteneintritt 69</td>
              <td className="p-4">Fachkräfte +400k</td>
              <td className="p-4 text-[#4caf82]">+18.5 Mrd EUR</td>
              <td className="p-4"><span className="px-2 py-1 rounded text-xs bg-[#243447] text-[#4caf82]">Aktiv</span></td>
            </tr>
            <tr className="hover:bg-[#243447]">
              <td className="p-4">Vermögenssteuer 1%</td>
              <td className="p-4">Kapitalflucht Risiko</td>
              <td className="p-4 text-[#4caf82]">+9.0 Mrd EUR</td>
              <td className="p-4"><span className="px-2 py-1 rounded text-xs bg-[#1e3048] text-[#8faabb]">Inaktiv</span></td>
            </tr>
            <tr className="hover:bg-[#243447]">
              <td className="p-4">Fachkräftezuwanderung +200k</td>
              <td className="p-4">BIP +0.4%</td>
              <td className="p-4 text-[#4caf82]">+12.3 Mrd EUR</td>
              <td className="p-4"><span className="px-2 py-1 rounded text-xs bg-[#243447] text-[#00c8b4]">Simuliert</span></td>
            </tr>
            <tr className="hover:bg-[#243447]">
              <td className="p-4">Subventionsabbau</td>
              <td className="p-4">Wirtschaftsbelastung</td>
              <td className="p-4 text-[#4caf82]">+15.0 Mrd EUR</td>
              <td className="p-4"><span className="px-2 py-1 rounded text-xs bg-[#1e3048] text-[#8faabb]">Inaktiv</span></td>
            </tr>
            <tr className="hover:bg-[#243447]">
              <td className="p-4">Verteidigung 2.5% BIP</td>
              <td className="p-4">NATO-Ziel erfüllt</td>
              <td className="p-4 text-[#e05c5c]">-21.0 Mrd EUR</td>
              <td className="p-4"><span className="px-2 py-1 rounded text-xs bg-[#243447] text-[#00c8b4]">Simuliert</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
