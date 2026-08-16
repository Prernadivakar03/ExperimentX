import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import AnimatedCounter from "../AnimatedCounter";

const ACCENTS = {
  violet: {
    glow: "from-brand-violet/25 via-brand-violet/5 to-transparent",
    shadow: "group-hover:shadow-[0_0_0_1px_rgba(108,92,231,0.35),0_24px_50px_-18px_rgba(108,92,231,0.45)]",
    bar: "bg-brand-violet",
    iconBg: "bg-brand-violet/15 text-brand-violet",
  },
  blue: {
    glow: "from-brand-blue/25 via-brand-blue/5 to-transparent",
    shadow: "group-hover:shadow-[0_0_0_1px_rgba(79,140,255,0.35),0_24px_50px_-18px_rgba(79,140,255,0.45)]",
    bar: "bg-brand-blue",
    iconBg: "bg-brand-blue/15 text-brand-blue",
  },
  emerald: {
    glow: "from-emerald-500/25 via-emerald-500/5 to-transparent",
    shadow: "group-hover:shadow-[0_0_0_1px_rgba(16,185,129,0.35),0_24px_50px_-18px_rgba(16,185,129,0.45)]",
    bar: "bg-emerald-500",
    iconBg: "bg-emerald-500/15 text-emerald-500",
  },
  amber: {
    glow: "from-amber-500/25 via-amber-500/5 to-transparent",
    shadow: "group-hover:shadow-[0_0_0_1px_rgba(245,158,11,0.35),0_24px_50px_-18px_rgba(245,158,11,0.45)]",
    bar: "bg-amber-500",
    iconBg: "bg-amber-500/15 text-amber-500",
  },
};

export default function MetricTile({ icon: Icon, label, value, accent = "violet", isDark, delay = 0 }) {
  const a = ACCENTS[accent] || ACCENTS.violet;
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-60, 60], [7, -7]), { stiffness: 220, damping: 22 });
  const rotateY = useSpring(useTransform(x, [-60, 60], [-7, 7]), { stiffness: 220, damping: 22 });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: "preserve-3d" }}
      className={`group relative overflow-hidden rounded-2xl border p-5 transition-shadow duration-300 cursor-default ${a.shadow} ${
        isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"
      }`}
    >
      <div
        className={`pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${a.glow} blur-2xl opacity-60 transition-opacity duration-300 group-hover:opacity-100`}
      />

      <div className="relative" style={{ transform: "translateZ(30px)" }}>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${a.iconBg}`}>
          <Icon size={17} strokeWidth={2.25} />
        </div>
      </div>

      <p
        className={`relative mt-4 text-[11px] font-semibold tracking-wider uppercase ${isDark ? "text-white/35" : "text-gray-400"}`}
        style={{ transform: "translateZ(20px)" }}
      >
        {label}
      </p>

      <div className="relative mt-1" style={{ transform: "translateZ(35px)" }}>
        <AnimatedCounter
          value={value || 0}
          duration={900}
          className={`text-3xl font-display font-bold tabular-nums ${isDark ? "text-white" : "text-gray-900"}`}
        />
      </div>

      <div className={`relative mt-4 h-1 rounded-full overflow-hidden ${isDark ? "bg-white/[0.06]" : "bg-gray-100"}`}>
        <motion.div
          className={`h-full rounded-full ${a.bar}`}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.1, delay: delay + 0.15, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}