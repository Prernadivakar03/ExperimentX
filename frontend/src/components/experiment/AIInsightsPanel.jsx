import { useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";
import toast from "react-hot-toast";


function ResultCard({ isDark, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={`mt-3 p-4 rounded-xl border ${isDark ? "bg-white/[0.03] border-white/[0.07]" : "bg-gray-50 border-gray-100"}`}>
      {children}
    </motion.div>
  );
}

const RISK_COLORS = {
  low: "text-emerald-500 bg-emerald-500/10",
  medium: "text-amber-500 bg-amber-500/10",
  high: "text-red-500 bg-red-500/10",
};

export default function AIInsightsPanel({ experimentId, isDark }) {
  const [risk, setRisk] = useState(null);
  const [riskLoading, setRiskLoading] = useState(false);

  const [explain, setExplain] = useState(null);
  const [explainLoading, setExplainLoading] = useState(false);

  const [anomaly, setAnomaly] = useState(null);
  const [anomalyLoading, setAnomalyLoading] = useState(false);

  const cardCls = `rounded-2xl border p-5 ${isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"}`;

  const runRiskScore = async () => {
    setRiskLoading(true);
    try {
      const r = await api.post("/ai/risk-score", { experiment_id: experimentId });
      setRisk(r.data);
    } catch {
      toast.error("Couldn't compute risk score");
    } finally {
      setRiskLoading(false);
    }
  };

  const runExplain = async () => {
    setExplainLoading(true);
    try {
      const r = await api.post("/ai/explain-result", { experiment_id: experimentId });
      setExplain(r.data);
    } catch {
      toast.error("Couldn't generate explanation — needs at least 2 variants with visitor data");
    } finally {
      setExplainLoading(false);
    }
  };

  const runAnomalyCheck = async () => {
    setAnomalyLoading(true);
    try {
      const ts = await api.get(`/experiments/analytics/${experimentId}/timeseries`);
      const dailyCounts = (ts.data?.days || ts.data || []).map((d) => d.visitors ?? d.count ?? 0);
      if (dailyCounts.length < 5) {
        toast.error("Need at least 5 days of data to check for anomalies");
        setAnomalyLoading(false);
        return;
      }
      const r = await api.post("/ai/detect-anomaly", { experiment_id: experimentId, daily_visitor_counts: dailyCounts });
      setAnomaly(r.data);
    } catch {
      toast.error("Couldn't run anomaly detection");
    } finally {
      setAnomalyLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Risk Score */}
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-1">
          <p className={`text-sm font-semibold ${isDark ? "text-white/85" : "text-gray-900"}`}>Pre-launch Risk</p>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-violet/15 text-brand-violet font-medium">AI</span>
        </div>
        <p className={`text-xs mb-3 ${isDark ? "text-white/35" : "text-gray-500"}`}>
          Deterministic checks on sample size, SRM, guardrails — AI only phrases the reasoning.
        </p>
        <button onClick={runRiskScore} disabled={riskLoading}
          className="w-full py-2 rounded-lg text-xs font-medium text-white bg-brand-violet hover:opacity-90 disabled:opacity-50 transition-opacity">
          {riskLoading ? "Analyzing…" : risk ? "Re-check" : "Check risk"}
        </button>

        {risk && (
          <ResultCard isDark={isDark}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${RISK_COLORS[risk.risk_level]}`}>
                {risk.risk_level?.toUpperCase()} · {risk.risk_score}/100
              </span>
            </div>
            {risk.ai_summary && (
              <p className={`text-xs leading-relaxed mb-2 ${isDark ? "text-white/60" : "text-gray-600"}`}>{risk.ai_summary}</p>
            )}
            {risk.signals?.length > 0 && (
              <ul className="space-y-1">
                {risk.signals.map((s, i) => (
                  <li key={i} className={`text-[11px] flex gap-1.5 ${isDark ? "text-white/40" : "text-gray-500"}`}>
                    <span className="text-amber-500 flex-shrink-0">•</span>{s}
                  </li>
                ))}
              </ul>
            )}
          </ResultCard>
        )}
      </div>

      {/* Explainability */}
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-1">
          <p className={`text-sm font-semibold ${isDark ? "text-white/85" : "text-gray-900"}`}>Explain Results</p>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-violet/15 text-brand-violet font-medium">AI</span>
        </div>
        <p className={`text-xs mb-3 ${isDark ? "text-white/35" : "text-gray-500"}`}>
          Grounded strictly in your funnel event data — never invents design causes.
        </p>
        <button onClick={runExplain} disabled={explainLoading}
          className="w-full py-2 rounded-lg text-xs font-medium text-white bg-brand-violet hover:opacity-90 disabled:opacity-50 transition-opacity">
          {explainLoading ? "Analyzing…" : explain ? "Re-check" : "Explain results"}
        </button>

        {explain && (
          <ResultCard isDark={isDark}>
            <p className={`text-xs leading-relaxed mb-2 ${isDark ? "text-white/60" : "text-gray-600"}`}>
              {explain.ai_explanation?.plain_english}
            </p>
            {explain.ai_explanation?.data_limitation && (
              <p className={`text-[11px] italic leading-relaxed ${isDark ? "text-white/30" : "text-gray-400"}`}>
                ⚠ {explain.ai_explanation.data_limitation}
              </p>
            )}
          </ResultCard>
        )}
      </div>

      {/* Anomaly detection */}
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-1">
          <p className={`text-sm font-semibold ${isDark ? "text-white/85" : "text-gray-900"}`}>Traffic Anomaly</p>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-violet/15 text-brand-violet font-medium">AI</span>
        </div>
        <p className={`text-xs mb-3 ${isDark ? "text-white/35" : "text-gray-500"}`}>
          Z-score check on daily traffic — AI only suggests what to investigate.
        </p>
        <button onClick={runAnomalyCheck} disabled={anomalyLoading}
          className="w-full py-2 rounded-lg text-xs font-medium text-white bg-brand-violet hover:opacity-90 disabled:opacity-50 transition-opacity">
          {anomalyLoading ? "Checking…" : anomaly ? "Re-check" : "Check for anomalies"}
        </button>

        {anomaly && (
          <ResultCard isDark={isDark}>
            {!anomaly.checked ? (
              <p className={`text-xs ${isDark ? "text-white/40" : "text-gray-500"}`}>{anomaly.reason}</p>
            ) : anomaly.anomalous ? (
              <>
                <p className="text-xs font-semibold text-red-400 mb-1">
                  {anomaly.direction === "drop" ? "📉 Drop detected" : "📈 Spike detected"}
                </p>
                <p className={`text-[11px] leading-relaxed mb-2 ${isDark ? "text-white/50" : "text-gray-500"}`}>{anomaly.message}</p>
                {anomaly.ai_investigation_suggestions && (
                  <ul className="space-y-1">
                    {(Array.isArray(anomaly.ai_investigation_suggestions) ? anomaly.ai_investigation_suggestions : []).map((s, i) => (
                      <li key={i} className={`text-[11px] flex gap-1.5 ${isDark ? "text-white/40" : "text-gray-500"}`}>
                        <span className="text-brand-violet flex-shrink-0">→</span>{typeof s === "string" ? s : JSON.stringify(s)}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <p className="text-xs text-emerald-500">✓ Traffic pattern looks normal</p>
            )}
          </ResultCard>
        )}
      </div>
    </div>
  );
}