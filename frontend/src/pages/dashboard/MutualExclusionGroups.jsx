// frontend/src/pages/dashboard/MutualExclusionGroups.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";
import { usePermission } from "../../hooks/usePermission";
import api from "../../services/api";
import {
  listMutualExclusionGroups, createMutualExclusionGroup, deleteMutualExclusionGroup,
} from "../../api/mutualExclusion";

function CreateGroupModal({ experiments, onClose, onCreated, isDark }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rows, setRows] = useState([{ experiment_id: "", allocation_pct: 50 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputCls = `w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-violet/25 transition-all ${
    isDark
      ? "bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-brand-violet/50"
      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-brand-violet"
  }`;
  const labelCls = `block text-xs font-medium mb-1.5 ${isDark ? "text-white/45" : "text-gray-600"}`;

  const addRow = () => setRows([...rows, { experiment_id: "", allocation_pct: 0 }]);
  const removeRow = (i) => setRows(rows.filter((_, idx) => idx !== i));
  const updateRow = (i, field, value) => {
    const next = [...rows];
    next[i] = { ...next[i], [field]: value };
    setRows(next);
  };

  const total = rows.reduce((sum, r) => sum + (Number(r.allocation_pct) || 0), 0);
  const usedExperimentIds = rows.map((r) => r.experiment_id).filter(Boolean);
  const validRows = rows.filter((r) => r.experiment_id && r.allocation_pct > 0);

  const handleSubmit = async () => {
    if (!name.trim()) return setError("Name is required");
    if (validRows.length < 2) return setError("Add at least 2 experiments to the group");
    if (total > 100) return setError(`Total allocation is ${total}% — cannot exceed 100%`);

    setLoading(true);
    setError("");
    try {
      await createMutualExclusionGroup({
        name,
        description,
        memberships: validRows.map((r) => ({
          experiment_id: r.experiment_id,
          allocation_pct: Number(r.allocation_pct),
        })),
      });
      toast.success("Mutual exclusion group created");
      onCreated();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.detail?.[0]?.msg || err?.response?.data?.detail || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={`w-full max-w-md rounded-2xl border p-6 max-h-[85vh] overflow-y-auto ${
          isDark ? "bg-[#0D0E1A] border-white/[0.08]" : "bg-white border-gray-200"
        }`}
      >
        <h2 className={`font-display font-bold text-lg mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
          New mutual exclusion group
        </h2>
        <p className={`text-xs mb-4 ${isDark ? "text-white/35" : "text-gray-500"}`}>
          Reserves a slice of traffic for each experiment in the group so the same visitor
          never lands in two of them at once. Unallocated % sees none of them.
        </p>

        <label className={labelCls}>Name</label>
        <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Homepage layer" />

        <label className={`${labelCls} mt-4`}>Description (optional)</label>
        <input className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="Why these experiments are mutually exclusive" />

        <div className="flex items-center justify-between mt-5 mb-2">
          <label className={labelCls}>Experiments in this group</label>
          <button type="button" onClick={addRow}
            className="text-xs text-brand-violet hover:underline">+ Add experiment</button>
        </div>

        <div className="space-y-2">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center gap-2">
              <select
                value={row.experiment_id}
                onChange={(e) => updateRow(i, "experiment_id", e.target.value)}
                className={`${inputCls} flex-1`}
              >
                <option value="">Select experiment…</option>
                {experiments
                  .filter((exp) => exp.id === row.experiment_id || !usedExperimentIds.includes(exp.id))
                  .map((exp) => (
                    <option key={exp.id} value={exp.id}>{exp.name}</option>
                  ))}
              </select>
              <input
                type="number" min="1" max="100"
                value={row.allocation_pct}
                onChange={(e) => updateRow(i, "allocation_pct", e.target.value)}
                className={`${inputCls} w-16 text-center`}
              />
              <span className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>%</span>
              {rows.length > 1 && (
                <button type="button" onClick={() => removeRow(i)}
                  className={`text-xs px-1.5 ${isDark ? "text-white/25 hover:text-red-400" : "text-gray-300 hover:text-red-500"}`}>
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <div className={`flex items-center justify-between text-xs px-1 mt-3 ${
          total <= 100 ? (isDark ? "text-white/30" : "text-gray-400") : "text-red-400"
        }`}>
          <span>Total allocated</span>
          <span className="font-mono">{total}% {total > 100 && "— exceeds 100%"}</span>
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
            {loading ? "Creating…" : "Create group"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function MutualExclusionGroups() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const canEdit = usePermission("editor");
  const canDelete = usePermission("admin");

  const [groups, setGroups] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const load = async () => {
    try {
      const [groupsRes, expRes] = await Promise.all([
        listMutualExclusionGroups(),
        api.get("/experiments/"),
      ]);
      setGroups(groupsRes.data);
      setExperiments(expRes.data);
    } catch (err) {
      console.error("Failed to load mutual exclusion groups:", err);
      toast.error("Could not load mutual exclusion groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (groupId, name) => {
    if (!window.confirm(`Delete "${name}"? Experiments in it become independently allocated again.`)) return;
    try {
      await deleteMutualExclusionGroup(groupId);
      toast.success("Group deleted");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to delete group");
    }
  };

  const experimentName = (id) => experiments.find((e) => e.id === id)?.name || "Unknown experiment";

  const cardCls = `rounded-2xl border ${
    isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"
  }`;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`text-xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Mutual Exclusion Groups
          </h1>
          <p className={`text-sm mt-0.5 ${isDark ? "text-white/35" : "text-gray-500"}`}>
            {groups.length} group{groups.length !== 1 ? "s" : ""}
          </p>
        </div>
        {canEdit && (
          <button onClick={() => setShowCreate(true)}
            disabled={experiments.length < 2}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white font-medium
                       bg-gradient-to-r from-brand-violet to-brand-blue hover:opacity-90 transition-opacity
                       shadow-[0_0_20px_rgba(108,92,231,0.3)] disabled:opacity-40 disabled:cursor-not-allowed">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M12 4v16m8-8H4" />
            </svg>
            New group
          </button>
        )}
      </div>

      {loading ? (
        <div className={`${cardCls} p-8 text-center`}>
          <p className={isDark ? "text-white/30" : "text-gray-400"}>Loading…</p>
        </div>
      ) : experiments.length < 2 ? (
        <div className={`flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed ${
          isDark ? "border-white/[0.07]" : "border-gray-200"
        }`}>
          <p className={`text-sm ${isDark ? "text-white/30" : "text-gray-400"}`}>
            Need at least 2 experiments before you can group them
          </p>
        </div>
      ) : groups.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed ${
          isDark ? "border-white/[0.07]" : "border-gray-200"
        }`}>
          <p className={`text-sm ${isDark ? "text-white/30" : "text-gray-400"}`}>No mutual exclusion groups yet</p>
          {canEdit && (
            <button onClick={() => setShowCreate(true)} className="mt-3 text-sm text-brand-violet hover:underline">
              Create your first group →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((g) => {
            const totalAllocated = g.memberships.reduce((sum, m) => sum + m.allocation_pct, 0);
            return (
              <div key={g.id} className={`${cardCls} p-5`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={`font-medium ${isDark ? "text-white/85" : "text-gray-900"}`}>{g.name}</p>
                    {g.description && (
                      <p className={`text-xs mt-1 ${isDark ? "text-white/40" : "text-gray-500"}`}>{g.description}</p>
                    )}
                  </div>
                  {canDelete && (
                    <button onClick={() => handleDelete(g.id, g.name)}
                      className={`px-2 py-1 rounded-lg text-xs transition-colors ${
                        isDark ? "text-white/20 hover:text-red-400 hover:bg-red-400/10" : "text-gray-300 hover:text-red-500 hover:bg-red-50"
                      }`}>
                      Delete
                    </button>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  {g.memberships.map((m) => (
                    <div key={m.experiment_id} className="flex items-center gap-3">
                      <span className={`text-xs flex-1 truncate ${isDark ? "text-white/60" : "text-gray-600"}`}>
                        {experimentName(m.experiment_id)}
                      </span>
                      <div className={`flex-1 max-w-[140px] h-2 rounded-full overflow-hidden ${isDark ? "bg-white/[0.06]" : "bg-gray-100"}`}>
                        <div className="h-full rounded-full bg-gradient-to-r from-brand-violet to-brand-blue"
                          style={{ width: `${m.allocation_pct}%` }} />
                      </div>
                      <span className={`text-xs font-mono w-10 text-right ${isDark ? "text-white/50" : "text-gray-500"}`}>
                        {m.allocation_pct}%
                      </span>
                    </div>
                  ))}
                  {totalAllocated < 100 && (
                    <p className={`text-[11px] pt-1 ${isDark ? "text-white/25" : "text-gray-400"}`}>
                      {100 - totalAllocated}% of traffic sees none of these experiments
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showCreate && (
          <CreateGroupModal
            experiments={experiments}
            onClose={() => setShowCreate(false)}
            onCreated={load}
            isDark={isDark}
          />
        )}
      </AnimatePresence>
    </div>
  );
}