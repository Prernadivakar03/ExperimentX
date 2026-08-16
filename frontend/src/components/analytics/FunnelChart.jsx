import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

// Visitors → Clicks → Conversions. Each stage is a subset of the one above it,
// so widths are always monotonically non-increasing — that's what makes this a
// real funnel rather than three unrelated bars.
export default function FunnelChart({ summary, isDark }) {
  if (!summary) return null;

  const stages = [
    { label: "Visitors", value: Number(summary.total_visitors) || 0, color: "#6C5CE7" },
    { label: "Clicks", value: Number(summary.total_clicks) || 0, color: "#4F8CFF" },
    { label: "Conversions", value: Number(summary.total_conversions) || 0, color: "#10B981" },
  ];

  const base = stages[0].value || 1;

  return (
    <div className="space-y-3">
      {stages.map((s, i) => {
        const pct = Math.max((s.value / base) * 100, 4);
        const prev = i > 0 ? stages[i - 1].value : null;
        const stepPct = prev ? ((s.value / prev) * 100).toFixed(1) : null;

        return (
          <div key={s.label}>
            {i > 0 && (
              <div className="flex items-center gap-1.5 pl-1 py-1">
                <ArrowDown size={12} className={isDark ? "text-white/20" : "text-gray-300"} />
                <span className={`text-[11px] font-semibold ${isDark ? "text-white/30" : "text-gray-400"}`}>
                  {stepPct}% continued
                </span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <span className={`w-24 shrink-0 text-xs font-semibold ${isDark ? "text-white/60" : "text-gray-600"}`}>
                {s.label}
              </span>
              <div className={`flex-1 h-9 rounded-lg overflow-hidden ${isDark ? "bg-white/[0.04]" : "bg-gray-100"}`}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: i * 0.12, ease: "easeOut" }}
                  className="h-full rounded-lg flex items-center justify-end px-3"
                  style={{ background: `linear-gradient(90deg, ${s.color}33, ${s.color})` }}
                >
                  <span className="text-xs font-display font-bold text-white tabular-nums drop-shadow">
                    {s.value.toLocaleString()}
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}