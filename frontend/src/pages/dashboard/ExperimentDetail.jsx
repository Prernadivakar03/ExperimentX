import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";
import api from "../../services/api";
import { useTheme } from "../../context/ThemeContext";
import AIInsightsPanel from "../../components/experiment/AIInsightsPanel";
import MLInsightsPanel from "../../components/experiment/MLInsightsPanel";
import ActivityTimeline from "../../components/experiment/ActivityTimeline";

// ─── Helper to transform API timeseries into chart data ───
// This function attempts to normalise various response shapes.
// If your API returns something else, adjust the mapping below.
function transformTimeseries(data) {
  if (!data) return [];
  
  // If data is already an array with `day`, `A`, `B` – return as-is.
  if (Array.isArray(data) && data.length && 'day' in data[0] && ('A' in data[0] || 'B' in data[0])) {
    return data;
  }

  // If data is an object with a `days` array (common pattern)
  if (data.days && Array.isArray(data.days)) {
    return data.days;
  }

  // If data is an array but uses different keys, try to map them.
  if (Array.isArray(data) && data.length) {
    // Example: [{ date: "...", variants: [{ label: "A", conversion_rate: 12.3 }] }]
    if ('date' in data[0] && 'variants' in data[0]) {
      return data.map(item => {
        const a = item.variants.find(v => v.label === "A");
        const b = item.variants.find(v => v.label === "B");
        return {
          day: item.date,
          A: a?.conversion_rate ?? 0,
          B: b?.conversion_rate ?? 0,
        };
      });
    }
    // If it's just an array of numbers? That's unlikely; return empty.
  }

  // Last resort: return empty array.
  console.warn("Unrecognised timeseries format:", data);
  return [];
}

function StatCard({ label, value, sub, color, isDark }) {
  return (
    <div className={`p-4 rounded-xl border ${
      isDark ? "bg-white/[0.03] border-white/[0.07]" : "bg-white border-gray-200"
    }`}>
      <p className={`text-[11px] font-medium uppercase tracking-wide ${isDark ? "text-white/30" : "text-gray-400"}`}>
        {label}
      </p>
      <p className={`text-2xl font-display font-bold mt-1 ${color || (isDark ? "text-white" : "text-gray-900")}`}>
        {value}
      </p>
      {sub && <p className={`text-xs mt-0.5 ${isDark ? "text-white/25" : "text-gray-400"}`}>{sub}</p>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`px-3 py-2 rounded-xl border text-xs ${
      isDark
        ? "bg-[#161827] border-white/10 text-white"
        : "bg-white border-gray-200 text-gray-800 shadow-lg"
    }`}>
      <p className="font-medium mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}%</p>
      ))}
    </div>
  );
};

export default function ExperimentDetail({ experimentId, onBack }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [experiment, setExperiment] = useState(null);
  const [stats, setStats] = useState(null);
  const [timeseries, setTimeseries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!experimentId) return;
    setLoading(true);
    Promise.all([
      api.get(`/experiments/${experimentId}`),
      api.get(`/experiments/analytics/${experimentId}`).catch(() => null),
      api.get(`/experiments/analytics/${experimentId}/timeseries`).catch(() => null),
    ]).then(([expRes, statsRes, tsRes]) => {
      setExperiment(expRes.data);
      setStats(statsRes?.data || null);
      // Normalise timeseries data
      const rawTs = tsRes?.data;
      setTimeseries(transformTimeseries(rawTs));
    }).catch((err) => {
      console.error("Failed to load experiment details:", err);
    }).finally(() => setLoading(false));
  }, [experimentId]);

  const updateStatus = async (status) => {
    setUpdating(true);
    try {
      await api.patch(`/experiments/${experimentId}`, { status });
      const res = await api.get(`/experiments/${experimentId}`);
      setExperiment(res.data);
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  const gc = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const tc = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)";
  const cardCls = `rounded-2xl border transition-colors ${
    isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"
  }`;

  const STATUS_ACTIONS = {
    draft: [{ label: "▶ Start experiment", status: "running", color: "text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20" }],
    running: [
      { label: "⏸ Pause", status: "paused", color: "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20" },
      { label: "✓ Mark complete", status: "completed", color: "text-brand-violet bg-brand-violet/10 hover:bg-brand-violet/20" },
    ],
    paused: [
      { label: "▶ Resume", status: "running", color: "text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20" },
      { label: "✓ Mark complete", status: "completed", color: "text-brand-violet bg-brand-violet/10 hover:bg-brand-violet/20" },
    ],
    completed: [],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          className="w-8 h-8 rounded-full border-2 border-brand-violet border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className={isDark ? "text-white/40" : "text-gray-400"}>Experiment not found</p>
        <button onClick={onBack} className="mt-3 text-sm text-brand-violet hover:underline">
          ← Back to experiments
        </button>
      </div>
    );
  }

  const statusConfig = {
    draft:     { color: "bg-gray-400/10 text-gray-400",     dot: "bg-gray-400" },
    running:   { color: "bg-emerald-500/10 text-emerald-500", dot: "bg-emerald-400" },
    paused:    { color: "bg-amber-500/10 text-amber-500",     dot: "bg-amber-400" },
    completed: { color: "bg-brand-violet/10 text-brand-violet", dot: "bg-brand-violet" },
  };
  const sc = statusConfig[experiment.status] || statusConfig.draft;
  const actions = STATUS_ACTIONS[experiment.status] || [];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <button
            onClick={onBack}
            className={`flex items-center gap-1.5 text-xs mb-3 transition-colors ${
              isDark ? "text-white/35 hover:text-white" : "text-gray-400 hover:text-gray-700"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to experiments
          </button>
          <h1 className={`text-xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            {experiment.name}
          </h1>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${sc.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} ${experiment.status === "running" ? "animate-pulse" : ""}`} />
              {experiment.status}
            </span>
            <span className={`text-xs ${isDark ? "text-white/25" : "text-gray-400"}`}>
              Goal: <span className={isDark ? "text-white/50" : "text-gray-600"}>{experiment.goal}</span>
            </span>
            <span className={`text-xs ${isDark ? "text-white/25" : "text-gray-400"}`}>
              Created {new Date(experiment.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {actions.map((a) => (
            <button
              key={a.status}
              onClick={() => updateStatus(a.status)}
              disabled={updating}
              className={`px-4 py-2 rounded-xl text-sm font-medium border border-transparent transition-all disabled:opacity-50 ${a.color}`}
            >
              {updating ? "Updating…" : a.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row — from real analytics data */}
      {stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total visitors" value={stats.summary?.total_visitors?.toLocaleString() || 0} isDark={isDark} color="text-brand-violet" />
          <StatCard label="Conversions" value={stats.summary?.total_conversions?.toLocaleString() || 0} isDark={isDark} color="text-brand-blue" />
          <StatCard label="Page views" value={stats.summary?.total_page_views?.toLocaleString() || 0} isDark={isDark} color="text-emerald-500" />
          <StatCard
            label="Confidence"
            value={stats.statistics?.confidence ? `${stats.statistics.confidence}%` : "—"}
            sub={stats.statistics?.is_significant ? "✓ Significant" : "Keep running"}
            isDark={isDark}
            color={stats.statistics?.is_significant ? "text-emerald-500" : isDark ? "text-white" : "text-gray-900"}
          />
        </div>
      ) : (
        <div className={`text-center py-4 text-sm ${isDark ? "text-white/25" : "text-gray-400"}`}>
          No analytics data available yet. Start the experiment and send events.
        </div>
      )}

      {/* Variant comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {experiment.variants.map((v, i) => {
          const variantStats = stats?.variants?.find((vs) => vs.label === v.label);
          const isWinner = stats?.statistics?.winner === v.label;
          return (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`${cardCls} p-5 ${isWinner ? "ring-1 ring-emerald-500/30" : ""}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                  v.label === "A" ? "bg-brand-violet" : "bg-brand-blue"
                }`}>
                  {v.label}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>{v.name}</p>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-white/30" : "text-gray-400"}`}>
                    {(v.traffic_split * 100).toFixed(0)}% traffic
                    {v.description && ` · ${v.description}`}
                  </p>
                </div>
                {isWinner && (
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                    🏆 Winner
                  </span>
                )}
              </div>

              {/* Traffic split bar */}
              <div className="mb-4">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className={isDark ? "text-white/25" : "text-gray-400"}>Traffic allocation</span>
                  <span className={isDark ? "text-white/40" : "text-gray-500"}>{(v.traffic_split * 100).toFixed(0)}%</span>
                </div>
                <div className={`h-1.5 rounded-full ${isDark ? "bg-white/[0.06]" : "bg-gray-100"}`}>
                  <div
                    className={`h-full rounded-full ${v.label === "A" ? "bg-brand-violet" : "bg-brand-blue"}`}
                    style={{ width: `${v.traffic_split * 100}%` }}
                  />
                </div>
              </div>

              {/* Stats if available */}
              {variantStats ? (
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Visitors", value: variantStats.visitors },
                    { label: "Conv.", value: variantStats.conversions },
                    { label: "Rate", value: `${variantStats.conversion_rate}%` },
                  ].map((m) => (
                    <div key={m.label} className={`p-2 rounded-lg ${isDark ? "bg-white/[0.03]" : "bg-gray-50"}`}>
                      <p className={`text-[10px] ${isDark ? "text-white/25" : "text-gray-400"}`}>{m.label}</p>
                      <p className={`text-sm font-display font-bold mt-0.5 ${
                        isWinner && m.label === "Rate"
                          ? "text-emerald-500"
                          : isDark ? "text-white" : "text-gray-900"
                      }`}>{m.value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-xs text-center py-3 rounded-xl ${isDark ? "bg-white/[0.02] text-white/20" : "bg-gray-50 text-gray-300"}`}>
                  No data yet — start experiment and track events
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ─── Charts section (real data) ─── */}
      {stats?.variants?.length > 0 && (
        <>
          {/* Conversion rate over time */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${cardCls} p-5`}
          >
            <div className="flex items-center justify-between mb-4">
              <p className={`text-sm font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>
                Conversion rate over time
              </p>
              <div className="flex items-center gap-4 text-xs">
                {experiment.variants.map((v) => (
                  <div key={v.label} className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${v.label === "A" ? "bg-brand-violet" : "bg-brand-blue"}`} />
                    <span className={isDark ? "text-white/35" : "text-gray-400"}>Variant {v.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {timeseries.length === 0 ? (
              <div className={`flex items-center justify-center h-[200px] text-xs rounded-xl ${
                isDark ? "bg-white/[0.02] text-white/20" : "bg-gray-50 text-gray-300"
              }`}>
                No timeseries data yet — check back once the experiment has been running a few days
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={timeseries}>
                  <defs>
                    <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F8CFF" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4F8CFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gc} vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: tc }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: tc }} axisLine={false} tickLine={false} />
                  <Tooltip content={(p) => <CustomTooltip {...p} isDark={isDark} />} />
                  <Area type="monotone" dataKey="A" name="Variant A" stroke="#6C5CE7" fill="url(#gA)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="B" name="Variant B" stroke="#4F8CFF" fill="url(#gB)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Significance panel */}
          {stats.statistics && !stats.statistics.error && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className={`${cardCls} p-5`}
            >
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <p className={`text-sm font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>
                  Statistical significance
                </p>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  stats.statistics.is_significant
                    ? "bg-emerald-500/10 text-emerald-500"
                    : isDark ? "bg-white/[0.05] text-white/35" : "bg-gray-100 text-gray-500"
                }`}>
                  {stats.statistics.is_significant ? "✓ Significant at 95%" : "⏳ Not yet significant"}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                {[
                  { label: "Z-score", value: stats.statistics.z_score },
                  { label: "P-value", value: stats.statistics.p_value },
                  { label: "Confidence", value: `${stats.statistics.confidence}%` },
                  {
                    label: "Winner",
                    value: stats.statistics.winner ? `Variant ${stats.statistics.winner}` : "—",
                    highlight: !!stats.statistics.winner,
                  },
                ].map((s) => (
                  <div key={s.label} className={`p-3 rounded-xl ${isDark ? "bg-white/[0.03]" : "bg-gray-50"}`}>
                    <p className={`text-[10px] uppercase tracking-wide ${isDark ? "text-white/25" : "text-gray-400"}`}>{s.label}</p>
                    <p className={`text-base font-display font-bold mt-0.5 ${
                      s.highlight ? "text-emerald-500" : isDark ? "text-white" : "text-gray-900"
                    }`}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className={isDark ? "text-white/30" : "text-gray-400"}>Confidence level</span>
                  <span className={`font-medium ${
                    stats.statistics.confidence >= 95
                      ? "text-emerald-500"
                      : isDark ? "text-white/50" : "text-gray-600"
                  }`}>{stats.statistics.confidence}%</span>
                </div>
                <div className={`h-2.5 rounded-full ${isDark ? "bg-white/[0.06]" : "bg-gray-100"}`}>
                  <motion.div
                    className={`h-full rounded-full ${
                      stats.statistics.confidence >= 95 ? "bg-emerald-500" : "bg-brand-violet"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(stats.statistics.confidence, 100)}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>
                <p className={`text-xs mt-2 ${isDark ? "text-white/20" : "text-gray-400"}`}>
                  {stats.statistics.is_significant
                    ? `Variant ${stats.statistics.winner} is the winner with ${stats.statistics.confidence}% confidence. Safe to deploy.`
                    : "Collect more data. You need at least 95% confidence to declare a winner safely."}
                </p>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* SDK Quick Reference */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`${cardCls} p-5`}
      >
        <p className={`text-sm font-medium mb-3 ${isDark ? "text-white/70" : "text-gray-700"}`}>
          Quick SDK reference for this experiment
        </p>
        <div className={`rounded-xl overflow-hidden ${isDark ? "bg-[#080912]" : "bg-gray-950"}`}>
          <pre className="p-4 text-xs text-emerald-400 overflow-x-auto leading-relaxed">
{`// Assign visitor to variant
const variant = await ExperimentX.getVariant('${experiment.id}');

// Render based on variant
if (variant === 'B') {
  // Show Variant B — ${experiment.variants[1]?.name || "Challenger"}
} else {
  // Show Variant A — ${experiment.variants[0]?.name || "Control"}
}

// Track conversion when goal achieved
ExperimentX.trackConversion('${experiment.goal}', '${experiment.id}');`}
          </pre>
        </div>
      </motion.div>

      {/* AI Insights */}
      <div>
        <p className={`text-sm font-semibold mb-3 ${isDark ? "text-white/70" : "text-gray-700"}`}>AI Insights</p>
        <AIInsightsPanel experimentId={experimentId} isDark={isDark} />
        <MLInsightsPanel experimentId={experimentId} isDark={isDark} />
      </div>

      {/* Timeline */}
      <ActivityTimeline experimentId={experimentId} isDark={isDark} />
    </div>
  );
}