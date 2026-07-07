import { motion } from "framer-motion";

const features = [
  { title: "Real-Time Analytics", desc: "Watch conversions roll in live, no refresh needed." },
  { title: "Statistical Significance", desc: "Built-in Z-test tells you exactly when a result is trustworthy." },
  { title: "AI Recommendations", desc: "Get a plain-English call on which variant is winning, and why." },
  { title: "Deterministic Assignment", desc: "Visitors always see the same variant on repeat visits." },
  { title: "Custom Goals", desc: "Track signups, purchases, clicks — whatever moves your business." },
  { title: "Team Dashboards", desc: "Everyone sees the same source of truth, in one clean view." },
];

export default function FeatureCards() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className="p-6 rounded-2xl bg-white dark:bg-brand-card border border-gray-200 dark:border-white/10"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-violet/20 to-brand-blue/20
                            flex items-center justify-center mb-4">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-brand-violet to-brand-blue" />
            </div>
            <h3 className="font-display font-semibold text-gray-900 dark:text-white">{f.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}