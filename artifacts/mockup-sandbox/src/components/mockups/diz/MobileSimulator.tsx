import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export function MobileSimulator() {
  const [beamte, setBeamte] = useState(4900);
  const [ministerien, setMinisterien] = useState(16);
  const [verteidigung, setVerteidigung] = useState(2.0);
  
  return (
    <div className="w-[390px] h-[844px] bg-[#0d1b2a] mx-auto overflow-hidden flex flex-col text-[#f0f4f8] font-sans border border-[#1e3048]">
      <header className="p-4 border-b border-[#1e3048] bg-[#1a2b3c]">
        <h1 className="text-lg font-bold">Simulator</h1>
        <div className="flex gap-2 mt-2">
          <Badge className="bg-[#4caf82] text-white text-xs">LIVE</Badge>
          <span className="text-xs text-[#8faabb] self-center">Defizit: -34.2 Mrd EUR</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <Accordion type="single" defaultValue="item-1" className="w-full">
          <AccordionItem value="item-1" className="border-[#1e3048] bg-[#1a2b3c] rounded mb-4 px-4">
            <AccordionTrigger className="text-[#00c8b4] font-bold">Staat</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2 pb-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Beamte</span>
                  <Badge variant="outline" className="bg-[#243447] text-[#00c8b4] border-[#1e3048]">{beamte}k</Badge>
                </div>
                <input type="range" min="4200" max="6000" value={beamte} onChange={(e) => setBeamte(Number(e.target.value))} className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[#243447] accent-[#00c8b4]" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Ministerien</span>
                  <Badge variant="outline" className="bg-[#243447] text-[#00c8b4] border-[#1e3048]">{ministerien}</Badge>
                </div>
                <input type="range" min="10" max="25" value={ministerien} onChange={(e) => setMinisterien(Number(e.target.value))} className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[#243447] accent-[#00c8b4]" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Verteidigung</span>
                  <Badge variant="outline" className="bg-[#243447] text-[#00c8b4] border-[#1e3048]">{verteidigung}%</Badge>
                </div>
                <input type="range" min="1.0" max="3.0" step="0.1" value={verteidigung} onChange={(e) => setVerteidigung(Number(e.target.value))} className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[#243447] accent-[#00c8b4]" />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" className="border-[#1e3048] bg-[#1a2b3c] rounded mb-4 px-4">
            <AccordionTrigger className="text-[#8faabb]">Migration</AccordionTrigger>
            <AccordionContent>Parameter details...</AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border-[#1e3048] bg-[#1a2b3c] rounded mb-4 px-4">
            <AccordionTrigger className="text-[#8faabb]">Gesundheit</AccordionTrigger>
            <AccordionContent>Parameter details...</AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4" className="border-[#1e3048] bg-[#1a2b3c] rounded mb-4 px-4">
            <AccordionTrigger className="text-[#8faabb]">Soziales</AccordionTrigger>
            <AccordionContent>Parameter details...</AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5" className="border-[#1e3048] bg-[#1a2b3c] rounded mb-4 px-4">
            <AccordionTrigger className="text-[#8faabb]">Steuern</AccordionTrigger>
            <AccordionContent>Parameter details...</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="h-[80px] bg-[#0d1b2a] border-t border-[#1e3048] flex absolute bottom-0 w-full max-w-[390px]">
        <div className="flex-1 flex flex-col items-center justify-center text-[#00c8b4]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-1">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
          <span className="text-xs font-bold">Parameter</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-[#8faabb]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-1">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span className="text-xs">Ergebnisse</span>
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
