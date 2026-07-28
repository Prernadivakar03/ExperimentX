// frontend/src/components/InviteMemberModal.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { inviteMember } from "../api/organizations";

export default function InviteMemberModal({ orgId, onClose, onInvited, isDark }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputCls = `w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-violet/25 transition-all ${
    isDark
      ? "bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-brand-violet/50"
      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-brand-violet"
  }`;
  const labelCls = `block text-xs font-medium mb-1.5 ${isDark ? "text-white/45" : "text-gray-600"}`;

  const handleSubmit = async () => {
    if (!email.includes("@")) {
      setError("Enter a valid email address");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await inviteMember(orgId, email, role);
      toast.success(`Invitation sent to ${email}`);
      onInvited();
      onClose();
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(detail || "Failed to send invitation");
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
        <h2 className={`font-display font-bold text-lg mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
          Invite a team member
        </h2>

        <label className={labelCls}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          className={inputCls}
        />

        <label className={`${labelCls} mt-4`}>Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={inputCls}
        >
          <option value="viewer">Viewer — can view, no editing</option>
          <option value="editor">Editor — can create and edit</option>
          <option value="admin">Admin — full control, including team management</option>
        </select>

        {error && (
          <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-lg mt-4">
            {error}
          </p>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className={`flex-1 py-2.5 rounded-xl text-sm border transition-colors ${
              isDark ? "border-white/[0.08] text-white/45 hover:text-white/70" : "border-gray-200 text-gray-500 hover:text-gray-700"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm text-white font-medium
                       bg-gradient-to-r from-brand-violet to-brand-blue disabled:opacity-60
                       hover:opacity-90 transition-opacity"
          >
            {loading ? "Sending…" : "Send Invitation"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}