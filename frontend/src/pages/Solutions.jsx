import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import {
  Boxes,
  TrendingUp,
  Wrench,
  LineChart,
  Flag,
  ArrowRight,
  ShieldAlert,
  Percent,
  CalendarClock,
  CheckCircle2,
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────
// Four audiences, each with a real pain point, three concrete capabilities,
// and a proof widget shaped like the actual thing that team would look at —
// not a restatement of the same feature list from the Product page.
const personas = [
  {
    key: "product",
    label: "Product teams",
    icon: Boxes,
    pain: "You ship a feature, then find out three sprints later whether it actually helped.",
    points: [
      "Launch behind a feature flag, then convert it into an A/B test with one click",
      "AI Reviewer flags weak hypotheses and missing guardrails before you launch",
      "Revenue and retention impact sit next to usage, not in a separate dashboard",
    ],
    proof: { type: "flagToTest", flag: "checkout-redesign", rollout: 20 },
  },
  {
    key: "growth",
    label: "Growth & marketing",
    icon: TrendingUp,
    pain: "Landing page tests drag on for weeks because no one's sure when it's safe to call a winner.",
    points: [
      "Bayesian probability-to-win updates daily, so you can call it as soon as it's real",
      "Built-in sample ratio mismatch detection catches broken redirects before they cost you a launch",
      "One traffic split works across landing pages, checkout, and pricing",
    ],
    proof: { type: "winProb", a: 41, b: 82 },
  },
  {
    key: "engineering",
    label: "Engineering",
    icon: Wrench,
    pain: "Every rollout is a bet — you find out it broke something after it's already at 100%.",
    points: [
      "Gradual rollouts with automatic guardrail pause on error-rate or latency regressions",
      "One SDK call across React, Vue, Node, and Python — no separate flag service to run",
      "Deterministic assignment means the same visitor always gets the same variant",
    ],
    proof: { type: "guardrail", metric: "Checkout error rate", reason: "+2.1% vs control" },
  },
  {
    key: "data",
    label: "Data & analytics",
    icon: LineChart,
    pain: "Someone keeps peeking at results early, and now nobody trusts the p-values.",
    points: [
      "Sequential testing controls the false-positive rate even if people check daily",
      "CUPED variance reduction gets a significant read with less traffic",
      "Every result ships with its assumptions — sample size, power, and method used",
    ],
    proof: { type: "sequential", day: 9, of: 14 },
  },
];

// ── Reveal wrapper (matches Product.jsx) ──
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Persona proof widgets ──────────────────────────────────────────────────────

function ProofFlagToTest({ flag, rollout, isDark }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${isDark ? "border-white/[0.08] bg-white/[0.03]" : "border-gray-200 bg-gray-50"}`}>
        <Flag size={14} className="text-amber-500" />
        <code className={`text-xs ${isDark ? "text-white/70" : "text-gray-700"}`}>{flag}</code>
        <span className={`text-[10px] ${isDark ? "text-white/30" : "text-gray-400"}`}>{rollout}% rollout</span>
      </div>
      <ArrowRight size={16} className={isDark ? "text-white/20" : "text-gray-300"} />
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-ember/10 border border-brand-ember/20">
        <Percent size={14} className="text-brand-ember" />
        <span className="text-xs font-medium text-brand-ember">A/B test, 50/50</span>
      </div>
    </div>
  );
}

function ProofWinProb({ a, b, isDark }) {
  return (
    <div className="w-full max-w-xs space-y-3">
      {[{ label: "Variant A", value: a, color: "bg-white/20" }, { label: "Variant B", value: b, color: "bg-emerald-500" }].map((v) => (
        <div key={v.label}>
          <div className="flex justify-between text-xs mb-1">
            <span className={isDark ? "text-white/50" : "text-gray-500"}>{v.label}</span>
            <span className={v.value === b ? "text-emerald-500 font-medium" : isDark ? "text-white/40" : "text-gray-400"}>
              {v.value}% to win
            </span>
          </div>
          <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? "bg-white/[0.06]" : "bg-gray-100"}`}>
            <div className={`h-full rounded-full ${v.color}`} style={{ width: `${v.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProofGuardrail({ metric, reason, isDark }) {
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border border-rose-500/30 bg-rose-500/[0.06] max-w-xs`}>
      <ShieldAlert size={18} className="text-rose-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-rose-500">Rollout auto-paused</p>
        <p className={`text-xs mt-0.5 ${isDark ? "text-white/50" : "text-gray-500"}`}>{metric}: {reason}</p>
      </div>
    </div>
  );
}

function ProofSequential({ day, of, isDark }) {
  const pct = (day / of) * 100;
  return (
    <div className="w-full max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        <CalendarClock size={14} className={isDark ? "text-white/40" : "text-gray-400"} />
        <span className={`text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>Day {day} of {of}</span>
      </div>
      <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? "bg-white/[0.06]" : "bg-gray-100"}`}>
        <div className="h-full rounded-full bg-brand-gold" style={{ width: `${pct}%` }} />
      </div>
      <p className={`text-[11px] mt-2 ${isDark ? "text-white/30" : "text-gray-400"}`}>
        Not significant yet — safe to keep watching, checking daily won't inflate false positives.
      </p>
    </div>
  );
}

function PersonaProof({ proof, isDark }) {
  switch (proof.type) {
    case "flagToTest":
      return <ProofFlagToTest {...proof} isDark={isDark} />;
    case "winProb":
      return <ProofWinProb {...proof} isDark={isDark} />;
    case "guardrail":
      return <ProofGuardrail {...proof} isDark={isDark} />;
    case "sequential":
      return <ProofSequential {...proof} isDark={isDark} />;
    default:
      return null;
  }
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function SolutionsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [active, setActive] = useState(personas[0].key);
  const current = personas.find((p) => p.key === active);

  const bgStyle = isDark
    ? "bg-[#05060d] bg-gradient-to-b from-[#0a0d1c] to-[#05060d]"
    : "bg-[#FAFBFC]";

  return (
    <div className={`relative min-h-screen transition-colors ${bgStyle}`}>
      {/* ── Hero ── */}
      <section className="px-4 pt-20 pb-12 text-center">
        <Reveal>
          <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">
            <span className={isDark ? "text-white" : "text-gray-900"}>Built for how</span>
            <br />
            <span className="bg-gradient-to-r from-brand-ember via-purple-500 to-brand-gold bg-clip-text text-transparent">
              each team actually decides
            </span>
          </h1>
          <p className={`text-lg mt-4 max-w-xl mx-auto ${isDark ? "text-white/50" : "text-gray-500"}`}>
            Product, growth, engineering, and data teams pull from the same experiment —
            each sees the part that matters to them.
          </p>
        </Reveal>
      </section>

      {/* ── Persona switcher ── */}
      <section className="px-4 pb-20 max-w-5xl mx-auto">
        <Reveal>
          <div className={`rounded-3xl border overflow-hidden md:flex ${isDark ? "border-white/[0.07] bg-[#0D0E1A]" : "border-gray-200 bg-white shadow-sm"}`}>
            {/* Left rail: persona list */}
            <div className={`md:w-56 flex-shrink-0 flex md:flex-col overflow-x-auto md:overflow-visible border-b md:border-b-0 md:border-r ${isDark ? "border-white/[0.06]" : "border-gray-100"}`}>
              {personas.map((p) => {
                const Icon = p.icon;
                const isActive = p.key === active;
                return (
                  <button
                    key={p.key}
                    onClick={() => setActive(p.key)}
                    className={`flex items-center gap-2.5 px-4 py-3.5 text-left text-sm whitespace-nowrap md:whitespace-normal transition-colors flex-shrink-0 md:flex-shrink w-full ${
                      isActive
                        ? isDark
                          ? "bg-white/[0.05] text-white border-b-2 md:border-b-0 md:border-l-2 border-brand-ember"
                          : "bg-gray-50 text-gray-900 border-b-2 md:border-b-0 md:border-l-2 border-brand-ember"
                        : isDark
                        ? "text-white/40 hover:text-white/70"
                        : "text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    <Icon size={16} className={isActive ? "text-brand-ember" : ""} />
                    {p.label}
                  </button>
                );
              })}
            </div>

            {/* Right: active persona detail */}
            <div className="flex-1 p-6 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="grid md:grid-cols-2 gap-8 items-center"
                >
                  <div>
                    <p className={`text-sm italic ${isDark ? "text-white/40" : "text-gray-500"}`}>
                      "{current.pain}"
                    </p>
                    <ul className="mt-4 space-y-2.5">
                      {current.points.map((point) => (
                        <li key={point} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className={isDark ? "text-white/75" : "text-gray-700"}>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`flex items-center justify-center rounded-2xl border p-6 min-h-[160px] ${isDark ? "border-white/[0.06] bg-[#0B0C15]" : "border-gray-100 bg-gray-50"}`}>
                    <PersonaProof proof={current.proof} isDark={isDark} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── One experiment, four views ── */}
      <section className={`py-16 px-4 ${isDark ? "bg-[#0D0E1A]" : "bg-white"} border-y ${isDark ? "border-white/[0.06]" : "border-gray-100"}`}>
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <h2 className={`text-3xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              One experiment. Four views of it.
            </h2>
            <p className={`text-sm mt-2 mb-10 max-w-lg mx-auto ${isDark ? "text-white/40" : "text-gray-500"}`}>
              No separate tools to reconcile — everyone is looking at the same running test.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className={`flex flex-col md:flex-row items-stretch rounded-2xl border overflow-hidden ${isDark ? "border-white/[0.07]" : "border-gray-200"}`}>
              {personas.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.key}
                    className={`flex-1 flex items-center gap-2 justify-center px-4 py-4 text-sm ${
                      i > 0 ? (isDark ? "border-t md:border-t-0 md:border-l border-white/[0.06]" : "border-t md:border-t-0 md:border-l border-gray-100") : ""
                    } ${isDark ? "text-white/60" : "text-gray-600"}`}
                  >
                    <Icon size={15} className="text-brand-ember flex-shrink-0" />
                    {p.label}
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-ember/5 via-transparent to-transparent pointer-events-none" />
        <Reveal>
          <div className="relative max-w-2xl mx-auto">
            <h2 className={`text-3xl md:text-4xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Find your team's starting point
            </h2>
            <p className={`text-sm mt-2 ${isDark ? "text-white/40" : "text-gray-500"}`}>
              Same platform, same data — start from whichever side you work on.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-brand-ember to-brand-gold shadow-lg hover:shadow-xl transition-shadow"
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
                Talk to Sales
              </motion.button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}