// frontend/src/components/OrgSwitcher.jsx
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2 } from "lucide-react";
import { getMyOrganizations } from "../api/organizations";

export default function OrgSwitcher({ isDark }) {
  const [orgs, setOrgs] = useState([]);
  const [activeOrgId, setActiveOrgId] = useState(localStorage.getItem("experimentx_active_org_id"));
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    getMyOrganizations().then((r) => {
      setOrgs(r.data);
      if (!activeOrgId && r.data.length > 0) {
        localStorage.setItem("experimentx_active_org_id", r.data[0].id);
        setActiveOrgId(r.data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchOrg = (orgId) => {
    localStorage.setItem("experimentx_active_org_id", orgId);
    setActiveOrgId(orgId);
    setOpen(false);
    window.location.reload();
  };

  const activeOrg = orgs.find((o) => o.id === activeOrgId);

  if (orgs.length <= 1) return null; // nothing to switch between yet
//   if (orgs.length === 0) return null; just the tested one !
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
          isDark
            ? "border-white/10 text-white/70 hover:bg-white/[0.05]"
            : "border-gray-200 text-gray-700 hover:bg-gray-50"
        }`}
      >
        <Building2 className="w-4 h-4" />
        <span className="max-w-[120px] truncate">{activeOrg?.name || "Select org"}</span>
        <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={`absolute right-0 mt-2 w-56 rounded-xl border shadow-lg z-50 overflow-hidden ${
              isDark ? "bg-[#0D0E1A] border-white/[0.08]" : "bg-white border-gray-200"
            }`}
          >
            {orgs.map((org) => (
              <button
                key={org.id}
                onClick={() => switchOrg(org.id)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  org.id === activeOrgId
                    ? "text-brand-violet bg-brand-violet/10"
                    : isDark
                      ? "text-white/70 hover:bg-white/[0.05]"
                      : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {org.name}
                {org.id === activeOrgId && <span className="ml-2">✓</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}