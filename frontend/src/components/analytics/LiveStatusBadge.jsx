import { motion } from "framer-motion";

const STATUS_MAP = {
  running: { label: "Live", color: "#22C58E" },
  paused: { label: "Paused", color: "#F5A623" },
  completed: { label: "Completed", color: "#8B7CFF" },
  draft: { label: "Collecting data", color: "#9A9AA8" },
};

export default function LiveStatusBadge({ status, isDark }) {
  const s = STATUS_MAP[status] || STATUS_MAP.draft;
  const pulsing = status === "running";

  return (
    <span className={`inline-flex items-center gap-2 text-xs font-semibold ${isDark ? "text-white/50" : "text-gray-500"}`}>
      <span className="relative flex h-1.5 w-1.5">
        {pulsing && (
          <motion.span
            className="absolute inline-flex h-full w-full rounded-full"
            style={{ background: s.color }}
            animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: s.color }} />
      </span>
      {s.label}
    </span>
  );
}