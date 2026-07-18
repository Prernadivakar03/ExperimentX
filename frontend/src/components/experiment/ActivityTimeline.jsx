import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";

const ACTION_ICONS = {
  "experiment.created": "✨",
  "experiment.status_changed": "🔄",
  default: "•",
};

export default function ActivityTimeline({ experimentId, isDark }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/experiments/${experimentId}/timeline`)
      .then((r) => setLogs(r.data))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, [experimentId]);

  const cardCls = `rounded-2xl border p-5 ${isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"}`;

  if (loading) {
    return <div className={`${cardCls} h-32 animate-pulse`} />;
  }

  if (logs.length === 0) {
    return (
      <div className={cardCls}>
        <p className={`text-sm ${isDark ? "text-white/30" : "text-gray-400"}`}>No activity recorded yet.</p>
      </div>
    );
  }

  return (
    <div className={cardCls}>
      <p className={`text-sm font-semibold mb-4 ${isDark ? "text-white/85" : "text-gray-900"}`}>Activity timeline</p>
      <div className="space-y-3">
        {logs.map((log, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-start gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
              isDark ? "bg-white/[0.05]" : "bg-gray-100"
            }`}>
              {ACTION_ICONS[log.action] || ACTION_ICONS.default}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>
                {log.action.replace(/\./g, " → ").replace(/_/g, " ")}
              </p>
              {log.details && (
                <p className={`text-[11px] mt-0.5 ${isDark ? "text-white/30" : "text-gray-400"}`}>
                  {Object.entries(log.details).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                </p>
              )}
              <p className={`text-[10px] mt-0.5 ${isDark ? "text-white/20" : "text-gray-300"}`}>
                {new Date(log.timestamp).toLocaleString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}