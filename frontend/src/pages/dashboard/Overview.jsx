// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import {
//   LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
//   XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
// } from "recharts";
// import api from "../../services/api";
// import { useTheme } from "../../context/ThemeContext";

// const COLORS = ["#6C5CE7", "#4F8CFF"];

// function KPICard({ label, value, sub, color, delay }) {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 16 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay }}
//       className={`p-5 rounded-2xl border transition-colors duration-300 ${
//         isDark
//           ? "bg-white/[0.03] border-white/10"
//           : "bg-white border-gray-200 shadow-sm"
//       }`}
//     >
//       <p className={`text-xs font-medium mb-1 ${isDark ? "text-white/40" : "text-gray-500"}`}>{label}</p>
//       <p className={`text-2xl font-display font-bold ${color}`}>{value}</p>
//       {sub && <p className={`text-xs mt-1 ${isDark ? "text-white/30" : "text-gray-400"}`}>{sub}</p>}
//     </motion.div>
//   );
// }

// const mockVisitors = [
//   { day: "Mon", visitors: 420 }, { day: "Tue", visitors: 680 },
//   { day: "Wed", visitors: 590 }, { day: "Thu", visitors: 810 },
//   { day: "Fri", visitors: 760 }, { day: "Sat", visitors: 430 },
//   { day: "Sun", visitors: 560 },
// ];

// export default function Overview() {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";
//   const [stats, setStats] = useState(null);
//   const [experiments, setExperiments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const [statsRes, expRes] = await Promise.all([
//           api.get("/analytics"),
//           api.get("/experiments/"),
//         ]);
//         setStats(statsRes.data);
//         setExperiments(expRes.data);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
//   const textColor = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)";

//   const barData = experiments.slice(0, 5).map((e) => ({
//     name: e.name.length > 14 ? e.name.slice(0, 14) + "…" : e.name,
//     A: e.variants[0]?.traffic_split * 100 || 50,
//     B: e.variants[1]?.traffic_split * 100 || 50,
//   }));

//   const pieData = [
//     { name: "Running", value: stats?.running_experiments || 0 },
//     { name: "Completed", value: stats?.completed_experiments || 0 },
//   ];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <motion.div
//           className="w-8 h-8 rounded-full border-2 border-brand-violet border-t-transparent"
//           animate={{ rotate: 360 }}
//           transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className={`text-xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
//           Overview
//         </h1>
//         <p className={`text-sm mt-1 ${isDark ? "text-white/40" : "text-gray-500"}`}>
//           Track your experiments and key metrics
//         </p>
//       </div>

//       {/* KPI cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <KPICard label="Visitors" value={stats?.total_visitors?.toLocaleString() || "0"} color="text-brand-violet" delay={0} />
//         <KPICard label="Conversions" value={stats?.total_conversions?.toLocaleString() || "0"} color="text-brand-blue" delay={0.05} />
//         <KPICard label="Page Views" value={stats?.total_page_views?.toLocaleString() || "0"} color="text-emerald-500" delay={0.1} />
//         <KPICard label="Experiments" value={stats?.total_experiments || "0"} sub={`${stats?.running_experiments || 0} running`} color="text-fuchsia-500" delay={0.15} />
//       </div>

//       {/* Charts row */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {/* Visitors over time */}
//         <motion.div
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className={`md:col-span-2 p-5 rounded-2xl border ${
//             isDark ? "bg-white/[0.03] border-white/10" : "bg-white border-gray-200 shadow-sm"
//           }`}
//         >
//           <p className={`text-sm font-medium mb-4 ${isDark ? "text-white/70" : "text-gray-700"}`}>
//             Visitors over time
//           </p>
//           <ResponsiveContainer width="100%" height={180}>
//             <LineChart data={mockVisitors}>
//               <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
//               <XAxis dataKey="day" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
//               <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
//               <Tooltip
//                 contentStyle={{
//                   background: isDark ? "#161827" : "#fff",
//                   border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
//                   borderRadius: "8px",
//                   color: isDark ? "#fff" : "#111",
//                 }}
//               />
//               <Line type="monotone" dataKey="visitors" stroke="#6C5CE7" strokeWidth={2} dot={false} />
//             </LineChart>
//           </ResponsiveContainer>
//         </motion.div>

//         {/* Experiment status pie */}
//         <motion.div
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.25 }}
//           className={`p-5 rounded-2xl border ${
//             isDark ? "bg-white/[0.03] border-white/10" : "bg-white border-gray-200 shadow-sm"
//           }`}
//         >
//           <p className={`text-sm font-medium mb-4 ${isDark ? "text-white/70" : "text-gray-700"}`}>
//             Experiment status
//           </p>
//           <ResponsiveContainer width="100%" height={140}>
//             <PieChart>
//               <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={4}>
//                 {pieData.map((_, i) => (
//                   <Cell key={i} fill={COLORS[i]} />
//                 ))}
//               </Pie>
//               <Tooltip
//                 contentStyle={{
//                   background: isDark ? "#161827" : "#fff",
//                   border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
//                   borderRadius: "8px",
//                   color: isDark ? "#fff" : "#111",
//                 }}
//               />
//             </PieChart>
//           </ResponsiveContainer>
//           <div className="flex justify-center gap-4 mt-2">
//             {pieData.map((d, i) => (
//               <div key={d.name} className="flex items-center gap-1.5">
//                 <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
//                 <span className={`text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>{d.name} ({d.value})</span>
//               </div>
//             ))}
//           </div>
//         </motion.div>
//       </div>

//       {/* A vs B bar chart */}
//       {barData.length > 0 && (
//         <motion.div
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className={`p-5 rounded-2xl border ${
//             isDark ? "bg-white/[0.03] border-white/10" : "bg-white border-gray-200 shadow-sm"
//           }`}
//         >
//           <p className={`text-sm font-medium mb-4 ${isDark ? "text-white/70" : "text-gray-700"}`}>
//             Traffic split by experiment
//           </p>
//           <ResponsiveContainer width="100%" height={180}>
//             <BarChart data={barData}>
//               <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
//               <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
//               <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
//               <Tooltip
//                 contentStyle={{
//                   background: isDark ? "#161827" : "#fff",
//                   border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
//                   borderRadius: "8px",
//                   color: isDark ? "#fff" : "#111",
//                 }}
//               />
//               <Bar dataKey="A" fill="#6C5CE7" radius={[4, 4, 0, 0]} />
//               <Bar dataKey="B" fill="#4F8CFF" radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </motion.div>
//       )}

//       {/* Recent experiments */}
//       {experiments.length > 0 && (
//         <motion.div
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.35 }}
//           className={`p-5 rounded-2xl border ${
//             isDark ? "bg-white/[0.03] border-white/10" : "bg-white border-gray-200 shadow-sm"
//           }`}
//         >
//           <p className={`text-sm font-medium mb-4 ${isDark ? "text-white/70" : "text-gray-700"}`}>
//             Recent experiments
//           </p>
//           <div className="space-y-3">
//             {experiments.slice(0, 5).map((e) => (
//               <div key={e.id} className={`flex items-center justify-between py-2.5 border-b last:border-0 ${
//                 isDark ? "border-white/5" : "border-gray-100"
//               }`}>
//                 <div>
//                   <p className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{e.name}</p>
//                   <p className={`text-xs mt-0.5 ${isDark ? "text-white/40" : "text-gray-400"}`}>Goal: {e.goal}</p>
//                 </div>
//                 <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
//                   e.status === "running"
//                     ? "bg-emerald-500/10 text-emerald-500"
//                     : e.status === "completed"
//                       ? "bg-brand-violet/10 text-brand-violet"
//                       : "bg-gray-500/10 text-gray-500"
//                 }`}>
//                   {e.status}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// }













































import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import api from "../../services/api";
import { useTheme } from "../../context/ThemeContext";
import Onboarding from "./Onboarding";

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div className="w-8 h-8 rounded-full border-2 border-brand-violet border-t-transparent"
          animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
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