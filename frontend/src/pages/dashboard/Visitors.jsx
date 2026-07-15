import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import api from "../../services/api";
import { SkeletonTable } from "../../components/Skeleton";

export default function Visitors() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [experiments, setExperiments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get("/experiments/").then((r) => {
      setExperiments(r.data);
      if (r.data.length > 0) setSelected(r.data[0]);
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    api.get(`/analytics/${selected.id}/visitors?page=${page}&limit=20`)
      .then((r) => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [selected, page]);

  const cardCls = `rounded-2xl border overflow-hidden transition-colors ${
    isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"
  }`;
  const thCls = `text-left px-5 py-3 text-xs font-medium ${isDark ? "text-white/25" : "text-gray-400"}`;
  const tdCls = `px-5 py-3.5 text-sm`;
  const rowCls = `border-b last:border-0 transition-colors ${
    isDark ? "border-white/[0.04] hover:bg-white/[0.02]" : "border-gray-50 hover:bg-gray-50/50"
  }`;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`text-xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Visitors
          </h1>
          <p className={`text-sm mt-0.5 ${isDark ? "text-white/35" : "text-gray-500"}`}>
            Every visitor assigned to a variant
          </p>
        </div>
        {experiments.length > 0 && (
          <select
            value={selected?.id || ""}
            onChange={(e) => {
              setSelected(experiments.find((x) => x.id === e.target.value));
              setPage(1);
            }}
            className={`px-3.5 py-2 rounded-xl text-sm border focus:outline-none ${
              isDark
                ? "bg-white/[0.04] border-white/[0.08] text-white"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            {experiments.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Summary pills */}
      {data && (
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Total visitors", value: data.total },
            { label: "Page", value: `${data.page} of ${data.pages}` },
            { label: "Converted", value: `${data.visitors.filter(v => v.converted).length} shown` },
          ].map((s) => (
            <div key={s.label} className={`px-4 py-2 rounded-xl border text-sm ${
              isDark ? "bg-white/[0.03] border-white/[0.07]" : "bg-white border-gray-200"
            }`}>
              <span className={`${isDark ? "text-white/35" : "text-gray-400"}`}>{s.label}: </span>
              <span className={`font-semibold ${isDark ? "text-white/80" : "text-gray-800"}`}>{s.value}</span>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <SkeletonTable />
      ) : !data || data.visitors.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed ${
          isDark ? "border-white/[0.07]" : "border-gray-200"
        }`}>
          <p className={`text-sm ${isDark ? "text-white/30" : "text-gray-400"}`}>
            {experiments.length === 0
              ? "Create and start an experiment first"
              : "No visitors yet — start the experiment and integrate the SDK"}
          </p>
        </div>
      ) : (
        <>
          <div className={cardCls}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDark ? "border-white/[0.05]" : "border-gray-100"}`}>
                    <th className={thCls}>Fingerprint</th>
                    <th className={thCls}>Variant</th>
                    <th className={thCls}>Events</th>
                    <th className={thCls}>Converted</th>
                    <th className={thCls}>Assigned</th>
                  </tr>
                </thead>
                <tbody>
                  {data.visitors.map((v, i) => (
                    <motion.tr
                      key={v.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className={rowCls}
                    >
                      <td className={`${tdCls} font-mono text-xs ${isDark ? "text-white/45" : "text-gray-500"}`}>
                        {v.fingerprint}
                      </td>
                      <td className={tdCls}>
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold ${
                            v.variant === "A" ? "bg-brand-violet" : "bg-brand-blue"
                          }`}>
                            {v.variant}
                          </div>
                          <span className={`text-xs ${isDark ? "text-white/55" : "text-gray-600"}`}>
                            {v.variant_name}
                          </span>
                        </div>
                      </td>
                      <td className={`${tdCls} ${isDark ? "text-white/55" : "text-gray-600"}`}>
                        {v.events}
                      </td>
                      <td className={tdCls}>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          v.converted
                            ? "bg-emerald-500/10 text-emerald-500"
                            : isDark ? "bg-white/[0.05] text-white/25" : "bg-gray-100 text-gray-400"
                        }`}>
                          {v.converted ? "✓ Yes" : "No"}
                        </span>
                      </td>
                      <td className={`${tdCls} text-xs ${isDark ? "text-white/25" : "text-gray-400"}`}>
                        {new Date(v.created_at).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                        })}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {data.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className={`px-4 py-2 rounded-xl text-sm border transition-colors disabled:opacity-40 ${
                  isDark
                    ? "border-white/[0.08] text-white/50 hover:text-white hover:border-white/20"
                    : "border-gray-200 text-gray-500 hover:text-gray-900"
                }`}
              >
                ← Previous
              </button>
              <span className={`text-sm ${isDark ? "text-white/30" : "text-gray-400"}`}>
                Page {page} of {data.pages}
              </span>
              <button
                disabled={page === data.pages}
                onClick={() => setPage((p) => p + 1)}
                className={`px-4 py-2 rounded-xl text-sm border transition-colors disabled:opacity-40 ${
                  isDark
                    ? "border-white/[0.08] text-white/50 hover:text-white hover:border-white/20"
                    : "border-gray-200 text-gray-500 hover:text-gray-900"
                }`}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}