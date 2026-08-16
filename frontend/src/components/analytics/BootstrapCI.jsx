import { motion } from "framer-motion";

export default function BootstrapCI({ ci, isDark }) {
  if (!ci || ci.error) return null;

  const clamp = (n) => Math.max(0, Math.min(100, n));
  const left = clamp(50 + ci.ci_lower_pct);
  const right = clamp(50 - ci.ci_upper_pct);
  const meanPos = clamp(50 + ci.mean_lift_pct);
  const crossesZero = ci.ci_lower_pct < 0 && ci.ci_upper_pct > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`p-5 md:p-6 rounded-2xl border ${isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"}`}
    >
      <p className={`text-[11px] font-bold tracking-widest uppercase ${isDark ? "text-white/40" : "text-gray-400"}`}>
        Bootstrap Confidence Interval
      </p>
      <p className={`text-xs mt-1 mb-8 ${isDark ? "text-white/35" : "text-gray-500"}`}>
        Non-parametric — doesn't assume a normal distribution, more robust on small samples.
      </p>

      <div className="relative h-10">
        <div className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full ${isDark ? "bg-white/[0.06]" : "bg-gray-100"}`} />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-brand-violet/40"
          initial={{ left: "50%", right: "50%" }}
          whileInView={{ left: `${left}%`, right: `${right}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <div className={`absolute left-1/2 top-0 bottom-0 w-px ${isDark ? "bg-white/15" : "bg-gray-300"}`} />
        <motion.div
          className={`absolute top-1/2 w-4 h-4 rounded-full bg-brand-violet border-2 -translate-x-1/2 -translate-y-1/2 shadow-lg ${
            isDark ? "border-[#0D0E1A]" : "border-white"
          }`}
          initial={{ left: "50%" }}
          whileInView={{ left: `${meanPos}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </div>

      <div className="flex justify-between text-xs mt-2">
        <span className={isDark ? "text-white/30" : "text-gray-400"}>{ci.ci_lower_pct}%</span>
        <span className={`font-display font-semibold ${isDark ? "text-white/70" : "text-gray-700"}`}>
          mean lift: {ci.mean_lift_pct >= 0 ? "+" : ""}
          {ci.mean_lift_pct}%
        </span>
        <span className={isDark ? "text-white/30" : "text-gray-400"}>+{ci.ci_upper_pct}%</span>
      </div>

      <p className={`text-[11px] mt-3 ${isDark ? "text-white/25" : "text-gray-400"}`}>
        {ci.confidence_level * 100}% confidence interval over {ci.iterations?.toLocaleString()} resamples
        {crossesZero && " — interval crosses zero, so a real difference isn't confirmed yet"}
      </p>
    </motion.div>
  );
}