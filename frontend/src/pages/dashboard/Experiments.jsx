
// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import api from "../../services/api";
// import { useTheme } from "../../context/ThemeContext";
// import ExperimentDetail from "./ExperimentDetail";
// import toast from "react-hot-toast";
// import { SkeletonCard } from "../../components/Skeleton";

// const STATUS_CONFIG = {
//   draft:     { color: "bg-gray-400/10 text-gray-400", dot: "bg-gray-400", label: "Draft" },
//   running:   { color: "bg-emerald-500/10 text-emerald-500", dot: "bg-emerald-400", label: "Running" },
//   paused:    { color: "bg-amber-500/10 text-amber-500", dot: "bg-amber-400", label: "Paused" },
//   completed: { color: "bg-brand-violet/10 text-brand-violet", dot: "bg-brand-violet", label: "Completed" },
// };

// function CreateModal({ onClose, onCreated, isDark }) {
//   const [step, setStep] = useState(1);
//   const [form, setForm] = useState({
//     name: "", description: "", goal: "purchase",
//     planned_duration_days: null,
//     target_sample_size: null,
//     scheduled_start_at: null,
//     scheduled_end_at: null,
//     timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
//     variants: [
//       { name: "Control", label: "A", description: "", traffic_split: 0.5 },
//       { name: "Challenger", label: "B", description: "", traffic_split: 0.5 },
//     ],
//   });
//   const [showSchedule, setShowSchedule] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const inputCls = `w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-violet/25 transition-all ${
//     isDark
//       ? "bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-brand-violet/50"
//       : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-brand-violet"
//   }`;

//   const labelCls = `block text-xs font-medium mb-1.5 ${isDark ? "text-white/45" : "text-gray-600"}`;

//   const handleSubmit = async () => {
//     if (!form.name) { setError("Experiment name is required"); return; }
//     setLoading(true);
//     setError("");
//     try {
//       // Convert local datetime inputs to UTC ISO strings for the backend
//       const payload = {
//         ...form,
//         scheduled_start_at: form.scheduled_start_at ? new Date(form.scheduled_start_at).toISOString() : null,
//         scheduled_end_at: form.scheduled_end_at ? new Date(form.scheduled_end_at).toISOString() : null,
//       };
//       await api.post("/experiments/", payload);
//       toast.success("Experiment created! Set it to Running to start collecting data.");
//       onCreated();
//       onClose();
//     } catch (err) {
//       const d = err.response?.data?.detail;
//       setError(Array.isArray(d) ? d.map((x) => x.msg).join(", ") : d || "Failed to create");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//         className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
//       <motion.div
//         initial={{ opacity: 0, scale: 0.96, y: 12 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         exit={{ opacity: 0, scale: 0.96, y: 12 }}
//         transition={{ duration: 0.2 }}
//         className={`relative z-10 w-full max-w-xl rounded-2xl border ${
//           isDark ? "bg-[#0D0E1A] border-white/[0.08]" : "bg-white border-gray-200 shadow-2xl"
//         }`}
//       >
//         {/* Header */}
//         <div className={`flex items-center justify-between px-6 py-4 border-b ${
//           isDark ? "border-white/[0.06]" : "border-gray-100"
//         }`}>
//           <div>
//             <h2 className={`font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
//               New experiment
//             </h2>
//             <p className={`text-xs mt-0.5 ${isDark ? "text-white/30" : "text-gray-400"}`}>
//               Step {step} of 2 — {step === 1 ? "Basic details" : "Configure variants"}
//             </p>
//           </div>
//           <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${
//             isDark ? "text-white/30 hover:text-white hover:bg-white/[0.05]" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
//           }`}>
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//               <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         {/* Progress */}
//         <div className={`h-0.5 ${isDark ? "bg-white/[0.05]" : "bg-gray-100"}`}>
//           <motion.div className="h-full bg-gradient-to-r from-brand-violet to-brand-blue"
//             animate={{ width: step === 1 ? "50%" : "100%" }} transition={{ duration: 0.3 }} />
//         </div>

//         <div className="px-6 py-5">
//           <AnimatePresence mode="wait">
//             {step === 1 ? (
//               <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
//                 <div>
//                   <label className={labelCls}>Experiment name *</label>
//                   <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Homepage headline test" />
//                 </div>
//                 <div>
//                   <label className={labelCls}>Description</label>
//                   <textarea className={`${inputCls} resize-none`} rows={2} value={form.description}
//                     onChange={(e) => setForm({ ...form, description: e.target.value })}
//                     placeholder="What are you trying to learn?" />
//                 </div>
//                 <div>
//                   <label className={labelCls}>Conversion goal</label>
//                   <select className={inputCls} value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}>
//                     <option value="purchase">Purchase</option>
//                     <option value="signup">Signup</option>
//                     <option value="click">Button click</option>
//                     <option value="page_view">Page view</option>
//                   </select>
//                 </div>

//                 {/* ── Scheduling section ── */}
//                 <div>
//                   <button
//                     type="button"
//                     onClick={() => setShowSchedule(!showSchedule)}
//                     className={`flex items-center gap-1.5 text-xs font-medium ${
//                       isDark ? "text-white/45 hover:text-white/70" : "text-gray-500 hover:text-gray-700"
//                     }`}
//                   >
//                     <svg className={`w-3.5 h-3.5 transition-transform ${showSchedule ? "rotate-90" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
//                       <path strokeLinecap="round" d="M9 5l7 7-7 7" />
//                     </svg>
//                     Scheduling & sample size (optional)
//                   </button>

//                   <AnimatePresence>
//                     {showSchedule && (
//                       <motion.div
//                         initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
//                         className="overflow-hidden"
//                       >
//                         <div className="grid grid-cols-2 gap-3 mt-3">
//                           <div>
//                             <label className={labelCls}>Planned duration (days)</label>
//                             <input type="number" min={1} className={inputCls}
//                               value={form.planned_duration_days ?? ""}
//                               onChange={(e) => setForm({ ...form, planned_duration_days: e.target.value ? Number(e.target.value) : null })}
//                               placeholder="14" />
//                           </div>
//                           <div>
//                             <label className={labelCls}>Target sample size</label>
//                             <input type="number" min={1} className={inputCls}
//                               value={form.target_sample_size ?? ""}
//                               onChange={(e) => setForm({ ...form, target_sample_size: e.target.value ? Number(e.target.value) : null })}
//                               placeholder="10000" />
//                           </div>
//                           <div>
//                             <label className={labelCls}>Auto-start at</label>
//                             <input type="datetime-local" className={inputCls}
//                               value={form.scheduled_start_at ?? ""}
//                               onChange={(e) => setForm({ ...form, scheduled_start_at: e.target.value || null })} />
//                           </div>
//                           <div>
//                             <label className={labelCls}>Auto-end at</label>
//                             <input type="datetime-local" className={inputCls}
//                               value={form.scheduled_end_at ?? ""}
//                               onChange={(e) => setForm({ ...form, scheduled_end_at: e.target.value || null })} />
//                           </div>
//                         </div>
//                         <p className={`text-[11px] mt-2 ${isDark ? "text-white/25" : "text-gray-400"}`}>
//                           Leave start/end blank to control status manually. Times are in your local timezone ({form.timezone}).
//                         </p>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               </motion.div>
//             ) : (
//               <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
//                 <p className={`text-xs ${isDark ? "text-white/35" : "text-gray-500"}`}>
//                   Traffic is split 50/50 by default. Customize below.
//                 </p>
//                 {form.variants.map((v, i) => (
//                   <div key={i} className={`p-4 rounded-xl border ${
//                     isDark ? "border-white/[0.07] bg-white/[0.02]" : "border-gray-200 bg-gray-50/50"
//                   }`}>
//                     <div className="flex items-center gap-2 mb-3">
//                       <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
//                         i === 0 ? "bg-brand-violet" : "bg-brand-blue"
//                       }`}>{v.label}</div>
//                       <span className={`text-sm font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>
//                         Variant {v.label}
//                       </span>
//                       <span className={`ml-auto text-xs ${isDark ? "text-white/25" : "text-gray-400"}`}>
//                         {(v.traffic_split * 100).toFixed(0)}% traffic
//                       </span>
//                     </div>
//                     <div className="grid grid-cols-2 gap-3">
//                       <div>
//                         <label className={labelCls}>Name</label>
//                         <input className={inputCls} value={v.name}
//                           onChange={(e) => {
//                             const vs = [...form.variants];
//                             vs[i] = { ...vs[i], name: e.target.value };
//                             setForm({ ...form, variants: vs });
//                           }}
//                           placeholder={i === 0 ? "Control" : "Challenger"} />
//                       </div>
//                       <div>
//                         <label className={labelCls}>What&apos;s different?</label>
//                         <input className={inputCls} value={v.description}
//                           onChange={(e) => {
//                             const vs = [...form.variants];
//                             vs[i] = { ...vs[i], description: e.target.value };
//                             setForm({ ...form, variants: vs });
//                           }}
//                           placeholder="Briefly describe the change" />
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {error && (
//             <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
//               className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-lg mt-4">
//               {error}
//             </motion.p>
//           )}

//           <div className="flex gap-3 mt-5">
//             <button onClick={step === 1 ? onClose : () => setStep(1)}
//               className={`flex-1 py-2.5 rounded-xl text-sm border transition-colors ${
//                 isDark ? "border-white/[0.08] text-white/45 hover:text-white/70" : "border-gray-200 text-gray-500 hover:text-gray-700"
//               }`}>
//               {step === 1 ? "Cancel" : "← Back"}
//             </button>
//             <button
//               onClick={step === 1 ? () => { if (form.name) setStep(2); else setError("Name is required"); } : handleSubmit}
//               disabled={loading}
//               className="flex-1 py-2.5 rounded-xl text-sm text-white font-medium
//                          bg-gradient-to-r from-brand-violet to-brand-blue disabled:opacity-60
//                          hover:opacity-90 transition-opacity">
//               {loading ? "Creating…" : step === 1 ? "Next →" : "Create experiment"}
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// export default function Experiments() {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";
//   const [experiments, setExperiments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showCreate, setShowCreate] = useState(false);
//   const [filter, setFilter] = useState("all");
//   const [search, setSearch] = useState("");

//   const [detailId, setDetailId] = useState(null);

//   const load = async () => {
//     try { const r = await api.get("/experiments/"); setExperiments(r.data); }
//     finally { setLoading(false); }
//   };
//   useEffect(() => { load(); }, []);

//   const updateStatus = async (id, status) => {
//     try {
//       await api.patch(`/experiments/${id}`, { status });
//       toast.success(`Experiment ${status}`);
//       load();
//     } catch {
//       toast.error("Failed to update experiment");
//     }
//   };

//   const deleteExp = async (id) => {
//     if (!confirm("Delete this experiment? This cannot be undone.")) return;
//     try {
//       await api.delete(`/experiments/${id}`);
//       toast.success("Experiment deleted");
//       load();
//     } catch {
//       toast.error("Failed to delete experiment");
//     }
//   };

//   const filtered = experiments.filter((e) => {
//     const matchFilter = filter === "all" || e.status === filter;
//     const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
//     return matchFilter && matchSearch;
//   });

//   const FILTERS = ["all", "running", "paused", "draft", "completed"];

//   const cardCls = `rounded-2xl border p-5 transition-colors ${
//     isDark ? "bg-[#0D0E1A] border-white/[0.07] hover:border-white/[0.12]" : "bg-white border-gray-200 shadow-sm hover:border-gray-300"
//   }`;

//   // --- Show experiment detail if selected ---
//   if (detailId) {
//     return (
//       <ExperimentDetail
//         experimentId={detailId}
//         onBack={() => setDetailId(null)}
//       />
//     );
//   }

//   // --- Show skeleton while loading ---
//   if (loading) {
//     return (
//       <div className="space-y-5">
//         <div className="flex items-center justify-between">
//           <div className={`h-6 w-36 rounded-lg animate-pulse ${isDark ? "bg-white/[0.06]" : "bg-gray-200"}`} />
//           <div className={`h-9 w-36 rounded-xl animate-pulse ${isDark ? "bg-white/[0.06]" : "bg-gray-200"}`} />
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
//           {[0,1,2,3,4,5].map(i => <SkeletonCard key={i} />)}
//         </div>
//       </div>
//     );
//   }

//   // --- Normal render (data loaded) ---
//   return (
//     <div className="space-y-5">
//       <div className="flex items-center justify-between flex-wrap gap-3">
//         <div>
//           <h1 className={`text-xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Experiments</h1>
//           <p className={`text-sm mt-0.5 ${isDark ? "text-white/35" : "text-gray-500"}`}>
//             {experiments.length} total · {experiments.filter((e) => e.status === "running").length} running
//           </p>
//         </div>
//         <button onClick={() => setShowCreate(true)}
//           className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white font-medium
//                      bg-gradient-to-r from-brand-violet to-brand-blue hover:opacity-90 transition-opacity
//                      shadow-[0_0_20px_rgba(108,92,231,0.3)]">
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
//             <path strokeLinecap="round" d="M12 4v16m8-8H4" />
//           </svg>
//           New experiment
//         </button>
//       </div>

//       {/* Filters + search */}
//       <div className="flex items-center gap-3 flex-wrap">
//         <div className={`flex items-center gap-1 p-1 rounded-xl border ${
//           isDark ? "bg-white/[0.02] border-white/[0.07]" : "bg-gray-50 border-gray-200"
//         }`}>
//           {FILTERS.map((f) => (
//             <button key={f} onClick={() => setFilter(f)}
//               className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
//                 filter === f
//                   ? "bg-brand-violet text-white shadow-sm"
//                   : isDark ? "text-white/40 hover:text-white" : "text-gray-500 hover:text-gray-900"
//               }`}>
//               {f}
//             </button>
//           ))}
//         </div>
//         <div className="relative flex-1 min-w-[180px] max-w-xs">
//           <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isDark ? "text-white/25" : "text-gray-400"}`}
//             fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//             <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
//           </svg>
//           <input value={search} onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search experiments…"
//             className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-violet/25 ${
//               isDark
//                 ? "bg-white/[0.03] border-white/[0.07] text-white placeholder:text-white/25"
//                 : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
//             }`} />
//         </div>
//       </div>

//       {/* Experiment cards */}
//       {filtered.length === 0 ? (
//         <div className={`flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed ${
//           isDark ? "border-white/[0.07]" : "border-gray-200"
//         }`}>
//           <svg className={`w-10 h-10 mb-3 ${isDark ? "text-white/15" : "text-gray-300"}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
//             <path strokeLinecap="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//           </svg>
//           <p className={`text-sm ${isDark ? "text-white/30" : "text-gray-400"}`}>
//             {search || filter !== "all" ? "No experiments match your filter" : "No experiments yet"}
//           </p>
//           {!search && filter === "all" && (
//             <button onClick={() => setShowCreate(true)} className="mt-3 text-sm text-brand-violet hover:underline">
//               Create your first experiment →
//             </button>
//           )}
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//           {filtered.map((e, i) => {
//             const sc = STATUS_CONFIG[e.status] || STATUS_CONFIG.draft;
//             return (
//               <motion.div key={e.id}
//                 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: i * 0.04 }}
//                 className={cardCls}
//               >
//                 <div className="flex items-start justify-between gap-2 mb-3">
//                   <p
//                     className={`font-medium leading-snug cursor-pointer hover:text-brand-violet transition-colors ${
//                     isDark ? "text-white/85" : "text-gray-900"
//                     }`}
//                     onClick={() => setDetailId(e.id)}
//                   >
//                   {e.name}
//                   </p>
//                   <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${sc.color}`}>
//                     <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
//                     {sc.label}
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-2 mb-4">
//                   <span className={`text-xs px-2 py-0.5 rounded-full ${
//                     isDark ? "bg-white/[0.05] text-white/40" : "bg-gray-100 text-gray-500"
//                   }`}>{e.goal}</span>
//                   <span className={`text-xs ${isDark ? "text-white/25" : "text-gray-400"}`}>
//                     {e.created_at
//                       ? new Date(e.created_at).toLocaleDateString("en-IN", {
//                           day: "numeric",
//                           month: "short",
//                         })
//                       : "No date"}
//                   </span>
//                 </div>

//                 {/* Variant pills */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
//                   {e.variants.map((v) => (
//                     <div key={v.id} className={`flex-1 px-3 py-2 rounded-xl ${
//                       isDark ? "bg-white/[0.03] border border-white/[0.06]" : "bg-gray-50 border border-gray-100"
//                     }`}>
//                       <div className="flex items-center gap-1.5">
//                         <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold ${
//                           v.label === "A" ? "bg-brand-violet" : "bg-brand-blue"
//                         }`}>{v.label}</div>
//                         <span className={`text-xs truncate ${isDark ? "text-white/50" : "text-gray-600"}`}>{v.name}</span>
//                       </div>
//                       <div className={`mt-1.5 h-1 rounded-full ${isDark ? "bg-white/[0.06]" : "bg-gray-200"}`}>
//                         <div className={`h-full rounded-full ${v.label === "A" ? "bg-brand-violet" : "bg-brand-blue"}`}
//                           style={{ width: `${v.traffic_split * 100}%` }} />
//                       </div>
//                       <p className={`text-[10px] mt-1 ${isDark ? "text-white/20" : "text-gray-400"}`}>
//                         {(v.traffic_split * 100).toFixed(0)}%
//                       </p>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Actions */}
//                 <div className={`grid grid-cols-2 gap-2 pt-3 border-t ${isDark ? "border-white/[0.05]" : "border-gray-100"}`}>
//                   {e.status === "draft" && (
//                     <button onClick={() => updateStatus(e.id, "running")}
//                       className="flex-1 py-1.5 rounded-lg text-xs font-medium text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors">
//                       ▶ Start
//                     </button>
//                   )}
//                   {e.status === "running" && (
//                     <button onClick={() => updateStatus(e.id, "paused")}
//                       className="flex-1 py-1.5 rounded-lg text-xs font-medium text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 transition-colors">
//                       ⏸ Pause
//                     </button>
//                   )}
//                   {e.status === "paused" && (
//                     <>
//                       <button onClick={() => updateStatus(e.id, "running")}
//                         className="flex-1 py-1.5 rounded-lg text-xs font-medium text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors">
//                         ▶ Resume
//                       </button>
//                       <button onClick={() => updateStatus(e.id, "completed")}
//                         className="flex-1 py-1.5 rounded-lg text-xs font-medium text-brand-violet bg-brand-violet/10 hover:bg-brand-violet/20 transition-colors">
//                         ✓ Complete
//                       </button>
//                     </>
//                   )}
//                   <button
//                     onClick={() => setDetailId(e.id)}
//                     className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
//                       isDark
//                         ? "text-white/30 hover:text-brand-violet hover:bg-brand-violet/10"
//                         : "text-gray-400 hover:text-brand-violet hover:bg-brand-violet/5"
//                     }`}
//                   >
//                     View →
//                   </button>
//                   <button onClick={() => deleteExp(e.id)}
//                     className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
//                       isDark ? "text-white/20 hover:text-red-400 hover:bg-red-400/10" : "text-gray-300 hover:text-red-500 hover:bg-red-50"
//                     }`}>
//                     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                       <path strokeLinecap="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                     </svg>
//                   </button>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>
//       )}

//       <AnimatePresence>
//         {showCreate && <CreateModal onClose={() => setShowCreate(false)} onCreated={load} isDark={isDark} />}
//       </AnimatePresence>
//     </div>
//   );
// }













































































































































import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import { useTheme } from "../../context/ThemeContext";
import ExperimentDetail from "./ExperimentDetail";
import toast from "react-hot-toast";
import { SkeletonCard } from "../../components/Skeleton";

const STATUS_CONFIG = {
  draft:     { color: "bg-gray-400/10 text-gray-400", dot: "bg-gray-400", label: "Draft" },
  running:   { color: "bg-emerald-500/10 text-emerald-500", dot: "bg-emerald-400", label: "Running" },
  paused:    { color: "bg-amber-500/10 text-amber-500", dot: "bg-amber-400", label: "Paused" },
  completed: { color: "bg-brand-violet/10 text-brand-violet", dot: "bg-brand-violet", label: "Completed" },
};

function CreateModal({ onClose, onCreated, isDark }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", description: "", goal: "purchase",
    planned_duration_days: null,
    target_sample_size: null,
    scheduled_start_at: null,
    scheduled_end_at: null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    variants: [
      { name: "Control", label: "A", description: "", traffic_split: 0.5 },
      { name: "Challenger", label: "B", description: "", traffic_split: 0.5 },
    ],
  });
  const [showSchedule, setShowSchedule] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputCls = `w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-violet/25 transition-all ${
    isDark
      ? "bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-brand-violet/50"
      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-brand-violet"
  }`;

  const labelCls = `block text-xs font-medium mb-1.5 ${isDark ? "text-white/45" : "text-gray-600"}`;

  const handleSubmit = async () => {
    if (!form.name) { setError("Experiment name is required"); return; }
    setLoading(true);
    setError("");
    try {
      // Convert local datetime inputs to UTC ISO strings for the backend
      const payload = {
        ...form,
        scheduled_start_at: form.scheduled_start_at ? new Date(form.scheduled_start_at).toISOString() : null,
        scheduled_end_at: form.scheduled_end_at ? new Date(form.scheduled_end_at).toISOString() : null,
        // ⚠️ If your backend schema does NOT include 'timezone', remove it from the payload.
        // Otherwise, keep it.
      };
      await api.post("/experiments/", payload);
      toast.success("Experiment created! Set it to Running to start collecting data.");
      onCreated();
      onClose();
    } catch (err) {
      const d = err.response?.data?.detail;
      setError(Array.isArray(d) ? d.map((x) => x.msg).join(", ") : d || "Failed to create");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        className={`relative z-10 w-full max-w-xl rounded-2xl border ${
          isDark ? "bg-[#0D0E1A] border-white/[0.08]" : "bg-white border-gray-200 shadow-2xl"
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? "border-white/[0.06]" : "border-gray-100"
        }`}>
          <div>
            <h2 className={`font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              New experiment
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? "text-white/30" : "text-gray-400"}`}>
              Step {step} of 2 — {step === 1 ? "Basic details" : "Configure variants"}
            </p>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${
            isDark ? "text-white/30 hover:text-white hover:bg-white/[0.05]" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress */}
        <div className={`h-0.5 ${isDark ? "bg-white/[0.05]" : "bg-gray-100"}`}>
          <motion.div className="h-full bg-gradient-to-r from-brand-violet to-brand-blue"
            animate={{ width: step === 1 ? "50%" : "100%" }} transition={{ duration: 0.3 }} />
        </div>

        <div className="px-6 py-5">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                <div>
                  <label className={labelCls}>Experiment name *</label>
                  <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Homepage headline test" />
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea className={`${inputCls} resize-none`} rows={2} value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="What are you trying to learn?" />
                </div>
                <div>
                  <label className={labelCls}>Conversion goal</label>
                  <select className={inputCls} value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}>
                    <option value="purchase">Purchase</option>
                    <option value="signup">Signup</option>
                    <option value="click">Button click</option>
                    <option value="page_view">Page view</option>
                  </select>
                </div>

                {/* ── Scheduling section ── */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowSchedule(!showSchedule)}
                    className={`flex items-center gap-1.5 text-xs font-medium ${
                      isDark ? "text-white/45 hover:text-white/70" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <svg className={`w-3.5 h-3.5 transition-transform ${showSchedule ? "rotate-90" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" d="M9 5l7 7-7 7" />
                    </svg>
                    Scheduling & sample size (optional)
                  </button>

                  <AnimatePresence>
                    {showSchedule && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div>
                            <label className={labelCls}>Planned duration (days)</label>
                            <input type="number" min={1} className={inputCls}
                              value={form.planned_duration_days ?? ""}
                              onChange={(e) => setForm({ ...form, planned_duration_days: e.target.value ? Number(e.target.value) : null })}
                              placeholder="14" />
                          </div>
                          <div>
                            <label className={labelCls}>Target sample size</label>
                            <input type="number" min={1} className={inputCls}
                              value={form.target_sample_size ?? ""}
                              onChange={(e) => setForm({ ...form, target_sample_size: e.target.value ? Number(e.target.value) : null })}
                              placeholder="10000" />
                          </div>
                          <div>
                            <label className={labelCls}>Auto-start at</label>
                            <input type="datetime-local" className={inputCls}
                              value={form.scheduled_start_at ?? ""}
                              onChange={(e) => setForm({ ...form, scheduled_start_at: e.target.value || null })} />
                          </div>
                          <div>
                            <label className={labelCls}>Auto-end at</label>
                            <input type="datetime-local" className={inputCls}
                              value={form.scheduled_end_at ?? ""}
                              onChange={(e) => setForm({ ...form, scheduled_end_at: e.target.value || null })} />
                          </div>
                        </div>
                        <p className={`text-[11px] mt-2 ${isDark ? "text-white/25" : "text-gray-400"}`}>
                          Leave start/end blank to control status manually. Times are in your local timezone ({form.timezone}).
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
                <p className={`text-xs ${isDark ? "text-white/35" : "text-gray-500"}`}>
                  Traffic is split 50/50 by default. Customize below.
                </p>
                {form.variants.map((v, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${
                    isDark ? "border-white/[0.07] bg-white/[0.02]" : "border-gray-200 bg-gray-50/50"
                  }`}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        i === 0 ? "bg-brand-violet" : "bg-brand-blue"
                      }`}>{v.label}</div>
                      <span className={`text-sm font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>
                        Variant {v.label}
                      </span>
                      <span className={`ml-auto text-xs ${isDark ? "text-white/25" : "text-gray-400"}`}>
                        {(v.traffic_split * 100).toFixed(0)}% traffic
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Name</label>
                        <input className={inputCls} value={v.name}
                          onChange={(e) => {
                            const vs = [...form.variants];
                            vs[i] = { ...vs[i], name: e.target.value };
                            setForm({ ...form, variants: vs });
                          }}
                          placeholder={i === 0 ? "Control" : "Challenger"} />
                      </div>
                      <div>
                        <label className={labelCls}>What&apos;s different?</label>
                        <input className={inputCls} value={v.description}
                          onChange={(e) => {
                            const vs = [...form.variants];
                            vs[i] = { ...vs[i], description: e.target.value };
                            setForm({ ...form, variants: vs });
                          }}
                          placeholder="Briefly describe the change" />
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-lg mt-4">
              {error}
            </motion.p>
          )}

          <div className="flex gap-3 mt-5">
            <button onClick={step === 1 ? onClose : () => setStep(1)}
              className={`flex-1 py-2.5 rounded-xl text-sm border transition-colors ${
                isDark ? "border-white/[0.08] text-white/45 hover:text-white/70" : "border-gray-200 text-gray-500 hover:text-gray-700"
              }`}>
              {step === 1 ? "Cancel" : "← Back"}
            </button>
            <button
              onClick={step === 1 ? () => { if (form.name) setStep(2); else setError("Name is required"); } : handleSubmit}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm text-white font-medium
                         bg-gradient-to-r from-brand-violet to-brand-blue disabled:opacity-60
                         hover:opacity-90 transition-opacity">
              {loading ? "Creating…" : step === 1 ? "Next →" : "Create experiment"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Experiments() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [detailId, setDetailId] = useState(null);

  const load = async () => {
    try {
      const r = await api.get("/experiments/");
      setExperiments(r.data);
    } catch (err) {
      console.error("Failed to load experiments:", err);
      toast.error("Could not load experiments");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/experiments/${id}`, { status });
      toast.success(`Experiment ${status}`);
      load();
    } catch {
      toast.error("Failed to update experiment");
    }
  };

  const deleteExp = async (id) => {
    if (!confirm("Delete this experiment? This cannot be undone.")) return;
    try {
      await api.delete(`/experiments/${id}`);
      toast.success("Experiment deleted");
      load();
    } catch {
      toast.error("Failed to delete experiment");
    }
  };

  const filtered = experiments.filter((e) => {
    const matchFilter = filter === "all" || e.status === filter;
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const FILTERS = ["all", "running", "paused", "draft", "completed"];

  const cardCls = `rounded-2xl border p-5 transition-colors ${
    isDark ? "bg-[#0D0E1A] border-white/[0.07] hover:border-white/[0.12]" : "bg-white border-gray-200 shadow-sm hover:border-gray-300"
  }`;

  // --- Show experiment detail if selected ---
  if (detailId) {
    return (
      <ExperimentDetail
        experimentId={detailId}
        onBack={() => setDetailId(null)}
      />
    );
  }

  // --- Show skeleton while loading ---
  if (loading) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className={`h-6 w-36 rounded-lg animate-pulse ${isDark ? "bg-white/[0.06]" : "bg-gray-200"}`} />
          <div className={`h-9 w-36 rounded-xl animate-pulse ${isDark ? "bg-white/[0.06]" : "bg-gray-200"}`} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[0,1,2,3,4,5].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  // --- Normal render (data loaded) ---
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`text-xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Experiments</h1>
          <p className={`text-sm mt-0.5 ${isDark ? "text-white/35" : "text-gray-500"}`}>
            {experiments.length} total · {experiments.filter((e) => e.status === "running").length} running
          </p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white font-medium
                     bg-gradient-to-r from-brand-violet to-brand-blue hover:opacity-90 transition-opacity
                     shadow-[0_0_20px_rgba(108,92,231,0.3)]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M12 4v16m8-8H4" />
          </svg>
          New experiment
        </button>
      </div>

      {/* Filters + search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className={`flex items-center gap-1 p-1 rounded-xl border ${
          isDark ? "bg-white/[0.02] border-white/[0.07]" : "bg-gray-50 border-gray-200"
        }`}>
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                filter === f
                  ? "bg-brand-violet text-white shadow-sm"
                  : isDark ? "text-white/40 hover:text-white" : "text-gray-500 hover:text-gray-900"
              }`}>
              {f}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isDark ? "text-white/25" : "text-gray-400"}`}
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search experiments…"
            className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-violet/25 ${
              isDark
                ? "bg-white/[0.03] border-white/[0.07] text-white placeholder:text-white/25"
                : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
            }`} />
        </div>
      </div>

      {/* Experiment cards */}
      {filtered.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed ${
          isDark ? "border-white/[0.07]" : "border-gray-200"
        }`}>
          <svg className={`w-10 h-10 mb-3 ${isDark ? "text-white/15" : "text-gray-300"}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className={`text-sm ${isDark ? "text-white/30" : "text-gray-400"}`}>
            {search || filter !== "all" ? "No experiments match your filter" : "No experiments yet"}
          </p>
          {!search && filter === "all" && (
            <button onClick={() => setShowCreate(true)} className="mt-3 text-sm text-brand-violet hover:underline">
              Create your first experiment →
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((e, i) => {
            const sc = STATUS_CONFIG[e.status] || STATUS_CONFIG.draft;
            return (
              <motion.div key={e.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={cardCls}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <p
                    className={`font-medium leading-snug cursor-pointer hover:text-brand-violet transition-colors ${
                    isDark ? "text-white/85" : "text-gray-900"
                    }`}
                    onClick={() => setDetailId(e.id)}
                  >
                  {e.name}
                  </p>
                  <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${sc.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                    {sc.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isDark ? "bg-white/[0.05] text-white/40" : "bg-gray-100 text-gray-500"
                  }`}>{e.goal}</span>
                  <span className={`text-xs ${isDark ? "text-white/25" : "text-gray-400"}`}>
                    {e.created_at
                      ? new Date(e.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })
                      : "No date"}
                  </span>
                </div>

                {/* Variant pills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {e.variants.map((v) => (
                    <div key={v.id} className={`flex-1 px-3 py-2 rounded-xl ${
                      isDark ? "bg-white/[0.03] border border-white/[0.06]" : "bg-gray-50 border border-gray-100"
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold ${
                          v.label === "A" ? "bg-brand-violet" : "bg-brand-blue"
                        }`}>{v.label}</div>
                        <span className={`text-xs truncate ${isDark ? "text-white/50" : "text-gray-600"}`}>{v.name}</span>
                      </div>
                      <div className={`mt-1.5 h-1 rounded-full ${isDark ? "bg-white/[0.06]" : "bg-gray-200"}`}>
                        <div className={`h-full rounded-full ${v.label === "A" ? "bg-brand-violet" : "bg-brand-blue"}`}
                          style={{ width: `${v.traffic_split * 100}%` }} />
                      </div>
                      <p className={`text-[10px] mt-1 ${isDark ? "text-white/20" : "text-gray-400"}`}>
                        {(v.traffic_split * 100).toFixed(0)}%
                      </p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className={`grid grid-cols-2 gap-2 pt-3 border-t ${isDark ? "border-white/[0.05]" : "border-gray-100"}`}>
                  {e.status === "draft" && (
                    <button onClick={() => updateStatus(e.id, "running")}
                      className="flex-1 py-1.5 rounded-lg text-xs font-medium text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors">
                      ▶ Start
                    </button>
                  )}
                  {e.status === "running" && (
                    <button onClick={() => updateStatus(e.id, "paused")}
                      className="flex-1 py-1.5 rounded-lg text-xs font-medium text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 transition-colors">
                      ⏸ Pause
                    </button>
                  )}
                  {e.status === "paused" && (
                    <>
                      <button onClick={() => updateStatus(e.id, "running")}
                        className="flex-1 py-1.5 rounded-lg text-xs font-medium text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors">
                        ▶ Resume
                      </button>
                      <button onClick={() => updateStatus(e.id, "completed")}
                        className="flex-1 py-1.5 rounded-lg text-xs font-medium text-brand-violet bg-brand-violet/10 hover:bg-brand-violet/20 transition-colors">
                        ✓ Complete
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setDetailId(e.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      isDark
                        ? "text-white/30 hover:text-brand-violet hover:bg-brand-violet/10"
                        : "text-gray-400 hover:text-brand-violet hover:bg-brand-violet/5"
                    }`}
                  >
                    View →
                  </button>
                  <button onClick={() => deleteExp(e.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      isDark ? "text-white/20 hover:text-red-400 hover:bg-red-400/10" : "text-gray-300 hover:text-red-500 hover:bg-red-50"
                    }`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showCreate && <CreateModal onClose={() => setShowCreate(false)} onCreated={load} isDark={isDark} />}
      </AnimatePresence>
    </div>
  );
}