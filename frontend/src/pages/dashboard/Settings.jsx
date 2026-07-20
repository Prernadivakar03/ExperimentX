
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../services/auth";
import ThemeToggle from "../../components/ThemeToggle";

function Section({ title, children, delay, isDark }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className={`rounded-2xl border overflow-hidden ${
        isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"
      }`}>
      <div className={`px-6 py-4 border-b ${isDark ? "border-white/[0.06]" : "border-gray-100"}`}>
        <p className={`text-sm font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>{title}</p>
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </motion.div>
  );
}

function Row({ label, description, children, isDark }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className={`text-sm font-medium ${isDark ? "text-white/80" : "text-gray-800"}`}>{label}</p>
        {description && <p className={`text-xs mt-0.5 ${isDark ? "text-white/30" : "text-gray-400"}`}>{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

export default function Settings() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { user, clearAuth } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    clearAuth();
    navigate("/login");
  };

  const fakeApiKey = "xp_live_sk_" + "a1b2c3d4e5f6".repeat(2);
  const copyKey = () => {
    navigator.clipboard.writeText(fakeApiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className={`text-xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Settings</h1>
        <p className={`text-sm mt-0.5 ${isDark ? "text-white/35" : "text-gray-500"}`}>Manage your account and workspace</p>
      </div>

      <Section title="Profile" delay={0} isDark={isDark}>
        <Row label="Name" isDark={isDark}>
          <p className={`text-sm ${isDark ? "text-white/60" : "text-gray-600"}`}>{user?.name}</p>
        </Row>
        <Row label="Email" isDark={isDark}>
          <p className={`text-sm ${isDark ? "text-white/60" : "text-gray-600"}`}>{user?.email}</p>
        </Row>
        {user?.company && (
          <Row label="Company" isDark={isDark}>
            <p className={`text-sm ${isDark ? "text-white/60" : "text-gray-600"}`}>{user.company}</p>
          </Row>
        )}
      </Section>

      <Section title="Appearance" delay={0.05} isDark={isDark}>
        <Row label="Theme" description={`Currently using ${isDark ? "dark" : "light"} mode`} isDark={isDark}>
          <ThemeToggle />
        </Row>
      </Section>

      <Section title="API" delay={0.1} isDark={isDark}>
        <Row label="API Key" description="Use this to connect your app to ExperimentX" isDark={isDark}>
          <button onClick={copyKey}
            className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border transition-colors ${
              isDark ? "border-white/[0.08] text-white/50 hover:text-white hover:border-white/20" : "border-gray-200 text-gray-500 hover:text-gray-900"
            }`}>
            {copied ? "✓ Copied" : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="9" y="9" width="13" height="13" rx="2" /><path strokeLinecap="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Copy key
              </>
            )}
          </button>
        </Row>
        <div className={`px-3 py-2.5 rounded-xl font-mono text-xs ${
          isDark ? "bg-white/[0.03] text-white/25 border border-white/[0.06]" : "bg-gray-50 text-gray-400 border border-gray-200"
        }`}>
          {fakeApiKey.slice(0, 20)}••••••••••••••••
        </div>
        <Row label="Backend URL" description="Update before deploying to production" isDark={isDark}>
          <span className={`font-mono text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>localhost:8000</span>
        </Row>
      </Section>

      <Section title="Danger zone" delay={0.15} isDark={isDark}>
        <Row label="Sign out" description="End your current session" isDark={isDark}>
          <button onClick={handleLogout} disabled={loggingOut}
            className="px-4 py-2 rounded-lg text-sm text-red-400 bg-red-400/10 border border-red-400/20
                       hover:bg-red-400/20 transition-colors disabled:opacity-50">
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </Row>
      </Section>
    </div>
  );
}