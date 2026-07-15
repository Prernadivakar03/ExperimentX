// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
// import api from "../../services/api";
// import { useTheme } from "../../context/ThemeContext";

// export default function Analytics() {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";
//   const [experiments, setExperiments] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     api.get("/experiments/").then((r) => {
//       setExperiments(r.data);
//       if (r.data.length > 0) setSelected(r.data[0].id);
//     });
//   }, []);

//   useEffect(() => {
//     if (!selected) return;
//     setLoading(true);
//     api.get(`/analytics/${selected}`)
//       .then((r) => setStats(r.data))
//       .catch(() => setStats(null))
//       .finally(() => setLoading(false));
//   }, [selected]);

//   const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
//   const textColor = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)";
//   const tooltipStyle = {
//     background: isDark ? "#161827" : "#fff",
//     border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
//     borderRadius: "8px",
//     color: isDark ? "#fff" : "#111",
//   };

//   const cardClass = `p-5 rounded-2xl border ${
//     isDark ? "bg-white/[0.03] border-white/10" : "bg-white border-gray-200 shadow-sm"
//   }`;

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between flex-wrap gap-3">
//         <div>
//           <h1 className={`text-xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Analytics</h1>
//           <p className={`text-sm mt-1 ${isDark ? "text-white/40" : "text-gray-500"}`}>Deep stats per experiment</p>
//         </div>
//         <select
//           value={selected || ""}
//           onChange={(e) => setSelected(e.target.value)}
//           className={`px-3 py-2 rounded-lg text-sm border focus:outline-none ${
//             isDark
//               ? "bg-white/[0.04] border-white/10 text-white"
//               : "bg-white border-gray-200 text-gray-900"
//           }`}
//         >
//           {experiments.map((e) => (
//             <option key={e.id} value={e.id}>{e.name}</option>
//           ))}
//         </select>
//       </div>

//       {loading ? (
//         <div className="flex items-center justify-center h-48">
//           <motion.div className="w-8 h-8 rounded-full border-2 border-brand-violet border-t-transparent"
//             animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
//         </div>
//       ) : !stats ? (
//         <div className={`flex items-center justify-center h-48 rounded-2xl border border-dashed ${
//           isDark ? "border-white/10" : "border-gray-200"
//         }`}>
//           <p className={`text-sm ${isDark ? "text-white/40" : "text-gray-400"}`}>
//             {experiments.length === 0 ? "No experiments yet" : "Select an experiment to view stats"}
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-5">
//           {/* Summary KPIs */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {[
//               { label: "Total visitors", value: stats.summary.total_visitors },
//               { label: "Conversions", value: stats.summary.total_conversions },
//               { label: "Clicks", value: stats.summary.total_clicks },
//               { label: "Page views", value: stats.summary.total_page_views },
//             ].map((s, i) => (
//               <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={cardClass}>
//                 <p className={`text-xs ${isDark ? "text-white/40" : "text-gray-500"}`}>{s.label}</p>
//                 <p className={`text-2xl font-display font-bold mt-1 text-brand-violet`}>{s.value?.toLocaleString() || 0}</p>
//               </motion.div>
//             ))}
//           </div>

//           {/* Per variant */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {stats.variants.map((v, i) => (
//               <motion.div key={v.variant_id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }} className={cardClass}>
//                 <div className="flex items-center gap-2 mb-3">
//                   <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${
//                     v.label === "A" ? "bg-brand-violet" : "bg-brand-blue"
//                   }`}>{v.label}</div>
//                   <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{v.name}</p>
//                   {stats.statistics?.winner === v.label && (
//                     <span className="ml-auto text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">WINNER</span>
//                   )}
//                 </div>
//                 <div className="grid grid-cols-3 gap-3">
//                   {[
//                     { label: "Visitors", value: v.visitors },
//                     { label: "Conversions", value: v.conversions },
//                     { label: "Conv. rate", value: `${v.conversion_rate}%` },
//                   ].map((m) => (
//                     <div key={m.label}>
//                       <p className={`text-[10px] ${isDark ? "text-white/40" : "text-gray-400"}`}>{m.label}</p>
//                       <p className={`text-base font-display font-bold mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>{m.value}</p>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="mt-3 h-1.5 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
//                   <div className={`h-full rounded-full ${v.label === "A" ? "bg-brand-violet" : "bg-brand-blue"}`}
//                     style={{ width: `${Math.min(v.conversion_rate * 10, 100)}%` }} />
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//           {/* Bar chart */}
//           <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className={cardClass}>
//             <p className={`text-sm font-medium mb-4 ${isDark ? "text-white/70" : "text-gray-700"}`}>Conversion rate by variant</p>
//             <ResponsiveContainer width="100%" height={180}>
//               <BarChart data={stats.variants.map((v) => ({ name: `Variant ${v.label}`, rate: v.conversion_rate, visitors: v.visitors }))}>
//                 <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
//                 <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
//                 <YAxis tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
//                 <Tooltip contentStyle={tooltipStyle} />
//                 <Bar dataKey="rate" name="Conv. rate %" fill="#6C5CE7" radius={[6, 6, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </motion.div>

//           {/* Statistical significance */}
//           {stats.statistics && !stats.statistics.error && (
//             <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={cardClass}>
//               <p className={`text-sm font-medium mb-4 ${isDark ? "text-white/70" : "text-gray-700"}`}>Statistical significance</p>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {[
//                   { label: "Z-score", value: stats.statistics.z_score },
//                   { label: "P-value", value: stats.statistics.p_value },
//                   { label: "Confidence", value: `${stats.statistics.confidence}%` },
//                   { label: "Winner", value: stats.statistics.winner ? `Variant ${stats.statistics.winner}` : "None yet" },
//                 ].map((s) => (
//                   <div key={s.label}>
//                     <p className={`text-xs ${isDark ? "text-white/40" : "text-gray-400"}`}>{s.label}</p>
//                     <p className={`text-lg font-display font-bold mt-0.5 ${
//                       s.label === "Winner" && stats.statistics.winner ? "text-emerald-500" : isDark ? "text-white" : "text-gray-900"
//                     }`}>{s.value}</p>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-4 h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
//                 <div
//                   className={`h-full rounded-full transition-all duration-1000 ${
//                     stats.statistics.is_significant ? "bg-emerald-500" : "bg-brand-violet"
//                   }`}
//                   style={{ width: `${Math.min(stats.statistics.confidence, 100)}%` }}
//                 />
//               </div>
//               <p className={`text-xs mt-2 ${isDark ? "text-white/40" : "text-gray-400"}`}>
//                 {stats.statistics.is_significant
//                   ? "✓ Result is statistically significant (p < 0.05)"
//                   : "Keep running — more data needed for significance"}
//               </p>
//             </motion.div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }









































// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
//   CartesianGrid, RadialBarChart, RadialBar, Cell,
// } from "recharts";
// import api from "../../services/api";
// import { useTheme } from "../../context/ThemeContext";

// export default function Analytics() {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";
//   const [experiments, setExperiments] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     api.get("/experiments/").then((r) => {
//       setExperiments(r.data);
//       if (r.data.length > 0) setSelected(r.data[0].id);
//     });
//   }, []);

//   useEffect(() => {
//     if (!selected) return;
//     setLoading(true);
//     api.get(`/analytics/${selected}`)
//       .then((r) => setStats(r.data))
//       .catch(() => setStats(null))
//       .finally(() => setLoading(false));
//   }, [selected]);

//   const gc = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
//   const tc = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)";
//   const tt = {
//     background: isDark ? "#0D0E1A" : "#fff",
//     border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
//     borderRadius: "10px",
//     color: isDark ? "#fff" : "#111",
//     fontSize: "12px",
//   };
//   const cardCls = `p-5 rounded-2xl border transition-colors ${
//     isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"
//   }`;

//   return (
//     <div className="space-y-5">
//       <div className="flex items-center justify-between flex-wrap gap-3">
//         <div>
//           <h1 className={`text-xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Analytics</h1>
//           <p className={`text-sm mt-0.5 ${isDark ? "text-white/35" : "text-gray-500"}`}>Statistical breakdown per experiment</p>
//         </div>
//         {experiments.length > 0 && (
//           <select value={selected || ""} onChange={(e) => setSelected(e.target.value)}
//             className={`px-3.5 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-violet/25 ${
//               isDark
//                 ? "bg-white/[0.04] border-white/[0.08] text-white"
//                 : "bg-white border-gray-200 text-gray-900"
//             }`}>
//             {experiments.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
//           </select>
//         )}
//       </div>

//       {loading ? (
//         <div className="flex items-center justify-center h-48">
//           <motion.div className="w-8 h-8 rounded-full border-2 border-brand-violet border-t-transparent"
//             animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
//         </div>
//       ) : !stats ? (
//         <div className={`flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed ${
//           isDark ? "border-white/[0.07]" : "border-gray-200"
//         }`}>
//           <p className={`text-sm ${isDark ? "text-white/30" : "text-gray-400"}`}>
//             {experiments.length === 0 ? "Create an experiment first" : "No analytics data yet — start the experiment and track events"}
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-5">
//           {/* Summary KPIs */}
//           <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
//             {[
//               { label: "Total visitors", value: stats.summary.total_visitors, color: "text-brand-violet" },
//               { label: "Conversions", value: stats.summary.total_conversions, color: "text-brand-blue" },
//               { label: "Total clicks", value: stats.summary.total_clicks, color: "text-emerald-500" },
//               { label: "Page views", value: stats.summary.total_page_views, color: "text-amber-500" },
//             ].map((s, i) => (
//               <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
//                 className={cardCls}>
//                 <p className={`text-xs ${isDark ? "text-white/35" : "text-gray-500"}`}>{s.label}</p>
//                 <p className={`text-2xl font-display font-bold mt-1 ${s.color}`}>
//                   {s.value?.toLocaleString() || 0}
//                 </p>
//               </motion.div>
//             ))}
//           </div>

//           {/* Variant comparison */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {stats.variants.map((v, i) => {
//               const isWinner = stats.statistics?.winner === v.label;
//               return (
//                 <motion.div key={v.variant_id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.2 + i * 0.07 }}
//                   className={`${cardCls} ${isWinner ? "ring-1 ring-emerald-500/40" : ""}`}>
//                   <div className="flex items-center gap-2.5 mb-4">
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
//                       v.label === "A" ? "bg-brand-violet" : "bg-brand-blue"
//                     }`}>{v.label}</div>
//                     <div>
//                       <p className={`font-medium text-sm ${isDark ? "text-white" : "text-gray-900"}`}>{v.name}</p>
//                       <p className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>{(v.traffic_split * 100).toFixed(0)}% traffic</p>
//                     </div>
//                     {isWinner && (
//                       <span className="ml-auto flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
//                         🏆 Winner
//                       </span>
//                     )}
//                   </div>
//                   <div className="grid grid-cols-3 gap-3 mb-4">
//                     {[
//                       { label: "Visitors", value: v.visitors },
//                       { label: "Conversions", value: v.conversions },
//                       { label: "Conv. rate", value: `${v.conversion_rate}%` },
//                     ].map((m) => (
//                       <div key={m.label} className={`p-3 rounded-xl ${isDark ? "bg-white/[0.03]" : "bg-gray-50"}`}>
//                         <p className={`text-[10px] ${isDark ? "text-white/30" : "text-gray-400"}`}>{m.label}</p>
//                         <p className={`text-base font-display font-bold mt-0.5 ${
//                           isWinner && m.label === "Conv. rate" ? "text-emerald-500" : isDark ? "text-white" : "text-gray-900"
//                         }`}>{m.value}</p>
//                       </div>
//                     ))}
//                   </div>
//                   <div className={`h-1.5 rounded-full ${isDark ? "bg-white/[0.06]" : "bg-gray-100"}`}>
//                     <motion.div
//                       className={`h-full rounded-full ${isWinner ? "bg-emerald-500" : v.label === "A" ? "bg-brand-violet" : "bg-brand-blue"}`}
//                       initial={{ width: 0 }}
//                       animate={{ width: `${Math.min((v.conversion_rate / 20) * 100, 100)}%` }}
//                       transition={{ duration: 1, delay: 0.4 }}
//                     />
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </div>

//           {/* Bar chart */}
//           <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className={cardCls}>
//             <p className={`text-sm font-medium mb-4 ${isDark ? "text-white/70" : "text-gray-700"}`}>
//               Conversion rate by variant
//             </p>
//             <ResponsiveContainer width="100%" height={200}>
//               <BarChart data={stats.variants.map((v) => ({ name: `Variant ${v.label}`, rate: v.conversion_rate, visitors: v.visitors }))}>
//                 <CartesianGrid strokeDasharray="3 3" stroke={gc} />
//                 <XAxis dataKey="name" tick={{ fill: tc, fontSize: 12 }} axisLine={false} tickLine={false} />
//                 <YAxis tick={{ fill: tc, fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
//                 <Tooltip contentStyle={tt} />
//                 <Bar dataKey="rate" name="Conv. Rate %" radius={[8, 8, 0, 0]}>
//                   {stats.variants.map((v, i) => (
//                     <Cell key={i} fill={v.label === "A" ? "#6C5CE7" : "#4F8CFF"} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </motion.div>

//           {/* Significance panel */}
//           {stats.statistics && !stats.statistics.error && (
//             <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={cardCls}>
//               <div className="flex items-center justify-between mb-4">
//                 <p className={`text-sm font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>
//                   Statistical significance
//                 </p>
//                 <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
//                   stats.statistics.is_significant
//                     ? "bg-emerald-500/10 text-emerald-500"
//                     : isDark ? "bg-white/[0.05] text-white/35" : "bg-gray-100 text-gray-500"
//                 }`}>
//                   {stats.statistics.is_significant ? "✓ Significant" : "⏳ Not yet significant"}
//                 </span>
//               </div>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//                 {[
//                   { label: "Z-score", value: stats.statistics.z_score },
//                   { label: "P-value", value: stats.statistics.p_value },
//                   { label: "Confidence", value: `${stats.statistics.confidence}%` },
//                   { label: "Winner", value: stats.statistics.winner ? `Variant ${stats.statistics.winner}` : "—" },
//                 ].map((s) => (
//                   <div key={s.label} className={`p-3 rounded-xl ${isDark ? "bg-white/[0.03]" : "bg-gray-50"}`}>
//                     <p className={`text-[10px] ${isDark ? "text-white/30" : "text-gray-400"}`}>{s.label}</p>
//                     <p className={`text-lg font-display font-bold mt-0.5 ${
//                       s.label === "Winner" && stats.statistics.winner
//                         ? "text-emerald-500"
//                         : isDark ? "text-white" : "text-gray-900"
//                     }`}>{s.value}</p>
//                   </div>
//                 ))}
//               </div>
//               <div>
//                 <div className="flex justify-between text-xs mb-1.5">
//                   <span className={isDark ? "text-white/30" : "text-gray-400"}>Confidence level</span>
//                   <span className={`font-medium ${
//                     stats.statistics.confidence >= 95 ? "text-emerald-500" : isDark ? "text-white/50" : "text-gray-600"
//                   }`}>{stats.statistics.confidence}%</span>
//                 </div>
//                 <div className={`h-2 rounded-full ${isDark ? "bg-white/[0.06]" : "bg-gray-100"}`}>
//                   <motion.div
//                     className={`h-full rounded-full ${
//                       stats.statistics.confidence >= 95 ? "bg-emerald-500" : "bg-brand-violet"
//                     }`}
//                     initial={{ width: 0 }}
//                     animate={{ width: `${Math.min(stats.statistics.confidence, 100)}%` }}
//                     transition={{ duration: 1.2, ease: "easeOut" }}
//                   />
//                 </div>
//                 <p className={`text-xs mt-2 ${isDark ? "text-white/25" : "text-gray-400"}`}>
//                   {stats.statistics.is_significant
//                     ? `Variant ${stats.statistics.winner} is the winner with ${stats.statistics.confidence}% confidence (p < 0.05)`
//                     : "Keep collecting data — need 95%+ confidence to declare a winner"}
//                 </p>
//               </div>
//             </motion.div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }









































import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, RadialBarChart, RadialBar, Cell,
  LineChart, Line, AreaChart, Area   // added for time‑series
} from "recharts";
import api from "../../services/api";
import { useTheme } from "../../context/ThemeContext";

// --- Mock data (fallback if API returns empty) ---
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
  const [timeseries, setTimeseries] = useState([]);      // <-- NEW state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/experiments/").then((r) => {
      setExperiments(r.data);
      if (r.data.length > 0) setSelected(r.data[0].id);
    });
  }, []);

  // --- UPDATED useEffect: fetch both stats and timeseries ---
  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    Promise.all([
      api.get(`/analytics/${selected}`),
      api.get(`/analytics/${selected}/timeseries?days=7`)
        .catch(() => ({ data: [] })),   // graceful fallback
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

  // Prepare data for the time‑series chart (fallback to mock)
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
          {/* Summary KPIs */}
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

          {/* Variant comparison */}
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

          {/* --- EXISTING BAR CHART (by variant) --- */}
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

          {/* --- NEW CHART: Conversion rate over time (time‑series) --- */}
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

          {/* Significance panel */}
          {stats.statistics && !stats.statistics.error && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className={cardCls}>
              <div className="flex items-center justify-between mb-4">
                <p className={`text-sm font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>
                  Statistical significance
                </p>
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
        </div>
      )}
    </div>
  );
}