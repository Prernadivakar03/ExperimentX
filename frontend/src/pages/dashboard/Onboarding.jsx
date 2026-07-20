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
