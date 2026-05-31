import React from "react";

export function AIAnalysis() {
  return (
    <div className="bg-[#0d1b2a] min-h-screen text-[#f0f4f8] font-sans flex">
      <div className="w-[260px] bg-[#1a2b3c] border-r border-[#1e3048] flex flex-col">
        <div className="p-4 border-b border-[#1e3048]">
          <h2 className="font-bold text-lg">Gespeicherte Analysen</h2>
        </div>
        <div className="p-2 space-y-1 flex-1 overflow-y-auto">
          <button className="w-full text-left p-3 rounded hover:bg-[#243447] text-sm text-[#8faabb]">
            <div className="truncate font-medium text-[#f0f4f8]">Auswirkung Bürgergeld auf...</div>
            <div className="text-xs mt-1">Heute, 14:30</div>
          </button>
          <button className="w-full text-left p-3 rounded hover:bg-[#243447] text-sm text-[#8faabb] bg-[#243447]">
            <div className="truncate font-medium text-[#f0f4f8]">Beamtenzahl Reduktion</div>
            <div className="text-xs mt-1">Gestern, 09:15</div>
          </button>
          <button className="w-full text-left p-3 rounded hover:bg-[#243447] text-sm text-[#8faabb]">
            <div className="truncate font-medium text-[#f0f4f8]">Rente mit 70 Szenario</div>
            <div className="text-xs mt-1">12. Okt, 16:45</div>
          </button>
          <button className="w-full text-left p-3 rounded hover:bg-[#243447] text-sm text-[#8faabb]">
            <div className="truncate font-medium text-[#f0f4f8]">Vermögenssteuer Modelle</div>
            <div className="text-xs mt-1">10. Okt, 11:20</div>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-screen relative">
        <div className="p-6 border-b border-[#1e3048] flex items-center gap-3">
          <h1 className="text-2xl font-bold">KI-Politikanalyse</h1>
          <span className="bg-[#00c8b4] text-[#0d1b2a] text-xs font-bold px-2 py-1 rounded">AI</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">
          <div className="flex justify-end">
            <div className="bg-[#00c8b4] text-[#0d1b2a] p-4 rounded-xl rounded-tr-sm max-w-xl font-medium">
              Was passiert, wenn die Beamtenzahl um 20% sinkt?
            </div>
          </div>

          <div className="bg-[#1a2b3c] border-l-4 border-[#00c8b4] rounded-r-xl rounded-bl-sm p-6 max-w-3xl border-t border-r border-b border-t-[#1e3048] border-r-[#1e3048] border-b-[#1e3048]">
            <p className="mb-6 text-[#f0f4f8]">Eine Reduktion der Beamtenzahl um 20% (ca. 980.000 Stellen) ist ein massiver struktureller Eingriff in den deutschen Staatsapparat. Hier ist die detaillierte Analyse der Konsequenzen:</p>
            
            <div className="space-y-4">
              <div className="border-l-2 border-[#4caf82] pl-4">
                <h4 className="font-bold text-[#4caf82] mb-1">Chancen</h4>
                <p className="text-sm text-[#8faabb]">Einsparung ca. 28 Mrd EUR jährlich. Schlankere Verwaltung. Mehr Haushaltsspielraum.</p>
              </div>
              
              <div className="border-l-2 border-[#e05c5c] pl-4">
                <h4 className="font-bold text-[#e05c5c] mb-1">Risiken</h4>
                <p className="text-sm text-[#8faabb]">Überlastung verbleibender Beamter. Qualitätsverlust in Schulen und Polizei. 10-15 Jahre Umbauzeit.</p>
              </div>

              <div className="border-l-2 border-[#4a90e2] pl-4">
                <h4 className="font-bold text-[#4a90e2] mb-1">Gewinner</h4>
                <p className="text-sm text-[#8faabb]">Steuerzahler (-320 EUR/Jahr), Unternehmen, Investoren.</p>
              </div>

              <div className="border-l-2 border-[#f5a623] pl-4">
                <h4 className="font-bold text-[#f5a623] mb-1">Verlierer</h4>
                <p className="text-sm text-[#8faabb]">Betroffene Beamte (980k Stellen), Gewerkschaften, strukturschwache Regionen.</p>
              </div>

              <div className="border-l-2 border-[#8faabb] pl-4">
                <h4 className="font-bold text-[#f0f4f8] mb-1">Langfristig</h4>
                <p className="text-sm text-[#8faabb]">BIP +0.3% durch Effizienzgewinne ab 2032. Digitalisierungspotenzial steigt.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button className="bg-[#243447] text-[#00c8b4] border border-[#1e3048] px-4 py-2 rounded-full text-sm hover:bg-[#1e3048]">
              Wie wirkt sich das auf die Pensionen aus?
            </button>
            <button className="bg-[#243447] text-[#00c8b4] border border-[#1e3048] px-4 py-2 rounded-full text-sm hover:bg-[#1e3048]">
              Welche Ministerien wären am stärksten betroffen?
            </button>
            <button className="bg-[#243447] text-[#00c8b4] border border-[#1e3048] px-4 py-2 rounded-full text-sm hover:bg-[#1e3048]">
              In der Simulation anwenden
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0d1b2a] via-[#0d1b2a] to-transparent">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Stelle eine Frage zur aktuellen Simulation..." 
              className="flex-1 bg-[#1a2b3c] border border-[#1e3048] rounded-full px-6 py-4 text-[#f0f4f8] focus:outline-none focus:border-[#00c8b4]"
            />
            <button className="bg-[#00c8b4] hover:bg-[#00a896] text-[#0d1b2a] px-6 py-4 rounded-full font-bold">
              Senden
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
