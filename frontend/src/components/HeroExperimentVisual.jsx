import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const CYCLE_MS = 6500;
const PHASES = {
  FLOWING: "flowing",       // particles streaming and splitting
  DECIDING: "deciding",     // AI core pulses hard, ring spins faster
  REVEAL: "reveal",         // winner flashes, confetti, cards update
};

export default function HeroExperimentVisual() {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null, active: false });

  const [phase, setPhase] = useState(PHASES.FLOWING);
  const [splitA, setSplitA] = useState(50);
  const [winner, setWinner] = useState(null);
  const [cycleKey, setCycleKey] = useState(0);

  // container-wide mouse parallax (drives glow + ring + cards together)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const glowX = useSpring(mx, { stiffness: 80, damping: 20 });
  const glowY = useSpring(my, { stiffness: 80, damping: 20 });
  const ringRotateX = useSpring(useTransform(my, [-150, 150], [8, -8]), { stiffness: 150, damping: 20 });
  const ringRotateY = useSpring(useTransform(mx, [-150, 150], [-8, 8]), { stiffness: 150, damping: 20 });

  // ── Drive the story cycle ────────────────────────────────────────────────
  useEffect(() => {
    const newSplit = 46 + Math.floor(Math.random() * 8); // somewhere 46-54
    setSplitA(50);
    setWinner(null);
    setPhase(PHASES.FLOWING);

    const t1 = setTimeout(() => setPhase(PHASES.DECIDING), CYCLE_MS * 0.45);
    const t2 = setTimeout(() => {
      setSplitA(newSplit);
      setWinner(newSplit >= 50 ? "A" : "B");
      setPhase(PHASES.REVEAL);
    }, CYCLE_MS * 0.7);
    const t3 = setTimeout(() => setCycleKey((k) => k + 1), CYCLE_MS);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [cycleKey]);

  // ── Particle canvas — energy trails, brighter near the core ─────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;
    const orbX = () => W() / 2;
    const orbY = () => H() * 0.52;

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = W() / 2 + (Math.random() - 0.5) * 14;
        this.y = -10;
        this.branch = Math.random() < 0.5 ? "A" : "B";
        this.peakX = this.branch === "A" ? W() * 0.16 : W() * 0.84;
        this.peakY = H() * 0.3;
        this.t = Math.random();
        this.speed = 0.0035 + Math.random() * 0.002;
        this.size = 1.2 + Math.random() * 1.8;
        this.opacity = 0.6 + Math.random() * 0.4;
        // trailing segments for the "energy beam" look
        this.trail = [];
      }
      update() {
        this.t += this.speed;
        if (this.t >= 1) {
          this.reset();
          return;
        }
        const start = { x: W() / 2, y: -10 };
        const peak = { x: this.peakX, y: this.peakY };
        const end = { x: orbX(), y: orbY() - 10 };
        const t = this.t;
        const mt = 1 - t;
        const x = mt * mt * start.x + 2 * mt * t * peak.x + t * t * end.x;
        const y = mt * mt * start.y + 2 * mt * t * peak.y + t * t * end.y;

        this.trail.unshift({ x, y });
        if (this.trail.length > 6) this.trail.pop();

        this.x = x;
        this.y = y;
        // brighter as it nears the core
        this.proximityBoost = t;
        this.currentOpacity = this.opacity * (t < 0.88 ? 1 : 1 - (t - 0.88) / 0.12);
      }
      draw() {
        const colorA = theme === "dark" ? "168, 130, 255" : "124, 58, 237";
        const colorB = theme === "dark" ? "79, 200, 255" : "37, 99, 235";
        const color = this.branch === "A" ? colorA : colorB;
        const op = this.currentOpacity ?? this.opacity;
        const boost = 0.4 + (this.proximityBoost ?? 0) * 0.9;

        // trail — dim tail, bright head
        this.trail.forEach((p, i) => {
          const trailOp = op * boost * (1 - i / this.trail.length) * 0.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, this.size * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color}, ${trailOp})`;
          ctx.fill();
        });

        const glowSize = this.size * (3 + boost * 3);
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowSize);
        gradient.addColorStop(0, `rgba(${color}, ${op * boost * 0.6})`);
        gradient.addColorStop(1, `rgba(${color}, 0)`);
        ctx.beginPath();
        ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${op})`;
        ctx.fill();
      }
    }

    particles = Array.from({ length: 160 }, () => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, W(), H());
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    mx.set(e.clientX - rect.left - rect.width / 2);
    my.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const deciding = phase === PHASES.DECIDING;
  const revealing = phase === PHASES.REVEAL;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-[500px] rounded-3xl overflow-hidden
                 bg-gray-50/80 dark:bg-[#05060d] backdrop-blur-sm
                 border border-gray-200 dark:border-white/10
                 shadow-[0_0_60px_rgba(108,92,231,0.15)]"
      style={{ perspective: 1200 }}
    >
      {/* Layer 1 — drifting nebula/aurora background */}
      <motion.div
        className="absolute -inset-20 opacity-40 dark:opacity-60 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 30% 20%, rgba(108,92,231,0.25), transparent 60%), radial-gradient(ellipse 50% 35% at 75% 70%, rgba(79,140,255,0.2), transparent 60%)",
        }}
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Layer 2 — cursor-follow glow */}
      <motion.div
        className="absolute w-72 h-72 rounded-full pointer-events-none -z-0 dark:opacity-30 opacity-10"
        style={{
          left: "50%",
          top: "50%",
          x: useTransform(glowX, (v) => v - 144),
          y: useTransform(glowY, (v) => v - 144),
          background: "radial-gradient(circle, rgba(108,92,231,0.5), transparent 70%)",
        }}
      />

      {/* Incoming traffic header — "data entering a machine" framing */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <span className="text-[10px] tracking-widest uppercase text-gray-400 dark:text-white/40 mb-1">
          Incoming Traffic
        </span>
        <div className="px-4 py-1.5 rounded-lg bg-white dark:bg-brand-card border border-gray-200 dark:border-white/10
                        flex items-center gap-2">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">10,000 Users</span>
        </div>
        <div className="w-24 h-0.5 mt-1.5 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-violet to-brand-blue"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>

      {/* Layer 3 — particle stream */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />

      {/* Layer 4 — rotating glass ring + AI core */}
      <div
        className="absolute left-1/2 z-20"
        style={{ top: "52%", transform: "translate(-50%, -50%)" }}
      >
        <motion.div
          style={{ rotateX: ringRotateX, rotateY: ringRotateY, transformStyle: "preserve-3d" }}
          className="relative flex items-center justify-center"
        >
          {/* Outer rotating ring */}
          <motion.div
            className="absolute w-44 h-44 rounded-full border border-brand-violet/30 dark:border-brand-violet/40"
            style={{ borderStyle: "dashed" }}
            animate={{ rotate: 360 }}
            transition={{ duration: deciding ? 3 : 14, repeat: Infinity, ease: "linear" }}
          />
          {/* Mid ring, counter-rotating */}
          <motion.div
            className="absolute w-32 h-32 rounded-full border border-brand-blue/30"
            animate={{ rotate: -360 }}
            transition={{ duration: deciding ? 4 : 18, repeat: Infinity, ease: "linear" }}
          />
          {/* Hex pattern ring */}
          <svg className="absolute w-36 h-36 opacity-30" viewBox="0 0 100 100">
            <polygon
              points="50,3 90,25 90,75 50,97 10,75 10,25"
              fill="none"
              stroke="url(#hexGrad)"
              strokeWidth="0.5"
            />
            <defs>
              <linearGradient id="hexGrad" x1="0" y1="0" x2="100" y2="100">
                <stop offset="0%" stopColor="#6C5CE7" />
                <stop offset="100%" stopColor="#4F8CFF" />
              </linearGradient>
            </defs>
          </svg>

          {/* Light rays during deciding/reveal */}
          <AnimatePresence>
            {(deciding || revealing) && (
              <motion.div
                className="absolute w-56 h-56 rounded-full pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent, rgba(168,130,255,0.4), transparent, rgba(79,200,255,0.4), transparent)",
                }}
              />
            )}
          </AnimatePresence>

          {/* AI Core */}
          <motion.div
            className="relative w-24 h-24 rounded-full flex items-center justify-center
                       bg-gradient-to-br from-brand-violet via-fuchsia-500/70 to-brand-blue
                       shadow-[0_0_70px_rgba(108,92,231,0.7)]"
            animate={{
              scale: deciding ? [1, 1.18, 1] : revealing ? [1, 1.3, 1] : [1, 1.06, 1],
            }}
            transition={{ duration: deciding ? 0.6 : revealing ? 0.5 : 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute top-2 left-3 w-8 h-6 rounded-full bg-white/30 blur-md pointer-events-none" />
            <AnimatePresence mode="wait">
              <motion.span
                key={phase}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                className="text-white font-display font-bold text-sm pointer-events-none text-center leading-tight"
              >
                {phase === PHASES.FLOWING && "AI"}
                {phase === PHASES.DECIDING && "..."}
                {phase === PHASES.REVEAL && `${winner} ✓`}
              </motion.span>
            </AnimatePresence>

            <motion.div
              className="absolute inset-0 rounded-full border border-white/30 pointer-events-none"
              animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
              transition={{ duration: deciding ? 0.8 : 2, repeat: Infinity, ease: "easeOut" }}
            />
          </motion.div>

          {/* Platform ring beneath */}
          <div
            className="absolute -bottom-10 w-28 h-3 rounded-[50%]"
            style={{ background: "radial-gradient(ellipse at center, rgba(108,92,231,0.5), transparent 70%)" }}
          />
        </motion.div>
      </div>

      {/* Layer 5 — holographic variant panels */}
      <HoloCard
        position="left"
        badge="A"
        percent={splitA}
        visitors={`${(splitA * 100).toLocaleString()}`}
        color="violet"
        isWinner={winner === "A"}
        revealing={revealing}
        barHeights={[40, 70, 55, 90, 60, 80, 45, 65]}
      />
      <HoloCard
        position="right"
        badge="B"
        percent={100 - splitA}
        visitors={`${((100 - splitA) * 100).toLocaleString()}`}
        color="blue"
        isWinner={winner === "B"}
        revealing={revealing}
        barHeights={[50, 65, 80, 55, 95, 70, 60, 85]}
      />

      {/* Confetti pulse on reveal */}
      <AnimatePresence>{revealing && <ConfettiPulse key={cycleKey} />}</AnimatePresence>

      {/* Bottom story caption — makes the narrative explicit */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-[11px] text-gray-500 dark:text-white/50"
          >
            {phase === PHASES.FLOWING && "Splitting traffic between Variant A and Variant B…"}
            {phase === PHASES.DECIDING && "AI is analyzing results…"}
            {phase === PHASES.REVEAL && `Variant ${winner} is winning — significance detected`}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Holographic HUD-style variant card ──────────────────────────────────────

const colorMap = {
  violet: {
    text: "text-brand-violet",
    glow: "rgba(168,130,255,0.55)",
    ring: "rgba(108,92,231,0.6)",
    bar: "bg-brand-violet",
    border: "border-brand-violet/40",
  },
  blue: {
    text: "text-brand-blue",
    glow: "rgba(79,200,255,0.55)",
    ring: "rgba(79,140,255,0.6)",
    bar: "bg-brand-blue",
    border: "border-brand-blue/40",
  },
};

function HoloCard({ position, badge, percent, visitors, color, barHeights, isWinner, revealing }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-30, 30], [10, -10]), { stiffness: 250, damping: 18 });
  const rotateY = useSpring(useTransform(x, [-30, 30], [-10, 10]), { stiffness: 250, damping: 18 });

  const c = colorMap[color];
  const baseTilt = position === "left" ? -5 : 5;
  const sideClass = position === "left" ? "left-2 md:left-5" : "right-2 md:right-5";

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
      className={`absolute bottom-10 ${sideClass} z-20 flex flex-col items-center`}
      animate={{ y: [0, -9, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: position === "left" ? 0 : 0.6 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, rotateZ: baseTilt, transformPerspective: 700, transformStyle: "preserve-3d" }}
        animate={isWinner && revealing ? { scale: [1, 1.08, 1.04] } : { scale: 1 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.06 }}
        className={`relative w-36 md:w-40 px-4 py-4 rounded-2xl backdrop-blur-xl
                    bg-white/90 dark:bg-white/[0.07] border-2 ${
                      isWinner && revealing ? "border-emerald-400/70" : c.border
                    } cursor-default overflow-hidden`}
      >
        {/* glass reflection sweep */}
        <motion.div
          className="absolute -inset-y-10 -left-10 w-10 bg-white/20 dark:bg-white/10 rotate-12 pointer-events-none"
          animate={{ x: ["-20%", "260%"] }}
          transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
        />

        {/* rim glow, stronger if winner */}
        <motion.div
          className="absolute -inset-px rounded-2xl -z-10"
          animate={{
            boxShadow:
              isWinner && revealing
                ? [`0 0 10px rgba(52,211,153,0.6)`, `0 0 40px rgba(52,211,153,0.9)`, `0 0 10px rgba(52,211,153,0.6)`]
                : [`0 0 8px ${c.ring}`, `0 0 26px ${c.ring}`, `0 0 8px ${c.ring}`],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <div className="flex items-center justify-between" style={{ transform: "translateZ(20px)" }}>
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full ${color === "violet" ? "bg-brand-violet" : "bg-brand-blue"} flex items-center justify-center text-white text-xs font-bold`}>
              {badge}
            </span>
            <span className="text-xs text-gray-600 dark:text-white/70">Variant {badge}</span>
          </div>
          <AnimatePresence>
            {isWinner && revealing && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full"
              >
                WINNER
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <motion.p
          key={percent}
          initial={{ opacity: 0.4, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-2xl font-display font-bold mt-2 ${isWinner && revealing ? "text-emerald-500" : c.text}`}
          style={{ transform: "translateZ(30px)" }}
        >
          {percent}%
        </motion.p>
        <p className="text-[10px] text-gray-500 dark:text-white/50 mt-0.5" style={{ transform: "translateZ(15px)" }}>
          {visitors} Visitors
        </p>

        <div className="flex items-end gap-[2px] h-6 mt-3" style={{ transform: "translateZ(10px)" }}>
          {barHeights.map((h, i) => (
            <motion.div
              key={i}
              className={`w-1 rounded-sm ${isWinner && revealing ? "bg-emerald-400" : c.bar} opacity-70`}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.5, delay: i * 0.03 }}
            />
          ))}
        </div>

        <div className="mt-2 h-1 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden" style={{ transform: "translateZ(10px)" }}>
          <motion.div
            className={`h-full rounded-full ${isWinner && revealing ? "bg-emerald-400" : c.bar}`}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </motion.div>

      <div className="relative mt-2">
        <div className="w-20 h-3 rounded-[50%]" style={{ background: `radial-gradient(ellipse at center, ${c.glow}, transparent 70%)` }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-2 rounded-[50%] bg-white/20 dark:bg-white/10 backdrop-blur-sm border border-white/10" />
      </div>
    </motion.div>
  );
}

// ── Confetti pulse — brief celebratory burst on winner reveal ──────────────

function ConfettiPulse() {
  const pieces = Array.from({ length: 24 }, (_, i) => i);
  const colors = ["#6C5CE7", "#4F8CFF", "#34D399", "#F472B6", "#FBBF24"];

  return (
    <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
      {pieces.map((i) => {
        const startX = 50 + (Math.random() - 0.5) * 20;
        const endX = startX + (Math.random() - 0.5) * 60;
        const color = colors[i % colors.length];
        return (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-sm"
            style={{ left: `${startX}%`, top: "52%", backgroundColor: color }}
            initial={{ opacity: 1, y: 0, x: 0, rotate: 0 }}
            animate={{
              opacity: [1, 1, 0],
              y: [0, -60 - Math.random() * 40, 40],
              x: [(endX - startX) * 2],
              rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
            }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}














































































