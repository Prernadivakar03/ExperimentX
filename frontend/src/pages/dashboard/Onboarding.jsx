import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

const STEPS = [
  {
    n: 1,
    icon: "🧪",
    title: "Create your first experiment",
    desc: "Name it, set a goal (purchase, signup, click), and define two variants. Takes 2 minutes.",
    action: "Go to Experiments",
    target: "experiments",
    color: "from-brand-violet to-purple-600",
  },
  {
    n: 2,
    icon: "⚡",
    title: "Install the SDK",
    desc: "One npm install and three lines of code. Works with React, Next.js, Vue, Node.js, and Python.",
    action: "View SDK docs",
    target: "sdk",
    color: "from-brand-blue to-cyan-500",
  },
  {
    n: 3,
    icon: "📊",
    title: "Watch results roll in",
    desc: "Your analytics update in real time. The AI will tell you when a winner is found.",
    action: "Open analytics",
    target: "analytics",
    color: "from-emerald-500 to-teal-500",
  },
];

export default function Onboarding({ onNavigate }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { user } = useAuth();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Welcome heading */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-violet to-brand-blue flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(108,92,231,0.4)]">
            <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
              <path d="M6 6L34 34M34 6L6 34" stroke="white" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className={`text-2xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Welcome, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className={`text-sm mt-2 max-w-sm mx-auto ${isDark ? "text-white/40" : "text-gray-500"}`}>
            ExperimentX is your AI-powered A/B testing copilot. Here's how to run your first experiment.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className={`relative flex items-start gap-5 p-5 rounded-2xl border transition-all group cursor-pointer ${
                isDark
                  ? "bg-[#0D0E1A] border-white/[0.07] hover:border-white/[0.15]"
                  : "bg-white border-gray-200 shadow-sm hover:border-gray-300 hover:shadow"
              }`}
              onClick={() => onNavigate?.(step.target)}
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-xl flex-shrink-0`}>
                {step.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold ${isDark ? "text-white/20" : "text-gray-300"}`}>
                    STEP {step.n}
                  </span>
                </div>
                <p className={`text-sm font-semibold mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>
                  {step.title}
                </p>
                <p className={`text-xs mt-1 ${isDark ? "text-white/35" : "text-gray-400"}`}>
                  {step.desc}
                </p>
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium flex-shrink-0 mt-1 ${
                isDark ? "text-brand-violet" : "text-brand-violet"
              } opacity-0 group-hover:opacity-100 transition-opacity`}>
                {step.action}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`mt-6 flex items-start gap-3 p-4 rounded-xl border ${
            isDark ? "bg-brand-violet/5 border-brand-violet/20" : "bg-brand-violet/[0.04] border-brand-violet/15"
          }`}
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-violet to-brand-blue flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
            AI
          </div>
          <div>
            <p className={`text-xs font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>
              Tip from your AI Copilot
            </p>
            <p className={`text-xs mt-0.5 ${isDark ? "text-white/35" : "text-gray-500"}`}>
              Not sure what to test? Go to AI Insights → Experiment Planner and type your business goal. The AI will generate a complete experiment for you in seconds.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

















































// import { motion } from "framer-motion";
// import { useTheme } from "../../context/ThemeContext";
// import { useAuth } from "../../context/AuthContext";

// const STEPS = [
//   {
//     id: "create",
//     title: "Create your first experiment",
//     desc: "Name it, set a goal (purchase, signup, click), and define two variants. Takes 2 minutes.",
//     action: "Go to Experiments",
//     target: "experiments",
//     color: "from-brand-violet to-purple-600",
//   },
//   {
//     id: "sdk",
//     title: "Install the SDK",
//     desc: "One npm install and three lines of code. Works with React, Next.js, Vue, Node.js, and Python.",
//     action: "View SDK docs",
//     target: "sdk",
//     color: "from-brand-blue to-cyan-500",
//   },
//   {
//     id: "analytics",
//     title: "Watch results roll in",
//     desc: "Your analytics update in real time. The AI will tell you when a winner is found.",
//     action: "Open analytics",
//     target: "analytics",
//     color: "from-emerald-500 to-teal-500",
//   },
// ];

// // Mock data for dashboard after onboarding
// const MOCK_STATS = {
//   running: 4,
//   activeUsers: 284,
//   conversionRate: "3.8%",
//   winningVariant: "B",
//   revenueLift: "+12.4%",
//   trafficToday: 1247,
// };

// const MOCK_RECENT = [
//   { name: "Pricing page CTA test", status: "Running", date: "2h ago" },
//   { name: "Checkout button color", status: "Won (B)", date: "1d ago" },
//   { name: "Signup form length", status: "Analyzing", date: "3d ago" },
// ];

// export default function Onboarding({
//   onNavigate,
//   stepStatus = [false, false, false], // array of booleans for each step
//   onCreateExperiment,
//   onOpenAIPlanner,
// }) {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";
//   const { user } = useAuth();

//   const allStepsDone = stepStatus.every(Boolean);
//   const completedCount = stepStatus.filter(Boolean).length;

//   // Determine greeting based on time
//   const hour = new Date().getHours();
//   let greeting = "Good morning";
//   if (hour >= 12 && hour < 18) greeting = "Good afternoon";
//   else if (hour >= 18) greeting = "Good evening";

//   const displayName = user?.name?.split(" ")[0] || "there";

//   return (
//     <div className="min-h-[70vh] py-6 px-4 bg-[#FAFBFC] dark:bg-[#0D0E1A] transition-colors">
//       <div className="max-w-7xl mx-auto">
//         {/* Header row with greeting and action button */}
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className={`text-2xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
//               {greeting}, {displayName}
//             </h1>
//             <p className={`text-sm mt-0.5 ${isDark ? "text-white/40" : "text-gray-500"}`}>
//               {allStepsDone
//                 ? "Here's what's happening with your experiments."
//                 : "Let's get your first experiment running."}
//             </p>
//           </div>
//           <button
//             onClick={onCreateExperiment}
//             className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-brand-violet to-brand-blue shadow-sm hover:shadow-md transition-shadow flex items-center gap-2"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
//               <path strokeLinecap="round" d="M12 4v16M4 12h16" />
//             </svg>
//             Create Experiment
//           </button>
//         </div>

//         {/* Two‑column layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left column – Main content */}
//           <div className="lg:col-span-2 space-y-6">
//             {!allStepsDone ? (
//               // Onboarding checklist
//               <>
//                 {/* Progress indicator */}
//                 <div className="flex items-center gap-3">
//                   <span className={`text-xs font-medium ${isDark ? "text-white/30" : "text-gray-400"}`}>
//                     Getting started
//                   </span>
//                   <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-white/10">
//                     <div
//                       className="h-full rounded-full bg-gradient-to-r from-brand-violet to-brand-blue transition-all duration-500"
//                       style={{ width: `${(completedCount / STEPS.length) * 100}%` }}
//                     />
//                   </div>
//                   <span className={`text-xs font-medium ${isDark ? "text-white/40" : "text-gray-500"}`}>
//                     {completedCount}/{STEPS.length}
//                   </span>
//                 </div>

//                 {/* Step cards with status badges */}
//                 {STEPS.map((step, index) => {
//                   const isDone = stepStatus[index];
//                   return (
//                     <motion.div
//                       key={step.id}
//                       initial={{ opacity: 0, y: 16 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.05 * index }}
//                       className={`relative flex items-start gap-4 p-4 rounded-xl border transition-all group cursor-pointer ${
//                         isDone
//                           ? isDark
//                             ? "bg-white/[0.03] border-white/[0.05] opacity-70"
//                             : "bg-gray-50 border-gray-200 opacity-70"
//                           : isDark
//                           ? "bg-[#0D0E1A] border-white/[0.07] hover:border-white/[0.15] hover:shadow-lg hover:-translate-y-0.5"
//                           : "bg-white border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5"
//                       }`}
//                       onClick={() => onNavigate?.(step.target)}
//                     >
//                       {/* Icon or checkmark */}
//                       <div
//                         className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
//                           isDone
//                             ? "bg-emerald-500/10 text-emerald-500"
//                             : `bg-gradient-to-br ${step.color} text-white`
//                         }`}
//                       >
//                         {isDone ? (
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                           </svg>
//                         ) : (
//                           step.icon
//                         )}
//                       </div>

//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2">
//                           <span
//                             className={`text-[10px] font-bold ${
//                               isDone
//                                 ? "text-emerald-500"
//                                 : isDark
//                                 ? "text-white/20"
//                                 : "text-gray-300"
//                             }`}
//                           >
//                             {String(index + 1).padStart(2, "0")}
//                           </span>
//                           {isDone && (
//                             <span className="text-[9px] font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
//                               Complete
//                             </span>
//                           )}
//                         </div>
//                         <p
//                           className={`text-sm font-semibold mt-0.5 ${
//                             isDone
//                               ? isDark
//                                 ? "text-white/50"
//                                 : "text-gray-500"
//                               : isDark
//                               ? "text-white"
//                               : "text-gray-900"
//                           }`}
//                         >
//                           {step.title}
//                         </p>
//                         <p
//                           className={`text-xs mt-1 ${
//                             isDone
//                               ? isDark
//                                 ? "text-white/20"
//                                 : "text-gray-400"
//                               : isDark
//                               ? "text-white/35"
//                               : "text-gray-400"
//                           }`}
//                         >
//                           {step.desc}
//                         </p>
//                       </div>

//                       {!isDone && (
//                         <div
//                           className={`flex items-center gap-1 text-xs font-medium flex-shrink-0 mt-1 ${
//                             isDark ? "text-brand-violet" : "text-brand-violet"
//                           } opacity-0 group-hover:opacity-100 transition-opacity`}
//                         >
//                           {step.action}
//                           <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
//                             <path strokeLinecap="round" d="M9 5l7 7-7 7" />
//                           </svg>
//                         </div>
//                       )}
//                     </motion.div>
//                   );
//                 })}
//               </>
//             ) : (
//               // Dashboard after completion
//               <div className="space-y-6">
//                 {/* KPI cards */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   {[
//                     { label: "Visitors", value: "12.4k", change: "+8.2%" },
//                     { label: "Conversion Rate", value: "3.8%", change: "+0.6%" },
//                     { label: "Running Experiments", value: "4", change: "+1" },
//                     { label: "Revenue Lift", value: "+12.4%", change: "+2.1%" },
//                   ].map((stat) => (
//                     <div
//                       key={stat.label}
//                       className={`p-4 rounded-xl border ${
//                         isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"
//                       }`}
//                     >
//                       <p className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>{stat.label}</p>
//                       <p className={`text-xl font-bold mt-1 ${isDark ? "text-white" : "text-gray-900"}`}>
//                         {stat.value}
//                       </p>
//                       <p className="text-[10px] text-emerald-500 mt-0.5">{stat.change}</p>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Recent Experiments */}
//                 <div
//                   className={`p-4 rounded-xl border ${
//                     isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"
//                   }`}
//                 >
//                   <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? "text-white/30" : "text-gray-400"}`}>
//                     Recent Activity
//                   </p>
//                   <div className="space-y-3">
//                     {MOCK_RECENT.map((exp, idx) => (
//                       <div key={idx} className="flex items-center justify-between">
//                         <div>
//                           <p className={`text-sm font-medium ${isDark ? "text-white/80" : "text-gray-800"}`}>{exp.name}</p>
//                           <p className={`text-[10px] ${isDark ? "text-white/20" : "text-gray-400"}`}>{exp.date}</p>
//                         </div>
//                         <span
//                           className={`text-[10px] font-medium px-2 py-1 rounded-full ${
//                             exp.status === "Running"
//                               ? "bg-brand-blue/10 text-brand-blue"
//                               : exp.status.startsWith("Won")
//                               ? "bg-emerald-500/10 text-emerald-500"
//                               : "bg-amber-500/10 text-amber-500"
//                           }`}
//                         >
//                           {exp.status}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right column – Quick Stats + AI Tip (always visible) */}
//           <div className="space-y-6">
//             {/* Quick Stats */}
//             <div
//               className={`p-4 rounded-xl border ${
//                 isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"
//               }`}
//             >
//               <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? "text-white/30" : "text-gray-400"}`}>
//                 Quick Stats
//               </p>
//               <div className="space-y-2">
//                 {[
//                   { label: "Running Experiments", value: MOCK_STATS.running },
//                   { label: "Visitors", value: "12.4k" },
//                   { label: "Conversions", value: "471" },
//                   { label: "Winning Variant", value: MOCK_STATS.winningVariant || "—" },
//                 ].map((stat) => (
//                   <div key={stat.label} className="flex items-center justify-between">
//                     <span className={`text-xs ${isDark ? "text-white/40" : "text-gray-500"}`}>{stat.label}</span>
//                     <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
//                       {stat.value}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* AI Tip Callout */}
//             <div
//               className={`p-5 rounded-xl border ${
//                 isDark
//                   ? "bg-gradient-to-br from-brand-violet/5 to-brand-blue/5 border-brand-violet/20"
//                   : "bg-gradient-to-br from-brand-violet/[0.04] to-brand-blue/[0.04] border-brand-violet/15"
//               }`}
//             >
//               <div className="flex items-start gap-3">
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-violet to-brand-blue flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
//                   AI
//                 </div>
//                 <div>
//                   <p className={`text-sm font-medium ${isDark ? "text-white/80" : "text-gray-800"}`}>Need inspiration?</p>
//                   <p className={`text-xs mt-1 ${isDark ? "text-white/40" : "text-gray-500"}`}>
//                     Open AI Planner and describe your business goal. We'll generate hypotheses, variants, and success metrics in seconds.
//                   </p>
//                   <button
//                     onClick={onOpenAIPlanner}
//                     className={`mt-3 text-xs font-medium px-3 py-1.5 rounded-lg border ${
//                       isDark
//                         ? "border-brand-violet/30 text-brand-violet hover:bg-brand-violet/10"
//                         : "border-brand-violet/20 text-brand-violet hover:bg-brand-violet/5"
//                     } transition-colors`}
//                   >
//                     Open AI Planner →
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }