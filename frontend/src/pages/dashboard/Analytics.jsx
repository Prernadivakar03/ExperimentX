
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, RadialBarChart, RadialBar, Cell,
  LineChart, Line, AreaChart, Area
} from "recharts";
import api from "../../services/api";
import { useTheme } from "../../context/ThemeContext";

const mockTimeSeries = [
  { date: "Jun 25", conversion_rate: 4.2 },
  { date: "Jun 26", conversion_rate: 5.1 },
  { date: "Jun 27", conversion_rate: 3.8 },
  { date: "Jun 28", conversion_rate: 6.3 },
  { date: "Jun 29", conversion_rate: 5.7 },
  { date: "Jun 30", conversion_rate: 7.2 },
  { date: "Jul 1",  conversion_rate: 6.8 },
];

export default function Analytics() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [experiments, setExperiments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [stats, setStats] = useState(null);
  const [timeseries, setTimeseries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/experiments/").then((r) => {
      setExperiments(r.data);
      if (r.data.length > 0) setSelected(r.data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    Promise.all([
      api.get(`/experiments/analytics/${selected}`),
      api.get(`/experiments/analytics/${selected}/timeseries?days=7`)
        .catch(() => ({ data: [] })),
    ])
      .then(([statsRes, tsRes]) => {
        setStats(statsRes.data);
        setTimeseries(tsRes.data);
      })
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [selected]);

  const gc = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const tc = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)";
  const tt = {
    background: isDark ? "#0D0E1A" : "#fff",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
    borderRadius: "10px",
    color: isDark ? "#fff" : "#111",
    fontSize: "12px",
  };
  const cardCls = `p-5 rounded-2xl border transition-colors ${
    isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"
  }`;
  const chartData = timeseries.length > 0 ? timeseries : mockTimeSeries;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`text-xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Analytics</h1>
          <p className={`text-sm mt-0.5 ${isDark ? "text-white/35" : "text-gray-500"}`}>Statistical breakdown per experiment</p>
        </div>
        {experiments.length > 0 && (
          <select value={selected || ""} onChange={(e) => setSelected(e.target.value)}
            className={`px-3.5 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-violet/25 ${
              isDark
                ? "bg-white/[0.04] border-white/[0.08] text-white"
                : "bg-white border-gray-200 text-gray-900"
            }`}>
            {experiments.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <motion.div className="w-8 h-8 rounded-full border-2 border-brand-violet border-t-transparent"
            animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
        </div>
      ) : !stats ? (
        <div className={`flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed ${
          isDark ? "border-white/[0.07]" : "border-gray-200"
        }`}>
          <p className={`text-sm ${isDark ? "text-white/30" : "text-gray-400"}`}>
            {experiments.length === 0 ? "Create an experiment first" : "No analytics data yet — start the experiment and track events"}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: "Total visitors", value: stats.summary.total_visitors, color: "text-brand-violet" },
              { label: "Conversions", value: stats.summary.total_conversions, color: "text-brand-blue" },
              { label: "Total clicks", value: stats.summary.total_clicks, color: "text-emerald-500" },
              { label: "Page views", value: stats.summary.total_page_views, color: "text-amber-500" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={cardCls}>
                <p className={`text-xs ${isDark ? "text-white/35" : "text-gray-500"}`}>{s.label}</p>
                <p className={`text-2xl font-display font-bold mt-1 ${s.color}`}>
                  {s.value?.toLocaleString() || 0}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.variants.map((v, i) => {
              const isWinner = stats.statistics?.winner === v.label;
              return (
                <motion.div key={v.variant_id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.07 }}
                  className={`${cardCls} ${isWinner ? "ring-1 ring-emerald-500/40" : ""}`}>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      v.label === "A" ? "bg-brand-violet" : "bg-brand-blue"
                    }`}>{v.label}</div>
                    <div>
                      <p className={`font-medium text-sm ${isDark ? "text-white" : "text-gray-900"}`}>{v.name}</p>
                      <p className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>{(v.traffic_split * 100).toFixed(0)}% traffic</p>
                    </div>
                    {isWinner && (
                      <span className="ml-auto flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                        🏆 Winner
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: "Visitors", value: v.visitors },
                      { label: "Conversions", value: v.conversions },
                      { label: "Conv. rate", value: `${v.conversion_rate}%` },
                    ].map((m) => (
                      <div key={m.label} className={`p-3 rounded-xl ${isDark ? "bg-white/[0.03]" : "bg-gray-50"}`}>
                        <p className={`text-[10px] ${isDark ? "text-white/30" : "text-gray-400"}`}>{m.label}</p>
                        <p className={`text-base font-display font-bold mt-0.5 ${
                          isWinner && m.label === "Conv. rate" ? "text-emerald-500" : isDark ? "text-white" : "text-gray-900"
                        }`}>{m.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className={`h-1.5 rounded-full ${isDark ? "bg-white/[0.06]" : "bg-gray-100"}`}>
                    <motion.div
                      className={`h-full rounded-full ${isWinner ? "bg-emerald-500" : v.label === "A" ? "bg-brand-violet" : "bg-brand-blue"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((v.conversion_rate / 20) * 100, 100)}%` }}
                      transition={{ duration: 1, delay: 0.4 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className={cardCls}>
            <p className={`text-sm font-medium mb-4 ${isDark ? "text-white/70" : "text-gray-700"}`}>
              Conversion rate by variant
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.variants.map((v) => ({ name: `Variant ${v.label}`, rate: v.conversion_rate, visitors: v.visitors }))}>
                <CartesianGrid strokeDasharray="3 3" stroke={gc} />
                <XAxis dataKey="name" tick={{ fill: tc, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: tc, fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip contentStyle={tt} />
                <Bar dataKey="rate" name="Conv. Rate %" radius={[8, 8, 0, 0]}>
                  {stats.variants.map((v, i) => (
                    <Cell key={i} fill={v.label === "A" ? "#6C5CE7" : "#4F8CFF"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={cardCls}>
            <div className="flex items-center justify-between mb-4">
              <p className={`text-sm font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>
                Conversion rate over time (last 7 days)
              </p>
              {timeseries.length === 0 && (
                <span className={`text-xs ${isDark ? "text-white/25" : "text-gray-400"}`}>
                  (using mock data)
                </span>
              )}
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="timeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gc} />
                <XAxis dataKey="date" tick={{ fill: tc, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: tc, fontSize: 12 }} axisLine={false} tickLine={false} unit="%" domain={[0, 'auto']} />
                <Tooltip contentStyle={tt} />
                <Area
                  type="monotone"
                  dataKey="conversion_rate"
                  name="Conversion rate"
                  stroke="#6C5CE7"
                  fill="url(#timeGrad)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#6C5CE7" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {stats.srm?.checked && stats.srm.mismatched && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border ${
                stats.srm.severity === "high"
                  ? "bg-red-500/10 border-red-500/20"
                  : "bg-amber-500/10 border-amber-500/20"
              }`}>
              <div className="flex items-start gap-3">
                <span className="text-lg leading-none">⚠️</span>
                <div>
                  <p className={`text-sm font-medium ${stats.srm.severity === "high" ? "text-red-400" : "text-amber-500"}`}>
                    Sample Ratio Mismatch detected
                  </p>
                  <p className={`text-xs mt-1 ${isDark ? "text-white/50" : "text-gray-600"}`}>{stats.srm.message}</p>
                  <p className={`text-[11px] mt-1 ${isDark ? "text-white/30" : "text-gray-400"}`}>
                    p-value: {stats.srm.p_value} · χ²: {stats.srm.chi_square}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {stats.peeking_warning?.at_risk && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl border bg-blue-500/10 border-blue-500/20">
              <div className="flex items-start gap-3">
                <span className="text-lg leading-none">⏳</span>
                <div>
                  <p className="text-sm font-medium text-blue-400">Results are still directional</p>
                  <p className={`text-xs mt-1 ${isDark ? "text-white/50" : "text-gray-600"}`}>{stats.peeking_warning.message}</p>
                  {(stats.peeking_warning.sample_progress_pct != null || stats.peeking_warning.duration_progress_pct != null) && (
                    <p className={`text-[11px] mt-1 ${isDark ? "text-white/30" : "text-gray-400"}`}>
                      {stats.peeking_warning.sample_progress_pct != null && `Sample: ${stats.peeking_warning.sample_progress_pct}%`}
                      {stats.peeking_warning.sample_progress_pct != null && stats.peeking_warning.duration_progress_pct != null && " · "}
                      {stats.peeking_warning.duration_progress_pct != null && `Duration: ${stats.peeking_warning.duration_progress_pct}%`}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {stats.statistics && !stats.statistics.error && "z_score" in stats.statistics && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className={cardCls}>
              <div className="flex items-center justify-between mb-4">
                <p className={`text-sm font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>Statistical significance</p>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  stats.statistics.is_significant
                    ? "bg-emerald-500/10 text-emerald-500"
                    : isDark ? "bg-white/[0.05] text-white/35" : "bg-gray-100 text-gray-500"
                }`}>
                  {stats.statistics.is_significant ? "✓ Significant" : "⏳ Not yet significant"}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {[
                  { label: "Z-score", value: stats.statistics.z_score },
                  { label: "P-value", value: stats.statistics.p_value },
                  { label: "Confidence", value: `${stats.statistics.confidence}%` },
                  { label: "Winner", value: stats.statistics.winner ? `Variant ${stats.statistics.winner}` : "—" },
                ].map((s) => (
                  <div key={s.label} className={`p-3 rounded-xl ${isDark ? "bg-white/[0.03]" : "bg-gray-50"}`}>
                    <p className={`text-[10px] ${isDark ? "text-white/30" : "text-gray-400"}`}>{s.label}</p>
                    <p className={`text-lg font-display font-bold mt-0.5 ${
                      s.label === "Winner" && stats.statistics.winner
                        ? "text-emerald-500"
                        : isDark ? "text-white" : "text-gray-900"
                    }`}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className={isDark ? "text-white/30" : "text-gray-400"}>Confidence level</span>
                  <span className={`font-medium ${
                    stats.statistics.confidence >= 95 ? "text-emerald-500" : isDark ? "text-white/50" : "text-gray-600"
                  }`}>{stats.statistics.confidence}%</span>
                </div>
                <div className={`h-2 rounded-full ${isDark ? "bg-white/[0.06]" : "bg-gray-100"}`}>
                  <motion.div
                    className={`h-full rounded-full ${
                      stats.statistics.confidence >= 95 ? "bg-emerald-500" : "bg-brand-violet"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(stats.statistics.confidence, 100)}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>
                <p className={`text-xs mt-2 ${isDark ? "text-white/25" : "text-gray-400"}`}>
                  {stats.statistics.is_significant
                    ? `Variant ${stats.statistics.winner} is the winner with ${stats.statistics.confidence}% confidence (p < 0.05)`
                    : "Keep collecting data — need 95%+ confidence to declare a winner"}
                </p>
              </div>
            </motion.div>
          )}

          {stats.statistics && !stats.statistics.error && "overall_p_value" in stats.statistics && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className={cardCls}>
              <div className="flex items-center justify-between mb-4">
                <p className={`text-sm font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>
                  Statistical significance ({stats.variants.length} variants)
                </p>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  stats.statistics.overall_significant
                    ? "bg-emerald-500/10 text-emerald-500"
                    : isDark ? "bg-white/[0.05] text-white/35" : "bg-gray-100 text-gray-500"
                }`}>
                  {stats.statistics.overall_significant ? "✓ Significant" : "⏳ Not yet significant"}
                </span>
              </div>
              <p className={`text-xs mb-3 ${isDark ? "text-white/40" : "text-gray-500"}`}>
                Overall χ² = {stats.statistics.overall_chi_square}, p = {stats.statistics.overall_p_value}, control = Variant {stats.statistics.control_label}
              </p>
              <div className="space-y-2">
                {stats.statistics.pairwise_vs_control?.map((p) => (
                  <div key={p.label} className={`flex items-center justify-between p-3 rounded-xl ${isDark ? "bg-white/[0.03]" : "bg-gray-50"}`}>
                    <span className={`text-sm font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>Variant {p.label} vs control</span>
                    <div className="flex items-center gap-3 text-xs">
                      <span className={isDark ? "text-white/40" : "text-gray-500"}>lift: {p.lift_pct != null ? `${p.lift_pct}%` : "—"}</span>
                      <span className={isDark ? "text-white/40" : "text-gray-500"}>p (adj): {p.p_value_adjusted}</span>
                      <span className={`px-2 py-0.5 rounded-full font-medium ${
                        p.is_significant_adjusted ? "bg-emerald-500/10 text-emerald-500" : isDark ? "bg-white/[0.05] text-white/30" : "bg-gray-100 text-gray-400"
                      }`}>
                        {p.is_significant_adjusted ? "significant" : "not yet"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className={`text-[11px] mt-3 ${isDark ? "text-white/25" : "text-gray-400"}`}>
                P-values adjusted using Benjamini-Hochberg correction for multiple comparisons.
              </p>
            </motion.div>
          )}

          {stats.bootstrap_ci && !stats.bootstrap_ci.error && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className={cardCls}>
              <p className={`text-sm font-medium mb-1 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                Bootstrap confidence interval
              </p>
              <p className={`text-xs mb-4 ${isDark ? "text-white/35" : "text-gray-500"}`}>
                Non-parametric — doesn't assume a normal distribution, more robust on small samples.
              </p>
              <div className="relative h-16 flex items-center">
                <div className={`absolute left-0 right-0 h-1 rounded-full ${isDark ? "bg-white/[0.06]" : "bg-gray-100"}`} />
                <div className="absolute h-1 rounded-full bg-brand-violet/40"
                  style={{
                    left: `${Math.max(0, Math.min(100, 50 + stats.bootstrap_ci.ci_lower_pct))}%`,
                    right: `${Math.max(0, Math.min(100, 50 - stats.bootstrap_ci.ci_upper_pct))}%`,
                  }} />
                <div className="absolute w-3 h-3 rounded-full bg-brand-violet -translate-x-1/2"
                  style={{ left: `${Math.max(0, Math.min(100, 50 + stats.bootstrap_ci.mean_lift_pct))}%` }} />
                <div className={`absolute left-1/2 top-0 bottom-0 w-px ${isDark ? "bg-white/15" : "bg-gray-300"}`} />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className={isDark ? "text-white/30" : "text-gray-400"}>{stats.bootstrap_ci.ci_lower_pct}%</span>
                <span className={`font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>
                  mean lift: {stats.bootstrap_ci.mean_lift_pct}%
                </span>
                <span className={isDark ? "text-white/30" : "text-gray-400"}>{stats.bootstrap_ci.ci_upper_pct}%</span>
              </div>
              <p className={`text-[11px] mt-2 ${isDark ? "text-white/25" : "text-gray-400"}`}>
                {stats.bootstrap_ci.confidence_level * 100}% confidence interval over {stats.bootstrap_ci.iterations.toLocaleString()} resamples
                {stats.bootstrap_ci.ci_lower_pct < 0 && stats.bootstrap_ci.ci_upper_pct > 0 && " — interval crosses zero, so a real difference isn't confirmed yet"}
              </p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
































