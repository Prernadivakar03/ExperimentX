// frontend/src/components/NewApiKeyModal.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { createApiKey } from "../api/apiKeys";

export default function NewApiKeyModal({ orgId, onClose, onCreated, isDark }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdKey, setCreatedKey] = useState(null); // { full_key, name } once issued
  const [copied, setCopied] = useState(false);

  const inputCls = `w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-violet/25 transition-all ${
    isDark
      ? "bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-brand-violet/50"
      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-brand-violet"
  }`;
  const labelCls = `block text-xs font-medium mb-1.5 ${isDark ? "text-white/45" : "text-gray-600"}`;

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Give this key a name — e.g. \"Production SDK\"");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await createApiKey(orgId, name.trim());
      setCreatedKey(res.data);
      onCreated();
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(detail || "Failed to create API key");
    } finally {
      setLoading(false);
    }
  };

  const copyFullKey = () => {
    navigator.clipboard.writeText(createdKey.full_key);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={`w-full max-w-md rounded-2xl border p-6 ${
          isDark ? "bg-[#0D0E1A] border-white/[0.08]" : "bg-white border-gray-200"
        }`}
      >
        {!createdKey ? (
          <>
            <h2 className={`font-display font-bold text-lg mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              New API key
            </h2>
            <label className={labelCls}>Name</label>
            <input
              className={inputCls}
              placeholder="Production SDK"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
            <div className="flex gap-2 mt-5">
              <button
                onClick={onClose}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                  isDark ? "border-white/[0.08] text-white/60 hover:text-white" : "border-gray-200 text-gray-600 hover:text-gray-900"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-brand-violet text-white hover:bg-brand-violet/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Creating…" : "Create key"}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className={`font-display font-bold text-lg mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
              "{createdKey.name}" created
            </h2>
            <p className={`text-xs mb-4 ${isDark ? "text-amber-400/80" : "text-amber-600"}`}>
              Copy this now — you won't be able to see it again.
            </p>
            <div
              className={`px-3.5 py-3 rounded-xl font-mono text-xs break-all border ${
                isDark ? "bg-white/[0.03] text-white/80 border-white/[0.08]" : "bg-gray-50 text-gray-700 border-gray-200"
              }`}
            >
              {createdKey.full_key}
            </div>
            <button
              onClick={copyFullKey}
              className={`mt-3 w-full flex items-center justify-center gap-2 text-sm px-4 py-2.5 rounded-xl border transition-colors ${
                isDark ? "border-white/[0.08] text-white/70 hover:text-white hover:border-white/20" : "border-gray-200 text-gray-600 hover:text-gray-900"
              }`}
            >
              {copied ? "✓ Copied" : "Copy key"}
            </button>
            <button
              onClick={onClose}
              className="mt-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-brand-violet text-white hover:bg-brand-violet/90 transition-colors"
            >
              Done
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}