
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import api from "../../services/api";
import { useTheme } from "../../context/ThemeContext";
import Onboarding from "./Onboarding";
import { SkeletonKPIRow, SkeletonChart, SkeletonTable } from "../../components/Skeleton";

const mockTimeSeries = [
  { day: "Jun 25", visitors: 312, conversions: 24 },
  { day: "Jun 26", visitors: 480, conversions: 38 },
  { day: "Jun 27", visitors: 390, conversions: 29 },
  { day: "Jun 28", visitors: 620, conversions: 54 },
  { day: "Jun 29", visitors: 580, conversions: 48 },
  { day: "Jun 30", visitors: 710, conversions: 67 },
  { day: "Jul 1",  visitors: 540, conversions: 52 },
];

function TrendBadge({ value }) {
  const up = value >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full ${
      up ? "bg-emerald-500/10 text-emerald-500" : "bg-red-400/10 text-red-400"
    }`}>
      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" d={up ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
      </svg>
      {Math.abs(value)}%
    </span>
  );
}

function KPICard({ label, value, trend, sub, accent, delay, spark }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={`relative p-5 rounded-2xl border overflow-hidden transition-colors ${
        isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"
      }`}
    >
      {/* Accent glow */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: accent }} />
      <div className="flex items-start justify-between mb-3">
        <p className={`text-xs font-medium ${isDark ? "text-white/40" : "text-gray-500"}`}>{label}</p>
        <TrendBadge value={trend} />
      </div>
      <p className={`text-2xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{value}</p>
      {sub && <p className={`text-xs mt-1 ${isDark ? "text-white/25" : "text-gray-400"}`}>{sub}</p>}
      {spark && (
        <div className="mt-3 h-8">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spark} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`sg${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={accent} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={accent} fill={`url(#sg${label})`} strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`px-3 py-2 rounded-xl border text-xs ${
      isDark ? "bg-[#161827] border-white/10 text-white" : "bg-white border-gray-200 text-gray-800 shadow-lg"
    }`}>
      <p className="font-medium mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function Overview({ onNavigate }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [stats, setStats] = useState(null);
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/analytics"), api.get("/experiments/")])
      .then(([s, e]) => { setStats(s.data); setExperiments(e.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const gc = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const tc = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)";

  const sparkA = mockTimeSeries.map((d) => ({ v: d.visitors }));
  const sparkB = mockTimeSeries.map((d) => ({ v: d.conversions }));

  if (!loading && experiments.length === 0) {
    return <Onboarding onNavigate={onNavigate} />;
  }

  // --- LOADING SKELETON (fixed) ---
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className={`h-6 w-32 rounded-lg animate-pulse mb-2 ${isDark ? "bg-white/[0.06]" : "bg-gray-200"}`} />
          <div className={`h-4 w-48 rounded-lg animate-pulse ${isDark ? "bg-white/[0.04]" : "bg-gray-100"}`} />
        </div>
        <SkeletonKPIRow />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2"><SkeletonChart /></div>
          {/* Inline skeleton card (replaces <SkeletonCard />) */}
          <div className={`p-5 rounded-2xl border ${isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"}`}>
            <div className={`h-4 w-32 rounded-lg animate-pulse mb-4 ${isDark ? "bg-white/[0.06]" : "bg-gray-200"}`} />
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-white/[0.06]" : "bg-gray-200"}`} />
                  <div className="flex-1">
                    <div className={`h-3 w-3/4 rounded-lg animate-pulse ${isDark ? "bg-white/[0.06]" : "bg-gray-200"}`} />
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`flex-1 h-1 rounded-full ${isDark ? "bg-white/[0.06]" : "bg-gray-200"}`} />
                      <div className={`h-2 w-8 rounded-lg animate-pulse ${isDark ? "bg-white/[0.04]" : "bg-gray-100"}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <SkeletonTable />
      </div>
    );
  }

  const running = experiments.filter((e) => e.status === "running");
  const completed = experiments.filter((e) => e.status === "completed");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className={`text-xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Overview
          </h1>
          <p className={`text-sm mt-0.5 ${isDark ? "text-white/35" : "text-gray-500"}`}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border ${
          isDark ? "border-white/10 text-white/40" : "border-gray-200 text-gray-500"
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {running.length} experiment{running.length !== 1 ? "s" : ""} running
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard label="Total Visitors" value={stats?.total_visitors?.toLocaleString() || "0"}
          trend={12.4} sub="vs last 7 days" accent="#6C5CE7" delay={0}
          spark={sparkA} />
        <KPICard label="Conversions" value={stats?.total_conversions?.toLocaleString() || "0"}
          trend={8.1} sub={`${stats?.total_experiments || 0} experiments`} accent="#4F8CFF" delay={0.05}
          spark={sparkB} />
        <KPICard label="Avg. Conv. Rate"
          value={stats?.total_visitors > 0
            ? `${((stats.total_conversions / stats.total_visitors) * 100).toFixed(2)}%`
            : "0%"}
          trend={-2.3} sub="across all experiments" accent="#10B981" delay={0.1} />
        <KPICard label="Running Tests" value={running.length}
          trend={0} sub={`${completed.length} completed`} accent="#F59E0B" delay={0.15} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className={`lg:col-span-2 p-5 rounded-2xl border ${
            isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <p className={`text-sm font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>Visitors & Conversions</p>
            <div className="flex items-center gap-4 text-xs">
              {[{ color: "#6C5CE7", label: "Visitors" }, { color: "#4F8CFF", label: "Conversions" }].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                  <span className={isDark ? "text-white/40" : "text-gray-400"}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockTimeSeries}>
              <defs>
                <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gc2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F8CFF" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4F8CFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gc} />
              <XAxis dataKey="day" tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={(p) => <CustomTooltip {...p} isDark={isDark} />} />
              <Area type="monotone" dataKey="visitors" name="Visitors" stroke="#6C5CE7" fill="url(#gv)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="conversions" name="Conversions" stroke="#4F8CFF" fill="url(#gc2)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top experiments */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className={`p-5 rounded-2xl border ${
            isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <p className={`text-sm font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>Active experiments</p>
            <button onClick={() => onNavigate?.("experiments")} className="text-xs text-brand-violet hover:underline">
              View all
            </button>
          </div>
          {running.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32">
              <p className={`text-xs ${isDark ? "text-white/25" : "text-gray-400"}`}>No running experiments</p>
              <button onClick={() => onNavigate?.("experiments")}
                className="mt-2 text-xs text-brand-violet hover:underline">Create one →</button>
            </div>
          ) : (
            <div className="space-y-3">
              {running.slice(0, 4).map((e) => (
                <div key={e.id} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${isDark ? "text-white/80" : "text-gray-800"}`}>
                      {e.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`flex-1 h-1 rounded-full ${isDark ? "bg-white/10" : "bg-gray-100"}`}>
                        <div className="h-full rounded-full bg-brand-violet" style={{ width: "60%" }} />
                      </div>
                      <span className={`text-[10px] flex-shrink-0 ${isDark ? "text-white/25" : "text-gray-400"}`}>
                        {e.variants.length} variants
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent experiments table */}
      {experiments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className={`rounded-2xl border overflow-hidden ${
            isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <div className={`flex items-center justify-between px-5 py-4 border-b ${
            isDark ? "border-white/[0.06]" : "border-gray-100"
          }`}>
            <p className={`text-sm font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>All experiments</p>
            <button onClick={() => onNavigate?.("experiments")} className="text-xs text-brand-violet hover:underline">
              Manage →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-xs ${isDark ? "text-white/25 border-white/[0.05]" : "text-gray-400 border-gray-50"} border-b`}>
                  {["Experiment", "Goal", "Variants", "Status", "Created"].map((h) => (
                    <th key={h} className={`text-left font-medium px-5 py-3 ${h === "Status" ? "hidden sm:table-cell" : ""}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {experiments.slice(0, 6).map((e, i) => (
                  <tr key={e.id} className={`border-b last:border-0 transition-colors ${
                    isDark
                      ? "border-white/[0.04] hover:bg-white/[0.02]"
                      : "border-gray-50 hover:bg-gray-50/50"
                  }`}>
                    <td className="px-5 py-3.5">
                      <p className={`font-medium truncate max-w-[160px] ${isDark ? "text-white/80" : "text-gray-800"}`}>
                        {e.name}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isDark ? "bg-white/[0.05] text-white/45" : "bg-gray-100 text-gray-500"
                      }`}>{e.goal}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1">
                        {e.variants.map((v) => (
                          <span key={v.id} className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold ${
                            v.label === "A" ? "bg-brand-violet" : "bg-brand-blue"
                          }`}>{v.label}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                        e.status === "running" ? "bg-emerald-500/10 text-emerald-500"
                          : e.status === "completed" ? "bg-brand-violet/10 text-brand-violet"
                          : e.status === "paused" ? "bg-amber-500/10 text-amber-500"
                          : isDark ? "bg-white/[0.05] text-white/35" : "bg-gray-100 text-gray-400"
                      }`}>
                        {e.status === "running" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                        {e.status}
                      </span>
                    </td>
                    <td className={`px-5 py-3.5 text-xs ${isDark ? "text-white/25" : "text-gray-400"}`}>
                      {new Date(e.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}