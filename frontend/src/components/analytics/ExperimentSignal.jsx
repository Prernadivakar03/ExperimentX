// import { motion } from "framer-motion";
// import { Zap } from "lucide-react";

// export default function ExperimentSignal({ statistics, variants, isDark }) {
//   if (!statistics || statistics.error || !variants?.length) return null;

//   const control = variants.find((v) => v.label === "A") || variants[0];
//   let significant, headline, liftPct, confidenceLabel, pValueLabel;

//   if ("z_score" in statistics) {
//     significant = !!statistics.is_significant;
//     const winner = variants.find((v) => v.label === statistics.winner);
//     const leader = winner || variants.reduce((b, v) => (!b || v.conversion_rate > b.conversion_rate ? v : b), null);
//     liftPct =
//       control && leader && leader !== control && control.conversion_rate > 0
//         ? ((leader.conversion_rate - control.conversion_rate) / control.conversion_rate) * 100
//         : null;
//     confidenceLabel = `${statistics.confidence}%`;
//     pValueLabel = statistics.p_value < 0.000001 ? "p < 0.000001" : `p = ${statistics.p_value}`;
//     headline = significant
//       ? `Variant ${leader?.label} is outperforming Control ${control?.label}`
//       : `Variant ${leader?.label ?? ""} is currently ahead, but the result isn't statistically significant yet`;
//   } else if ("overall_p_value" in statistics) {
//     significant = !!statistics.overall_significant;
//     const bestPair = (statistics.pairwise_vs_control || []).reduce(
//       (b, p) => (!b || (p.lift_pct ?? -Infinity) > (b.lift_pct ?? -Infinity) ? p : b),
//       null
//     );
//     liftPct = bestPair?.lift_pct ?? null;
//     confidenceLabel = null;
//     pValueLabel = statistics.overall_p_value < 0.000001 ? "p < 0.000001" : `p = ${statistics.overall_p_value}`;
//     headline = significant
//       ? `Variant ${bestPair?.label} is outperforming Control ${statistics.control_label}`
//       : `Variant ${bestPair?.label ?? ""} is currently ahead, but the difference isn't statistically significant yet`;
//   } else {
//     return null;
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 16 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }}
//       transition={{ duration: 0.5 }}
//       className={`relative overflow-hidden rounded-2xl border p-5 md:p-6 ${
//         significant
//           ? isDark
//             ? "bg-gradient-to-br from-emerald-500/10 via-[#0D0E1A] to-[#0D0E1A] border-emerald-500/25"
//             : "bg-gradient-to-br from-emerald-50 via-white to-white border-emerald-200"
//           : isDark
//           ? "bg-gradient-to-br from-brand-violet/10 via-[#0D0E1A] to-[#0D0E1A] border-white/[0.08]"
//           : "bg-gradient-to-br from-violet-50 via-white to-white border-gray-200"
//       }`}
//     >
//       <div className="flex items-center gap-2 mb-3">
//         <span
//           className={`flex items-center justify-center w-6 h-6 rounded-lg ${
//             significant ? "bg-emerald-500/15 text-emerald-500" : "bg-brand-violet/15 text-brand-violet"
//           }`}
//         >
//           <Zap size={13} strokeWidth={2.5} />
//         </span>
//         <span className={`text-[11px] font-bold tracking-widest uppercase ${isDark ? "text-white/40" : "text-gray-400"}`}>
//           Experiment Signal
//         </span>
//       </div>

//       <p className={`font-display font-semibold text-base md:text-lg ${isDark ? "text-white" : "text-gray-900"}`}>
//         {headline}
//       </p>

//       <div className="flex flex-wrap gap-x-8 gap-y-3 mt-5">
//         {liftPct !== null && (
//           <div>
//             <p className={`text-2xl font-display font-bold tabular-nums ${liftPct >= 0 ? "text-emerald-500" : "text-red-400"}`}>
//               {liftPct >= 0 ? "+" : ""}
//               {liftPct.toFixed(1)}%
//             </p>
//             <p className={`text-[10px] font-semibold tracking-wider uppercase mt-0.5 ${isDark ? "text-white/30" : "text-gray-400"}`}>
//               Relative lift
//             </p>
//           </div>
//         )}
//         {confidenceLabel && (
//           <div>
//             <p className={`text-2xl font-display font-bold tabular-nums ${isDark ? "text-white" : "text-gray-900"}`}>
//               {confidenceLabel}
//             </p>
//             <p className={`text-[10px] font-semibold tracking-wider uppercase mt-0.5 ${isDark ? "text-white/30" : "text-gray-400"}`}>
//               Confidence
//             </p>
//           </div>
//         )}
//         <div>
//           <p className={`text-2xl font-display font-bold tabular-nums ${isDark ? "text-white" : "text-gray-900"}`}>
//             {pValueLabel}
//           </p>
//           <p className={`text-[10px] font-semibold tracking-wider uppercase mt-0.5 ${isDark ? "text-white/30" : "text-gray-400"}`}>
//             P-value
//           </p>
//         </div>
//       </div>
//     </motion.div>
//   );
// }








































import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function ExperimentSignal({ statistics, variants, isDark }) {
  if (!statistics || statistics.error || !variants?.length) return null;

  const control = variants.find((v) => v.label === "A") || variants[0];
  let significant, headline, liftPct, confidenceLabel, pValueLabel;

  if ("z_score" in statistics) {
    significant = !!statistics.is_significant;
    const winner = variants.find((v) => v.label === statistics.winner);
    const leader = winner || variants.reduce((b, v) => (!b || v.conversion_rate > b.conversion_rate ? v : b), null);
    liftPct = statistics.relative_lift_pct ?? null;
    confidenceLabel = statistics.achieved_power != null ? `${Math.round(statistics.achieved_power * 100)}% power` : null;
    pValueLabel = statistics.p_value < 0.000001 ? "p < 0.000001" : `p = ${statistics.p_value}`;
    headline = significant
      ? `Variant ${leader?.label} is outperforming Control ${control?.label}`
      : `Variant ${leader?.label ?? ""} is currently ahead, but the result isn't statistically significant yet`;
  } else if ("overall_p_value" in statistics) {
    significant = !!statistics.overall_significant;
    const bestPair = (statistics.pairwise_vs_control || []).reduce(
      (b, p) => (!b || (p.lift_pct ?? -Infinity) > (b.lift_pct ?? -Infinity) ? p : b),
      null
    );
    liftPct = bestPair?.lift_pct ?? null;
    confidenceLabel = null;
    pValueLabel = statistics.overall_p_value < 0.000001 ? "p < 0.000001" : `p = ${statistics.overall_p_value}`;
    headline = significant
      ? `Variant ${bestPair?.label} is outperforming Control ${statistics.control_label}`
      : `Variant ${bestPair?.label ?? ""} is currently ahead, but the difference isn't statistically significant yet`;
  } else {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-2xl border p-5 md:p-6 ${
        significant
          ? isDark
            ? "bg-gradient-to-br from-emerald-500/10 via-[#0D0E1A] to-[#0D0E1A] border-emerald-500/25"
            : "bg-gradient-to-br from-emerald-50 via-white to-white border-emerald-200"
          : isDark
          ? "bg-gradient-to-br from-brand-violet/10 via-[#0D0E1A] to-[#0D0E1A] border-white/[0.08]"
          : "bg-gradient-to-br from-violet-50 via-white to-white border-gray-200"
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`flex items-center justify-center w-6 h-6 rounded-lg ${
            significant ? "bg-emerald-500/15 text-emerald-500" : "bg-brand-violet/15 text-brand-violet"
          }`}
        >
          <Zap size={13} strokeWidth={2.5} />
        </span>
        <span className={`text-[11px] font-bold tracking-widest uppercase ${isDark ? "text-white/40" : "text-gray-400"}`}>
          Experiment Signal
        </span>
      </div>

      <p className={`font-display font-semibold text-base md:text-lg ${isDark ? "text-white" : "text-gray-900"}`}>
        {headline}
      </p>

      <div className="flex flex-wrap gap-x-8 gap-y-3 mt-5">
        {liftPct !== null && (
          <div>
            <p className={`text-2xl font-display font-bold tabular-nums ${liftPct >= 0 ? "text-emerald-500" : "text-red-400"}`}>
              {liftPct >= 0 ? "+" : ""}
              {liftPct.toFixed(1)}%
            </p>
            <p className={`text-[10px] font-semibold tracking-wider uppercase mt-0.5 ${isDark ? "text-white/30" : "text-gray-400"}`}>
              Relative lift
            </p>
          </div>
        )}
        {confidenceLabel && (
          <div>
            <p className={`text-2xl font-display font-bold tabular-nums ${isDark ? "text-white" : "text-gray-900"}`}>
              {confidenceLabel}
            </p>
            <p className={`text-[10px] font-semibold tracking-wider uppercase mt-0.5 ${isDark ? "text-white/30" : "text-gray-400"}`}>
              Power
            </p>
          </div>
        )}
        <div>
          <p className={`text-2xl font-display font-bold tabular-nums ${isDark ? "text-white" : "text-gray-900"}`}>
            {pValueLabel}
          </p>
          <p className={`text-[10px] font-semibold tracking-wider uppercase mt-0.5 ${isDark ? "text-white/30" : "text-gray-400"}`}>
            P-value
          </p>
        </div>
      </div>
    </motion.div>
  );
}