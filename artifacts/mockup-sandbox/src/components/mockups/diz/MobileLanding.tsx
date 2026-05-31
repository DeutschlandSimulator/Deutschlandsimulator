import React from "react";

export function MobileLanding() {
  return (
    <div className="w-[390px] min-h-[844px] bg-[#0d1b2a] mx-auto overflow-y-auto text-[#f0f4f8] font-sans border border-[#1e3048]">
      <nav className="flex items-center justify-between p-4 border-b border-[#1e3048]">
        <div className="text-lg font-bold text-[#00c8b4]">DIZ</div>
        <button className="text-[#8faabb]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </nav>

      <main className="p-6">
        <div className="text-center mb-10 mt-6">
          <h1 className="text-4xl font-extrabold mb-4 leading-tight">Deutschland in Zahlen</h1>
          <p className="text-lg text-[#8faabb] mb-8">Simuliere politische Entscheidungen in Echtzeit.</p>
          <button className="w-full bg-[#00c8b4] hover:bg-[#00a896] text-[#0d1b2a] font-bold py-4 rounded text-lg">
            Simulation starten
          </button>
        </div>

        <div className="w-full h-[200px] border border-[#00c8b4] rounded bg-[#1a2b3c] flex items-center justify-center shadow-[0_0_15px_rgba(0,200,180,0.2)] mb-10">
          <span className="text-[#8faabb] font-medium">Deutschlandkarte</span>
        </div>

        <div className="grid grid-cols-2 gap-4 pb-10">
          <div className="bg-[#1a2b3c] p-4 rounded border border-[#1e3048]">
            <div className="text-[#8faabb] text-xs mb-1">Staatsverschuldung</div>
            <div className="text-xl font-bold">2.445 Mrd</div>
            <div className="text-[#e05c5c] text-xs mt-1">+1.8%</div>
          </div>
          <div className="bg-[#1a2b3c] p-4 rounded border border-[#1e3048]">
            <div className="text-[#8faabb] text-xs mb-1">Bundeshaushalt</div>
            <div className="text-xl font-bold">476.8 Mrd</div>
            <div className="text-[#e05c5c] text-xs mt-1">-16.3 Defizit</div>
          </div>
          <div className="bg-[#1a2b3c] p-4 rounded border border-[#1e3048]">
            <div className="text-[#8faabb] text-xs mb-1">Bevölkerung</div>
            <div className="text-xl font-bold">84.7 Mio</div>
            <div className="text-[#4caf82] text-xs mt-1">+0.2%</div>
          </div>
          <div className="bg-[#1a2b3c] p-4 rounded border border-[#1e3048]">
            <div className="text-[#8faabb] text-xs mb-1">Erwerbstätige</div>
            <div className="text-xl font-bold">45.9 Mio</div>
            <div className="text-[#e05c5c] text-xs mt-1">-120k</div>
          </div>
        </div>
      </main>
    </div>
  );
}
