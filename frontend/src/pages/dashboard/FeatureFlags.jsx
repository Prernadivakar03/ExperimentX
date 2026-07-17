import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";
import { SkeletonCard } from "../../components/Skeleton";

function CreateFlagModal({ onClose, onCreated, isDark }) {
  const [form, setForm] = useState({
    key: "", name: "", description: "", rollout_percentage: 0, is_enabled: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputCls = `w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-violet/25 transition-all ${
    isDark
      ? "bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-brand-violet/50"
      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-brand-violet"
  }`;
  const labelCls = `block text-xs font-medium mb-1.5 ${isDark ? "text-white/45" : "text-gray-600"}`;

  const slugify = (v) => v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const handleSubmit = async () => {
    if (!form.name) { setError("Flag name is required"); return; }
    const key = form.key || slugify(form.name);
    if (!key) { setError("Couldn't derive a valid key — try a different name"); return; }

    setLoading(true);
    setError("");
    try {
      await api.post("/flags/", { ...form, key });
      toast.success("Flag created");
      onCreated();
      onClose();
    } catch (err) {
      const d = err.response?.data?.detail;
      setError(Array.isArray(d) ? d.map((x) => x.msg).join(", ") : d || "Failed to create flag");
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
        className={`relative z-10 w-full max-w-md rounded-2xl border ${
          isDark ? "bg-[#0D0E1A] border-white/[0.08]" : "bg-white border-gray-200 shadow-2xl"
        }`}
      >
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? "border-white/[0.06]" : "border-gray-100"
        }`}>
          <h2 className={`font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>New feature flag</h2>
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
            <label className={labelCls}>Flag name *</label>
            <input className={inputCls} value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. New Checkout Flow" />
          </div>
          <div>
            <label className={labelCls}>Key (auto-generated if left blank)</label>
            <input className={inputCls} value={form.key}
              onChange={(e) => setForm({ ...form, key: e.target.value })}
              placeholder="new-checkout-flow" />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea className={`${inputCls} resize-none`} rows={2} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What does this flag control?" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelCls}>Initial rollout</label>
              <span className={`text-xs font-medium ${isDark ? "text-white/60" : "text-gray-600"}`}>
                {form.rollout_percentage}%
              </span>
            </div>
            <input type="range" min={0} max={100} value={form.rollout_percentage}
              onChange={(e) => setForm({ ...form, rollout_percentage: Number(e.target.value) })}
              className="w-full accent-brand-violet" />
          </div>

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
              {loading ? "Creating…" : "Create flag"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function FeatureFlags() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const load = async () => {
    try {
      const r = await api.get("/flags/");
      setFlags(r.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleEnabled = async (flag) => {
    try {
      await api.patch(`/flags/${flag.id}`, { is_enabled: !flag.is_enabled });
      toast.success(flag.is_enabled ? "Flag disabled" : "Flag enabled");
      load();
    } catch {
      toast.error("Failed to update flag");
    }
  };

  const updateRollout = async (flag, newPct) => {
    try {
      await api.patch(`/flags/${flag.id}`, { rollout_percentage: newPct });
      load();
    } catch {
      toast.error("Failed to update rollout");
    }
  };

  const deleteFlag = async (id) => {
    if (!confirm("Delete this flag? Any SDK calls referencing it will default to off.")) return;
    try {
      await api.delete(`/flags/${id}`);
      toast.success("Flag deleted");
      load();
    } catch {
      toast.error("Failed to delete flag");
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
          <h1 className={`text-xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Feature Flags</h1>
          <p className={`text-sm mt-0.5 ${isDark ? "text-white/35" : "text-gray-500"}`}>
            {flags.length} total · {flags.filter((f) => f.is_enabled).length} enabled
          </p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white font-medium
                     bg-gradient-to-r from-brand-violet to-brand-blue hover:opacity-90 transition-opacity
                     shadow-[0_0_20px_rgba(108,92,231,0.3)]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M12 4v16m8-8H4" />
          </svg>
          New flag
        </button>
      </div>

      {flags.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed ${
          isDark ? "border-white/[0.07]" : "border-gray-200"
        }`}>
          <svg className={`w-10 h-10 mb-3 ${isDark ? "text-white/15" : "text-gray-300"}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M3 3l18 18M10.5 10.677V6a1.5 1.5 0 013 0v4.5m-3 0h3m-3 0L6 21m4.5-10.323L18 21" />
          </svg>
          <p className={`text-sm ${isDark ? "text-white/30" : "text-gray-400"}`}>No feature flags yet</p>
          <button onClick={() => setShowCreate(true)} className="mt-3 text-sm text-brand-violet hover:underline">
            Create your first flag →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flags.map((f, i) => (
            <motion.div key={f.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cardCls}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className={`font-medium ${isDark ? "text-white/85" : "text-gray-900"}`}>{f.name}</p>
                  <code className={`text-[11px] ${isDark ? "text-white/30" : "text-gray-400"}`}>{f.key}</code>
                </div>
                <button
                  onClick={() => toggleEnabled(f)}
                  className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ${
                    f.is_enabled ? "bg-emerald-500" : isDark ? "bg-white/[0.12]" : "bg-gray-300"
                  }`}
                  style={{ height: 22 }}
                  title={f.is_enabled ? "Enabled (kill switch on)" : "Disabled (kill switch off)"}
                >
                  <motion.div
                    className="absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow"
                    style={{ width: 18, height: 18 }}
                    animate={{ left: f.is_enabled ? 20 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {f.description && (
                <p className={`text-xs mb-4 ${isDark ? "text-white/40" : "text-gray-500"}`}>{f.description}</p>
              )}

              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs ${isDark ? "text-white/40" : "text-gray-500"}`}>Rollout</span>
                  <span className={`text-xs font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>
                    {f.rollout_percentage}%
                  </span>
                </div>
                <input type="range" min={0} max={100} value={f.rollout_percentage}
                  onChange={(e) => updateRollout(f, Number(e.target.value))}
                  disabled={!f.is_enabled}
                  className="w-full accent-brand-violet disabled:opacity-40" />
                {!f.is_enabled && (
                  <p className={`text-[10px] mt-1 ${isDark ? "text-white/25" : "text-gray-400"}`}>
                    Enable the flag to adjust rollout
                  </p>
                )}
              </div>

              <div className={`flex justify-end pt-3 border-t ${isDark ? "border-white/[0.05]" : "border-gray-100"}`}>
                <button onClick={() => deleteFlag(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    isDark ? "text-white/20 hover:text-red-400 hover:bg-red-400/10" : "text-gray-300 hover:text-red-500 hover:bg-red-50"
                  }`}>
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showCreate && <CreateFlagModal onClose={() => setShowCreate(false)} onCreated={load} isDark={isDark} />}
      </AnimatePresence>
    </div>
  );
}