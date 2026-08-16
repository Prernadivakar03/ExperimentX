import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Trophy, TrendingUp, TrendingDown } from "lucide-react";

export default function VariantBattleCard({ variant, isControl, isWinner, lift, isDark, delay = 0 }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-140, 140], [5, -5]), { stiffness: 180, damping: 24 });
  const rotateY = useSpring(useTransform(x, [-140, 140], [-5, 5]), { stiffness: 180, damping: 24 });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const accentBg = variant.label === "A" ? "bg-brand-violet" : "bg-brand-blue";
  const accentText = variant.label === "A" ? "text-brand-violet" : "text-brand-blue";

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 1000, transformStyle: "preserve-3d" }}
      className={`relative rounded-2xl border p-5 md:p-6 overflow-hidden cursor-default transition-colors duration-300 ${
        isWinner
          ? isDark
            ? "bg-[#0D0E1A] border-emerald-500/40 shadow-[0_0_0_1px_rgba(16,185,129,0.15),0_25px_60px_-20px_rgba(16,185,129,0.35)]"
            : "bg-white border-emerald-400/50 shadow-[0_0_0_1px_rgba(16,185,129,0.1),0_25px_60px_-20px_rgba(16,185,129,0.25)]"
          : isDark
          ? "bg-[#0D0E1A] border-white/[0.07]"
          : "bg-white border-gray-200 shadow-sm"
      }`}
    >
      {isWinner && (
        <motion.div
          className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl"
          animate={{ opacity: [0.45, 0.85, 0.45] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {isWinner && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl border border-emerald-400/30"
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <div className="relative flex items-center gap-3" style={{ transform: "translateZ(20px)" }}>
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-display font-bold shrink-0 ${accentBg}`}
        >
          {variant.label}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`text-[10px] font-bold tracking-widest uppercase ${
              isControl ? (isDark ? "text-white/30" : "text-gray-400") : accentText
            }`}
          >
            {isControl ? "Control" : "Challenger"}
          </p>
          <p className={`font-display font-semibold text-sm truncate ${isDark ? "text-white" : "text-gray-900"}`}>
            {variant.name}
          </p>
        </div>
        {isWinner && (
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full shrink-0">
            <Trophy size={12} strokeWidth={2.5} /> Winner
          </span>
        )}
      </div>

      <div className="relative mt-5" style={{ transform: "translateZ(30px)" }}>
        <p
          className={`font-display font-extrabold leading-none tabular-nums ${
            isWinner ? "text-emerald-500 text-5xl" : `${isDark ? "text-white" : "text-gray-900"} text-4xl`
          }`}
        >
          {variant.conversion_rate}%
        </p>
        <p className={`text-xs mt-1.5 ${isDark ? "text-white/35" : "text-gray-400"}`}>Conversion rate</p>
      </div>

      <div className="relative grid grid-cols-2 gap-3 mt-5" style={{ transform: "translateZ(15px)" }}>
        <div className={`p-3 rounded-xl ${isDark ? "bg-white/[0.03]" : "bg-gray-50"}`}>
          <p className={`text-lg font-display font-bold tabular-nums ${isDark ? "text-white" : "text-gray-900"}`}>
            {variant.conversions?.toLocaleString()}
          </p>
          <p className={`text-[11px] ${isDark ? "text-white/30" : "text-gray-400"}`}>conversions</p>
        </div>
        <div className={`p-3 rounded-xl ${isDark ? "bg-white/[0.03]" : "bg-gray-50"}`}>
          <p className={`text-lg font-display font-bold tabular-nums ${isDark ? "text-white" : "text-gray-900"}`}>
            {variant.visitors?.toLocaleString()}
          </p>
          <p className={`text-[11px] ${isDark ? "text-white/30" : "text-gray-400"}`}>visitors</p>
        </div>
      </div>

      <div className="relative mt-5" style={{ transform: "translateZ(15px)" }}>
        <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? "bg-white/[0.06]" : "bg-gray-100"}`}>
          <motion.div
            className={`h-full rounded-full ${isWinner ? "bg-emerald-500" : accentBg}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((variant.conversion_rate / 20) * 100, 100)}%` }}
            transition={{ duration: 1, delay: delay + 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="relative flex items-center justify-between mt-4" style={{ transform: "translateZ(15px)" }}>
        <span className={`text-[11px] ${isDark ? "text-white/30" : "text-gray-400"}`}>
          {(variant.traffic_split * 100).toFixed(0)}% traffic
        </span>
        {isControl ? (
          <span className={`text-xs font-semibold ${isDark ? "text-white/30" : "text-gray-400"}`}>Baseline</span>
        ) : lift !== null && lift !== undefined ? (
          <span className={`flex items-center gap-1 text-xs font-bold ${lift >= 0 ? "text-emerald-500" : "text-red-400"}`}>
            {lift >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {lift >= 0 ? "+" : ""}
            {lift.toFixed(1)}% lift
          </span>
        ) : null}
      </div>
    </motion.div>
  );
}













