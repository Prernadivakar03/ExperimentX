import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

function FloatingCard({ label, accent, headline, metric, metricLabel, delay, tiltDirection }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [12, -12]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-12, 12]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40, rotateZ: tiltDirection * 4 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
      style={{
        rotateX,
        rotateY,
        rotateZ: tiltDirection * 4,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      }}
      className="relative w-64 rounded-2xl bg-white dark:bg-brand-card border border-gray-200 dark:border-white/10
                 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_25px_60px_-15px_rgba(108,92,231,0.3)]
                 overflow-hidden cursor-default"
    >
      {/* Mock browser bar */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-gray-100 dark:border-white/5">
        <span className="w-2 h-2 rounded-full bg-red-400/70" />
        <span className="w-2 h-2 rounded-full bg-yellow-400/70" />
        <span className="w-2 h-2 rounded-full bg-green-400/70" />
        <span className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full ${accent.badge}`}>
          {label}
        </span>
      </div>

      {/* Mock content */}
      <div className="p-5">
        <div className={`w-9 h-9 rounded-lg ${accent.bg} mb-3`} style={{ transform: "translateZ(20px)" }} />
        <p className="text-sm font-display font-semibold text-gray-900 dark:text-white" style={{ transform: "translateZ(15px)" }}>
          {headline}
        </p>
        <div className="mt-3 h-1.5 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
          <div className={`h-full rounded-full ${accent.bar}`} style={{ width: `${metric}%` }} />
        </div>
        <div className="mt-4 flex items-end justify-between" style={{ transform: "translateZ(25px)" }}>
          <span className="text-2xl font-display font-bold text-gray-900 dark:text-white">{metric}%</span>
          <span className="text-xs text-gray-400">{metricLabel}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Floating3DCards() {
  return (
    // <section className="relative max-w-5xl mx-auto px-6 py-28">
    <section className="relative max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
          See the difference, instantly
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-3">
          Every experiment, compared side by side in real time
        </p>
      </div>

      <div className="relative flex items-center justify-center gap-10 md:gap-16" style={{ perspective: 1200 }}>
        <motion.div
          className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full
                     bg-gradient-to-br from-brand-violet to-brand-blue blur-3xl"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <FloatingCard
          label="VARIANT A"
          headline="Original checkout flow"
          metric={50}
          metricLabel="conversion"
          delay={0}
          tiltDirection={-1}
          accent={{
            badge: "bg-brand-violet/10 text-brand-violet",
            bg: "bg-gradient-to-br from-brand-violet/30 to-brand-violet/10",
            bar: "bg-brand-violet",
          }}
        />

        {/* Winner badge floating between cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          animate={{ y: [0, -10, 0] }}
          style={{ animationDuration: "3s" }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="hidden md:flex flex-col items-center gap-1 px-4 py-3 rounded-2xl
                       bg-white dark:bg-brand-card border border-gray-200 dark:border-white/10
                       shadow-[0_15px_40px_-10px_rgba(108,92,231,0.4)]"
          >
            <span className="text-[10px] font-medium text-gray-400">AI VERDICT</span>
            <span className="text-sm font-display font-bold text-brand-blue">B wins +14.2%</span>
          </motion.div>
        </motion.div>

        <FloatingCard
          label="VARIANT B"
          headline="Streamlined checkout flow"
          metric={64}
          metricLabel="conversion"
          delay={0.15}
          tiltDirection={1}
          accent={{
            badge: "bg-brand-blue/10 text-brand-blue",
            bg: "bg-gradient-to-br from-brand-blue/30 to-brand-blue/10",
            bar: "bg-brand-blue",
          }}


        />
      </div>
    </section>
  );
}

























