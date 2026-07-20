
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/auth";
import ThemeToggle from "../components/ThemeToggle";
import Overview from "./dashboard/Overview";
import Experiments from "./dashboard/Experiments";
import Analytics from "./dashboard/Analytics";
import AIInsights from "./dashboard/AIInsights";
import Settings from "./dashboard/Settings";
import SDKIntegration from "./dashboard/SDKIntegration";
import Onboarding from "./dashboard/Onboarding";
import Visitors from "./dashboard/Visitors"; // <-- NEW IMPORT
import FeatureFlags from "./dashboard/FeatureFlags";
import MetricBuilder from "./dashboard/MetricBuilder";

const NAV = [
  {
    id: "overview", label: "Overview",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    id: "experiments", label: "Experiments",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: "flags", label: "Feature Flags",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 14l3-3 3 3 5-5" />
      </svg>
    ),
  },
  {
    id: "metrics", label: "Metrics",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M3 21h18" />
      </svg>
    ),
  },
  {
    id: "analytics", label: "Analytics",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  // --- NEW VISITORS ENTRY ---
  {
    id: "visitors", label: "Visitors",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  // --------------------------
  {
    id: "sdk", label: "SDK & API",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },

  {
    id: "ai", label: "AI Insights", badge: "AI",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: "settings", label: "Settings",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const PAGES = {
  overview: Overview,
  experiments: Experiments,
  flags: FeatureFlags,
  metrics: MetricBuilder,
  analytics: Analytics,
  visitors: Visitors,
  sdk: SDKIntegration,
  ai: AIInsights,
  settings: Settings,
};

function Sidebar({ active, setActive, collapsed, isDark, user, onLogout }) {
  const base = `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-150 cursor-pointer w-full text-left`;

  return (
    <div className={`flex flex-col h-full transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 h-14 border-b flex-shrink-0 ${
        isDark ? "border-white/[0.06]" : "border-gray-100"
      }`}>
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-violet to-brand-blue flex items-center justify-center flex-shrink-0 shadow-[0_0_14px_rgba(108,92,231,0.4)]">
          <svg width="13" height="13" viewBox="0 0 40 40" fill="none">
            <path d="M6 6L34 34M34 6L6 34" stroke="white" strokeWidth="6" strokeLinecap="round" />
          </svg>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className={`font-display font-bold text-sm leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
              Experiment<span className="text-brand-violet">X</span>
            </p>
            <p className={`text-[9px] ${isDark ? "text-white/25" : "text-gray-400"}`}>AI Testing Platform</p>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              title={collapsed ? item.label : undefined}
              className={`${base} ${collapsed ? "justify-center px-2" : ""} ${
                isActive
                  ? isDark
                    ? "bg-brand-violet/12 text-brand-violet"
                    : "bg-brand-violet/8 text-brand-violet"
                  : isDark
                    ? "text-white/45 hover:text-white hover:bg-white/[0.04]"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-brand-violet/15 text-brand-violet">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 w-0.5 h-5 bg-brand-violet rounded-r"
                  style={{ position: "absolute", left: 0 }}
                />
              )}
            </button>
            
          );
        })}
      </nav>

      {/* User section */}
      <div className={`px-2 py-3 border-t ${isDark ? "border-white/[0.06]" : "border-gray-100"}`}>
        {!collapsed ? (
          <div className={`flex items-center gap-2.5 px-2 py-2 rounded-xl ${
            isDark ? "hover:bg-white/[0.04]" : "hover:bg-gray-50"
          } transition-colors`}>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-violet to-brand-blue flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium truncate ${isDark ? "text-white/80" : "text-gray-800"}`}>{user?.name}</p>
              <p className={`text-[10px] truncate ${isDark ? "text-white/25" : "text-gray-400"}`}>{user?.email}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-violet to-brand-blue flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { user, clearAuth } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    clearAuth();
    navigate("/login");
  };

  const PageComponent = PAGES[active];

  // const sidebarBg = isDark
  //   ? "bg-[#0D0E1A] border-white/[0.06]"
  //   : "bg-white border-gray-200";

  // const mainBg = isDark ? "bg-[#080912]" : "bg-gray-50/80";
  // const topbarBg = isDark ? "bg-[#0D0E1A]/80 border-white/[0.06]" : "bg-white/80 border-gray-200";

  const sidebarBg = isDark
  ? "bg-[#0D0E1A] border-white/[0.06]"
  : "bg-white border-gray-200";

const mainBg = isDark ? "bg-[#080912]" : "bg-[#F8F7FF]";
const topbarBg = isDark ? "bg-[#0D0E1A]/80 border-white/[0.06]" : "bg-white/80 border-gray-200";

  return (
    <div className={`flex h-screen overflow-hidden ${mainBg} transition-colors duration-300`}>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            key="mobile-sidebar"
            initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className={`fixed inset-y-0 left-0 z-50 border-r lg:hidden ${sidebarBg}`}
          >
            <Sidebar
              active={active}
              setActive={(id) => { setActive(id); setMobileSidebarOpen(false); }}
              collapsed={false}
              isDark={isDark}
              user={user}
              onLogout={handleLogout}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:block border-r flex-shrink-0 relative transition-all duration-300 ${sidebarBg}`}
        style={{ width: collapsed ? 64 : 240 }}>
        <Sidebar
          active={active}
          setActive={setActive}
          collapsed={collapsed}
          isDark={isDark}
          user={user}
          onLogout={handleLogout}
        />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`absolute -right-3 top-[68px] w-6 h-6 rounded-full border flex items-center justify-center z-10
                      transition-colors ${isDark ? "bg-[#0D0E1A] border-white/10 text-white/40 hover:text-white" : "bg-white border-gray-200 text-gray-400 hover:text-gray-700"}`}
        >
          <svg className={`w-3 h-3 transition-transform ${collapsed ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className={`flex items-center gap-4 px-4 md:px-6 h-14 border-b backdrop-blur-md flex-shrink-0 ${topbarBg}`}>
          {/* Mobile menu */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className={`lg:hidden p-1.5 rounded-lg ${isDark ? "text-white/50 hover:text-white hover:bg-white/[0.06]" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${isDark ? "text-white/30" : "text-gray-400"}`}>Dashboard</span>
            <span className={`text-sm ${isDark ? "text-white/20" : "text-gray-300"}`}>/</span>
            <span className={`text-sm font-medium capitalize ${isDark ? "text-white/70" : "text-gray-700"}`}>
              {active === "ai" ? "AI Insights" : active === "sdk" ? "SDK & API" : active}
            </span>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2 md:gap-3">
            {/* New experiment quick button */}
            <button
              onClick={() => setActive("experiments")}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white
                         bg-gradient-to-r from-brand-violet to-brand-blue hover:opacity-90 transition-opacity"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M12 4v16m8-8H4" />
              </svg>
              New experiment
            </button>

            <ThemeToggle />

            {/* Avatar dropdown */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-violet to-brand-blue flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="hidden md:block">
                <p className={`text-xs font-medium leading-tight ${isDark ? "text-white/80" : "text-gray-800"}`}>{user?.name}</p>
                <button onClick={handleLogout} className="text-[10px] text-red-400 hover:underline">Sign out</button>
              </div>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <PageComponent onNavigate={setActive} />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}