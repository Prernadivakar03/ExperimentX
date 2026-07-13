
import { motion } from "framer-motion";

const steps = [
  { n: "01", title: "Create Experiment", desc: "Set up your experiment in minutes. No code required.", icon: "✦" },
  { n: "02", title: "Split Traffic", desc: "We automatically split your traffic between variants.", icon: "⇄" },
  { n: "03", title: "Analyze Results", desc: "AI-powered analytics surface the performance gap in real time.", icon: "◈" },
  { n: "04", title: "Deploy & Optimize", desc: "Ship the winning variant and keep iterating with confidence.", icon: "↗" },
];

export default function HowItWorks() {
  return (
    // <section className="relative max-w-6xl mx-auto px-6 py-28 overflow-hidden">
    <section className="relative max-w-6xl mx-auto px-6 py-24 overflow-hidden">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-display font-bold text-center text-gray-900 dark:text-white"
      >
        How ExperimentX Works
      </motion.h2>
      <p className="text-center text-gray-500 dark:text-gray-400 mt-3">
        Simple steps to better decisions
      </p>

      <div className="relative mt-16">
        {/* Connecting glow line behind the steps, desktop only */}
        <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-px
                        bg-gradient-to-r from-brand-violet/0 via-brand-violet/50 to-brand-blue/0" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col items-center text-center"
            >
              {/* Glowing badge */}
              <div className="relative mb-5">
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-violet to-brand-blue blur-md"
                  animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.15, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                />
                <div className="relative w-20 h-20 rounded-full flex items-center justify-center
                                bg-gradient-to-br from-brand-violet to-brand-blue
                                text-white text-2xl font-display font-semibold
                                shadow-[0_0_30px_rgba(108,92,231,0.5)]
                                group-hover:shadow-[0_0_50px_rgba(108,92,231,0.8)] transition-shadow duration-300">
                  {s.icon}
                </div>
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full
                                 bg-white dark:bg-brand-card border border-gray-200 dark:border-white/10
                                 flex items-center justify-center text-[10px] font-mono text-brand-violet">
                  {s.n}
                </span>
              </div>

              <h3 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
                {s.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed max-w-[220px]">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}





















































