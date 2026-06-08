import { motion } from "framer-motion";
import { useMemo } from "react";
import type { Schuldenbremse, Kohleausstieg, Atomkraft } from "@/lib/compute";

export interface CompassInputs {
  einkommensteuer: number;
  unternehmenssteuer: number;
  vermoegenssteuer: boolean;
  einheitsversicherung: boolean;
  privatAbschaffen: boolean;
  buergergeld: number;
  schuldenbremse: Schuldenbremse;
  sozialwohnungen: number;
  mietpreisbremse: boolean;
  wohngeld: number;
  bafoeg: number;
  kohleausstieg: Kohleausstieg;
  windausbau: number;
  solarausbau: number;
  co2Preis: number;
  atomkraft: Atomkraft;
  kitaAusbau: number;
  bildungsausgaben: number;
  euZuwanderung: boolean;
  fluechtlinge: number;
}

function clamp(v: number) {
  return Math.max(-1, Math.min(1, v));
}

export function computeCompassPosition(p: CompassInputs): [number, number] {
  // ── Wirtschaftsachse: -1 = sozialistisch/links, +1 = marktwirtschaftlich/rechts ──
  let econ = 0;
  econ -= (p.einkommensteuer  - 42)   * 0.008;   // baseline 42%
  econ -= (p.unternehmenssteuer - 29.9) * 0.008; // baseline 29.9%
  econ -= p.vermoegenssteuer ? 0.15 : 0;
  econ -= p.einheitsversicherung ? 0.10 : 0;
  econ -= p.privatAbschaffen ? 0.08 : 0;
  econ -= (p.buergergeld - 502) * 0.0004;         // baseline 502 €
  const schdbMap: Record<Schuldenbremse, number> = {
    aktuell: 0.15, reformiert: 0.05, ausgesetzt: -0.10, abgeschafft: -0.20,
  };
  econ += schdbMap[p.schuldenbremse];
  econ -= (p.sozialwohnungen - 30) * 0.003;       // baseline 30k/J
  econ -= p.mietpreisbremse ? 0.10 : 0;
  econ -= p.wohngeld  * 0.002;
  econ -= p.bafoeg    * 0.001;

  // ── Gesellschaftsachse: -1 = konservativ, +1 = progressiv/grün ──
  let social = 0;
  const kohleMap: Record<Kohleausstieg, number> = {
    "2030": 0.25, "2035": 0.08, "2038": -0.10, offen: -0.25,
  };
  social += kohleMap[p.kohleausstieg];
  social += (p.windausbau  - 100) * 0.002;        // baseline 100%
  social += (p.solarausbau - 100) * 0.002;
  social += (p.co2Preis    -  60) * 0.001;        // baseline 60 €/t
  const atomMap: Record<Atomkraft, number> = {
    ausstieg: 0.15, statusquo: 0, verlaengerung: -0.10, neubau: -0.22,
  };
  social += atomMap[p.atomkraft];
  social += p.kitaAusbau * 0.002;
  social += (p.bildungsausgaben - 4.3) * 0.05;   // baseline 4.3% BIP
  social += p.euZuwanderung ? 0.06 : -0.06;
  social += (p.fluechtlinge - 180) * 0.0008;      // baseline 180k/J

  return [clamp(econ), clamp(social)];
}

// Reference dots for German parties (approximate on economic+green axes)
const PARTIES = [
  { label: "SPD",   econ: -0.20, social: -0.05, color: "#e0323c" },
  { label: "Grüne", econ: -0.15, social:  0.65, color: "#46962b" },
  { label: "FDP",   econ:  0.55, social:  0.30, color: "#ffcb00", textColor: "#0d1b2a" },
  { label: "CDU",   econ:  0.25, social: -0.30, color: "#5a5a5a" },
  { label: "Linke", econ: -0.70, social:  0.45, color: "#be3075" },
];

const QUADRANTS = [
  { label: "Öko-Sozial",          x: "left",  y: "top",    color: "rgba(0,200,100,0.10)"  },
  { label: "Liberal-Progressiv",  x: "right", y: "top",    color: "rgba(255,200,0,0.08)"  },
  { label: "Sozial-Konservativ",  x: "left",  y: "bottom", color: "rgba(220,80,80,0.10)"  },
  { label: "Wirtschafts-Kons.",   x: "right", y: "bottom", color: "rgba(80,120,220,0.10)" },
];

interface Props {
  inputs: CompassInputs;
}

const SIZE = 240; // px — square compass area

export function PoliticalCompass({ inputs }: Props) {
  const [econ, social] = useMemo(() => computeCompassPosition(inputs), [inputs]);

  // Map [-1,1] → [0, SIZE]
  const dotX = ((econ   + 1) / 2) * SIZE;
  const dotY = ((1 - social) / 2) * SIZE; // invert: social↑ = up

  return (
    <div className="bg-[#1a2b3c] rounded-lg border border-[#1e3048] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[#f0f4f8] text-sm font-semibold">Politischer Kompass</div>
          <div className="text-[#8faabb] text-[10px] mt-0.5">Basierend auf deinen Reglerwerten</div>
        </div>
        <div className="text-right text-[10px] text-[#8faabb] leading-tight">
          <div>↔ Wirtschafts-</div>
          <div>↕ Gesellschafts-</div>
          <div>achse</div>
        </div>
      </div>

      {/* Compass square */}
      <div className="flex justify-center">
        <div style={{ position: "relative", width: SIZE, height: SIZE }} className="rounded overflow-hidden select-none">

          {/* Quadrant backgrounds */}
          {QUADRANTS.map((q) => (
            <div
              key={q.label}
              style={{
                position: "absolute",
                [q.y]: 0,
                [q.x]: 0,
                width: "50%",
                height: "50%",
                background: q.color,
              }}
            />
          ))}

          {/* Grid lines */}
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(143,170,187,0.25)", transform: "translateY(-0.5px)" }} />
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(143,170,187,0.25)", transform: "translateX(-0.5px)" }} />

          {/* Border */}
          <div style={{ position: "absolute", inset: 0, border: "1px solid rgba(143,170,187,0.15)", pointerEvents: "none" }} />

          {/* Quadrant labels */}
          <span style={{ position: "absolute", top: 4,    left: 5,  fontSize: 9,  color: "rgba(143,170,187,0.55)", lineHeight: 1.1 }}>Öko-Sozial</span>
          <span style={{ position: "absolute", top: 4,    right: 5, fontSize: 9,  color: "rgba(143,170,187,0.55)", textAlign: "right", lineHeight: 1.1 }}>Liberal-<br/>Progressiv</span>
          <span style={{ position: "absolute", bottom: 4, left: 5,  fontSize: 9,  color: "rgba(143,170,187,0.55)", lineHeight: 1.1 }}>Sozial-<br/>Konservativ</span>
          <span style={{ position: "absolute", bottom: 4, right: 5, fontSize: 9,  color: "rgba(143,170,187,0.55)", textAlign: "right", lineHeight: 1.1 }}>Wirtschafts-<br/>Kons.</span>

          {/* Party reference dots */}
          {PARTIES.map((party) => {
            const px = ((party.econ   + 1) / 2) * SIZE;
            const py = ((1 - party.social) / 2) * SIZE;
            return (
              <div
                key={party.label}
                style={{
                  position: "absolute",
                  left: px - 4,
                  top: py - 4,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: party.color,
                  opacity: 0.6,
                }}
                title={party.label}
              />
            );
          })}

          {/* Party labels */}
          {PARTIES.map((party) => {
            const px = ((party.econ   + 1) / 2) * SIZE;
            const py = ((1 - party.social) / 2) * SIZE;
            // nudge label so it doesn't overlap the dot
            const offX = party.econ > 0 ? -20 : 6;
            const offY = party.social > 0.5 ? 6 : -14;
            return (
              <span
                key={party.label + "-label"}
                style={{
                  position: "absolute",
                  left: px + offX,
                  top:  py + offY,
                  fontSize: 8,
                  color: party.color,
                  opacity: 0.7,
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {party.label}
              </span>
            );
          })}

          {/* User position dot */}
          <motion.div
            animate={{ left: dotX - 9, top: dotY - 9 }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
            style={{
              position: "absolute",
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "#00c8b4",
              boxShadow: "0 0 0 3px rgba(0,200,180,0.3), 0 0 14px rgba(0,200,180,0.6)",
              border: "2px solid #0d1b2a",
              zIndex: 10,
            }}
          />
        </div>
      </div>

      {/* Axis labels below compass */}
      <div className="flex justify-between mt-1 px-0" style={{ width: SIZE, margin: "4px auto 0" }}>
        <span className="text-[9px] text-[#8faabb]">← Links</span>
        <span className="text-[9px] text-[#8faabb] text-center">Wirtschaft</span>
        <span className="text-[9px] text-[#8faabb]">Rechts →</span>
      </div>

      {/* Current position text */}
      <div className="mt-3 text-center">
        <PositionLabel econ={econ} social={social} />
      </div>

      <div className="mt-2 text-[9px] text-[#8faabb] text-center opacity-60">
        Partei-Punkte sind Näherungswerte auf dieser spezifischen Achsendefinition
      </div>
    </div>
  );
}

function PositionLabel({ econ, social }: { econ: number; social: number }) {
  const econLabel  = econ   > 0.15 ? "rechts"     : econ   < -0.15 ? "links"        : "zentristisch";
  const socialLabel = social > 0.15 ? "progressiv" : social < -0.15 ? "konservativ"  : "gemäßigt";

  const quadrant =
    econ <= 0 && social >= 0 ? "Öko-Sozial" :
    econ >  0 && social >= 0 ? "Liberal-Progressiv" :
    econ <= 0 && social <  0 ? "Sozial-Konservativ" :
                               "Wirtschaftskonservativ";

  return (
    <div className="space-y-0.5">
      <div className="text-[#00c8b4] text-xs font-semibold">{quadrant}</div>
      <div className="text-[#8faabb] text-[10px]">
        Wirtschaftlich <span className="text-[#f0f4f8]">{econLabel}</span>
        {" · "}
        Gesellschaftlich <span className="text-[#f0f4f8]">{socialLabel}</span>
      </div>
    </div>
  );
}
