import React from "react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";

export default function Landing() {
  return (
    <Layout>
      <div className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full flex flex-col justify-center">
        <div className="text-center mb-16 max-w-3xl mx-auto mt-12">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">Deutschlandsimulator</h1>
          <p className="text-xl text-[#8faabb] mb-10 leading-relaxed">
            Simuliere politische Entscheidungen in Echtzeit und erkenne die wirtschaftlichen Konsequenzen. 
            Ein Cockpit für Deutschland — transparent, datenbasiert und unabhängig.
          </p>
          <Link href="/simulator" className="inline-block bg-[#00c8b4] hover:bg-[#00a896] text-[#0d1b2a] font-bold py-4 px-10 rounded text-lg transition-transform hover:-translate-y-0.5 shadow-lg shadow-[#00c8b4]/20" data-testid="button-start-sim">
            Simulation starten
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#1a2b3c] p-6 rounded border border-[#1e3048] hover:border-[#00c8b4]/50 transition-colors">
            <div className="text-[#8faabb] mb-2 text-sm font-medium uppercase tracking-wider">Staatsverschuldung</div>
            <div className="text-3xl font-bold mb-1">2.445 Mrd EUR</div>
            <div className="text-[#e05c5c] text-sm font-medium flex items-center gap-1">
              <span>+1.8%</span>
            </div>
          </div>
          <div className="bg-[#1a2b3c] p-6 rounded border border-[#1e3048] hover:border-[#00c8b4]/50 transition-colors">
            <div className="text-[#8faabb] mb-2 text-sm font-medium uppercase tracking-wider">Bundeshaushalt</div>
            <div className="text-3xl font-bold mb-1">476.8 Mrd EUR</div>
            <div className="text-[#e05c5c] text-sm font-medium">
              -16.3 Mrd Defizit
            </div>
          </div>
          <div className="bg-[#1a2b3c] p-6 rounded border border-[#1e3048] hover:border-[#00c8b4]/50 transition-colors">
            <div className="text-[#8faabb] mb-2 text-sm font-medium uppercase tracking-wider">Bevölkerung</div>
            <div className="text-3xl font-bold mb-1">84.7 Mio</div>
            <div className="text-[#4caf82] text-sm font-medium">
              +0.2%
            </div>
          </div>
          <div className="bg-[#1a2b3c] p-6 rounded border border-[#1e3048] hover:border-[#00c8b4]/50 transition-colors">
            <div className="text-[#8faabb] mb-2 text-sm font-medium uppercase tracking-wider">Erwerbstätige</div>
            <div className="text-3xl font-bold mb-1">45.9 Mio</div>
            <div className="text-[#e05c5c] text-sm font-medium">
              -120k
            </div>
          </div>
          <div className="bg-[#1a2b3c] p-6 rounded border border-[#1e3048] hover:border-[#00c8b4]/50 transition-colors">
            <div className="text-[#8faabb] mb-2 text-sm font-medium uppercase tracking-wider">Rentner</div>
            <div className="text-3xl font-bold mb-1">21.3 Mio</div>
            <div className="text-[#e05c5c] text-sm font-medium">
              +2.1%
            </div>
          </div>
          <div className="bg-[#1a2b3c] p-6 rounded border border-[#1e3048] hover:border-[#00c8b4]/50 transition-colors">
            <div className="text-[#8faabb] mb-2 text-sm font-medium uppercase tracking-wider">Durchschnittslohn</div>
            <div className="text-3xl font-bold mb-1">4.323 EUR/M</div>
            <div className="text-[#4caf82] text-sm font-medium">
              +2.8%
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
