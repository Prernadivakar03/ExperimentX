
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    per: "forever",
    desc: "For individuals and side projects exploring A/B testing.",
    features: [
      "3 active experiments",
      "Up to 10,000 visitors/month",
      "2 variants per experiment",
      "Basic analytics",
      "Community support",
    ],
    cta: "Get started free",
    href: "/register",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹2,499",
    per: "per month",
    desc: "For growing teams running serious experiments.",
    features: [
      "Unlimited experiments",
      "Up to 500,000 visitors/month",
      "Unlimited variants",
      "AI Copilot — all 6 agents",
      "Statistical significance engine",
      "SDK for React, Vue, Next.js, Node",
      "Email alerts on winner detected",
      "Priority support",
    ],
    cta: "Start 14-day trial",
    href: "/register",
    highlight: true,
    badge: "Most popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    per: "contact us",
    desc: "For large teams needing SSO, audit logs, and custom SLAs.",
    features: [
      "Everything in Pro",
      "Unlimited visitors",
      "SSO / SAML",
      "Audit logs",
      "Custom integrations",
      "Dedicated Slack channel",
      "99.99% SLA",
      "Custom AI model fine-tuning",
    ],
    cta: "Talk to sales",
    href: "mailto:hello@experimentx.io",
    highlight: false,
  },
];

const FAQ = [
  {
    q: "How does the free plan work?",
    a: "You can run up to 3 experiments simultaneously with no time limit. No credit card required to sign up.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from Settings any time — no penalties, no questions. Your data stays accessible for 30 days after cancellation.",
  },
  {
    q: "What counts as a visitor?",
    a: "A unique visitor assigned to a variant in any experiment during the billing month. The same visitor across multiple experiments counts once per experiment.",
  },
  {
    q: "Do I need to install something in my app?",
    a: "Yes — you install the ExperimentX SDK (one npm package) and call two functions: getVariant() and track(). Full integration typically takes under 30 minutes.",
  },
  {
    q: "Is the AI Copilot included in the free plan?",
    a: "The AI Chat is available on free. The 5 specialized agents (Planner, Reviewer, Analyst, Guardian, Variant Generator) require the Pro plan.",
  },
];

function FAQItem({ item, isDark, delay }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={`rounded-xl border overflow-hidden transition-colors duration-300 ${
        isDark
          ? "border-white/[0.07] bg-white/[0.03]"
          : "border-gray-200 bg-white"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className={`text-sm font-medium transition-colors ${
          isDark ? "text-white/80" : "text-gray-800"
        }`}>
          {item.q}
        </span>
        <motion.svg
          className={`w-4 h-4 flex-shrink-0 ml-3 transition-colors ${
            isDark ? "text-white/30" : "text-gray-400"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className={`px-5 pb-4 text-sm leading-relaxed transition-colors ${
              isDark ? "text-white/40" : "text-gray-500"
            }`}>
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Pricing() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      id="pricing"
      className={`py-24 px-6 transition-colors duration-500 ${
        isDark ? "bg-brand-black" : "bg-[#F7F8FC]"
      }`}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-brand-violet/10 text-brand-violet mb-4">
            Pricing
          </span>
          <h2 className={`text-3xl md:text-4xl font-display font-bold transition-colors ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            Simple, transparent pricing
          </h2>
          <p className={`text-base mt-3 max-w-md mx-auto transition-colors ${
            isDark ? "text-white/40" : "text-gray-500"
          }`}>
            Start free. Upgrade when you need more. No hidden fees.
          </p>
        </motion.div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col rounded-2xl border p-7 transition-all duration-300 ${
                plan.highlight
                  ? isDark
                    ? "bg-brand-violet/[0.08] border-brand-violet/40 shadow-[0_0_60px_rgba(108,92,231,0.2)]"
                    : "bg-white border-brand-violet/40 shadow-[0_0_40px_rgba(108,92,231,0.12)]"
                  : isDark
                    ? "bg-white/[0.03] border-white/[0.07] hover:border-white/[0.15]"
                    : "bg-white border-gray-200 hover:border-gray-300 shadow-sm"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-brand-violet to-brand-blue text-white shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className={`text-sm font-semibold ${isDark ? "text-white/60" : "text-gray-500"}`}>
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className={`text-3xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${isDark ? "text-white/30" : "text-gray-400"}`}>
                    /{plan.per}
                  </span>
                </div>
                <p className={`text-sm mt-2 ${isDark ? "text-white/35" : "text-gray-400"}`}>
                  {plan.desc}
                </p>
              </div>

              <ul className="space-y-2.5 flex-1 mb-7">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <svg
                      className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={isDark ? "text-white/60" : "text-gray-600"}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.href}
                className={`block text-center py-2.5 rounded-xl text-sm font-medium transition-all ${
                  plan.highlight
                    ? "bg-gradient-to-r from-brand-violet to-brand-blue text-white hover:opacity-90 shadow-[0_0_20px_rgba(108,92,231,0.35)]"
                    : isDark
                      ? "border border-white/10 text-white/70 hover:text-white hover:border-white/25"
                      : "border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 bg-gray-50 hover:bg-white"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Feature comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`rounded-2xl border overflow-hidden mb-20 transition-colors duration-300 ${
            isDark
              ? "bg-white/[0.03] border-white/[0.07]"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <div className={`px-6 py-4 border-b ${isDark ? "border-white/[0.06]" : "border-gray-100"}`}>
            <p className={`text-sm font-semibold ${isDark ? "text-white/70" : "text-gray-700"}`}>
              Feature comparison
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${isDark ? "border-white/[0.05]" : "border-gray-100"}`}>
                  <th className={`text-left px-6 py-3 text-xs font-medium ${
                    isDark ? "text-white/25" : "text-gray-400"
                  }`}>Feature</th>
                  {PLANS.map((p) => (
                    <th key={p.name} className={`text-center px-6 py-3 text-xs font-semibold ${
                      p.highlight
                        ? "text-brand-violet"
                        : isDark ? "text-white/40" : "text-gray-500"
                    }`}>{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Experiments", "3", "Unlimited", "Unlimited"],
                  ["Visitors/month", "10K", "500K", "Unlimited"],
                  ["AI Copilot agents", "Chat only", "All 6 agents", "All 6 + custom"],
                  ["Statistical engine", "✓", "✓", "✓"],
                  ["SDK integration", "✓", "✓", "✓"],
                  ["Team members", "1", "Up to 10", "Unlimited"],
                  ["Webhooks", "—", "✓", "✓"],
                  ["SSO / SAML", "—", "—", "✓"],
                  ["Audit logs", "—", "—", "✓"],
                  ["SLA", "—", "99.9%", "99.99%"],
                ].map(([feature, ...values]) => (
                  <tr
                    key={feature}
                    className={`border-b last:border-0 transition-colors ${
                      isDark
                        ? "border-white/[0.04] hover:bg-white/[0.02]"
                        : "border-gray-50 hover:bg-gray-50/70"
                    }`}
                  >
                    <td className={`px-6 py-3 ${isDark ? "text-white/55" : "text-gray-600"}`}>
                      {feature}
                    </td>
                    {values.map((v, i) => (
                      <td
                        key={i}
                        className={`px-6 py-3 text-center font-medium ${
                          v === "✓"
                            ? "text-emerald-500"
                            : v === "—"
                              ? isDark ? "text-white/15" : "text-gray-300"
                              : PLANS[i].highlight
                                ? "text-brand-violet"
                                : isDark ? "text-white/55" : "text-gray-600"
                        }`}
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <motion.h3
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-xl font-display font-bold text-center mb-8 transition-colors ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Frequently asked questions
          </motion.h3>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <FAQItem
                key={item.q}
                item={item}
                isDark={isDark}
                delay={i * 0.06}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}