// import { motion } from "framer-motion";
// import { CheckCircle2, Clock } from "lucide-react";

// export default function StatisticalVerdict({ statistics, variantsCount, isDark }) {
//   if (!statistics || statistics.error) return null;

//   const cardCls = `p-5 md:p-6 rounded-2xl border ${
//     isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"
//   }`;

//   if ("z_score" in statistics) {
//     const sig = statistics.is_significant;
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 16 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.5 }}
//         className={cardCls}
//       >
//         <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
//           <p className={`text-[11px] font-bold tracking-widest uppercase ${isDark ? "text-white/40" : "text-gray-400"}`}>
//             Statistical Verdict
//           </p>
//           <span
//             className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold ${
//               sig ? "bg-emerald-500/10 text-emerald-500" : isDark ? "bg-white/[0.05] text-white/40" : "bg-gray-100 text-gray-500"
//             }`}
//           >
//             {sig ? <CheckCircle2 size={13} /> : <Clock size={13} />}
//             {sig ? "Significant" : "Not yet significant"}
//           </span>
//         </div>
//         <p className={`text-sm mb-5 ${isDark ? "text-white/50" : "text-gray-600"}`}>
//           {sig ? `Variant ${statistics.winner} is currently winning` : "Still gathering evidence — keep the experiment running"}
//         </p>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
//           {[
//             { label: "Z-score", value: statistics.z_score },
//             { label: "P-value", value: statistics.p_value < 0.000001 ? "<0.000001" : statistics.p_value },
//             { label: "Confidence", value: `${statistics.confidence}%` },
//             { label: "Winner", value: statistics.winner ? `Variant ${statistics.winner}` : "—" },
//           ].map((s) => (
//             <div key={s.label} className={`p-3 rounded-xl ${isDark ? "bg-white/[0.03]" : "bg-gray-50"}`}>
//               <p className={`text-[10px] ${isDark ? "text-white/30" : "text-gray-400"}`}>{s.label}</p>
//               <p
//                 className={`text-lg font-display font-bold mt-0.5 tabular-nums ${
//                   s.label === "Winner" && statistics.winner ? "text-emerald-500" : isDark ? "text-white" : "text-gray-900"
//                 }`}
//               >
//                 {s.value}
//               </p>
//             </div>
//           ))}
//         </div>
//         <div>
//           <div className="flex justify-between text-xs mb-1.5">
//             <span className={isDark ? "text-white/30" : "text-gray-400"}>Confidence level</span>
//             <span
//               className={`font-semibold ${
//                 statistics.confidence >= 95 ? "text-emerald-500" : isDark ? "text-white/50" : "text-gray-600"
//               }`}
//             >
//               {statistics.confidence}%
//             </span>
//           </div>
//           <div className={`h-2.5 rounded-full overflow-hidden ${isDark ? "bg-white/[0.06]" : "bg-gray-100"}`}>
//             <motion.div
//               className={`h-full rounded-full ${statistics.confidence >= 95 ? "bg-emerald-500" : "bg-brand-violet"}`}
//               initial={{ width: 0 }}
//               whileInView={{ width: `${Math.min(statistics.confidence, 100)}%` }}
//               viewport={{ once: true }}
//               transition={{ duration: 1.2, ease: "easeOut" }}
//             />
//           </div>
//           <p className={`text-xs mt-3 ${isDark ? "text-white/30" : "text-gray-400"}`}>
//             {sig
//               ? `Variant ${statistics.winner} is statistically significant at the current confidence level.`
//               : "The experiment has not reached statistical significance yet. Continue collecting data."}
//           </p>
//         </div>
//       </motion.div>
//     );
//   }

//   if ("overall_p_value" in statistics) {
//     const sig = statistics.overall_significant;
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 16 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.5 }}
//         className={cardCls}
//       >
//         <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
//           <p className={`text-[11px] font-bold tracking-widest uppercase ${isDark ? "text-white/40" : "text-gray-400"}`}>
//             Statistical Verdict · {variantsCount} variants
//           </p>
//           <span
//             className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold ${
//               sig ? "bg-emerald-500/10 text-emerald-500" : isDark ? "bg-white/[0.05] text-white/40" : "bg-gray-100 text-gray-500"
//             }`}
//           >
//             {sig ? <CheckCircle2 size={13} /> : <Clock size={13} />}
//             {sig ? "Significant" : "Not yet significant"}
//           </span>
//         </div>
//         <p className={`text-xs mb-5 ${isDark ? "text-white/40" : "text-gray-500"}`}>
//           Overall χ² = {statistics.overall_chi_square}, p = {statistics.overall_p_value}, control = Variant{" "}
//           {statistics.control_label}
//         </p>
//         <div className="space-y-2">
//           {statistics.pairwise_vs_control?.map((p) => (
//             <div key={p.label} className={`flex items-center justify-between p-3 rounded-xl ${isDark ? "bg-white/[0.03]" : "bg-gray-50"}`}>
//               <span className={`text-sm font-semibold ${isDark ? "text-white/70" : "text-gray-700"}`}>
//                 Variant {p.label} vs control
//               </span>
//               <div className="flex items-center gap-3 text-xs">
//                 <span className={p.lift_pct >= 0 ? "text-emerald-500 font-semibold" : "text-red-400 font-semibold"}>
//                   {p.lift_pct != null ? `${p.lift_pct >= 0 ? "+" : ""}${p.lift_pct}%` : "—"}
//                 </span>
//                 <span className={isDark ? "text-white/40" : "text-gray-500"}>p (adj): {p.p_value_adjusted}</span>
//                 <span
//                   className={`px-2 py-0.5 rounded-full font-semibold ${
//                     p.is_significant_adjusted
//                       ? "bg-emerald-500/10 text-emerald-500"
//                       : isDark
//                       ? "bg-white/[0.05] text-white/30"
//                       : "bg-gray-100 text-gray-400"
//                   }`}
//                 >
//                   {p.is_significant_adjusted ? "significant" : "not yet"}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//         <p className={`text-[11px] mt-4 ${isDark ? "text-white/25" : "text-gray-400"}`}>
//           P-values adjusted using Benjamini-Hochberg correction for multiple comparisons.
//         </p>
//       </motion.div>
//     );
//   }

//   return null;
// } 









































import { motion } from "framer-motion";
import { CheckCircle2, Clock } from "lucide-react";

export default function StatisticalVerdict({ statistics, variantsCount, isDark }) {
  if (!statistics || statistics.error) return null;

  const cardCls = `p-5 md:p-6 rounded-2xl border ${
    isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"
  }`;

  if ("z_score" in statistics) {
    const sig = statistics.is_significant;
    const ci = statistics.absolute_lift_ci_95;
    const ciLabel = ci ? `[${ci.lower_pct_points >= 0 ? "+" : ""}${ci.lower_pct_points}, ${ci.upper_pct_points >= 0 ? "+" : ""}${ci.upper_pct_points}] pp` : "—";
    const powerLabel = statistics.achieved_power != null ? `${Math.round(statistics.achieved_power * 100)}%` : "—";

    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={cardCls}
      >
        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
          <p className={`text-[11px] font-bold tracking-widest uppercase ${isDark ? "text-white/40" : "text-gray-400"}`}>
            Statistical Verdict
          </p>
          <span
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold ${
              sig ? "bg-emerald-500/10 text-emerald-500" : isDark ? "bg-white/[0.05] text-white/40" : "bg-gray-100 text-gray-500"
            }`}
          >
            {sig ? <CheckCircle2 size={13} /> : <Clock size={13} />}
            {sig ? "Significant" : "Not yet significant"}
          </span>
        </div>
        <p className={`text-sm mb-5 ${isDark ? "text-white/50" : "text-gray-600"}`}>
          {sig ? `Variant ${statistics.winner} is currently winning` : "Still gathering evidence — keep the experiment running"}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
          {[
            { label: "P-value", value: statistics.p_value < 0.000001 ? "<0.000001" : statistics.p_value },
            {
              label: "Relative lift",
              value: statistics.relative_lift_pct != null
                ? `${statistics.relative_lift_pct >= 0 ? "+" : ""}${statistics.relative_lift_pct}%`
                : "—",
            },
            { label: "95% CI (lift)", value: ciLabel, small: true },
            { label: "Winner", value: statistics.winner ? `Variant ${statistics.winner}` : "—" },
          ].map((s) => (
            <div key={s.label} className={`p-3 rounded-xl ${isDark ? "bg-white/[0.03]" : "bg-gray-50"}`}>
              <p className={`text-[10px] ${isDark ? "text-white/30" : "text-gray-400"}`}>{s.label}</p>
              <p
                className={`${s.small ? "text-sm" : "text-lg"} font-display font-bold mt-0.5 tabular-nums ${
                  s.label === "Winner" && statistics.winner ? "text-emerald-500" : isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        <div className={`flex items-center justify-between text-xs mt-4 pt-4 border-t ${isDark ? "border-white/[0.06] text-white/30" : "border-gray-100 text-gray-400"}`}>
          <span>
            Power to detect this effect at current sample size: <strong className={isDark ? "text-white/60" : "text-gray-600"}>{powerLabel}</strong>
          </span>
        </div>

        <p className={`text-xs mt-3 ${isDark ? "text-white/30" : "text-gray-400"}`}>
          {sig
            ? `Variant ${statistics.winner} is statistically significant at p < ${statistics.alpha ?? 0.05}.`
            : statistics.achieved_power != null && statistics.achieved_power < 0.8
            ? "Not significant yet — and the test is underpowered at the current sample size, so this could be a real effect you can't detect yet, not necessarily 'no difference.'"
            : "The experiment has not reached statistical significance yet. Continue collecting data."}
        </p>
      </motion.div>
    );
  }

  if ("overall_p_value" in statistics) {
    const sig = statistics.overall_significant;
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={cardCls}
      >
        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
          <p className={`text-[11px] font-bold tracking-widest uppercase ${isDark ? "text-white/40" : "text-gray-400"}`}>
            Statistical Verdict · {variantsCount} variants
          </p>
          <span
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold ${
              sig ? "bg-emerald-500/10 text-emerald-500" : isDark ? "bg-white/[0.05] text-white/40" : "bg-gray-100 text-gray-500"
            }`}
          >
            {sig ? <CheckCircle2 size={13} /> : <Clock size={13} />}
            {sig ? "Significant" : "Not yet significant"}
          </span>
        </div>
        <p className={`text-xs mb-5 ${isDark ? "text-white/40" : "text-gray-500"}`}>
          Overall χ² = {statistics.overall_chi_square}, p = {statistics.overall_p_value}, control = Variant{" "}
          {statistics.control_label}
        </p>
        <div className="space-y-2">
          {statistics.pairwise_vs_control?.map((p) => (
            <div key={p.label} className={`flex items-center justify-between p-3 rounded-xl ${isDark ? "bg-white/[0.03]" : "bg-gray-50"}`}>
              <span className={`text-sm font-semibold ${isDark ? "text-white/70" : "text-gray-700"}`}>
                Variant {p.label} vs control
              </span>
              <div className="flex items-center gap-3 text-xs">
                <span className={p.lift_pct >= 0 ? "text-emerald-500 font-semibold" : "text-red-400 font-semibold"}>
                  {p.lift_pct != null ? `${p.lift_pct >= 0 ? "+" : ""}${p.lift_pct}%` : "—"}
                </span>
                <span className={isDark ? "text-white/40" : "text-gray-500"}>p (adj): {p.p_value_adjusted}</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-semibold ${
                    p.is_significant_adjusted
                      ? "bg-emerald-500/10 text-emerald-500"
                      : isDark
                      ? "bg-white/[0.05] text-white/30"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {p.is_significant_adjusted ? "significant" : "not yet"}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className={`text-[11px] mt-4 ${isDark ? "text-white/25" : "text-gray-400"}`}>
          P-values adjusted using Benjamini-Hochberg correction for multiple comparisons.
        </p>
      </motion.div>
    );
  }

  return null;
}