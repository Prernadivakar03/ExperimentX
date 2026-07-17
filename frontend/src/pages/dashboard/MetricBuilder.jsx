import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";
import { SkeletonCard } from "../../components/Skeleton";

const METRIC_TYPES = [
  { value: "conversion_rate", label: "Conversion Rate", hint: "Uses your existing conversion tracking — no extra fields needed" },
  { value: "count", label: "Event Count", hint: "Counts how many times an event type fired" },
  { value: "sum", label: "Sum (e.g. Revenue)", hint: "Sums the numeric value on an event type" },
  { value: "average", label: "Average (e.g. AOV)", hint: "Average value per event, e.g. average order value" },
  { value: "ratio", label: "Ratio (e.g. CTR)", hint: "One event type divided by another" },
  { value: "custom_formula", label: "Custom Formula", hint: "Arithmetic over visitors, conversions, event_count, event_sum" },
];

function CreateMetricModal({ onClose, onCreated, isDark }) {
  const [form, setForm] = useState({
    key: "", name: "", description: "", metric_type: "conversion_rate",
    event_type: "", numerator_event_type: "", denominator_event_type: "",
    formula: "", is_guardrail: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputCls = `w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-violet/25 transition-all ${
    isDark
      ? "bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-brand-violet/50"
      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-brand-violet"
  }`;
  const labelCls = `block text-xs font-medium mb-1.5 ${isDark ? "text-white/45" : "text-gray-600"}`;

  const slugify = (v) => v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

  const handleSubmit = async () => {
    if (!form.name) { setError("Metric name is required"); return; }
    const key = form.key || slugify(form.name);
    setLoading(true);
    setError("");
    try {
      await api.post("/metrics/", { ...form, key });
      toast.success("Metric created");
      onCreated();
      onClose();
    } catch (err) {
      const d = err.response?.data?.detail;
      setError(Array.isArray(d) ? d.map((x) => x.msg || JSON.stringify(x)).join(", ") : d || "Failed to create metric");
    } finally {
      setLoading(false);
    }
  };

  const selectedType = METRIC_TYPES.find((t) => t.value === form.metric_type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        className={`relative z-10 w-full max-w-lg rounded-2xl border max-h-[85vh] overflow-y-auto ${
          isDark ? "bg-[#0D0E1A] border-white/[0.08]" : "bg-white border-gray-200 shadow-2xl"
        }`}
      >
        <div className={`flex items-center justify-between px-6 py-4 border-b sticky top-0 backdrop-blur-md ${
          isDark ? "border-white/[0.06] bg-[#0D0E1A]/90" : "border-gray-100 bg-white/90"
        }`}>
          <h2 className={`font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>New metric</h2>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${
            isDark ? "text-white/30 hover:text-white hover:bg-white/[0.05]" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className={labelCls}>Metric name *</label>
            <input className={inputCls} value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Revenue per Visitor" />
          </div>

          <div>
            <label className={labelCls}>Metric type</label>
            <select className={inputCls} value={form.metric_type}
              onChange={(e) => setForm({ ...form, metric_type: e.target.value })}>
              {METRIC_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            {selectedType && (
              <p className={`text-[11px] mt-1.5 ${isDark ? "text-white/30" : "text-gray-400"}`}>{selectedType.hint}</p>
            )}
          </div>

          {["count", "sum", "average"].includes(form.metric_type) && (
            <div>
              <label className={labelCls}>Event type</label>
              <input className={inputCls} value={form.event_type}
                onChange={(e) => setForm({ ...form, event_type: e.target.value })}
                placeholder="e.g. purchase" />
            </div>
          )}

          {form.metric_type === "ratio" && (
            <>
              <div>
                <label className={labelCls}>Numerator event type</label>
                <input className={inputCls} value={form.numerator_event_type}
                  onChange={(e) => setForm({ ...form, numerator_event_type: e.target.value })}
                  placeholder="e.g. button_click" />
              </div>
              <div>
                <label className={labelCls}>Denominator event type</label>
                <input className={inputCls} value={form.denominator_event_type}
                  onChange={(e) => setForm({ ...form, denominator_event_type: e.target.value })}
                  placeholder="e.g. page_view" />
              </div>
            </>
          )}

          {form.metric_type === "custom_formula" && (
            <div>
              <label className={labelCls}>Formula</label>
              <input className={`${inputCls} font-mono`} value={form.formula}
                onChange={(e) => setForm({ ...form, formula: e.target.value })}
                placeholder="event_sum / visitors * 100" />
              <p className={`text-[11px] mt-1.5 ${isDark ? "text-white/30" : "text-gray-400"}`}>
                Available: visitors, conversions, event_count, event_sum. Only + − × ÷ allowed.
              </p>
            </div>
          )}

          <div>
            <label className={labelCls}>Description</label>
            <textarea className={`${inputCls} resize-none`} rows={2} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What does this metric measure?" />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={form.is_guardrail}
              onChange={(e) => setForm({ ...form, is_guardrail: e.target.checked })}
              className="w-4 h-4 rounded accent-brand-violet" />
            <span className={`text-sm ${isDark ? "text-white/60" : "text-gray-600"}`}>
              Mark as guardrail metric
            </span>
          </label>

          {error && (
            <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl text-sm border transition-colors ${
                isDark ? "border-white/[0.08] text-white/45 hover:text-white/70" : "border-gray-200 text-gray-500 hover:text-gray-700"
              }`}>
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm text-white font-medium
                         bg-gradient-to-r from-brand-violet to-brand-blue disabled:opacity-60
                         hover:opacity-90 transition-opacity">
              {loading ? "Creating…" : "Create metric"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function EvaluatePanel({ metric, experiments, isDark, onClose }) {
  const [experimentId, setExperimentId] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const evaluate = async () => {
    if (!experimentId) return;
    setLoading(true);
    setResults(null);
    try {
      const r = await api.get(`/metrics/${metric.id}/evaluate/${experimentId}`);
      setResults(r.data);
    } catch {
      toast.error("Failed to evaluate metric — check the experiment has variants with visitors");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden"
    >
      <div className={`mt-3 pt-3 border-t space-y-3 ${isDark ? "border-white/[0.06]" : "border-gray-100"}`}>
        <div className="flex gap-2">
          <select value={experimentId} onChange={(e) => setExperimentId(e.target.value)}
            className={`flex-1 px-3 py-2 rounded-lg text-xs border ${
              isDark ? "bg-white/[0.04] border-white/[0.08] text-white" : "bg-white border-gray-200 text-gray-900"
            }`}>
            <option value="">Select an experiment…</option>
            {experiments.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <button onClick={evaluate} disabled={!experimentId || loading}
            className="px-3 py-2 rounded-lg text-xs font-medium text-white bg-brand-violet hover:opacity-90 disabled:opacity-40 transition-opacity">
            {loading ? "…" : "Evaluate"}
          </button>
        </div>

        {results && (
          <div className="grid grid-cols-2 gap-2">
            {results.map((r) => (
              <div key={r.variant_label} className={`px-3 py-2 rounded-lg ${isDark ? "bg-white/[0.03]" : "bg-gray-50"}`}>
                <p className={`text-[10px] ${isDark ? "text-white/35" : "text-gray-400"}`}>Variant {r.variant_label}</p>
                <p className={`text-sm font-semibold ${isDark ? "text-white/85" : "text-gray-900"}`}>{r.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function MetricBuilder() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [metrics, setMetrics] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const load = async () => {
    try {
      const [metricsRes, experimentsRes] = await Promise.all([
        api.get("/metrics/"),
        api.get("/experiments/"),
      ]);
      setMetrics(metricsRes.data);
      setExperiments(experimentsRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const deleteMetric = async (id) => {
    if (!confirm("Delete this metric?")) return;
    try {
      await api.delete(`/metrics/${id}`);
      toast.success("Metric deleted");
      load();
    } catch {
      toast.error("Failed to delete metric");
    }
  };

  const cardCls = `rounded-2xl border p-5 transition-colors ${
    isDark ? "bg-[#0D0E1A] border-white/[0.07] hover:border-white/[0.12]" : "bg-white border-gray-200 shadow-sm hover:border-gray-300"
  }`;

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className={`h-6 w-36 rounded-lg animate-pulse ${isDark ? "bg-white/[0.06]" : "bg-gray-200"}`} />
          <div className={`h-9 w-36 rounded-xl animate-pulse ${isDark ? "bg-white/[0.06]" : "bg-gray-200"}`} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`text-xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Metrics</h1>
          <p className={`text-sm mt-0.5 ${isDark ? "text-white/35" : "text-gray-500"}`}>
            {metrics.length} custom metric{metrics.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white font-medium
                     bg-gradient-to-r from-brand-violet to-brand-blue hover:opacity-90 transition-opacity
                     shadow-[0_0_20px_rgba(108,92,231,0.3)]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M12 4v16m8-8H4" />
          </svg>
          New metric
        </button>
      </div>

      {metrics.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed ${
          isDark ? "border-white/[0.07]" : "border-gray-200"
        }`}>
          <p className={`text-sm ${isDark ? "text-white/30" : "text-gray-400"}`}>No custom metrics yet</p>
          <button onClick={() => setShowCreate(true)} className="mt-3 text-sm text-brand-violet hover:underline">
            Create your first metric →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((m, i) => (
            <motion.div key={m.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cardCls}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <p className={`font-medium ${isDark ? "text-white/85" : "text-gray-900"}`}>{m.name}</p>
                    {m.is_guardrail && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500">
                        GUARDRAIL
                      </span>
                    )}
                  </div>
                  <code className={`text-[11px] ${isDark ? "text-white/30" : "text-gray-400"}`}>{m.key}</code>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full flex-shrink-0 ${
                  isDark ? "bg-white/[0.05] text-white/40" : "bg-gray-100 text-gray-500"
                }`}>
                  {METRIC_TYPES.find((t) => t.value === m.metric_type)?.label || m.metric_type}
                </span>
              </div>

              {m.description && (
                <p className={`text-xs mb-3 ${isDark ? "text-white/40" : "text-gray-500"}`}>{m.description}</p>
              )}

              {/* Fixed: use template literal for className with dynamic part */}
              <div className={`flex items-center justify-between pt-3 border-t ${isDark ? 'border-white/[0.05]' : 'border-gray-100'}`}>
                <button onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}
                  className="text-xs text-brand-violet hover:underline">
                  {expandedId === m.id ? "Hide evaluation" : "Evaluate on an experiment →"}
                </button>
                <button onClick={() => deleteMetric(m.id)}
                  className={`px-2 py-1 rounded-lg text-xs transition-colors ${
                    isDark ? "text-white/20 hover:text-red-400 hover:bg-red-400/10" : "text-gray-300 hover:text-red-500 hover:bg-red-50"
                  }`}>
                  Delete
                </button>
              </div>

              <AnimatePresence>
                {expandedId === m.id && (
                  <EvaluatePanel metric={m} experiments={experiments} isDark={isDark} onClose={() => setExpandedId(null)} />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showCreate && <CreateMetricModal onClose={() => setShowCreate(false)} onCreated={load} isDark={isDark} />}
      </AnimatePresence>
    </div>
  );
}