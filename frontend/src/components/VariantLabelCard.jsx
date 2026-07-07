import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const colorMap = {
  violet: {
    text: "text-brand-violet",
    glow: "rgba(168,130,255,0.5)",
    ring: "rgba(108,92,231,0.6)",
    bar: "bg-brand-violet",
    badgeBg: "bg-brand-violet",
    border: "border-brand-violet/40",
  },
  blue: {
    text: "text-brand-blue",
    glow: "rgba(79,200,255,0.5)",
    ring: "rgba(79,140,255,0.6)",
    bar: "bg-brand-blue",
    badgeBg: "bg-brand-blue",
    border: "border-brand-blue/40",
  },
};

export default function VariantLabelCard({ position, badge, label, percent, visitors, color, barHeights }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-30, 30], [8, -8]), { stiffness: 250, damping: 18 });
  const rotateY = useSpring(useTransform(x, [-30, 30], [-8, 8]), { stiffness: 250, damping: 18 });

  const c = colorMap[color];
  const baseTilt = position === "left" ? -6 : 6;
  const sideClass = position === "left" ? "left-2 md:left-6" : "right-2 md:right-6";

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
      className={`absolute bottom-6 ${sideClass} z-10 flex flex-col items-center`}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: position === "left" ? 0 : 0.6 }}
    >
      {/* Glass card */}
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          rotateZ: baseTilt,
          transformPerspective: 700,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.05 }}
        className={`relative w-32 md:w-36 px-3.5 py-3.5 rounded-2xl backdrop-blur-md
            bg-white/90 dark:bg-white/[0.06] border ${c.border}
            cursor-default`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Rim glow */}
        <motion.div
          className="absolute -inset-px rounded-2xl -z-10"
          animate={{ boxShadow: [`0 0 8px ${c.ring}`, `0 0 28px ${c.ring}`, `0 0 8px ${c.ring}`] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />

        <div className="flex items-center gap-2" style={{ transform: "translateZ(20px)" }}>
          <span className={`w-6 h-6 rounded-full ${c.badgeBg} flex items-center justify-center text-white text-xs font-bold`}>
            {badge}
          </span>
          <span className="text-xs text-gray-600 dark:text-white/70">{label}</span>
        </div>

        <p className={`text-2xl font-display font-bold ${c.text} mt-2`} style={{ transform: "translateZ(30px)" }}>
          {percent}%
        </p>
        <p className="text-[10px] text-gray-500 dark:text-white/50 mt-0.5" style={{ transform: "translateZ(15px)" }}>
          {visitors} Visitors
        </p>

        {/* Mini bar chart, like the reference */}
        <div className="flex items-end gap-[2px] h-6 mt-3" style={{ transform: "translateZ(10px)" }}>
          {barHeights.map((h, i) => (
            <motion.div
              key={i}
              className={`w-1 rounded-sm ${c.bar} opacity-70`}
              initial={{ height: 0 }}
              whileInView={{ height: `${h}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.04 }}
            />
          ))}
        </div>

        <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden" style={{ transform: "translateZ(10px)" }}>
          <motion.div
            className={`h-full rounded-full ${c.bar}`}
            initial={{ width: 0 }}
            whileInView={{ width: `${percent}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Podium base */}
      <div className="relative mt-2">
        <div
          className="w-20 h-3 rounded-[50%]"
          style={{
            background: `radial-gradient(ellipse at center, ${c.glow}, transparent 70%)`,
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-2 rounded-[50%] bg-white/10 backdrop-blur-sm border border-white/10" />
      </div>
    </motion.div>
  );
}