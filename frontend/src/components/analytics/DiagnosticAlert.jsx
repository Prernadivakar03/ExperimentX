import { motion } from "framer-motion";
import { AlertTriangle, Clock3 } from "lucide-react";

const THEMES = {
  danger: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400", Icon: AlertTriangle },
  warning: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-500", Icon: AlertTriangle },
  info: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", Icon: Clock3 },
};

export default function DiagnosticAlert({ severity = "warning", title, message, meta, isDark }) {
  const t = THEMES[severity] || THEMES.info;
  const Icon = t.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`p-4 md:p-5 rounded-2xl border ${t.bg} ${t.border}`}
    >
      <div className="flex items-start gap-3">
        <span className={`flex items-center justify-center w-8 h-8 rounded-xl shrink-0 ${t.bg} ${t.text}`}>
          <Icon size={16} strokeWidth={2.25} />
        </span>
        <div>
          <p className={`text-sm font-display font-semibold ${t.text}`}>{title}</p>
          <p className={`text-xs mt-1 ${isDark ? "text-white/55" : "text-gray-600"}`}>{message}</p>
          {meta && <p className={`text-[11px] mt-1.5 ${isDark ? "text-white/30" : "text-gray-400"}`}>{meta}</p>}
        </div>
      </div>
    </motion.div>
  );
}