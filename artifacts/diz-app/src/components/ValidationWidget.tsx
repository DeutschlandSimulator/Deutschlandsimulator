import { useState, useCallback } from "react";
import { CheckCircle, AlertTriangle, X, ChevronDown, ChevronUp, Loader2, LogIn } from "lucide-react";
import { useAuth } from "@workspace/replit-auth-web";

const API = import.meta.env.BASE_URL.replace(/\/$/, "");

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

export function ValidationWidget({ assumptionId, stats, onStatsChange }: Props) {
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const [busy, setBusy] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reason, setReason] = useState("");
  const [reportSent, setReportSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validationCount = stats?.validationCount ?? 0;
  const errorCount = stats?.errorCount ?? 0;
  const myValidation = stats?.myValidation ?? false;
  const status = stats?.status ?? "ki_recherchiert";
  const isCommunityVerified = status === "community_geprueft";

  const handleValidate = useCallback(async () => {
    if (!isAuthenticated || busy) return;
    setBusy(true);
    setError(null);
    try {
      const method = myValidation ? "DELETE" : "POST";
      await apiFetch(`/api/validations/${assumptionId}`, { method });
      const delta = myValidation ? -1 : 1;
      const newCount = validationCount + delta;
      onStatsChange({
        assumptionId,
        validationCount: newCount,
        errorCount,
        status: newCount >= 3 ? "community_geprueft" : "ki_recherchiert",
        myValidation: !myValidation,
      });
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
      onStatsChange({
        assumptionId,
        validationCount,
        errorCount: errorCount + 1,
        status,
        myValidation,
      });
    } catch {
      setError("Fehler beim Melden. Bitte erneut versuchen.");
    } finally {
      setBusy(false);
    }
  }, [reason, busy, assumptionId, validationCount, errorCount, status, myValidation, onStatsChange]);

  return (
    <div className="border-t border-[#1e3048] pt-3 mt-2 space-y-3">
      {/* Status badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
            isCommunityVerified
              ? "bg-[#1a3d2b] text-[#4caf82] border-[#4caf82]/40"
              : "bg-[#3d2d0a] text-[#f5a623] border-[#f5a623]/40"
          }`}
        >
          {isCommunityVerified ? "🟢" : "🟡"}{" "}
          {isCommunityVerified ? "Community überprüft" : "KI recherchiert"}
        </span>
        {validationCount > 0 && (
          <span className="text-xs text-[#8faabb]">
            {validationCount} {validationCount === 1 ? "Nutzer hat" : "Nutzer haben"} überprüft
          </span>
        )}
        {errorCount > 0 && (
          <span className="text-xs text-[#e05c5c]">
            {errorCount} Fehlermeldung{errorCount > 1 ? "en" : ""}
          </span>
        )}
      </div>

      {/* Transparency note */}
      <p className="text-[10px] text-[#8faabb] leading-relaxed italic">
        Community-Validierungen bedeuten lediglich, dass Nutzer die zugrunde liegenden Quellen geprüft haben. Sie stellen keine Garantie für die Richtigkeit der Daten dar.
      </p>

      {/* Actions */}
      {authLoading ? null : !isAuthenticated ? (
        <button
          onClick={login}
          className="flex items-center gap-1.5 text-xs text-[#00c8b4] hover:text-[#00e6d0] transition-colors"
        >
          <LogIn size={13} />
          Einloggen um zu validieren
        </button>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleValidate}
            disabled={busy}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded border transition-colors disabled:opacity-50 ${
              myValidation
                ? "bg-[#1a3d2b] text-[#4caf82] border-[#4caf82]/40 hover:bg-[#143020]"
                : "bg-[#0d1b2a] text-[#8faabb] border-[#1e3048] hover:border-[#4caf82]/60 hover:text-[#4caf82]"
            }`}
          >
            {busy ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
            {myValidation ? "Bestätigung zurückziehen" : "Quelle geprüft — bestätigen"}
          </button>

          {!reportSent && (
            <button
              onClick={() => setShowReport((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded border border-[#1e3048] bg-[#0d1b2a] text-[#8faabb] hover:border-[#f5a623]/60 hover:text-[#f5a623] transition-colors"
            >
              <AlertTriangle size={12} />
              Fehler melden
              {showReport ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>
          )}
          {reportSent && (
            <span className="flex items-center gap-1.5 text-xs text-[#4caf82]">
              <CheckCircle size={12} /> Fehlermeldung übermittelt
            </span>
          )}
        </div>
      )}

      {/* Report form */}
      {showReport && !reportSent && (
        <div className="bg-[#0d1b2a] border border-[#1e3048] rounded p-3 space-y-2">
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

      {error && (
        <p className="text-xs text-[#e05c5c]">{error}</p>
      )}
    </div>
  );
}
