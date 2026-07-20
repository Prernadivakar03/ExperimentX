
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Pen,
  Search,
  BarChart,
  FileText,
  MessageSquare,
  Trophy,
  Sparkles,
  Send,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  Target,
  Users,
  AlertCircle,
  Zap,
  Activity,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import api from "../../services/api";

const AGENTS = [
  {
    id: "planner",
    name: "Experiment Planner",
    icon: Brain,
    color: "from-purple-500 to-brand-violet",
    desc: "Turns a business goal into a complete experiment plan",
    placeholder: "e.g. I want to increase checkout conversions on my pricing page",
    endpoint: "/ai/plan-experiment",
    bodyKey: "goal",
  },
  {
    id: "variant",
    name: "Variant Generator",
    icon: Pen,
    color: "from-brand-blue to-cyan-500",
    desc: "Generates optimized copy variants for any element",
    placeholder: "e.g. Generate 5 CTA button variants for a SaaS pricing page",
    endpoint: "/ai/generate-variants",
    bodyKey: "element",
  },
  {
    id: "reviewer",
    name: "Experiment Reviewer",
    icon: Search,
    color: "from-emerald-500 to-teal-500",
    desc: "Reviews your experiment config before you launch",
    placeholder: "e.g. Homepage headline test, goal: signup, 14 days, 50% traffic",
    endpoint: "/ai/review-experiment",
    bodyKey: "name",
  },
  {
    id: "analyst",
    name: "Analytics Interpreter",
    icon: BarChart,
    color: "from-amber-500 to-orange-500",
    desc: "Explains your real experiment results in plain English",
    placeholder: "Select an experiment below to interpret its real results",
    endpoint: "/ai/interpret-results",
    bodyKey: "experiment_id",
  },
  {
    id: "report",
    name: "Report Generator",
    icon: FileText,
    color: "from-rose-500 to-pink-500",
    desc: "Writes a full professional report from your real data",
    placeholder: "Select an experiment below to generate its report",
    endpoint: "/ai/generate-report",
    bodyKey: "experiment_id",
  },
  {
    id: "chat",
    name: "AI Copilot Chat",
    icon: MessageSquare,
    color: "from-fuchsia-500 to-brand-violet",
    desc: "Ask anything about A/B testing or optimization",
    placeholder: "Ask me anything about your experiments...",
    endpoint: "/ai/chat",
    bodyKey: "message",
  },
];

const EXAMPLE_PROMPTS = [
  "Increase checkout conversion",
  "Generate CTA variants",
  "Review my pricing page experiment",
  "Explain why Variant B won",
];

// Typing effect hook
const useTyping = (text, speed = 20) => {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text.charAt(index));
        setIndex(index + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  useEffect(() => {
    setDisplayText("");
    setIndex(0);
  }, [text]);

  return displayText;
};

// Metric card component – icons are in circles
function MetricCard({ label, value, icon: Icon, color, subtext, progress }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border bg-white/5 border-white/10 backdrop-blur-sm flex-1 min-w-[100px]">
      <div className={`p-2 rounded-full bg-gradient-to-br ${color} text-white shadow-lg`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">{label}</p>
        <p className="text-sm font-semibold text-white/90">{value}</p>
        {subtext && <p className="text-[10px] text-white/30 mt-0.5">{subtext}</p>}
        {progress !== undefined && (
          <div className="h-1 w-full bg-white/10 rounded-full mt-1">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-violet to-brand-blue" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}

function StructuredResult({ data, agentId, isDark }) {
  const [expanded, setExpanded] = useState(true);
  const toggleExpand = () => setExpanded(!expanded);

  const cardBase = `p-3 rounded-xl border mb-3 transition-all ${
    isDark
      ? "bg-white/5 border-white/10 backdrop-blur-sm"
      : "bg-white/80 border-gray-200/80 backdrop-blur-sm shadow-sm"
  }`;
  const label = `text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
    isDark ? "text-white/30" : "text-gray-400"
  }`;
  const val = `text-sm font-medium ${isDark ? "text-white/80" : "text-gray-800"}`;

  if (agentId === "planner") {
    const steps = [
      { icon: Target, label: "Goal", value: data.name },
      { icon: Brain, label: "Hypothesis", value: data.hypothesis },
      { icon: Users, label: "Variants", value: data.variants?.map(v => v.label).join(", ") },
      { icon: BarChart, label: "Primary Metric", value: data.primary_metric },
      { icon: Clock, label: "Duration", value: `${data.estimated_duration_days} days` },
      { icon: Activity, label: "Traffic", value: `${data.recommended_traffic_pct}%` },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex justify-between items-center">
          <p className="text-xs font-medium text-white/30">Workflow</p>
          <button onClick={toggleExpand} className="p-1 rounded hover:bg-white/10">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 overflow-hidden"
            >
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-violet to-brand-blue flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">{step.label}</p>
                    <p className={`text-sm font-medium ${isDark ? "text-white/80" : "text-gray-800"}`}>{step.value}</p>
                  </div>
                </div>
              ))}
              <div className="mt-2 p-3 rounded-xl border border-white/10 bg-white/5">
                <div className="flex justify-between mb-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">Confidence</p>
                  <span className="text-sm font-bold text-brand-violet">{data.confidence_score}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-violet to-brand-blue" style={{ width: `${data.confidence_score}%` }} />
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-brand-violet to-brand-blue text-white shadow-lg hover:shadow-xl transition-shadow"
              >
                Create Experiment →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  if (agentId === "variant") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        {data.variants?.map((v, idx) => (
          <motion.div
            key={v.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`${cardBase} flex items-start justify-between gap-3`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs font-bold ${
                    v.label === "A"
                      ? "text-brand-violet"
                      : v.label === "B"
                      ? "text-brand-blue"
                      : "text-emerald-500"
                  }`}
                >
                  {v.label}
                </span>
                <span className={`text-xs ${isDark ? "text-white/35" : "text-gray-400"}`}>
                  {v.name}
                </span>
                {data.recommended === v.label && (
                  <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                    RECOMMENDED
                  </span>
                )}
              </div>
              <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                "{v.copy}"
              </p>
              <p className={`text-xs mt-1 ${isDark ? "text-white/35" : "text-gray-500"}`}>
                {v.rationale}
              </p>
            </div>
            <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex-shrink-0">
              {v.predicted_lift}
            </span>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (agentId === "reviewer") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div
          className={`flex items-center justify-between p-3 rounded-xl border ${
            data.ready_to_launch
              ? "bg-emerald-500/10 border-emerald-500/20"
              : "bg-red-400/10 border-red-400/20"
          }`}
        >
          <span
            className={`text-sm font-bold ${
              data.ready_to_launch ? "text-emerald-500" : "text-red-400"
            }`}
          >
            {data.ready_to_launch ? (
              <><CheckCircle size={16} className="inline mr-1" /> Ready to launch</>
            ) : (
              <><AlertCircle size={16} className="inline mr-1" /> Not ready</>
            )}
          </span>
          <span className="text-sm font-bold text-brand-violet">
            {data.confidence_score}% confidence
          </span>
        </div>
        {data.passed?.length > 0 && (
          <div className={cardBase}>
            <p className={label}>Passed</p>
            {data.passed.map((p, i) => (
              <p key={i} className="text-xs text-emerald-500 mt-1">
                <CheckCircle size={12} className="inline mr-1" /> {p}
              </p>
            ))}
          </div>
        )}
        {data.warnings?.length > 0 && (
          <div className={cardBase}>
            <p className={label}>Warnings</p>
            {data.warnings.map((w, i) => (
              <p key={i} className="text-xs text-amber-500 mt-1">
                <AlertCircle size={12} className="inline mr-1" /> {w}
              </p>
            ))}
          </div>
        )}
        {data.errors?.length > 0 && (
          <div className={cardBase}>
            <p className={label}>Errors</p>
            {data.errors.map((e, i) => (
              <p key={i} className="text-xs text-red-400 mt-1">
                ✗ {e}
              </p>
            ))}
          </div>
        )}
        {data.suggestions?.length > 0 && (
          <div className={cardBase}>
            <p className={label}>Suggestions</p>
            {data.suggestions.map((s, i) => (
              <p
                key={i}
                className={`text-xs mt-1 ${isDark ? "text-white/55" : "text-gray-600"}`}
              >
                → {s}
              </p>
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  if (agentId === "analyst") {
    const metrics = [
      { label: "Winner", value: data.winner !== "None" ? `Variant ${data.winner}` : "None", icon: Trophy, color: "from-emerald-500 to-teal-500" },
      { label: "Lift", value: data.lift, icon: Zap, color: "from-amber-500 to-orange-500" },
      { label: "Confidence", value: "96%", icon: Activity, color: "from-brand-violet to-brand-blue", progress: 96 },
      { label: "Recommendation", value: data.recommendation, icon: Target, color: data.recommendation === "Deploy" ? "from-emerald-500 to-teal-500" : "from-rose-500 to-pink-500" },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div className="grid grid-cols-2 gap-2">
          {metrics.map((m, idx) => (
            <MetricCard
              key={idx}
              label={m.label}
              value={m.value}
              icon={m.icon}
              color={m.color}
              progress={m.progress}
              subtext={m.label === "Recommendation" ? data.recommendation_reason : undefined}
            />
          ))}
        </div>
        <div className={cardBase}>
          <p className={label}>Plain English</p>
          <p className={`text-sm ${isDark ? "text-white/65" : "text-gray-700"}`}>
            {data.plain_english}
          </p>
        </div>
        {data.key_insights?.length > 0 && (
          <div className={cardBase}>
            <p className={label}>Key Insights</p>
            {data.key_insights.map((ins, i) => (
              <p key={i} className={`text-xs mt-1.5 ${isDark ? "text-white/60" : "text-gray-600"}`}>
                • {ins}
              </p>
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  if (agentId === "report") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cardBase}
      >
        <p className={label}>Generated report — {data.experiment_name}</p>
        <p
          className={`text-sm leading-relaxed whitespace-pre-wrap ${
            isDark ? "text-white/70" : "text-gray-700"
          }`}
        >
          {data.report}
        </p>
      </motion.div>
    );
  }

  return null;
}

export default function AIInsights() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeAgent, setActiveAgent] = useState(AGENTS[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [experiments, setExperiments] = useState([]);
  const [selectedExpId, setSelectedExpId] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI Copilot running on openai/gpt-oss-120b. Ask me anything about A/B testing, experiment strategy, or conversion optimization.",
    },
  ]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    api
      .get("/experiments/")
      .then((r) => {
        setExperiments(r.data);
        if (r.data.length > 0) setSelectedExpId(r.data[0].id);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeAgent.id === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, activeAgent.id]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const needsExpId = activeAgent.id === "analyst" || activeAgent.id === "report";
    const value = needsExpId ? selectedExpId : input.trim();
    if (!value || loading) return;

    setError("");
    setResult(null);
    setLoading(true);

    if (activeAgent.id === "chat") {
      const newMessages = [...chatMessages, { role: "user", content: input }];
      setChatMessages(newMessages);
      setInput("");
      try {
        const res = await api.post("/ai/chat", {
          message: input,
          history: chatMessages.filter((m) => m.role !== "system"),
        });
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: res.data.reply },
        ]);
      } catch {
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Something went wrong. Please try again." },
        ]);
      }
    } else {
      const body = needsExpId
        ? { experiment_id: value }
        : activeAgent.id === "reviewer"
        ? {
            name: input,
            goal: "conversion",
            duration_days: 14,
            traffic_pct: 50,
            variants: [{ label: "A" }, { label: "B" }],
          }
        : activeAgent.id === "variant"
        ? { element: input, count: 5 }
        : { [activeAgent.bodyKey]: input };

      try {
        const res = await api.post(activeAgent.endpoint, body);
        setResult(res.data);
        if (!needsExpId) setInput("");
      } catch (err) {
        const detail = err.response?.data?.detail;
        setError(
          Array.isArray(detail)
            ? detail.map((d) => d.msg).join(", ")
            : detail || "AI request failed — check your API key"
        );
      }
    }
    setLoading(false);
  };

  const handleExampleClick = (prompt) => {
    setInput(prompt);
    if (inputRef.current) inputRef.current.focus();
  };

  const cardCls = `rounded-2xl border transition-all ${
    isDark
      ? "bg-[#0D0E1A]/80 border-white/10 backdrop-blur-xl shadow-2xl"
      : "bg-white/80 border-gray-200/80 backdrop-blur-xl shadow-2xl"
  }`;
  const inputCls = `flex-1 px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-violet/25 transition-shadow ${
    isDark
      ? "bg-white/5 border-white/10 text-white placeholder:text-white/25"
      : "bg-gray-50/80 border-gray-200/80 text-gray-900 placeholder:text-gray-400"
  }`;
  const needsExpId = activeAgent.id === "analyst" || activeAgent.id === "report";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-2xl font-display font-bold flex items-center gap-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            <Sparkles size={28} className="text-brand-violet" />
            ExperimentX AI Copilot
          </h1>
          <p className={`text-sm mt-0.5 ${isDark ? "text-white/35" : "text-gray-500"}`}>
            Plan · Generate · Review · Analyze · Report — all in one workspace
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-emerald-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </span>
          <span className={`text-xs px-3 py-1 rounded-full ${
            isDark ? "bg-white/5 text-white/60" : "bg-gray-100 text-gray-600"
          }`}>
            openai/gpt-oss-120b
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            isDark ? "bg-white/5 text-white/40" : "bg-gray-100 text-gray-400"
          }`}>
            ~0.6s avg
          </span>
        </div>
      </div>

      {/* Agent selector - pills without square boxes */}
      <div className="flex flex-wrap gap-2 items-center bg-white/5 rounded-2xl p-1 border border-white/10 backdrop-blur-sm">
        {AGENTS.map((agent) => {
          const Icon = agent.icon;
          const isActive = activeAgent.id === agent.id;
          return (
            <motion.button
              key={agent.id}
              onClick={() => {
                setActiveAgent(agent);
                setResult(null);
                setError("");
                setInput("");
              }}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? isDark
                    ? "bg-brand-violet/20 text-white shadow-lg shadow-brand-violet/20"
                    : "bg-brand-violet/10 text-brand-violet shadow-lg shadow-brand-violet/10"
                  : isDark
                  ? "text-white/50 hover:text-white/80 hover:bg-white/5"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
              }`}
            >
              <Icon size={16} />
              <span>{agent.name}</span>
              {isActive && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 rounded-xl border-2 border-brand-violet/60 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {isActive && (
                <span className="ml-1 text-[10px] font-bold text-brand-violet bg-brand-violet/10 px-1.5 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <motion.div
        layout
        className={cardCls}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div
          className={`flex items-center gap-3 px-5 py-4 border-b ${
            isDark ? "border-white/5" : "border-gray-200/50"
          }`}
        >
          <div
            className={`w-9 h-9 rounded-full bg-gradient-to-br ${activeAgent.color} flex items-center justify-center text-white shadow-lg`}
          >
            {(() => {
              const Icon = activeAgent.icon;
              return <Icon size={20} />;
            })()}
          </div>
          <div>
            <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
              {activeAgent.name}
            </p>
            <p className={`text-xs ${isDark ? "text-white/35" : "text-gray-400"}`}>
              {activeAgent.desc}
            </p>
          </div>
        </div>

        {/* Chat mode */}
        {activeAgent.id === "chat" ? (
          <>
            <div className="p-5 h-72 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-brand-violet/20">
              {chatMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-fuchsia-500 to-brand-violet flex items-center justify-center text-white text-[10px] font-bold mr-2 flex-shrink-0 mt-0.5">
                      AI
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-brand-violet to-brand-blue text-white rounded-br-sm"
                        : isDark
                        ? "bg-white/10 text-white/85 rounded-bl-sm backdrop-blur-sm"
                        : "bg-gray-100/80 text-gray-800 rounded-bl-sm backdrop-blur-sm"
                    }`}
                  >
                    {msg.role === "assistant" && i === chatMessages.length - 1 && loading
                      ? useTyping(msg.content, 15)
                      : msg.content}
                  </div>
                </motion.div>
              ))}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-fuchsia-500 to-brand-violet flex items-center justify-center text-white text-[10px] font-bold mr-2 flex-shrink-0">
                      AI
                    </div>
                    <div
                      className={`px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center ${
                        isDark ? "bg-white/10" : "bg-gray-100/80"
                      }`}
                    >
                      {[0, 0.2, 0.4].map((d) => (
                        <motion.div
                          key={d}
                          className="w-1.5 h-1.5 rounded-full bg-brand-violet"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: d,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
            <div
              className={`px-5 pb-4 pt-3 border-t ${
                isDark ? "border-white/5" : "border-gray-200/50"
              }`}
            >
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={activeAgent.placeholder}
                  className={inputCls}
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2.5 rounded-xl text-sm text-white font-medium bg-gradient-to-r from-brand-violet to-brand-blue disabled:opacity-40 hover:shadow-lg transition-shadow flex items-center gap-2"
                >
                  <Send size={16} />
                  Send
                </motion.button>
              </form>
            </div>
          </>
        ) : (
          <div className="p-5 space-y-4">
            {needsExpId ? (
              <div>
                <label
                  className={`block text-xs font-medium mb-1.5 ${
                    isDark ? "text-white/45" : "text-gray-600"
                  }`}
                >
                  Select experiment to analyze
                </label>
                <select
                  value={selectedExpId}
                  onChange={(e) => setSelectedExpId(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-violet/25 ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white"
                      : "bg-white/80 border-gray-200/80 text-gray-900"
                  }`}
                >
                  {experiments.length === 0 ? (
                    <option>No experiments yet — create one first</option>
                  ) : (
                    experiments.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={activeAgent.placeholder}
                    className={inputCls}
                  />
                  <motion.button
                    type="submit"
                    disabled={!input.trim() || loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-5 py-2.5 rounded-xl text-sm text-white font-medium bg-gradient-to-br ${activeAgent.color} disabled:opacity-40 hover:shadow-lg transition-shadow flex items-center gap-2`}
                  >
                    {loading ? (
                      <motion.div
                        className="w-4 h-4 rounded-full border-2 border-white border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    ) : (
                      (() => {
                        const Icon = activeAgent.icon;
                        return <Icon size={18} />;
                      })()
                    )}
                    {loading ? "Thinking…" : "Run"}
                  </motion.button>
                </form>
                {!result && !loading && !input && !error && (
                  <div className="mt-4">
                    <p className={`text-xs font-medium mb-2 ${isDark ? "text-white/30" : "text-gray-400"}`}>
                      Try one:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {EXAMPLE_PROMPTS.map((prompt) => (
                        <motion.button
                          key={prompt}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleExampleClick(prompt)}
                          className={`text-xs px-3 py-1.5 rounded-full border ${
                            isDark
                              ? "border-white/10 hover:border-white/20 text-white/60 hover:text-white"
                              : "border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          {prompt}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {needsExpId && (
              <motion.button
                onClick={handleSubmit}
                disabled={!selectedExpId || loading || experiments.length === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-2.5 rounded-xl text-sm text-white font-medium bg-gradient-to-br ${activeAgent.color} disabled:opacity-40 hover:shadow-lg transition-shadow flex items-center justify-center gap-2`}
              >
                {loading ? (
                  <motion.div
                    className="w-4 h-4 rounded-full border-2 border-white border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                ) : (
                  (() => {
                    const Icon = activeAgent.icon;
                    return <Icon size={18} />;
                  })()
                )}
                {loading
                  ? "Analyzing real data…"
                  : activeAgent.id === "report"
                  ? "Generate Report"
                  : "Interpret Results"}
              </motion.button>
            )}

            {error && (
              <motion.p
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2.5 rounded-xl"
              >
                {error}
              </motion.p>
            )}

            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <p
                    className={`text-xs font-medium mb-2 ${
                      isDark ? "text-white/30" : "text-gray-400"
                    }`}
                  >
                    {activeAgent.name} — result
                  </p>
                  <StructuredResult
                    data={result}
                    agentId={activeAgent.id}
                    isDark={isDark}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {!result && !loading && !input && !error && !needsExpId && (
              <div
                className={`text-center py-8 ${
                  isDark ? "text-white/15" : "text-gray-300"
                }`}
              >
                {(() => {
                  const Icon = activeAgent.icon;
                  return <Icon size={36} className="mx-auto mb-2 opacity-30" />;
                })()}
                <p className="text-xs">
                  Enter a prompt above or try one of the examples below
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}