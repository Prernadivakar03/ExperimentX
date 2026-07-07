// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { useTheme } from "../context/ThemeContext";
// import { useAuth } from "../context/AuthContext";
// import { logout } from "../services/auth";
// import ThemeToggle from "../components/ThemeToggle";
// import Overview from "./dashboard/Overview";
// import Experiments from "./dashboard/Experiments";
// import Analytics from "./dashboard/Analytics";
// import AIInsights from "./dashboard/AIInsights";
// import Settings from "./dashboard/Settings";

// const NAV = [
//   { id: "overview", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
//   { id: "experiments", label: "Experiments", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
//   { id: "analytics", label: "Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
//   { id: "ai", label: "AI Insights", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
//   { id: "settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
// ];

// const PAGES = { overview: Overview, experiments: Experiments, analytics: Analytics, ai: AIInsights, settings: Settings };

// export default function Dashboard() {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";
//   const { user, clearAuth } = useAuth();
//   const navigate = useNavigate();
//   const [active, setActive] = useState("overview");
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const PageComponent = PAGES[active];

//   const sidebarBg = isDark ? "bg-brand-surface border-white/10" : "bg-white border-gray-200";
//   const mainBg = isDark ? "bg-brand-black" : "bg-gray-50";

//   return (
//     <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${mainBg}`}>
//       {/* Mobile overlay */}
//       <AnimatePresence>
//         {sidebarOpen && (
//           <motion.div
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 z-20 lg:hidden"
//             onClick={() => setSidebarOpen(false)}
//           />
//         )}
//       </AnimatePresence>

//       {/* Sidebar */}
//       <motion.aside
//         className={`fixed lg:static inset-y-0 left-0 z-30 w-60 flex flex-col border-r
//                     transition-colors duration-300 ${sidebarBg}`}
//         initial={false}
//         animate={{ x: sidebarOpen ? 0 : -240 }}
//         transition={{ type: "spring", stiffness: 400, damping: 35 }}
//         style={{ x: undefined }}
//         // On desktop always show
//       >
//         <div className={`hidden lg:flex flex-col h-full`}>
//           <SidebarContent
//             active={active} setActive={setActive}
//             isDark={isDark} user={user}
//           />
//         </div>
//         <div className="flex lg:hidden flex-col h-full">
//           <SidebarContent
//             active={active} setActive={(id) => { setActive(id); setSidebarOpen(false); }}
//             isDark={isDark} user={user}
//           />
//         </div>
//       </motion.aside>

//       {/* Desktop sidebar — always visible */}
//       <aside className={`hidden lg:flex w-60 flex-shrink-0 flex-col border-r
//                          transition-colors duration-300 ${sidebarBg}`}>
//         <SidebarContent active={active} setActive={setActive} isDark={isDark} user={user} />
//       </aside>

//       {/* Main content */}
//       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         {/* Top bar */}
//         <header className={`flex items-center justify-between px-6 h-14 border-b flex-shrink-0
//                             transition-colors duration-300 ${
//                               isDark ? "border-white/10" : "border-gray-200 bg-white"
//                             }`}>
//           <button
//             onClick={() => setSidebarOpen(true)}
//             className={`lg:hidden p-1 rounded ${isDark ? "text-white/50" : "text-gray-500"}`}
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//               <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </button>
//           <div className="flex-1" />
//           <div className="flex items-center gap-3">
//             <ThemeToggle />
//             <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-brand-violet to-brand-blue
//                              flex items-center justify-center text-white text-xs font-bold`}>
//               {user?.name?.[0]?.toUpperCase() || "U"}
//             </div>
//           </div>
//         </header>

//         {/* Page content */}
//         <main className="flex-1 overflow-y-auto p-6">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={active}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               transition={{ duration: 0.2 }}
//             >
//               <PageComponent />
//             </motion.div>
//           </AnimatePresence>
//         </main>
//       </div>
//     </div>
//   );
// }

// function SidebarContent({ active, setActive, isDark, user }) {
//   return (
//     <>
//       {/* Logo */}
//       <div className="p-5 flex items-center gap-2">
//         <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-violet to-brand-blue
//                         flex items-center justify-center shadow-[0_0_15px_rgba(108,92,231,0.4)]">
//           <svg width="14" height="14" viewBox="0 0 40 40" fill="none">
//             <path d="M6 6 L34 34 M34 6 L6 34" stroke="white" strokeWidth="6" strokeLinecap="round" />
//           </svg>
//         </div>
//         <div>
//           <span className={`font-display font-bold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
//             Experiment<span className="text-brand-violet">X</span>
//           </span>
//           <p className={`text-[9px] leading-none ${isDark ? "text-white/25" : "text-gray-400"}`}>
//             AI Testing Platform
//           </p>
//         </div>
//       </div>

//       {/* Nav */}
//       <nav className="flex-1 px-3 space-y-0.5 mt-2">
//         {NAV.map((item) => (
//           <button
//             key={item.id}
//             onClick={() => setActive(item.id)}
//             className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm
//                         transition-all duration-200 ${
//                           active === item.id
//                             ? "bg-brand-violet/15 text-brand-violet font-medium"
//                             : isDark
//                               ? "text-white/50 hover:text-white hover:bg-white/[0.04]"
//                               : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
//                         }`}
//           >
//             <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
//             </svg>
//             {item.label}
//             {item.id === "ai" && (
//               <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-brand-violet/20 text-brand-violet">
//                 AI
//               </span>
//             )}
//           </button>
//         ))}
//       </nav>

//       {/* User */}
//       <div className={`p-4 border-t ${isDark ? "border-white/5" : "border-gray-100"}`}>
//         <div className="flex items-center gap-2.5">
//           <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-violet to-brand-blue
//                           flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
//             {user?.name?.[0]?.toUpperCase() || "U"}
//           </div>
//           <div className="min-w-0">
//             <p className={`text-xs font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}>{user?.name}</p>
//             <p className={`text-[10px] truncate ${isDark ? "text-white/30" : "text-gray-400"}`}>{user?.email}</p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }



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
    id: "analytics", label: "Analytics",
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
  analytics: Analytics,
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

  const sidebarBg = isDark
    ? "bg-[#0D0E1A] border-white/[0.06]"
    : "bg-white border-gray-200";

  const mainBg = isDark ? "bg-[#080912]" : "bg-gray-50/80";
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
              {active === "ai" ? "AI Insights" : active}
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