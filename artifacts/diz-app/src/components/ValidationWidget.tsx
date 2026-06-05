import { useState, useCallback } from "react";
import {
  CheckCircle, AlertTriangle, X, ChevronDown, ChevronUp,
  Loader2, LogIn, MessageCircle, ExternalLink,
} from "lucide-react";
import { useAuth } from "@workspace/replit-auth-web";

const API = import.meta.env.BASE_URL.replace(/\/$/, "");
const VALIDATION_THRESHOLD = 3;

export interface AssumptionStats {
  assumptionId: string;
  validationCount: number;
  errorCount: number;
  status: "ki_recherchiert" | "community_geprueft";
  myValidation: boolean;
}

interface Props {
  assumptionId: string;
  stats: AssumptionStats | undefined;
  onStatsChange: (updated: AssumptionStats) => void;
  letzteUeberpruefung: string;
  evidenz: "hoch" | "mittel" | "gering";
  githubDiscussionUrl: string;
  quellUrl?: string;
}

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function getTrustLevel(n: number) {
  if (n === 0)                    return { label: "Nicht geprüft",      color: "text-[#e05c5c]", barColor: "bg-[#e05c5c]", icon: "🔴" };
  if (n < VALIDATION_THRESHOLD)  return { label: "Mittel",             color: "text-[#f5a623]", barColor: "bg-[#f5a623]", icon: "🟡" };
  return                                 { label: "Community geprüft",  color: "text-[#4caf82]", barColor: "bg-[#4caf82]", icon: "🟢" };
}

const EVIDENZ_LABEL: Record<string, string> = { hoch: "Hoch",   mittel: "Mittel", gering: "Gering" };
const EVIDENZ_COLOR: Record<string, string> = { hoch: "text-[#4caf82]", mittel: "text-[#f5a623]", gering: "text-[#e05c5c]" };

// ─── Confirmation modal ───────────────────────────────────────────────────────
function ConfirmModal({
  onConfirm, onCancel, busy, quellUrl,
}: { onConfirm: () => void; onCancel: () => void; busy: boolean; quellUrl?: string }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-[#1a2b3c] border border-[#1e3048] rounded-xl p-5 max-w-sm w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-[#4caf82]" />
            <span className="text-sm font-bold text-[#f0f4f8]">Quelle validieren</span>
          </div>
          <button onClick={onCancel} className="text-[#8faabb] hover:text-[#f0f4f8] transition-colors">
            <X size={15} />
          </button>
        </div>

        <p className="text-sm text-[#f0f4f8] leading-relaxed mb-3">
          Hast du die zugrunde liegende Quelle geprüft und bestätigt, dass sie den angegebenen Wert unterstützt?
        </p>

        <div className="bg-[#0d1b2a] border border-[#f5a623]/20 rounded-lg px-3 py-2.5 mb-4">
          <p className="text-[10px] text-[#8faabb] leading-relaxed">
            <span className="text-[#f5a623] font-semibold">Hinweis: </span>
            Du bestätigst nicht die politische Aussage oder die Modellierung, sondern lediglich die Korrektheit der Quelle und des übernommenen Wertes.
          </p>
        </div>

        {quellUrl && (
          <a
            href={quellUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#00c8b4] hover:text-[#00a896] mb-4 transition-colors w-fit"
          >
            <ExternalLink size={12} />
            Quelle öffnen und prüfen
          </a>
        )}

        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            disabled={busy}
            className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold bg-[#4caf82]/10 hover:bg-[#4caf82]/20 text-[#4caf82] border border-[#4caf82]/40 rounded-lg py-2.5 transition-colors disabled:opacity-50"
          >
            {busy ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
            Bestätigen
          </button>
          <button
            onClick={onCancel}
            disabled={busy}
            className="flex-1 text-sm text-[#8faabb] border border-[#1e3048] rounded-lg py-2.5 hover:border-[#8faabb]/40 hover:text-[#f0f4f8] transition-colors disabled:opacity-50"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main widget ──────────────────────────────────────────────────────────────
export function ValidationWidget({
  assumptionId, stats, onStatsChange,
  letzteUeberpruefung, evidenz, githubDiscussionUrl, quellUrl,
}: Props) {
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const [busy,        setBusy]        = useState(false);
  const [showModal,   setShowModal]   = useState(false);
  const [showReport,  setShowReport]  = useState(false);
  const [reason,      setReason]      = useState("");
  const [reportSent,  setReportSent]  = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  const validationCount = stats?.validationCount ?? 0;
  const errorCount      = stats?.errorCount      ?? 0;
  const myValidation    = stats?.myValidation     ?? false;
  const status          = stats?.status           ?? "ki_recherchiert";
  const isCommunityVerified = status === "community_geprueft";
  const trust = getTrustLevel(validationCount);
  const progressPct = Math.min(100, (validationCount / VALIDATION_THRESHOLD) * 100);

  const doValidate = useCallback(async () => {
    if (!isAuthenticated || busy) return;
    setBusy(true);
    setError(null);
    try {
      const method = myValidation ? "DELETE" : "POST";
      await apiFetch(`/api/validations/${assumptionId}`, { method });
      const newCount = validationCount + (myValidation ? -1 : 1);
      onStatsChange({
        assumptionId,
        validationCount: newCount,
        errorCount,
        status: newCount >= VALIDATION_THRESHOLD ? "community_geprueft" : "ki_recherchiert",
        myValidation: !myValidation,
      });
      setShowModal(false);
    } catch {
      setError("Fehler beim Speichern. Bitte erneut versuchen.");
    } finally {
      setBusy(false);
    }
  }, [isAuthenticated, busy, myValidation, assumptionId, validationCount, errorCount, onStatsChange]);

  const handleReport = useCallback(async () => {
    if (!reason.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      await apiFetch(`/api/reports/${assumptionId}`, {
        method: "POST",
        body: JSON.stringify({ reason: reason.trim() }),
      });
      setReportSent(true);
      setReason("");
      onStatsChange({ assumptionId, validationCount, errorCount: errorCount + 1, status, myValidation });
    } catch {
      setError("Fehler beim Melden. Bitte erneut versuchen.");
    } finally {
      setBusy(false);
    }
  }, [reason, busy, assumptionId, validationCount, errorCount, status, myValidation, onStatsChange]);

  return (
    <>
      {showModal && (
        <ConfirmModal
          onConfirm={doValidate}
          onCancel={() => setShowModal(false)}
          busy={busy}
          quellUrl={quellUrl}
        />
      )}

      <div className="border-t border-[#1e3048] pt-3 mt-2 space-y-3">

        {/* ── Bereich 1: Qualitäts- und Vertrauensstatus ─────────────── */}
        <div className="bg-[#0d1b2a] border border-[#1e3048] rounded-lg p-3 space-y-3">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-[#8faabb]">
            Status der Annahme
          </p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm leading-none">{isCommunityVerified ? "🟢" : "🟡"}</span>
              <div>
                <div className="text-[9px] text-[#8faabb] uppercase tracking-wider">Recherche</div>
                <div className="text-[11px] font-semibold text-[#f0f4f8]">
                  {isCommunityVerified ? "Community geprüft" : "KI recherchiert"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm leading-none">🎯</span>
              <div>
                <div className="text-[9px] text-[#8faabb] uppercase tracking-wider">Vertrauensniveau</div>
                <div className={`text-[11px] font-semibold ${EVIDENZ_COLOR[evidenz]}`}>
                  {EVIDENZ_LABEL[evidenz]}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm leading-none">👥</span>
              <div>
                <div className="text-[9px] text-[#8faabb] uppercase tracking-wider">Community-Prüfungen</div>
                <div className="text-[11px] font-semibold text-[#f0f4f8]">
                  {validationCount} {validationCount === 1 ? "Bestätigung" : "Bestätigungen"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm leading-none">📅</span>
              <div>
                <div className="text-[9px] text-[#8faabb] uppercase tracking-wider">Zuletzt geprüft</div>
                <div className="text-[11px] font-semibold text-[#f0f4f8]">{letzteUeberpruefung}</div>
              </div>
            </div>
          </div>

          {/* Validation progress bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] text-[#8faabb] uppercase tracking-wider">Validierungsgrad</span>
              <span className={`text-[9px] font-semibold ${trust.color}`}>
                {trust.icon} {validationCount} von {VALIDATION_THRESHOLD} · {trust.label}
              </span>
            </div>
            <div className="h-1.5 bg-[#1e3048] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${trust.barColor}`}
                style={{ width: `${validationCount > 0 ? Math.max(progressPct, 12) : 0}%` }}
              />
            </div>
          </div>

          {errorCount > 0 && (
            <div className="flex items-center gap-1.5 text-[10px] text-[#e05c5c]">
              <AlertTriangle size={10} />
              {errorCount} Fehlermeldung{errorCount > 1 ? "en" : ""} von der Community eingegangen
            </div>
          )}
        </div>

        {/* ── Bereich 2: Community-Aktionen ────────────────────────────── */}
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-widest text-[#8faabb] mb-2">
            Community-Beiträge
          </p>

          {authLoading ? null : !isAuthenticated ? (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={login}
                className="flex items-center gap-1.5 text-xs font-medium text-[#00c8b4] hover:text-[#00e6d0] border border-[#00c8b4]/30 hover:border-[#00c8b4]/60 rounded-lg px-3 py-1.5 transition-colors"
              >
                <LogIn size={12} />
                Einloggen um zu validieren
              </button>
              <a
                href={githubDiscussionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[#8faabb] hover:text-[#f0f4f8] border border-[#1e3048] hover:border-[#8faabb]/40 rounded-lg px-3 py-1.5 transition-colors"
              >
                <MessageCircle size={12} />
                Diskussion öffnen
              </a>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {!myValidation ? (
                <button
                  onClick={() => setShowModal(true)}
                  disabled={busy}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border bg-[#4caf82]/10 text-[#4caf82] border-[#4caf82]/40 hover:bg-[#4caf82]/20 transition-colors disabled:opacity-50"
                >
                  <CheckCircle size={12} />
                  Quelle validieren
                </button>
              ) : (
                <button
                  onClick={doValidate}
                  disabled={busy}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border bg-[#1a3d2b] text-[#4caf82] border-[#4caf82]/40 hover:bg-[#143020] transition-colors disabled:opacity-50"
                >
                  {busy ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                  Bestätigung zurückziehen
                </button>
              )}

              {!reportSent ? (
                <button
                  onClick={() => setShowReport((v) => !v)}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-[#1e3048] bg-[#0d1b2a] text-[#8faabb] hover:border-[#f5a623]/60 hover:text-[#f5a623] transition-colors"
                >
                  <AlertTriangle size={12} />
                  Fehler melden
                  {showReport ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                </button>
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-[#4caf82]">
                  <CheckCircle size={12} /> Fehlermeldung übermittelt
                </span>
              )}

              <a
                href={githubDiscussionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[#8faabb] hover:text-[#f0f4f8] border border-[#1e3048] hover:border-[#8faabb]/40 rounded-lg px-3 py-1.5 transition-colors"
              >
                <MessageCircle size={12} />
                Diskussion öffnen
              </a>
            </div>
          )}

          {/* Report form */}
          {showReport && !reportSent && (
            <div className="mt-2 bg-[#0d1b2a] border border-[#1e3048] rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#f5a623]">Fehler oder veraltete Daten melden</span>
                <button onClick={() => setShowReport(false)} className="text-[#8faabb] hover:text-[#f0f4f8]">
                  <X size={13} />
                </button>
              </div>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Kurze Begründung (max. 1000 Zeichen)…"
                maxLength={1000}
                rows={3}
                className="w-full text-xs bg-[#1a2b3c] border border-[#1e3048] rounded px-2.5 py-2 text-[#f0f4f8] placeholder-[#8faabb] resize-none focus:outline-none focus:border-[#f5a623]/60"
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#8faabb]">{reason.length}/1000</span>
                <button
                  onClick={handleReport}
                  disabled={!reason.trim() || busy}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded bg-[#f5a623]/10 border border-[#f5a623]/40 text-[#f5a623] hover:bg-[#f5a623]/20 transition-colors disabled:opacity-50"
                >
                  {busy ? <Loader2 size={12} className="animate-spin" /> : null}
                  Melden
                </button>
              </div>
            </div>
          )}

          {error && <p className="text-xs text-[#e05c5c] mt-1">{error}</p>}
        </div>

        {/* ── Disclaimer ───────────────────────────────────────────────── */}
        <p className="text-[9px] text-[#8faabb]/50 leading-relaxed italic">
          Community-Validierungen bestätigen die Korrektheit der Quellenangabe und des übernommenen Wertes — keine politische Bewertung oder Modellgüte.
        </p>
      </div>
    </>
  );
}
