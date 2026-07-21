
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { LogoMark } from "../../components/Logo";
import {
  FlaskConical,
  Zap,
  BarChart3,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const STEPS = [
  {
    n: 1,
    icon: FlaskConical,
    title: "Create your first experiment",
    desc: "Name it, set a goal (purchase, signup, click), and define two variants. Takes 2 minutes.",
    action: "Go to Experiments",
    target: "/experiments",
    color: "from-brand-violet to-purple-600",
  },
  {
    n: 2,
    icon: Zap,
    title: "Install the SDK",
    desc: "One npm install and three lines of code. Works with React, Next.js, Vue, Node.js, and Python.",
    action: "View SDK docs",
    target: "/sdk",
    color: "from-brand-blue to-cyan-500",
  },
  {
    n: 3,
    icon: BarChart3,
    title: "Watch results roll in",
    desc: "Your analytics update in real time. The AI will tell you when a winner is found.",
    action: "Open analytics",
    target: "/analytics",
    color: "from-emerald-500 to-teal-500",
  },
];

export default function Onboarding() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { user } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className={`relative min-h-screen flex items-center justify-center py-12 px-4 overflow-hidden transition-colors duration-500 ${
      isDark ? "bg-[#0B0A1A]" : "bg-slate-50"
    }`}>
      {/* Background pattern + glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-violet/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl" />
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            isDark ? "opacity-[0.04]" : "opacity-[0.06]"
          }`}
          style={{
            backgroundImage: `radial-gradient(circle, ${isDark ? "#fff" : "#6C5CE7"} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex justify-center mb-4"
          >
            <LogoMark size={62} className="flex-shrink-0" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={`text-3xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Welcome, {firstName} 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-sm mt-2 max-w-sm mx-auto ${isDark ? "text-white/40" : "text-gray-500"}`}
          >
            ExperimentX is your AI-powered A/B testing copilot. Here's how to run your first experiment.
          </motion.p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mb-6">
          {STEPS.map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 200 }}
              className={`h-1.5 w-8 rounded-full transition-all duration-500 ${
                i === 0
                  ? "bg-gradient-to-r from-brand-violet to-brand-blue"
                  : isDark
                  ? "bg-white/10"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: isDark
                    ? "0 8px 30px rgba(108,92,231,0.25)"
                    : "0 8px 30px rgba(0,0,0,0.1)",
                  transition: { duration: 0.2 },
                }}
                className={`relative flex items-start gap-5 p-5 rounded-2xl border transition-all group cursor-pointer ${
                  isDark
                    ? "bg-[#0D0E1A] border-white/[0.07] hover:border-brand-violet/30"
                    : "bg-white border-gray-200 shadow-sm hover:border-brand-violet/20 hover:shadow-md"
                }`}
                onClick={() => navigate(step.target)}
              >
                {/* Step number badge */}
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-brand-violet to-brand-blue flex items-center justify-center text-white text-[10px] font-bold shadow-lg">
                  {step.n}
                </div>

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white flex-shrink-0 shadow-lg`}
                >
                  <Icon size={22} strokeWidth={2} />
                </div>

                <div className="flex-1">
                  <p className={`text-sm font-semibold mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>
                    {step.title}
                  </p>
                  <p className={`text-xs mt-1 ${isDark ? "text-white/35" : "text-gray-400"}`}>
                    {step.desc}
                  </p>
                </div>

                <div
                  className={`flex items-center gap-1 text-xs font-medium flex-shrink-0 mt-1 ${
                    isDark ? "text-brand-violet" : "text-brand-violet"
                  } opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2`}
                >
                  {step.action}
                  <ArrowRight size={14} strokeWidth={2.5} />
                </div>

                <div
                  className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
                    isDark
                      ? "shadow-[0_0_30px_rgba(108,92,231,0.15)]"
                      : "shadow-[0_0_30px_rgba(108,92,231,0.08)]"
                  }`}
                />
              </motion.div>
            );
          })}
        </div>

        {/* AI Tip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.01 }}
          className={`mt-8 flex items-start gap-4 p-5 rounded-xl border relative overflow-hidden ${
            isDark
              ? "bg-gradient-to-br from-brand-violet/10 to-brand-blue/5 border-brand-violet/20"
              : "bg-gradient-to-br from-brand-violet/[0.06] to-brand-blue/[0.04] border-brand-violet/15"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />

          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-violet to-brand-blue flex items-center justify-center text-white flex-shrink-0 shadow-md">
            <Sparkles size={18} strokeWidth={2} />
          </div>
          <div>
            <p className={`text-xs font-semibold ${isDark ? "text-white/80" : "text-gray-800"}`}>
              Tip from your AI Copilot
            </p>
            <p className={`text-xs mt-0.5 ${isDark ? "text-white/40" : "text-gray-500"}`}>
              Not sure what to test? Go to{" "}
              <span className="font-medium text-brand-violet">AI Insights → Experiment Planner</span> and type your business goal. The AI will generate a complete experiment for you in seconds.
            </p>
          </div>
        </motion.div>

        {/* Skip button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => navigate("/dashboard")}
            className={`text-xs font-medium px-6 py-2.5 rounded-full border transition-all hover:scale-105 hover:shadow-md ${
              isDark
                ? "border-white/10 text-white/40 hover:text-white hover:border-white/30 bg-white/[0.03]"
                : "border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 bg-white/60"
            }`}
          >
            Skip, take me to dashboard →
          </button>
        </motion.div>
      </motion.div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2.5s infinite;
        }
      `}</style>
    </div>
  );
}