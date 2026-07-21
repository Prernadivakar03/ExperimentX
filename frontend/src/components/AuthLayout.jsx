
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";

function AuthCanvas({ isDark }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * 1200,
      y: Math.random() * 900,
      r: Math.random() * 1.4 + 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.008 + 0.003,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
    }));

    const nodes = Array.from({ length: 18 }, () => ({
      x: Math.random() * 1200,
      y: Math.random() * 900,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, W(), H());

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W()) n.vx *= -1;
        if (n.y < 0 || n.y > H()) n.vy *= -1;
      });

      // Neural connections — darker in light mode so they're visible
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 220) {
            const op = isDark
              ? (1 - dist / 220) * 0.18
              : (1 - dist / 220) * 0.25;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = isDark
              ? `rgba(108,92,231,${op})`
              : `rgba(108,92,231,${op})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      nodes.forEach((n) => {
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 3);
        grad.addColorStop(0, isDark ? "rgba(108,92,231,0.6)" : "rgba(108,92,231,0.5)");
        grad.addColorStop(1, "rgba(108,92,231,0)");
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "rgba(168,130,255,0.8)" : "rgba(108,92,231,0.7)";
        ctx.fill();
      });

      stars.forEach((s) => {
        s.phase += s.speed;
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = W();
        if (s.x > W()) s.x = 0;
        if (s.y < 0) s.y = H();
        if (s.y > H()) s.y = 0;
        const op = isDark
          ? s.opacity * (0.5 + 0.5 * Math.sin(s.phase))
          : s.opacity * 0.4 * (0.5 + 0.5 * Math.sin(s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(168,130,255,${op})`
          : `rgba(108,92,231,${op})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [isDark]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

function RightPanelOrb({ isDark }) {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center w-full h-full gap-8 px-10">
      <motion.div
        className="relative w-48 h-48"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <motion.div
          className={`absolute inset-0 rounded-full border ${
            isDark ? "border-brand-violet/30" : "border-brand-violet/40"
          }`}
          style={{ borderStyle: "dashed" }}
        />
        <motion.div
          className={`absolute inset-6 rounded-full border ${
            isDark ? "border-brand-blue/25" : "border-brand-blue/35"
          }`}
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-3 h-3 rounded-full bg-brand-violet shadow-[0_0_10px_rgba(108,92,231,0.8)]"
          style={{ top: "0%", left: "50%", transformOrigin: "0 96px" }}
        />
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-brand-blue shadow-[0_0_8px_rgba(79,140,255,0.8)]"
          style={{ top: "50%", right: "0%", transformOrigin: "-96px 0" }}
        />
        <div className="absolute inset-10 rounded-full bg-gradient-to-br from-brand-violet via-fuchsia-500/60 to-brand-blue
                        flex items-center justify-center
                        shadow-[0_0_60px_rgba(108,92,231,0.7)]">
          <div className="absolute top-2 left-3 w-8 h-6 rounded-full bg-white/25 blur-md" />
          <motion.div
            className="absolute inset-0 rounded-full border border-white/20"
            animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-white font-display font-bold text-sm">AI</span>
        </div>
      </motion.div>

      {/* Title — theme-aware */}
      <div className="text-center space-y-3">
        <h2 className={`text-xl font-display font-bold ${
          isDark ? "text-white" : "text-gray-900"
        }`}>
          The AI that picks<br />the winning variant
        </h2>
        <p className={`text-sm max-w-xs ${
          isDark ? "text-white/50" : "text-gray-500"
        }`}>
          ExperimentX runs your A/B tests, analyzes results in real time, and tells you exactly what to ship.
        </p>
      </div>

      {/* Stat pills — theme-aware */}
      {[
        { label: "Avg. lift detected", value: "+14.2%", delay: 0 },
        { label: "Experiments run", value: "10,000+", delay: 0.4 },
        { label: "Confidence level", value: "97.4%", delay: 0.8 },
      ].map((s) => (
        <motion.div
          key={s.label}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3 + s.delay, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
          className={`w-full max-w-[220px] px-4 py-3 rounded-xl
                     flex items-center justify-between backdrop-blur-sm
                     border transition-colors duration-300 ${
                       isDark
                         ? "bg-white/[0.05] border-white/10"
                         : "bg-white/80 border-gray-200 shadow-sm"
                     }`}
        >
          <span className={`text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>
            {s.label}
          </span>
          <span className="text-sm font-display font-bold text-brand-violet">
            {s.value}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

export default function AuthLayout({ title, subtitle, children, footer }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`relative min-h-screen flex overflow-hidden transition-colors duration-500 ${
      isDark ? "bg-brand-black" : "bg-slate-50"
    }`}>
      <AuthCanvas isDark={isDark} />

      {/* Aurora blobs */}
      <motion.div
        className={`absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full
                   blur-[140px] pointer-events-none transition-opacity duration-500 ${
                     isDark ? "bg-brand-violet/20" : "bg-brand-violet/12"
                   }`}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full
                   blur-[140px] pointer-events-none transition-opacity duration-500 ${
                     isDark ? "bg-brand-blue/20" : "bg-brand-blue/12"
                   }`}
        animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Dot grid */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isDark ? "opacity-[0.04]" : "opacity-[0.06]"
        }`}
        style={{
          backgroundImage: `radial-gradient(circle, ${isDark ? "#fff" : "#6C5CE7"} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top bar */}
      <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="w-8 h-8 object-contain" />
        </Link>
        <div className="flex items-center gap-3">
  <Link
    to="/"
    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg
               border transition-all duration-200 hover:-translate-x-0.5
               ${isDark
                 ? "text-white/50 border-white/10 hover:text-white hover:border-white/20 bg-white/[0.03]"
                 : "text-gray-500 border-gray-200 hover:text-gray-900 hover:border-gray-300 bg-white/60"
               }`}
  >
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
    Home
  </Link>
  <ThemeToggle />
</div>
      </div>

      {/* Left — form panel */}
      <div className="relative z-10 flex items-center justify-center w-full lg:w-1/2 px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <div className={`rounded-2xl backdrop-blur-2xl px-8 py-9
                          border transition-all duration-500 ${
                            isDark
                              ? "bg-white/[0.04] border-white/10 shadow-[0_0_0_1px_rgba(108,92,231,0.15),0_32px_64px_-16px_rgba(0,0,0,0.6),0_0_80px_rgba(108,92,231,0.12)]"
                              : "bg-white/90 border-gray-200/80 shadow-[0_0_0_1px_rgba(108,92,231,0.08),0_20px_60px_-15px_rgba(108,92,231,0.18),0_0_40px_rgba(108,92,231,0.06)]"
                          }`}>
            <h1 className={`text-2xl font-display font-bold text-center ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              {title}
            </h1>
            {subtitle && (
              <p className={`text-sm text-center mt-2 ${
                isDark ? "text-white/40" : "text-gray-500"
              }`}>
                {subtitle}
              </p>
            )}
            <div className="mt-7">{children}</div>
          </div>

          {footer && (
            <div className={`text-center mt-5 text-sm ${
              isDark ? "text-white/40" : "text-gray-500"
            }`}>
              {footer}
            </div>
          )}
        </motion.div>
      </div>

      {/* Right — AI orb, desktop only */}
      <div className="relative z-10 hidden lg:flex w-1/2 items-center justify-center">
        <RightPanelOrb isDark={isDark} />
      </div>
    </div>
  );
}



















































