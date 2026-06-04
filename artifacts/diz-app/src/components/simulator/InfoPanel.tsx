import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, MessageCircle, AlertCircle } from "lucide-react";
import { SliderInfo } from "./types";
import { GITHUB } from "@/config/github";

function EvidenzBadge({ level }: { level: "hoch" | "mittel" | "gering" }) {
  const map = {
    hoch:   { label: "Hohe Evidenz",     cls: "bg-[#1a3d2b] text-[#4caf82] border border-[#4caf82]/40" },
    mittel: { label: "Mittlere Evidenz", cls: "bg-[#3d2d0a] text-[#f5a623] border border-[#f5a623]/40" },
    gering: { label: "Hohe Unsicherheit",cls: "bg-[#3d1515] text-[#e05c5c] border border-[#e05c5c]/40" },
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[level].cls}`}>{map[level].label}</span>;
}

interface InfoPanelProps {
  info: SliderInfo | null;
  onClose: () => void;
}

export function InfoPanel({ info, onClose }: InfoPanelProps) {
  return (
    <AnimatePresence>
      {info && (
        <div className="fixed inset-0 z-50 flex justify-end" data-testid="info-panel">
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative w-full max-w-[420px] h-full bg-[#1a2b3c] border-l border-[#1e3048] overflow-y-auto shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            <div className="flex items-center justify-between p-5 border-b border-[#1e3048] sticky top-0 bg-[#1a2b3c] z-10">
              <h3 className="font-bold text-lg text-[#f0f4f8]">{info.titel}</h3>
              <button
                onClick={onClose}
                className="text-[#8faabb] hover:text-[#f0f4f8] transition-colors"
                data-testid="button-close-panel"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-5 flex-1">
              <p className="text-[#8faabb] text-sm leading-relaxed">{info.beschreibung}</p>

              <div className="bg-[#0d1b2a] rounded p-4 border border-[#1e3048]">
                <div className="text-xs font-semibold text-[#00c8b4] uppercase tracking-widest mb-1">Aktueller Wert</div>
                <div className="text-xl font-bold text-[#f0f4f8]">{info.aktuellerWert}</div>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#8faabb] uppercase tracking-widest mb-2">Berechnungslogik</div>
                <p className="text-[#f0f4f8] text-sm leading-relaxed bg-[#0d1b2a] rounded p-3 border border-[#1e3048] font-mono">
                  {info.berechnungslogik}
                </p>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#8faabb] uppercase tracking-widest mb-2">Annahmen</div>
                <ul className="space-y-1.5">
                  {info.annahmen.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#f0f4f8]">
                      <span className="text-[#00c8b4] mt-0.5 shrink-0">›</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#8faabb] uppercase tracking-widest mb-2">Datenquellen</div>
                <div className="space-y-2">
                  {info.quellen.map((q, i) => (
                    <a
                      key={i}
                      href={q.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between bg-[#0d1b2a] rounded px-3 py-2 border border-[#1e3048] hover:border-[#00c8b4]/50 transition-colors"
                    >
                      <div>
                        <div className="text-sm text-[#f0f4f8] font-medium">{q.name}</div>
                        <div className="text-xs text-[#8faabb]">Aktualisiert: {q.aktualisiert}</div>
                      </div>
                      <ChevronRight size={14} className="text-[#00c8b4]" />
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#8faabb] uppercase tracking-widest mb-2">Evidenz-Level</div>
                <div className="flex items-start gap-3">
                  <EvidenzBadge level={info.evidenz} />
                  <p className="text-xs text-[#8faabb] leading-relaxed flex-1">{info.evidenzHinweis}</p>
                </div>
              </div>

              {/* Community actions */}
              <div className="border-t border-[#1e3048] pt-4 space-y-2">
                <div className="text-xs font-semibold text-[#8faabb] uppercase tracking-widest mb-3">Mitmachen</div>
                <a
                  href={`${GITHUB.discussions}?discussions_q=${encodeURIComponent(info.titel)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#0d1b2a] rounded px-3 py-2.5 border border-[#1e3048] hover:border-[#00c8b4]/50 transition-colors group"
                >
                  <MessageCircle size={15} className="text-[#00c8b4] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[#f0f4f8] font-medium group-hover:text-[#00c8b4] transition-colors">Annahme diskutieren</div>
                    <div className="text-xs text-[#8faabb]">GitHub Discussions</div>
                  </div>
                  <ChevronRight size={14} className="text-[#00c8b4] shrink-0" />
                </a>
                <a
                  href={`${GITHUB.newIssue}?title=${encodeURIComponent(`[Annahme] ${info.titel}`)}&labels=annahme`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#0d1b2a] rounded px-3 py-2.5 border border-[#1e3048] hover:border-[#f5a623]/50 transition-colors group"
                >
                  <AlertCircle size={15} className="text-[#f5a623] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[#f0f4f8] font-medium group-hover:text-[#f5a623] transition-colors">Fehler oder Verbesserung melden</div>
                    <div className="text-xs text-[#8faabb]">GitHub Issues</div>
                  </div>
                  <ChevronRight size={14} className="text-[#f5a623] shrink-0" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
