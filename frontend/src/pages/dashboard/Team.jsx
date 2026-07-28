// frontend/src/pages/dashboard/Team.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { usePermission } from "../../hooks/usePermission";
import { getMembers, updateMemberRole, removeMember } from "../../api/organizations";
import InviteMemberModal from "../../components/InviteMemberModal";

const ROLE_LABEL = { admin: "Admin", editor: "Editor", viewer: "Viewer" };
const ROLE_COLOR = {
  admin: "bg-brand-violet/15 text-brand-violet",
  editor: "bg-brand-blue/15 text-brand-blue",
  viewer: "bg-gray-400/15 text-gray-400",
};

export default function Team() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { user } = useAuth();
  const canManage = usePermission("admin");

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);

  const orgId = user?.organization_id;

  const load = async () => {
    if (!orgId) return;
    try {
      const r = await getMembers(orgId);
      setMembers(r.data);
    } catch (err) {
      console.error("Failed to load members:", err);
      toast.error("Could not load team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [orgId]);

  const handleRoleChange = async (membershipId, newRole) => {
    try {
      await updateMemberRole(orgId, membershipId, newRole);
      toast.success("Role updated");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to update role");
    }
  };

  const handleRemove = async (membershipId, name) => {
    if (!window.confirm(`Remove ${name || "this member"} from the team?`)) return;
    try {
      await removeMember(orgId, membershipId);
      toast.success("Member removed");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to remove member");
    }
  };

  const cardCls = `rounded-2xl border ${
    isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"
  }`;

  if (!orgId) {
    return (
      <div className={`${cardCls} p-8 text-center`}>
        <p className={isDark ? "text-white/40" : "text-gray-500"}>
          No organization found for your account. Try logging out and back in.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`text-xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Team
          </h1>
          <p className={`text-sm mt-0.5 ${isDark ? "text-white/35" : "text-gray-500"}`}>
            {members.length} member{members.length !== 1 ? "s" : ""}
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white font-medium
                       bg-gradient-to-r from-brand-violet to-brand-blue hover:opacity-90 transition-opacity
                       shadow-[0_0_20px_rgba(108,92,231,0.3)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M12 4v16m8-8H4" />
            </svg>
            Invite Member
          </button>
        )}
      </div>

      {loading ? (
        <div className={`${cardCls} p-8 text-center`}>
          <p className={isDark ? "text-white/30" : "text-gray-400"}>Loading…</p>
        </div>
      ) : (
        <div className={cardCls}>
          {members.map((m, i) => (
            <div
              key={m.id}
              className={`flex items-center justify-between gap-4 px-5 py-4 ${
                i !== members.length - 1 ? `border-b ${isDark ? "border-white/[0.05]" : "border-gray-100"}` : ""
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-violet to-brand-blue flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {(m.user_name || m.user_email || "?")[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${isDark ? "text-white/85" : "text-gray-900"}`}>
                    {m.user_name || m.invited_email}
                    {!m.accepted_at && (
                      <span className="ml-2 text-[10px] font-normal px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500">
                        Pending
                      </span>
                    )}
                  </p>
                  <p className={`text-xs truncate ${isDark ? "text-white/30" : "text-gray-400"}`}>
                    {m.user_email || m.invited_email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {canManage ? (
                  <select
                    value={m.role}
                    onChange={(e) => handleRoleChange(m.id, e.target.value)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border ${
                      isDark ? "bg-white/[0.04] border-white/[0.1] text-white" : "bg-white border-gray-200 text-gray-700"
                    }`}
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ROLE_COLOR[m.role]}`}>
                    {ROLE_LABEL[m.role]}
                  </span>
                )}

                {canManage && (
                  <button
                    onClick={() => handleRemove(m.id, m.user_name || m.invited_email)}
                    className={`px-2 py-1.5 rounded-lg text-xs transition-colors ${
                      isDark ? "text-white/20 hover:text-red-400 hover:bg-red-400/10" : "text-gray-300 hover:text-red-500 hover:bg-red-50"
                    }`}
                    title="Remove member"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showInvite && (
          <InviteMemberModal
            orgId={orgId}
            onClose={() => setShowInvite(false)}
            onInvited={load}
            isDark={isDark}
          />
        )}
      </AnimatePresence>
    </div>
  );
}