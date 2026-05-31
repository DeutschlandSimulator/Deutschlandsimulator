import React from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

const areaData = [
  { year: '2020', einnahmen: 750, ausgaben: 850 },
  { year: '2025', einnahmen: 930, ausgaben: 960 },
  { year: '2030', einnahmen: 1040, ausgaben: 1060 },
];

const barData = [
  { name: 'Soziales', einnahmen: 0, ausgaben: 175 },
  { name: 'Verteidigung', einnahmen: 0, ausgaben: 52 },
  { name: 'Zinsen', einnahmen: 0, ausgaben: 37 },
];

export function MobileDashboard() {
  return (
    <div className="w-[390px] h-[844px] bg-[#0d1b2a] mx-auto overflow-y-auto flex flex-col text-[#f0f4f8] font-sans border border-[#1e3048]">
      <header className="p-4 border-b border-[#1e3048] bg-[#1a2b3c] sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-lg font-bold">Ergebnisse</h1>
        <button className="bg-[#00c8b4] text-[#0d1b2a] text-xs font-bold px-3 py-1 rounded">Export</button>
      </header>

      <div className="p-4 space-y-4">
        <div className="bg-[#1a2b3c] p-4 rounded border border-[#1e3048] relative">
          <div className="text-[#8faabb] text-sm mb-1">Haushaltsdefizit</div>
          <div className="text-2xl font-bold text-[#e05c5c]">-34.2 Mrd</div>
        </div>
        <div className="bg-[#1a2b3c] p-4 rounded border border-[#1e3048] relative">
          <div className="text-[#8faabb] text-sm mb-1">Staatsverschuldung</div>
          <div className="text-2xl font-bold">2.445 Mrd</div>
        </div>
        <div className="bg-[#1a2b3c] p-4 rounded border border-[#1e3048] relative">
          <div className="text-[#8faabb] text-sm mb-1">Steueraufkommen</div>
          <div className="text-2xl font-bold text-[#4caf82]">916 Mrd</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]">
            <div className="text-[#8faabb] text-xs mb-1">Arbeitslosenquote</div>
            <div className="text-lg font-bold text-[#e05c5c]">5.7%</div>
          </div>
          <div className="bg-[#1a2b3c] p-3 rounded border border-[#1e3048]">
            <div className="text-[#8faabb] text-xs mb-1">Wirtschaftswachstum</div>
            <div className="text-lg font-bold text-[#4caf82]">+0.8%</div>
          </div>
        </div>

        <div className="bg-[#1a2b3c] p-4 rounded border border-[#1e3048] h-[300px]">
          <h3 className="text-sm font-bold mb-4">Einnahmen vs Ausgaben</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
              <XAxis dataKey="year" stroke="#8faabb" fontSize={10} />
              <YAxis stroke="#8faabb" fontSize={10} />
              <RechartsTooltip contentStyle={{backgroundColor: '#0d1b2a', borderColor: '#1e3048'}} />
              <Area type="monotone" dataKey="ausgaben" stroke="#e05c5c" fill="#e05c5c" fillOpacity={0.3} />
              <Area type="monotone" dataKey="einnahmen" stroke="#00c8b4" fill="#00c8b4" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1a2b3c] p-4 rounded border border-[#1e3048] h-[300px] mb-20">
          <h3 className="text-sm font-bold mb-4">Bundeshaushalt</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
              <XAxis dataKey="name" stroke="#8faabb" fontSize={10} />
              <YAxis stroke="#8faabb" fontSize={10} />
              <RechartsTooltip contentStyle={{backgroundColor: '#0d1b2a', borderColor: '#1e3048'}} />
              <Bar dataKey="ausgaben" fill="#e05c5c" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="h-[80px] bg-[#0d1b2a] border-t border-[#1e3048] flex fixed bottom-0 w-full max-w-[390px]">
        <div className="flex-1 flex flex-col items-center justify-center text-[#8faabb]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-1">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
          <span className="text-xs">Parameter</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-[#00c8b4]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-1">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span className="text-xs font-bold">Ergebnisse</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-[#8faabb]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-1">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          <span className="text-xs">Charts</span>
        </div>
      </div>
    </div>
  );
}
