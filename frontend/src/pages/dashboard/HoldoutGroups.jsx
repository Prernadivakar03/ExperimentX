// frontend/src/pages/dashboard/HoldoutGroups.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";
import { usePermission } from "../../hooks/usePermission";
import {
  listHoldoutGroups, createHoldoutGroup, updateHoldoutGroup, getHoldoutImpact,
} from "../../api/holdout";

function CreateHoldoutModal({ onClose, onCreated, isDark, hasActiveGroup }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [percentage, setPercentage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputCls = `w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-violet/25 transition-all ${
    isDark
      ? "bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-brand-violet/50"
      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-brand-violet"
  }`;
  const labelCls = `block text-xs font-medium mb-1.5 ${isDark ? "text-white/45" : "text-gray-600"}`;

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (percentage < 1 || percentage > 50) {
      setError("Percentage must be between 1 and 50");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await createHoldoutGroup({ name, description, percentage, is_active: true });
      toast.success("Holdout group created");
      onCreated();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to create holdout group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={`w-full max-w-sm rounded-2xl border p-6 ${
          isDark ? "bg-[#0D0E1A] border-white/[0.08]" : "bg-white border-gray-200"
        }`}
      >
        <h2 className={`font-display font-bold text-lg mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
          New holdout group
        </h2>
        <p className={`text-xs mb-4 ${isDark ? "text-white/35" : "text-gray-500"}`}>
          A slice of traffic permanently excluded from all experiments, used to
          measure your experimentation program's overall impact.
        </p>

        {hasActiveGroup && (
          <p className="text-xs text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-lg mb-4">
            You already have an active holdout group. Creating a new one won't work
            until the existing one is deactivated — only one active holdout at a
            time keeps the bucket math consistent.
          </p>
        )}

        <label className={labelCls}>Name</label>
        <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Q3 experimentation impact" />

        <label className={`${labelCls} mt-4`}>Description (optional)</label>
        <input className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="Why this holdout exists" />

        <label className={`${labelCls} mt-4`}>Percentage of traffic to hold out</label>
        <div className="flex items-center gap-3">
          <input
            type="range" min="1" max="50" value={percentage}
            onChange={(e) => setPercentage(Number(e.target.value))}
            className="flex-1 accent-brand-violet"
          />
          <span className={`text-sm font-mono w-12 text-right ${isDark ? "text-white/70" : "text-gray-700"}`}>
            {percentage}%
          </span>
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-lg mt-4">
            {error}
          </p>
        )}

        <div className="flex gap-3 mt-6">
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
            {loading ? "Creating…" : "Create holdout group"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ImpactPanel({ groupId, isDark }) {
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHoldoutImpact(groupId)
      .then((r) => setImpact(r.data))
      .catch(() => setImpact(null))
      .finally(() => setLoading(false));
  }, [groupId]);

  if (loading) {
    return <p className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>Loading impact…</p>;
  }
  if (!impact) {
    return <p className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>Could not load impact data.</p>;
  }

  const liftPositive = (impact.estimated_lift_pct ?? 0) >= 0;

  return (
    <div className={`mt-3 pt-3 border-t grid grid-cols-2 gap-4 ${isDark ? "border-white/[0.05]" : "border-gray-100"}`}>
      <div>
        <p className={`text-[10px] uppercase tracking-wide ${isDark ? "text-white/30" : "text-gray-400"}`}>Holdout</p>
        <p className={`text-lg font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          {impact.holdout_conversion_rate}%
        </p>
        <p className={`text-[11px] ${isDark ? "text-white/30" : "text-gray-400"}`}>
          {impact.holdout_conversions} / {impact.holdout_visitors} visitors
        </p>
      </div>
      <div>
        <p className={`text-[10px] uppercase tracking-wide ${isDark ? "text-white/30" : "text-gray-400"}`}>Baseline (in experiments)</p>
        <p className={`text-lg font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          {impact.baseline_conversion_rate}%
        </p>
        <p className={`text-[11px] ${isDark ? "text-white/30" : "text-gray-400"}`}>
          {impact.baseline_conversions} / {impact.baseline_visitors} visitors
        </p>
      </div>
      {impact.estimated_lift_pct !== null && (
        <div className="col-span-2">
          <p className={`text-xs font-medium ${liftPositive ? "text-emerald-500" : "text-red-400"}`}>
            {liftPositive ? "+" : ""}{impact.estimated_lift_pct}% estimated program lift
          </p>
        </div>
      )}
      <p className={`col-span-2 text-[11px] leading-relaxed ${isDark ? "text-white/25" : "text-gray-400"}`}>
        {impact.note}
      </p>
    </div>
  );
}

export default function HoldoutGroups() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const canEdit = usePermission("editor");
  const canDelete = usePermission("admin");

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const load = async () => {
    try {
      const r = await listHoldoutGroups();
      setGroups(r.data);
    } catch (err) {
      console.error("Failed to load holdout groups:", err);
      toast.error("Could not load holdout groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (group) => {
    try {
      await updateHoldoutGroup(group.id, { is_active: !group.is_active });
      toast.success(group.is_active ? "Holdout deactivated" : "Holdout activated");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to update holdout group");
    }
  };

  const cardCls = `rounded-2xl border ${
    isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"
  }`;

  const hasActiveGroup = groups.some((g) => g.is_active);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`text-xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Holdout Groups
          </h1>
          <p className={`text-sm mt-0.5 ${isDark ? "text-white/35" : "text-gray-500"}`}>
            {groups.length} group{groups.length !== 1 ? "s" : ""}
          </p>
        </div>
        {canEdit && (
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white font-medium
                       bg-gradient-to-r from-brand-violet to-brand-blue hover:opacity-90 transition-opacity
                       shadow-[0_0_20px_rgba(108,92,231,0.3)]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M12 4v16m8-8H4" />
            </svg>
            New holdout group
          </button>
        )}
      </div>

      {loading ? (
        <div className={`${cardCls} p-8 text-center`}>
          <p className={isDark ? "text-white/30" : "text-gray-400"}>Loading…</p>
        </div>
      ) : groups.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed ${
          isDark ? "border-white/[0.07]" : "border-gray-200"
        }`}>
          <p className={`text-sm ${isDark ? "text-white/30" : "text-gray-400"}`}>No holdout groups yet</p>
          {canEdit && (
            <button onClick={() => setShowCreate(true)} className="mt-3 text-sm text-brand-violet hover:underline">
              Create your first holdout group →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((g) => (
            <div key={g.id} className={`${cardCls} p-5`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className={`font-medium ${isDark ? "text-white/85" : "text-gray-900"}`}>{g.name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      g.is_active ? "bg-emerald-500/15 text-emerald-500" : "bg-gray-400/15 text-gray-400"
                    }`}>
                      {g.is_active ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                  {g.description && (
                    <p className={`text-xs mt-1 ${isDark ? "text-white/40" : "text-gray-500"}`}>{g.description}</p>
                  )}
                  <p className={`text-xs mt-1 ${isDark ? "text-white/30" : "text-gray-400"}`}>
                    {g.percentage}% of all traffic
                  </p>
                </div>
                {canEdit && (
                  <button onClick={() => toggleActive(g)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                      isDark ? "border-white/10 text-white/50 hover:text-white" : "border-gray-200 text-gray-500 hover:text-gray-800"
                    }`}>
                    {g.is_active ? "Deactivate" : "Activate"}
                  </button>
                )}
              </div>

              <button
                onClick={() => setExpandedId(expandedId === g.id ? null : g.id)}
                className="text-xs text-brand-violet hover:underline mt-3"
              >
                {expandedId === g.id ? "Hide impact" : "View impact →"}
              </button>

              <AnimatePresence>
                {expandedId === g.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                    <ImpactPanel groupId={g.id} isDark={isDark} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showCreate && (
          <CreateHoldoutModal
            onClose={() => setShowCreate(false)}
            onCreated={load}
            isDark={isDark}
            hasActiveGroup={hasActiveGroup}
          />
        )}
      </AnimatePresence>
    </div>
  );
}