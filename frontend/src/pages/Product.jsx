
import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import {
  Sparkles,
  Zap,
  BarChart3,
  Flag,
  Code,
  Brain,
  CheckCircle,
  ArrowRight,
  Shield,
  Lock,
  Users,
  FileText,
  ChevronDown,
  Play,
  Plus,
  Star,
  TrendingUp,
  Atom,
  Database,
  Target,
  DollarSign,
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────
const features = [
  {
    icon: Brain,
    title: "AI Copilot",
    desc: "Generate experiments instantly from a business goal.",
    color: "text-brand-violet",
  },
  {
    icon: Zap,
    title: "Experiment Management",
    desc: "Launch and manage A/B tests with a powerful dashboard.",
    color: "text-brand-blue",
  },
  {
    icon: BarChart3,
    title: "Real‑Time Analytics",
    desc: "Track visitors, conversions, and revenue lift live.",
    color: "text-emerald-500",
  },
  {
    icon: Flag,
    title: "Feature Flags",
    desc: "Control releases safely with gradual rollouts.",
    color: "text-amber-500",
  },
  {
    icon: Code,
    title: "SDK Integration",
    desc: "Works with React, Next.js, Vue, Node, and Python.",
    color: "text-rose-500",
  },
  {
    icon: Sparkles,
    title: "Statistical Engine",
    desc: "Bayesian + Frequentist testing for reliable results.",
    color: "text-indigo-500",
  },
];

const steps = [
  { label: "Create Experiment", icon: Plus },
  { label: "Install SDK", icon: Code },
  { label: "Traffic Split", icon: ArrowRight },
  { label: "Collect Events", icon: BarChart3 },
  { label: "AI Analysis", icon: Brain },
  { label: "Deploy Winner", icon: CheckCircle },
];

const agents = [
  { name: "Planner", icon: Brain, desc: "Turns goals into full experiment plans." },
  { name: "Reviewer", icon: CheckCircle, desc: "Checks your experiment before launch." },
  { name: "Variant Generator", icon: Sparkles, desc: "Generates copy and design variants." },
  { name: "Analytics", icon: BarChart3, desc: "Explains results in plain English." },
  { name: "Guardian", icon: Shield, desc: "Monitors anomalies and alerts." },
  { name: "Copilot Chat", icon: Zap, desc: "Ask anything about experimentation." },
];

const securityItems = [
  { icon: Shield, label: "GDPR Compliant", sub: "Full compliance" },
  { icon: Shield, label: "SOC2 Ready", sub: "Enterprise grade" },
  { icon: Lock, label: "Encryption at Rest", sub: "AES‑256" },
  { icon: Users, label: "Role‑Based Access", sub: "Fine‑grained" },
  { icon: FileText, label: "Audit Logs", sub: "Every action" },
];

const faqs = [
  {
    q: "How does ExperimentX assign variants?",
    a: "We use deterministic hashing based on a visitor ID and experiment ID to ensure consistent assignment across sessions.",
  },
  {
    q: "How is statistical significance calculated?",
    a: "We use both Bayesian and Frequentist methods. You get a confidence score and a clear winner recommendation.",
  },
  {
    q: "Can I self‑host ExperimentX?",
    a: "Yes, we offer an enterprise self‑hosted version with full control over your data.",
  },
  {
    q: "Do I need coding knowledge to use it?",
    a: "Not at all. The AI Copilot can generate experiments from a plain‑language description.",
  },
  {
    q: "Can AI create experiments?",
    a: "Absolutely. The Experiment Planner agent will generate a full hypothesis, variants, and metrics for you.",
  },
];

const frameworks = ["React", "Next.js", "Vue", "Node", "Python"];
const codeExamples = {
  React: `const variant = sdk.getVariant("checkout");
if (variant === "B") {
  showNewCheckout();
}`,
  "Next.js": `const variant = sdk.getVariant("checkout");
// Server‑side or client‑side
if (variant === "B") {
  return <NewCheckout />;
}`,
  Vue: `const variant = sdk.getVariant("checkout");
if (variant === "B") {
  // render new checkout
}`,
  Node: `const variant = await sdk.getVariant("checkout");
// server‑side logic`,
  Python: `variant = sdk.get_variant("checkout")
if variant == "B":
    show_new_checkout()`,
};

// ── Components ────────────────────────────────────────────────────────────────

// Scroll‑reveal wrapper
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Feature Card with interactive hover animation ──
function FeatureCard({ icon: Icon, title, desc, color, isDark, index }) {
  return (
    <Reveal delay={index * 0.05}>
      <motion.div
        whileHover={{ y: -4 }}
        className={`p-6 rounded-2xl border transition-all duration-300 ${
          isDark
            ? "bg-[#0D0E1A] border-white/[0.07] hover:border-white/[0.15]"
            : "bg-white border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-lg"
        }`}
      >
        <div className="flex items-start gap-3 mb-3">
          <motion.div
            whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              isDark ? "bg-white/5" : "bg-gray-50"
            } border ${isDark ? "border-white/10" : "border-gray-200"}`}
          >
            <Icon size={20} className={color} strokeWidth={1.5} />
          </motion.div>
          <h3 className={`text-base font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
            {title}
          </h3>
        </div>
        <p className={`text-sm ${isDark ? "text-white/40" : "text-gray-500"}`}>{desc}</p>
        <motion.a
          href="#"
          whileHover={{ x: 4 }}
          className="inline-flex items-center gap-1 text-xs font-medium text-brand-violet mt-3 transition-all hover:underline"
        >
          Learn More →
        </motion.a>
      </motion.div>
    </Reveal>
  );
}

// ── Timeline Step ──
function TimelineStep({ label, icon: Icon, isDark, index, total }) {
  return (
    <div className="flex flex-col items-center flex-1 relative">
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 border-brand-violet bg-brand-violet/5 dark:bg-brand-violet/10"
      >
        <Icon size={20} className="text-brand-violet" />
      </motion.div>
      <p className={`text-xs font-medium mt-2 text-center ${isDark ? "text-white/60" : "text-gray-600"}`}>{label}</p>
      {index < total - 1 && (
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
          className="hidden md:block absolute top-6 left-[calc(50%+1.5rem)] w-[calc(100%-3rem)] h-[2px] origin-left bg-brand-violet/30"
        />
      )}
    </div>
  );
}

// ── Agent Card ──
function AgentCard({ agent, isDark }) {
  const Icon = agent.icon;
  return (
    <Reveal>
      <motion.div
        whileHover={{ y: -2 }}
        className={`p-4 rounded-xl border ${
          isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-violet/10 flex items-center justify-center text-brand-violet">
            <Icon size={18} />
          </div>
          <div>
            <p className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{agent.name}</p>
            <p className={`text-xs ${isDark ? "text-white/40" : "text-gray-500"}`}>{agent.desc}</p>
          </div>
        </div>
      </motion.div>
    </Reveal>
  );
}

// ── FAQ Item ──
function FAQItem({ q, a, isDark }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-b ${isDark ? "border-white/[0.06]" : "border-gray-200"} py-4`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className={`text-sm font-medium ${isDark ? "text-white/80" : "text-gray-800"}`}>{q}</span>
        <ChevronDown
          size={18}
          className={`transition-transform ${open ? "rotate-180" : ""} ${isDark ? "text-white/30" : "text-gray-400"}`}
        />
      </button>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <p className={`text-sm mt-2 ${isDark ? "text-white/40" : "text-gray-500"}`}>{a}</p>
        </motion.div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ProductPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeFramework, setActiveFramework] = useState("React");

  // Background with subtle floating glow animation
  const bgStyle = isDark
    ? "bg-[#05060d] bg-gradient-to-b from-[#0a0d1c] to-[#05060d]"
    : "bg-[#FAFBFC]";

  return (
    <div className={`relative min-h-screen transition-colors ${bgStyle}`}>
      {/* Floating decorations with slow drift */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 left-10 w-96 h-96 rounded-full blur-3xl bg-brand-violet/5 dark:bg-brand-violet/10 pointer-events-none"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          x: [0, -10, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full blur-3xl bg-brand-blue/5 dark:bg-brand-blue/10 pointer-events-none"
      />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] pointer-events-none" />

      {/* ── Hero ── */}
      <section className="relative px-4 pt-20 pb-12 text-center">
        <Reveal>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-brand-violet/10 text-brand-violet border border-brand-violet/20 mb-6">
            Product
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">
            <span className={isDark ? "text-white" : "text-gray-900"}>AI‑Powered</span>
            <br />
            <span className="bg-gradient-to-r from-brand-violet via-purple-500 to-brand-blue bg-clip-text text-transparent">
              Experimentation Platform
            </span>
          </h1>
          <p className={`text-lg md:text-xl mt-4 max-w-2xl mx-auto ${isDark ? "text-white/50" : "text-gray-500"}`}>
            Build better products with intelligent experimentation.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-brand-violet to-brand-blue shadow-lg hover:shadow-xl transition-shadow"
            >
              Start Free Trial
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-6 py-3 rounded-xl text-sm font-medium flex items-center gap-2 border ${
                isDark ? "border-white/10 text-white/70 hover:bg-white/5" : "border-gray-300 text-gray-700 hover:bg-gray-50"
              } transition-colors`}
            >
              <Play size={16} /> Watch Demo
            </motion.button>
          </div>

          {/* Trusted stats – better contrast in light mode */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <Star className="text-amber-400 fill-amber-400" size={16} />
              <span className={isDark ? "text-white/60" : "text-gray-700"}>4.9/5 (500+ reviews)</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2"
            >
              <TrendingUp className="text-emerald-500" size={16} />
              <span className={isDark ? "text-white/60" : "text-gray-700"}>10,000+ experiments run</span>
            </motion.div>
          </div>
        </Reveal>
      </section>

      {/* ── Trusted By – Tech Stack ── */}
      <section className="py-6 border-y border-gray-200/30 dark:border-white/[0.06]">
        <Reveal>
          <div className="max-w-5xl mx-auto px-4">
            <p className={`text-xs text-center uppercase tracking-wider mb-4 ${isDark ? "text-white/20" : "text-gray-400"}`}>
              Built with modern technology
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: Atom, label: "React" },
                { icon: Zap, label: "FastAPI" },
                { icon: Database, label: "PostgreSQL" },
                { icon: Code, label: "Python" },
                { icon: Sparkles, label: "OpenAI" },
              ].map((tech) => (
                <div
                  key={tech.label}
                  className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${
                    isDark ? "border-white/[0.06] bg-white/[0.02]" : "border-gray-200 bg-white"
                  }`}
                >
                  <tech.icon size={18} className={isDark ? "text-white/60" : "text-gray-600"} />
                  <span className={`text-sm font-medium ${isDark ? "text-white/60" : "text-gray-600"}`}>
                    {tech.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Core Features (reduced padding) ── */}
      <section className="py-16 px-4 max-w-7xl mx-auto" id="features">
        <div className="text-center mb-10">
          <h2 className={`text-3xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Everything you need to experiment with confidence
          </h2>
          <p className={`text-sm mt-2 ${isDark ? "text-white/40" : "text-gray-500"}`}>
            Six powerful tools, one seamless platform.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} isDark={isDark} index={i} />
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className={`py-16 px-4 ${isDark ? "bg-[#0D0E1A]" : "bg-white"} border-y ${isDark ? "border-white/[0.06]" : "border-gray-100"}`}>
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-10">
              <h2 className={`text-3xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                How ExperimentX Works
              </h2>
              <p className={`text-sm mt-2 ${isDark ? "text-white/40" : "text-gray-500"}`}>
                From idea to winner in six steps.
              </p>
            </div>
          </Reveal>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative">
            {steps.map((step, idx) => (
              <TimelineStep
                key={step.label}
                label={step.label}
                icon={step.icon}
                isDark={isDark}
                index={idx}
                total={steps.length}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Copilot Showcase ── */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <Reveal>
          <div className="text-center mb-10">
            <h2 className={`text-3xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              AI Copilot — Your Experimentation Partner
            </h2>
            <p className={`text-sm mt-2 ${isDark ? "text-white/40" : "text-gray-500"}`}>
              Six specialized agents to guide you from planning to deployment.
            </p>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <AgentCard key={agent.name} agent={agent} isDark={isDark} />
          ))}
        </div>
      </section>

      {/* ── Analytics Showcase (with light theme contrast fix) ── */}
      <section className={`py-16 px-4 ${isDark ? "bg-[#0D0E1A]" : "bg-white"} border-y ${isDark ? "border-white/[0.06]" : "border-gray-100"}`}>
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-10">
              <h2 className={`text-3xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                Real‑Time Analytics
              </h2>
              <p className={`text-sm mt-2 ${isDark ? "text-white/40" : "text-gray-500"}`}>
                See visitors, conversions, and revenue lift at a glance.
              </p>
            </div>
          </Reveal>
          <div className={`p-6 rounded-2xl border ${isDark ? "bg-[#0B0C15] border-white/[0.07]" : "bg-gray-50 border-gray-200"}`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {[
                { label: "Visitors", value: "12,438", change: "+8.2%", icon: BarChart3 },
                { label: "Conversion", value: "4.2%", change: "+0.6%", icon: TrendingUp },
                { label: "Confidence", value: "98%", change: "Very high", icon: Target },
                { label: "Revenue Lift", value: "+15.3%", change: "Variant B winning", icon: DollarSign, highlight: true },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className={`p-4 rounded-xl border ${isDark ? "border-white/[0.06]" : "border-gray-200"}`}
                  >
                    <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-white/30">
                      <Icon size={14} /> {stat.label}
                    </div>
                    <div className={`text-2xl font-bold mt-1 ${stat.highlight ? "text-emerald-500" : isDark ? "text-white" : "text-gray-900"}`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-emerald-500">{stat.change}</div>
                  </div>
                );
              })}
            </div>

            {/* Chart */}
            <div className="aspect-[16/5] rounded-xl bg-gradient-to-r from-brand-violet/10 via-brand-blue/10 to-transparent flex items-center justify-center">
              <div className="w-full h-full flex items-end gap-1 px-4">
                {[40, 55, 48, 62, 70, 58, 65, 80, 75, 90, 85, 72].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                    className="flex-1 bg-brand-violet/30 rounded-t"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-8 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-brand-violet/60"></span>
                Variant A – 48%
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500/60"></span>
                Variant B – 52%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SDK Showcase ── */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-10">
            <h2 className={`text-3xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Simple SDK Integration
            </h2>
            <p className={`text-sm mt-2 ${isDark ? "text-white/40" : "text-gray-500"}`}>
              One line of code to start experimenting.
            </p>
          </div>
        </Reveal>
        <div className={`p-6 rounded-2xl border ${isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"}`}>
          <div className="flex flex-wrap gap-1 mb-4 border-b border-gray-200 dark:border-white/[0.06] pb-2">
            {frameworks.map((fw) => (
              <button
                key={fw}
                onClick={() => setActiveFramework(fw)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeFramework === fw
                    ? isDark ? "bg-brand-violet/20 text-brand-violet" : "bg-brand-violet/10 text-brand-violet"
                    : isDark ? "text-white/30 hover:text-white" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {fw}
              </button>
            ))}
          </div>
          <div className={`mb-2 text-xs font-mono ${isDark ? "text-white/30" : "text-gray-500"}`}>
            $ npm install experimentx
          </div>
          <pre className={`p-4 rounded-xl text-xs font-mono overflow-x-auto ${isDark ? "bg-[#0B0C15] text-emerald-400" : "bg-gray-900 text-emerald-400"}`}>
            <code>{codeExamples[activeFramework]}</code>
          </pre>
        </div>
      </section>

      {/* ── Security ── */}
      <section className={`py-16 px-4 ${isDark ? "bg-[#0D0E1A]" : "bg-white"} border-y ${isDark ? "border-white/[0.06]" : "border-gray-100"}`}>
        <div className="max-w-7xl mx-auto text-center">
          <Reveal>
            <h2 className={`text-3xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Enterprise‑Grade Security
            </h2>
            <p className={`text-sm mt-2 mb-10 ${isDark ? "text-white/40" : "text-gray-500"}`}>
              Your data is safe with us.
            </p>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-4">
            {securityItems.map((item) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.label}>
                  <div className={`p-4 rounded-xl border w-40 text-center ${isDark ? "border-white/[0.06] bg-white/[0.02]" : "border-gray-200 bg-white"}`}>
                    <div className="w-10 h-10 rounded-full bg-brand-violet/10 flex items-center justify-center mx-auto mb-2 text-brand-violet">
                      <Icon size={20} />
                    </div>
                    <p className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-800"}`}>{item.label}</p>
                    <p className={`text-xs ${isDark ? "text-white/30" : "text-gray-400"}`}>{item.sub}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4 max-w-3xl mx-auto">
        <Reveal>
          <h2 className={`text-3xl font-display font-bold text-center mb-10 ${isDark ? "text-white" : "text-gray-900"}`}>
            Frequently Asked Questions
          </h2>
        </Reveal>
        <div className="space-y-1">
          {faqs.map((faq) => (
            <FAQItem key={faq.q} {...faq} isDark={isDark} />
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-violet/5 via-transparent to-transparent pointer-events-none" />
        <Reveal>
          <div className="relative max-w-3xl mx-auto">
            <h2 className={`text-3xl md:text-4xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Ready to build better experiments?
            </h2>
            <p className={`text-sm mt-2 ${isDark ? "text-white/40" : "text-gray-500"}`}>
              Join thousands of teams using ExperimentX to make data‑driven decisions.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-brand-violet to-brand-blue shadow-lg hover:shadow-xl transition-shadow"
              >
                Start Free Trial
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-3 rounded-xl text-sm font-medium border ${
                  isDark ? "border-white/10 text-white/70 hover:bg-white/5" : "border-gray-300 text-gray-700 hover:bg-gray-50"
                } transition-colors`}
              >
                Book Demo
              </motion.button>
            </div>
            <p className={`text-xs mt-4 ${isDark ? "text-white/20" : "text-gray-400"}`}>
              No credit card required • Setup in less than 5 minutes
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}