
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";
// import { useTheme } from "../../context/ThemeContext";
// import { useAuth } from "../../context/AuthContext";
// import { usePermission } from "../../hooks/usePermission";
// import { logout } from "../../services/auth";
// import { listApiKeys, revokeApiKey } from "../../api/apiKeys";
// import ThemeToggle from "../../components/ThemeToggle";
// import NewApiKeyModal from "../../components/NewApiKeyModal";

// // ---------- Reusable Components ----------
// function Card({ title, children, isDark, className }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       className={`rounded-2xl border overflow-hidden ${
//         isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"
//       } ${className || ""}`}
//     >
//       <div className={`px-5 py-3 border-b ${isDark ? "border-white/[0.06]" : "border-gray-100"}`}>
//         <p className={`text-sm font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>{title}</p>
//       </div>
//       <div className="px-5 py-4 space-y-3">{children}</div>
//     </motion.div>
//   );
// }

// function Row({ label, description, children, isDark }) {
//   return (
//     <div className="flex items-center justify-between gap-4">
//       <div>
//         <p className={`text-sm font-medium ${isDark ? "text-white/80" : "text-gray-800"}`}>{label}</p>
//         {description && <p className={`text-xs mt-0.5 ${isDark ? "text-white/30" : "text-gray-400"}`}>{description}</p>}
//       </div>
//       <div className="flex-shrink-0">{children}</div>
//     </div>
//   );
// }

// // ---------- Tab Panels ----------

// // 1. Account
// function AccountTab({ user, isDark, onLogout, loggingOut }) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//       {/* Profile */}
//       <Card title="Profile" isDark={isDark}>
//         <Row label="Name" isDark={isDark}>
//           <p className={`text-sm ${isDark ? "text-white/60" : "text-gray-600"}`}>{user?.name}</p>
//         </Row>
//         <Row label="Email" isDark={isDark}>
//           <p className={`text-sm ${isDark ? "text-white/60" : "text-gray-600"}`}>{user?.email}</p>
//         </Row>
//         {user?.company && (
//           <Row label="Company" isDark={isDark}>
//             <p className={`text-sm ${isDark ? "text-white/60" : "text-gray-600"}`}>{user.company}</p>
//           </Row>
//         )}
//         <Row label="Sign out" description="End your current session" isDark={isDark}>
//           <button
//             onClick={onLogout}
//             disabled={loggingOut}
//             className="px-4 py-2 rounded-lg text-sm text-red-400 bg-red-400/10 border border-red-400/20 hover:bg-red-400/20 transition-colors disabled:opacity-50"
//           >
//             {loggingOut ? "Signing out…" : "Sign out"}
//           </button>
//         </Row>
//       </Card>

//       {/* Appearance */}
//       <Card title="Appearance" isDark={isDark}>
//         <Row label="Theme" description={`Currently using ${isDark ? "dark" : "light"} mode`} isDark={isDark}>
//           <ThemeToggle />
//         </Row>
//       </Card>
//     </div>
//   );
// }

// // 2. Workspace
// function WorkspaceTab({ user, isDark }) {
//   const navigate = useNavigate();
//   return (
//     <div className="max-w-2xl">
//       <Card title="Workspace" isDark={isDark}>
//         <Row label="Workspace Name" isDark={isDark}>
//           <p className={`text-sm ${isDark ? "text-white/60" : "text-gray-600"}`}>
//             {user?.organization_name || "My Workspace"}
//           </p>
//         </Row>
//         <Row label="Workspace ID" isDark={isDark}>
//           <p className={`text-sm font-mono ${isDark ? "text-white/60" : "text-gray-600"}`}>
//             {user?.organization_id || "N/A"}
//           </p>
//         </Row>
//         <Row label="Owner" isDark={isDark}>
//           <p className={`text-sm ${isDark ? "text-white/60" : "text-gray-600"}`}>{user?.name}</p>
//         </Row>
//         <Row label="Created" isDark={isDark}>
//           <p className={`text-sm ${isDark ? "text-white/60" : "text-gray-600"}`}>
//             {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
//           </p>
//         </Row>
//         <Row label="Team" description="Manage members and permissions" isDark={isDark}>
//           <button
//             onClick={() => navigate("/team")}
//             className="text-xs px-3 py-2 rounded-lg bg-brand-violet text-white hover:bg-brand-violet/90 transition-colors"
//           >
//             Manage team →
//           </button>
//         </Row>
//       </Card>
//     </div>
//   );
// }

// // 3. Experiments
// function ExperimentsTab({ isDark }) {
//   // Form state for experiment defaults
//   const [defaultTraffic, setDefaultTraffic] = useState(50);
//   const [confidenceLevel, setConfidenceLevel] = useState(95);
//   const [experimentType, setExperimentType] = useState("ab");
//   const [defaultDuration, setDefaultDuration] = useState(14);
//   const [autoStop, setAutoStop] = useState(false);
//   const [requireMinSample, setRequireMinSample] = useState(true);

//   // Statistical settings
//   const [statMethod, setStatMethod] = useState("frequentist");
//   const [significance, setSignificance] = useState(0.05);
//   const [correction, setCorrection] = useState("none");

//   const handleSaveDefaults = () => {
//     // TODO: Call API to save experiment defaults
//     toast.success("Experiment defaults saved");
//   };

//   const handleSaveStats = () => {
//     // TODO: Call API to save statistical settings
//     toast.success("Statistical settings saved");
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//       {/* Experiment Defaults */}
//       <Card title="Experiment Defaults" isDark={isDark}>
//         <Row label="Default traffic allocation" isDark={isDark}>
//           <div className="flex items-center gap-2">
//             <input
//               type="number"
//               min="0"
//               max="100"
//               value={defaultTraffic}
//               onChange={(e) => setDefaultTraffic(Number(e.target.value))}
//               className={`w-20 px-2 py-1 text-sm rounded-lg border ${
//                 isDark
//                   ? "bg-[#0D0E1A] border-white/10 text-white"
//                   : "bg-white border-gray-300 text-gray-900"
//               }`}
//             />
//             <span className={`text-sm ${isDark ? "text-white/40" : "text-gray-400"}`}>%</span>
//           </div>
//         </Row>
//         <Row label="Default confidence level" isDark={isDark}>
//           <select
//             value={confidenceLevel}
//             onChange={(e) => setConfidenceLevel(Number(e.target.value))}
//             className={`px-3 py-1.5 text-sm rounded-lg border ${
//               isDark
//                 ? "bg-[#0D0E1A] border-white/10 text-white"
//                 : "bg-white border-gray-300 text-gray-900"
//             }`}
//           >
//             <option value={90}>90%</option>
//             <option value={95}>95%</option>
//             <option value={99}>99%</option>
//           </select>
//         </Row>
//         <Row label="Default experiment type" isDark={isDark}>
//           <select
//             value={experimentType}
//             onChange={(e) => setExperimentType(e.target.value)}
//             className={`px-3 py-1.5 text-sm rounded-lg border ${
//               isDark
//                 ? "bg-[#0D0E1A] border-white/10 text-white"
//                 : "bg-white border-gray-300 text-gray-900"
//             }`}
//           >
//             <option value="ab">A/B Test</option>
//             <option value="multivariate">Multivariate</option>
//             <option value="feature">Feature Flag</option>
//           </select>
//         </Row>
//         <Row label="Default duration" isDark={isDark}>
//           <div className="flex items-center gap-2">
//             <input
//               type="number"
//               min="1"
//               value={defaultDuration}
//               onChange={(e) => setDefaultDuration(Number(e.target.value))}
//               className={`w-20 px-2 py-1 text-sm rounded-lg border ${
//                 isDark
//                   ? "bg-[#0D0E1A] border-white/10 text-white"
//                   : "bg-white border-gray-300 text-gray-900"
//               }`}
//             />
//             <span className={`text-sm ${isDark ? "text-white/40" : "text-gray-400"}`}>days</span>
//           </div>
//         </Row>
//         <Row label="Auto-stop experiments" isDark={isDark}>
//           <button
//             onClick={() => setAutoStop(!autoStop)}
//             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//               autoStop ? "bg-brand-violet" : isDark ? "bg-white/20" : "bg-gray-300"
//             }`}
//           >
//             <span
//               className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                 autoStop ? "translate-x-6" : "translate-x-1"
//               }`}
//             />
//           </button>
//         </Row>
//         <Row label="Require minimum sample size" isDark={isDark}>
//           <button
//             onClick={() => setRequireMinSample(!requireMinSample)}
//             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//               requireMinSample ? "bg-brand-violet" : isDark ? "bg-white/20" : "bg-gray-300"
//             }`}
//           >
//             <span
//               className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                 requireMinSample ? "translate-x-6" : "translate-x-1"
//               }`}
//             />
//           </button>
//         </Row>
//         <div className="pt-2">
//           <button
//             onClick={handleSaveDefaults}
//             className="w-full text-sm px-4 py-2 rounded-lg bg-brand-violet text-white hover:bg-brand-violet/90 transition-colors"
//           >
//             Save defaults
//           </button>
//         </div>
//       </Card>

//       {/* Statistical Settings */}
//       <Card title="Statistical Settings" isDark={isDark}>
//         <Row label="Statistical method" isDark={isDark}>
//           <select
//             value={statMethod}
//             onChange={(e) => setStatMethod(e.target.value)}
//             className={`px-3 py-1.5 text-sm rounded-lg border ${
//               isDark
//                 ? "bg-[#0D0E1A] border-white/10 text-white"
//                 : "bg-white border-gray-300 text-gray-900"
//             }`}
//           >
//             <option value="frequentist">Frequentist</option>
//             <option value="bayesian">Bayesian</option>
//           </select>
//         </Row>
//         <Row label="Confidence level" isDark={isDark}>
//           <select
//             value={confidenceLevel}
//             onChange={(e) => setConfidenceLevel(Number(e.target.value))}
//             className={`px-3 py-1.5 text-sm rounded-lg border ${
//               isDark
//                 ? "bg-[#0D0E1A] border-white/10 text-white"
//                 : "bg-white border-gray-300 text-gray-900"
//             }`}
//           >
//             <option value={90}>90%</option>
//             <option value={95}>95%</option>
//             <option value={99}>99%</option>
//           </select>
//         </Row>
//         <Row label="Significance threshold" isDark={isDark}>
//           <select
//             value={significance}
//             onChange={(e) => setSignificance(Number(e.target.value))}
//             className={`px-3 py-1.5 text-sm rounded-lg border ${
//               isDark
//                 ? "bg-[#0D0E1A] border-white/10 text-white"
//                 : "bg-white border-gray-300 text-gray-900"
//             }`}
//           >
//             <option value={0.01}>0.01</option>
//             <option value={0.05}>0.05</option>
//             <option value={0.10}>0.10</option>
//           </select>
//         </Row>
//         <Row label="Multiple comparison correction" isDark={isDark}>
//           <select
//             value={correction}
//             onChange={(e) => setCorrection(e.target.value)}
//             className={`px-3 py-1.5 text-sm rounded-lg border ${
//               isDark
//                 ? "bg-[#0D0E1A] border-white/10 text-white"
//                 : "bg-white border-gray-300 text-gray-900"
//             }`}
//           >
//             <option value="none">None</option>
//             <option value="bonferroni">Bonferroni</option>
//             <option value="holm">Holm</option>
//             <option value="fdr">FDR</option>
//           </select>
//         </Row>
//         <div className="pt-2">
//           <button
//             onClick={handleSaveStats}
//             className="w-full text-sm px-4 py-2 rounded-lg bg-brand-violet text-white hover:bg-brand-violet/90 transition-colors"
//           >
//             Save statistics
//           </button>
//         </div>
//       </Card>
//     </div>
//   );
// }

// // 4. Developer
// function DeveloperTab({
//   isDark,
//   apiKeys,
//   loadingKeys,
//   canManageKeys,
//   onNewKey,
//   onRevoke,
//   revokingId,
//   orgId,
// }) {
//   return (
//     <div className="space-y-5 max-w-2xl">
//       {/* API Keys */}
//       <Card title="API Keys" isDark={isDark}>
//         <Row
//           label="SDK authentication"
//           description="Keys the client SDK sends as X-API-Key to /assign and tracking calls"
//           isDark={isDark}
//         >
//           {canManageKeys && (
//             <button
//               onClick={onNewKey}
//               className="text-xs px-3 py-2 rounded-lg bg-brand-violet text-white hover:bg-brand-violet/90 transition-colors"
//             >
//               + New key
//             </button>
//           )}
//         </Row>

//         {loadingKeys ? (
//           <p className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>Loading…</p>
//         ) : apiKeys.length === 0 ? (
//           <p className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>
//             No API keys yet. {canManageKeys ? "Create one to start using the SDK." : "Ask an admin to create one."}
//           </p>
//         ) : (
//           <div className="space-y-2">
//             {apiKeys.map((key) => (
//               <div
//                 key={key.id}
//                 className={`flex items-center justify-between gap-4 px-3.5 py-3 rounded-xl border ${
//                   isDark ? "bg-white/[0.03] border-white/[0.06]" : "bg-gray-50 border-gray-200"
//                 }`}
//               >
//                 <div className="min-w-0">
//                   <p className={`text-sm font-medium truncate ${isDark ? "text-white/85" : "text-gray-800"}`}>
//                     {key.name}
//                     {key.revoked_at && (
//                       <span className="ml-2 text-xs font-normal text-red-400">revoked</span>
//                     )}
//                   </p>
//                   <p className={`font-mono text-xs mt-0.5 ${isDark ? "text-white/35" : "text-gray-500"}`}>
//                     {key.key_prefix}••••••••
//                   </p>
//                   <p className={`text-xs mt-0.5 ${isDark ? "text-white/25" : "text-gray-400"}`}>
//                     {key.last_used_at
//                       ? `Last used ${new Date(key.last_used_at).toLocaleDateString()}`
//                       : "Never used"}
//                   </p>
//                 </div>
//                 {canManageKeys && !key.revoked_at && (
//                   <button
//                     onClick={() => onRevoke(key.id, key.name)}
//                     disabled={revokingId === key.id}
//                     className="flex-shrink-0 text-xs px-3 py-2 rounded-lg text-red-400 bg-red-400/10 border border-red-400/20 hover:bg-red-400/20 transition-colors disabled:opacity-50"
//                   >
//                     {revokingId === key.id ? "Revoking…" : "Revoke"}
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}

//         <Row label="Backend URL" description="Pass this as apiUrl in ExperimentX.init()" isDark={isDark}>
//           <span className={`font-mono text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>
//             {import.meta.env.VITE_API_URL || "localhost:8000"}
//           </span>
//         </Row>
//       </Card>

//       {/* Webhooks (if implemented) */}
//       <Card title="Webhooks" isDark={isDark}>
//         <p className={`text-sm ${isDark ? "text-white/50" : "text-gray-500"}`}>
//           Webhook endpoints will be available in a future update.
//         </p>
//         {/* TODO: Add webhook list and creation UI when backend is ready */}
//       </Card>
//     </div>
//   );
// }

// // ---------- Main Settings Component ----------
// export default function Settings() {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";
//   const { user, clearAuth } = useAuth();
//   const canManageKeys = usePermission("admin");
//   const navigate = useNavigate();

//   const [loggingOut, setLoggingOut] = useState(false);
//   const orgId = user?.organization_id;

//   // API keys state
//   const [apiKeys, setApiKeys] = useState([]);
//   const [loadingKeys, setLoadingKeys] = useState(true);
//   const [showNewKeyModal, setShowNewKeyModal] = useState(false);
//   const [revokingId, setRevokingId] = useState(null);

//   // Tab state
//   const [activeTab, setActiveTab] = useState("account");

//   const loadKeys = async () => {
//     if (!orgId) return;
//     try {
//       const res = await listApiKeys(orgId);
//       setApiKeys(res.data);
//     } catch (err) {
//       console.error("Failed to load API keys:", err);
//       toast.error("Could not load API keys");
//     } finally {
//       setLoadingKeys(false);
//     }
//   };

//   useEffect(() => {
//     loadKeys();
//   }, [orgId]);

//   const handleRevoke = async (keyId, name) => {
//     if (!window.confirm(`Revoke "${name}"? Anything using this key will stop working immediately.`)) {
//       return;
//     }
//     setRevokingId(keyId);
//     try {
//       await revokeApiKey(orgId, keyId);
//       toast.success(`"${name}" revoked`);
//       loadKeys();
//     } catch (err) {
//       toast.error("Failed to revoke key");
//     } finally {
//       setRevokingId(null);
//     }
//   };

//   const handleLogout = async () => {
//     setLoggingOut(true);
//     await logout();
//     clearAuth();
//     navigate("/login");
//   };

//   // Tabs configuration
//   const tabs = [
//     { id: "account", label: "Account" },
//     { id: "workspace", label: "Workspace" },
//     { id: "experiments", label: "Experiments" },
//     { id: "developer", label: "Developer" },
//   ];

//   return (
//     <div className="space-y-6 max-w-5xl">
//       {/* Header */}
//       <div>
//         <h1 className={`text-xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
//           Settings
//         </h1>
//         <p className={`text-sm mt-0.5 ${isDark ? "text-white/35" : "text-gray-500"}`}>
//           Manage your account, workspace, and experimentation platform
//         </p>
//       </div>

//       {/* Horizontal Tabs */}
//       <div className={`border-b ${isDark ? "border-white/[0.06]" : "border-gray-200"}`}>
//         <div className="flex gap-6">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`pb-3 text-sm font-medium transition-colors relative ${
//                 activeTab === tab.id
//                   ? isDark
//                     ? "text-white"
//                     : "text-gray-900"
//                   : isDark
//                   ? "text-white/40 hover:text-white/70"
//                   : "text-gray-400 hover:text-gray-700"
//               }`}
//             >
//               {tab.label}
//               {activeTab === tab.id && (
//                 <motion.div
//                   layoutId="settingsTabIndicator"
//                   className={`absolute bottom-0 left-0 right-0 h-0.5 ${
//                     isDark ? "bg-white" : "bg-gray-900"
//                   }`}
//                 />
//               )}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Tab Content */}
//       <div className="py-2">
//         {activeTab === "account" && (
//           <AccountTab user={user} isDark={isDark} onLogout={handleLogout} loggingOut={loggingOut} />
//         )}
//         {activeTab === "workspace" && (
//           <WorkspaceTab user={user} isDark={isDark} />
//         )}
//         {activeTab === "experiments" && (
//           <ExperimentsTab isDark={isDark} />
//         )}
//         {activeTab === "developer" && (
//           <DeveloperTab
//             isDark={isDark}
//             apiKeys={apiKeys}
//             loadingKeys={loadingKeys}
//             canManageKeys={canManageKeys}
//             onNewKey={() => setShowNewKeyModal(true)}
//             onRevoke={handleRevoke}
//             revokingId={revokingId}
//             orgId={orgId}
//           />
//         )}
//       </div>

//       {/* New API Key Modal */}
//       {showNewKeyModal && (
//         <NewApiKeyModal
//           orgId={orgId}
//           isDark={isDark}
//           onClose={() => setShowNewKeyModal(false)}
//           onCreated={loadKeys}
//         />
//       )}
//     </div>
//   );
// }
























































































































import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { usePermission } from "../../hooks/usePermission";
import { logout } from "../../services/auth";
import { listApiKeys, revokeApiKey } from "../../api/apiKeys";
import { getWebhookSettings, updateWebhookSettings, testWebhook } from "../../api/webhooks";
import ThemeToggle from "../../components/ThemeToggle";
import NewApiKeyModal from "../../components/NewApiKeyModal";

// ---------- Reusable Components ----------
function Card({ title, children, isDark, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border overflow-hidden ${
        isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"
      } ${className || ""}`}
    >
      <div className={`px-5 py-3 border-b ${isDark ? "border-white/[0.06]" : "border-gray-100"}`}>
        <p className={`text-sm font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>{title}</p>
      </div>
      <div className="px-5 py-4 space-y-3">{children}</div>
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

// ---------- Tab Panels ----------

// 1. Account
function AccountTab({ user, isDark, onLogout, loggingOut }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Profile */}
      <Card title="Profile" isDark={isDark}>
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
        <Row label="Sign out" description="End your current session" isDark={isDark}>
          <button
            onClick={onLogout}
            disabled={loggingOut}
            className="px-4 py-2 rounded-lg text-sm text-red-400 bg-red-400/10 border border-red-400/20 hover:bg-red-400/20 transition-colors disabled:opacity-50"
          >
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </Row>
      </Card>

      {/* Appearance */}
      <Card title="Appearance" isDark={isDark}>
        <Row label="Theme" description={`Currently using ${isDark ? "dark" : "light"} mode`} isDark={isDark}>
          <ThemeToggle />
        </Row>
      </Card>
    </div>
  );
}

// 2. Workspace
function WorkspaceTab({ user, isDark }) {
  const navigate = useNavigate();
  return (
    <div className="max-w-2xl">
      <Card title="Workspace" isDark={isDark}>
        <Row label="Workspace Name" isDark={isDark}>
          <p className={`text-sm ${isDark ? "text-white/60" : "text-gray-600"}`}>
            {user?.organization_name || "My Workspace"}
          </p>
        </Row>
        <Row label="Workspace ID" isDark={isDark}>
          <p className={`text-sm font-mono ${isDark ? "text-white/60" : "text-gray-600"}`}>
            {user?.organization_id || "N/A"}
          </p>
        </Row>
        <Row label="Owner" isDark={isDark}>
          <p className={`text-sm ${isDark ? "text-white/60" : "text-gray-600"}`}>{user?.name}</p>
        </Row>
        <Row label="Created" isDark={isDark}>
          <p className={`text-sm ${isDark ? "text-white/60" : "text-gray-600"}`}>
            {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
          </p>
        </Row>
        <Row label="Team" description="Manage members and permissions" isDark={isDark}>
          <button
            onClick={() => navigate("/team")}
            className="text-xs px-3 py-2 rounded-lg bg-brand-violet text-white hover:bg-brand-violet/90 transition-colors"
          >
            Manage team →
          </button>
        </Row>
      </Card>
    </div>
  );
}

// 3. Experiments
function ExperimentsTab({ isDark }) {
  const [defaultTraffic, setDefaultTraffic] = useState(50);
  const [confidenceLevel, setConfidenceLevel] = useState(95);
  const [experimentType, setExperimentType] = useState("ab");
  const [defaultDuration, setDefaultDuration] = useState(14);
  const [autoStop, setAutoStop] = useState(false);
  const [requireMinSample, setRequireMinSample] = useState(true);

  const [statMethod, setStatMethod] = useState("frequentist");
  const [significance, setSignificance] = useState(0.05);
  const [correction, setCorrection] = useState("none");

  const handleSaveDefaults = () => {
    toast.success("Experiment defaults saved");
  };

  const handleSaveStats = () => {
    toast.success("Statistical settings saved");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Card title="Experiment Defaults" isDark={isDark}>
        <Row label="Default traffic allocation" isDark={isDark}>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="100"
              value={defaultTraffic}
              onChange={(e) => setDefaultTraffic(Number(e.target.value))}
              className={`w-20 px-2 py-1 text-sm rounded-lg border ${
                isDark
                  ? "bg-[#0D0E1A] border-white/10 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
            <span className={`text-sm ${isDark ? "text-white/40" : "text-gray-400"}`}>%</span>
          </div>
        </Row>
        <Row label="Default confidence level" isDark={isDark}>
          <select
            value={confidenceLevel}
            onChange={(e) => setConfidenceLevel(Number(e.target.value))}
            className={`px-3 py-1.5 text-sm rounded-lg border ${
              isDark
                ? "bg-[#0D0E1A] border-white/10 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value={90}>90%</option>
            <option value={95}>95%</option>
            <option value={99}>99%</option>
          </select>
        </Row>
        <Row label="Default experiment type" isDark={isDark}>
          <select
            value={experimentType}
            onChange={(e) => setExperimentType(e.target.value)}
            className={`px-3 py-1.5 text-sm rounded-lg border ${
              isDark
                ? "bg-[#0D0E1A] border-white/10 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="ab">A/B Test</option>
            <option value="multivariate">Multivariate</option>
            <option value="feature">Feature Flag</option>
          </select>
        </Row>
        <Row label="Default duration" isDark={isDark}>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={defaultDuration}
              onChange={(e) => setDefaultDuration(Number(e.target.value))}
              className={`w-20 px-2 py-1 text-sm rounded-lg border ${
                isDark
                  ? "bg-[#0D0E1A] border-white/10 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
            <span className={`text-sm ${isDark ? "text-white/40" : "text-gray-400"}`}>days</span>
          </div>
        </Row>
        <Row label="Auto-stop experiments" isDark={isDark}>
          <button
            onClick={() => setAutoStop(!autoStop)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              autoStop ? "bg-brand-violet" : isDark ? "bg-white/20" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                autoStop ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </Row>
        <Row label="Require minimum sample size" isDark={isDark}>
          <button
            onClick={() => setRequireMinSample(!requireMinSample)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              requireMinSample ? "bg-brand-violet" : isDark ? "bg-white/20" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                requireMinSample ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </Row>
        <div className="pt-2">
          <button
            onClick={handleSaveDefaults}
            className="w-full text-sm px-4 py-2 rounded-lg bg-brand-violet text-white hover:bg-brand-violet/90 transition-colors"
          >
            Save defaults
          </button>
        </div>
      </Card>

      <Card title="Statistical Settings" isDark={isDark}>
        <Row label="Statistical method" isDark={isDark}>
          <select
            value={statMethod}
            onChange={(e) => setStatMethod(e.target.value)}
            className={`px-3 py-1.5 text-sm rounded-lg border ${
              isDark
                ? "bg-[#0D0E1A] border-white/10 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="frequentist">Frequentist</option>
            <option value="bayesian">Bayesian</option>
          </select>
        </Row>
        <Row label="Confidence level" isDark={isDark}>
          <select
            value={confidenceLevel}
            onChange={(e) => setConfidenceLevel(Number(e.target.value))}
            className={`px-3 py-1.5 text-sm rounded-lg border ${
              isDark
                ? "bg-[#0D0E1A] border-white/10 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value={90}>90%</option>
            <option value={95}>95%</option>
            <option value={99}>99%</option>
          </select>
        </Row>
        <Row label="Significance threshold" isDark={isDark}>
          <select
            value={significance}
            onChange={(e) => setSignificance(Number(e.target.value))}
            className={`px-3 py-1.5 text-sm rounded-lg border ${
              isDark
                ? "bg-[#0D0E1A] border-white/10 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value={0.01}>0.01</option>
            <option value={0.05}>0.05</option>
            <option value={0.10}>0.10</option>
          </select>
        </Row>
        <Row label="Multiple comparison correction" isDark={isDark}>
          <select
            value={correction}
            onChange={(e) => setCorrection(e.target.value)}
            className={`px-3 py-1.5 text-sm rounded-lg border ${
              isDark
                ? "bg-[#0D0E1A] border-white/10 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="none">None</option>
            <option value="bonferroni">Bonferroni</option>
            <option value="holm">Holm</option>
            <option value="fdr">FDR</option>
          </select>
        </Row>
        <div className="pt-2">
          <button
            onClick={handleSaveStats}
            className="w-full text-sm px-4 py-2 rounded-lg bg-brand-violet text-white hover:bg-brand-violet/90 transition-colors"
          >
            Save statistics
          </button>
        </div>
      </Card>
    </div>
  );
}

// 4. Developer
function DeveloperTab({
  isDark,
  apiKeys,
  loadingKeys,
  canManageKeys,
  onNewKey,
  onRevoke,
  revokingId,
  orgId,
  webhookUrl,
  setWebhookUrl,
  webhookEvents,
  toggleWebhookEvent,
  loadingWebhook,
  savingWebhook,
  testingWebhook,
  onSaveWebhook,
  onTestWebhook,
}) {
  const WEBHOOK_EVENT_OPTIONS = [
    { value: "srm_detected", label: "Sample ratio mismatch" },
    { value: "significance_reached", label: "Significance reached" },
    { value: "anomaly_detected", label: "Anomaly detected" },
  ];

  return (
    <div className="space-y-5 max-w-2xl">
      {/* API Keys */}
      <Card title="API Keys" isDark={isDark}>
        <Row
          label="SDK authentication"
          description="Keys the client SDK sends as X-API-Key to /assign and tracking calls"
          isDark={isDark}
        >
          {canManageKeys && (
            <button
              onClick={onNewKey}
              className="text-xs px-3 py-2 rounded-lg bg-brand-violet text-white hover:bg-brand-violet/90 transition-colors"
            >
              + New key
            </button>
          )}
        </Row>

        {loadingKeys ? (
          <p className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>Loading…</p>
        ) : apiKeys.length === 0 ? (
          <p className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>
            No API keys yet. {canManageKeys ? "Create one to start using the SDK." : "Ask an admin to create one."}
          </p>
        ) : (
          <div className="space-y-2">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className={`flex items-center justify-between gap-4 px-3.5 py-3 rounded-xl border ${
                  isDark ? "bg-white/[0.03] border-white/[0.06]" : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${isDark ? "text-white/85" : "text-gray-800"}`}>
                    {key.name}
                    {key.revoked_at && (
                      <span className="ml-2 text-xs font-normal text-red-400">revoked</span>
                    )}
                  </p>
                  <p className={`font-mono text-xs mt-0.5 ${isDark ? "text-white/35" : "text-gray-500"}`}>
                    {key.key_prefix}••••••••
                  </p>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-white/25" : "text-gray-400"}`}>
                    {key.last_used_at
                      ? `Last used ${new Date(key.last_used_at).toLocaleDateString()}`
                      : "Never used"}
                  </p>
                </div>
                {canManageKeys && !key.revoked_at && (
                  <button
                    onClick={() => onRevoke(key.id, key.name)}
                    disabled={revokingId === key.id}
                    className="flex-shrink-0 text-xs px-3 py-2 rounded-lg text-red-400 bg-red-400/10 border border-red-400/20 hover:bg-red-400/20 transition-colors disabled:opacity-50"
                  >
                    {revokingId === key.id ? "Revoking…" : "Revoke"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <Row label="Backend URL" description="Pass this as apiUrl in ExperimentX.init()" isDark={isDark}>
          <span className={`font-mono text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>
            {import.meta.env.VITE_API_URL || "localhost:8000"}
          </span>
        </Row>
      </Card>

      {/* Webhooks */}
      <Card title="Webhooks" isDark={isDark}>
        <Row
          label="Slack / webhook URL"
          description="Fires when the events below happen on any running experiment"
          isDark={isDark}
        >
          {null}
        </Row>

        {loadingWebhook ? (
          <p className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>Loading…</p>
        ) : (
          <>
            <input
              type="text"
              placeholder="https://hooks.slack.com/services/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              disabled={!canManageKeys}
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-violet/25 transition-all disabled:opacity-50 ${
                isDark
                  ? "bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-brand-violet/50"
                  : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-brand-violet"
              }`}
            />

            <div className="flex flex-wrap gap-2 mt-3">
              {WEBHOOK_EVENT_OPTIONS.map((opt) => {
                const active = webhookEvents.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={!canManageKeys}
                    onClick={() => toggleWebhookEvent(opt.value)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors disabled:opacity-50 ${
                      active
                        ? "bg-brand-violet/15 border-brand-violet/40 text-brand-violet"
                        : isDark
                        ? "border-white/[0.08] text-white/40 hover:text-white/70"
                        : "border-gray-200 text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {canManageKeys && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={onSaveWebhook}
                  disabled={savingWebhook}
                  className="text-xs px-3.5 py-2 rounded-lg bg-brand-violet text-white hover:bg-brand-violet/90 transition-colors disabled:opacity-50"
                >
                  {savingWebhook ? "Saving…" : "Save"}
                </button>
                <button
                  onClick={onTestWebhook}
                  disabled={testingWebhook || !webhookUrl}
                  className={`text-xs px-3.5 py-2 rounded-lg border transition-colors disabled:opacity-50 ${
                    isDark ? "border-white/[0.08] text-white/60 hover:text-white" : "border-gray-200 text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {testingWebhook ? "Sending…" : "Send test alert"}
                </button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}

// ---------- Main Settings Component ----------
export default function Settings() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { user, clearAuth } = useAuth();
  const canManageKeys = usePermission("admin");
  const navigate = useNavigate();

  const [loggingOut, setLoggingOut] = useState(false);
  const orgId = user?.organization_id;

  // API keys state
  const [apiKeys, setApiKeys] = useState([]);
  const [loadingKeys, setLoadingKeys] = useState(true);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [revokingId, setRevokingId] = useState(null);

  // Webhook state
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookEvents, setWebhookEvents] = useState([]);
  const [loadingWebhook, setLoadingWebhook] = useState(true);
  const [savingWebhook, setSavingWebhook] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState("account");

  const loadKeys = async () => {
    if (!orgId) return;
    try {
      const res = await listApiKeys(orgId);
      setApiKeys(res.data);
    } catch (err) {
      console.error("Failed to load API keys:", err);
      toast.error("Could not load API keys");
    } finally {
      setLoadingKeys(false);
    }
  };

  const loadWebhookSettings = async () => {
    if (!orgId) return;
    try {
      const res = await getWebhookSettings(orgId);
      setWebhookUrl(res.data.webhook_url || "");
      setWebhookEvents(res.data.webhook_events || []);
    } catch (err) {
      console.error("Failed to load webhook settings:", err);
    } finally {
      setLoadingWebhook(false);
    }
  };

  useEffect(() => {
    loadKeys();
    loadWebhookSettings();
  }, [orgId]);

  const handleRevoke = async (keyId, name) => {
    if (!window.confirm(`Revoke "${name}"? Anything using this key will stop working immediately.`)) {
      return;
    }
    setRevokingId(keyId);
    try {
      await revokeApiKey(orgId, keyId);
      toast.success(`"${name}" revoked`);
      loadKeys();
    } catch (err) {
      toast.error("Failed to revoke key");
    } finally {
      setRevokingId(null);
    }
  };

  const toggleWebhookEvent = (value) => {
    setWebhookEvents((prev) =>
      prev.includes(value) ? prev.filter((e) => e !== value) : [...prev, value]
    );
  };

  const handleSaveWebhook = async () => {
    if (webhookUrl && !/^https?:\/\//.test(webhookUrl)) {
      toast.error("Webhook URL must start with http:// or https://");
      return;
    }
    setSavingWebhook(true);
    try {
      await updateWebhookSettings(orgId, webhookUrl, webhookEvents);
      toast.success("Webhook settings saved");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to save webhook settings");
    } finally {
      setSavingWebhook(false);
    }
  };

  const handleTestWebhook = async () => {
    setTestingWebhook(true);
    try {
      const res = await testWebhook(orgId);
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to send test alert");
    } finally {
      setTestingWebhook(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    clearAuth();
    navigate("/login");
  };

  // Tabs configuration
  const tabs = [
    { id: "account", label: "Account" },
    { id: "workspace", label: "Workspace" },
    { id: "experiments", label: "Experiments" },
    { id: "developer", label: "Developer" },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className={`text-xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          Settings
        </h1>
        <p className={`text-sm mt-0.5 ${isDark ? "text-white/35" : "text-gray-500"}`}>
          Manage your account, workspace, and experimentation platform
        </p>
      </div>

      {/* Horizontal Tabs */}
      <div className={`border-b ${isDark ? "border-white/[0.06]" : "border-gray-200"}`}>
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? isDark
                    ? "text-white"
                    : "text-gray-900"
                  : isDark
                  ? "text-white/40 hover:text-white/70"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="settingsTabIndicator"
                  className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                    isDark ? "bg-white" : "bg-gray-900"
                  }`}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-2">
        {activeTab === "account" && (
          <AccountTab user={user} isDark={isDark} onLogout={handleLogout} loggingOut={loggingOut} />
        )}
        {activeTab === "workspace" && (
          <WorkspaceTab user={user} isDark={isDark} />
        )}
        {activeTab === "experiments" && (
          <ExperimentsTab isDark={isDark} />
        )}
        {activeTab === "developer" && (
          <DeveloperTab
            isDark={isDark}
            apiKeys={apiKeys}
            loadingKeys={loadingKeys}
            canManageKeys={canManageKeys}
            onNewKey={() => setShowNewKeyModal(true)}
            onRevoke={handleRevoke}
            revokingId={revokingId}
            orgId={orgId}
            webhookUrl={webhookUrl}
            setWebhookUrl={setWebhookUrl}
            webhookEvents={webhookEvents}
            toggleWebhookEvent={toggleWebhookEvent}
            loadingWebhook={loadingWebhook}
            savingWebhook={savingWebhook}
            testingWebhook={testingWebhook}
            onSaveWebhook={handleSaveWebhook}
            onTestWebhook={handleTestWebhook}
          />
        )}
      </div>

      {/* New API Key Modal */}
      {showNewKeyModal && (
        <NewApiKeyModal
          orgId={orgId}
          isDark={isDark}
          onClose={() => setShowNewKeyModal(false)}
          onCreated={loadKeys}
        />
      )}
    </div>
  );
}