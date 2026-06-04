import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@workspace/replit-auth-web";
import { AlertTriangle, CheckCircle, Clock, LogIn, RefreshCw } from "lucide-react";
import { Link } from "wouter";

const API = import.meta.env.BASE_URL.replace(/\/$/, "");

interface AdminRow {
  assumptionId: string;
  validationCount: number;
  errorCount: number;
  lastValidatedAt: string | null;
  status: "ki_recherchiert" | "community_geprueft";
}

type SortKey = "validationCount" | "errorCount" | "lastValidatedAt" | "assumptionId";

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AdminPage() {
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("errorCount");
  const [desc, setDesc] = useState(true);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/admin/overview`, { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRows(data.rows);
    } catch {
      setError("Fehler beim Laden der Daten.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated) load();
  }, [isAuthenticated]);

  function handleSort(key: SortKey) {
    if (sort === key) setDesc((d) => !d);
    else { setSort(key); setDesc(true); }
  }

  const sorted = [...rows].sort((a, b) => {
    let av: number | string = a[sort] ?? "";
    let bv: number | string = b[sort] ?? "";
    if (typeof av === "string" && typeof bv === "string") return desc ? bv.localeCompare(av) : av.localeCompare(bv);
    return desc ? Number(bv) - Number(av) : Number(av) - Number(bv);
  });

  const unvalidated = rows.filter((r) => r.validationCount === 0).length;
  const highErrors = rows.filter((r) => r.errorCount >= 2).length;
  const verified = rows.filter((r) => r.status === "community_geprueft").length;

  const SortBtn = ({ k, label }: { k: SortKey; label: string }) => (
    <button
      onClick={() => handleSort(k)}
      className={`flex items-center gap-1 hover:text-[#00c8b4] transition-colors ${sort === k ? "text-[#00c8b4]" : "text-[#8faabb]"}`}
    >
      {label}
      <span className="text-[10px]">{sort === k ? (desc ? "↓" : "↑") : ""}</span>
    </button>
  );

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8 w-full">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#00c8b4] mb-1">Administration</p>
              <h1 className="text-2xl font-bold text-[#f0f4f8]">Validierungsübersicht</h1>
              <p className="text-sm text-[#8faabb] mt-1">Übersicht über Community-Validierungen aller Annahmen.</p>
            </div>
            {isAuthenticated && (
              <button
                onClick={load}
                disabled={loading}
                className="flex items-center gap-2 text-sm text-[#8faabb] hover:text-[#f0f4f8] border border-[#1e3048] hover:border-[#00c8b4]/40 rounded px-3 py-1.5 transition-colors"
              >
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                Aktualisieren
              </button>
            )}
          </div>
        </div>

        {authLoading ? (
          <div className="text-[#8faabb] text-sm">Wird geladen…</div>
        ) : !isAuthenticated ? (
          <div className="bg-[#1a2b3c] border border-[#1e3048] rounded-lg p-8 text-center space-y-4">
            <p className="text-[#8faabb]">Einloggen um die Admin-Ansicht zu öffnen.</p>
            <button
              onClick={login}
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded border border-[#00c8b4] text-[#00c8b4] hover:bg-[#00c8b4] hover:text-[#0d1b2a] transition-colors"
            >
              <LogIn size={14} />
              Einloggen
            </button>
          </div>
        ) : (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { icon: <AlertTriangle size={16} className="text-[#e05c5c]" />, label: "Noch nicht validiert", value: unvalidated, color: "#e05c5c" },
                { icon: <AlertTriangle size={16} className="text-[#f5a623]" />, label: "Viele Fehlermeldungen (≥2)", value: highErrors, color: "#f5a623" },
                { icon: <CheckCircle size={16} className="text-[#4caf82]" />, label: "Community überprüft", value: verified, color: "#4caf82" },
              ].map((card) => (
                <div key={card.label} className="bg-[#1a2b3c] border border-[#1e3048] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">{card.icon}<span className="text-xs text-[#8faabb]">{card.label}</span></div>
                  <div className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</div>
                </div>
              ))}
            </div>

            {error && <p className="text-sm text-[#e05c5c]">{error}</p>}

            {/* Table */}
            {rows.length === 0 && !loading ? (
              <div className="bg-[#1a2b3c] border border-[#1e3048] rounded-lg p-10 text-center">
                <p className="text-[#8faabb]">Noch keine Validierungen vorhanden. Validierungen erscheinen hier, sobald Nutzer Annahmen bestätigen.</p>
                <Link href="/annahmen" className="inline-block mt-4 text-sm text-[#00c8b4] hover:underline">
                  → Zu den Annahmen
                </Link>
              </div>
            ) : (
              <div className="bg-[#1a2b3c] border border-[#1e3048] rounded-lg overflow-hidden">
                <div className="px-5 py-3 border-b border-[#1e3048]">
                  <p className="text-xs font-semibold text-[#8faabb] uppercase tracking-widest">
                    {rows.length} Annahmen mit Aktivität
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#1e3048] text-left">
                        <th className="px-4 py-3"><SortBtn k="assumptionId" label="Annahme" /></th>
                        <th className="px-4 py-3"><SortBtn k="validationCount" label="Bestätigungen" /></th>
                        <th className="px-4 py-3"><SortBtn k="errorCount" label="Fehlermeldungen" /></th>
                        <th className="px-4 py-3"><SortBtn k="lastValidatedAt" label="Zuletzt validiert" /></th>
                        <th className="px-4 py-3 text-[#8faabb]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.map((row) => (
                        <tr key={row.assumptionId} className="border-b border-[#1e3048]/60 hover:bg-[#0d1b2a]/40 transition-colors">
                          <td className="px-4 py-3 font-mono text-[#f0f4f8] max-w-[200px] truncate" title={row.assumptionId}>
                            {row.assumptionId}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`font-semibold ${row.validationCount >= 3 ? "text-[#4caf82]" : row.validationCount > 0 ? "text-[#f0f4f8]" : "text-[#8faabb]"}`}>
                              {row.validationCount}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`font-semibold ${row.errorCount >= 2 ? "text-[#e05c5c]" : row.errorCount > 0 ? "text-[#f5a623]" : "text-[#8faabb]"}`}>
                              {row.errorCount}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[#8faabb] flex items-center gap-1.5">
                            <Clock size={11} />
                            {fmt(row.lastValidatedAt)}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                              row.status === "community_geprueft"
                                ? "bg-[#1a3d2b] text-[#4caf82] border-[#4caf82]/40"
                                : "bg-[#3d2d0a] text-[#f5a623] border-[#f5a623]/40"
                            }`}>
                              {row.status === "community_geprueft" ? "🟢 Community" : "🟡 KI"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
