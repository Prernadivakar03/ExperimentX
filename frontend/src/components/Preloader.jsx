
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

const LOADING_MESSAGES = [
  "Initializing experiment engine",
  "Warming up AI models",
  "Assigning variants",
  "Calculating statistical significance",
  "Preparing your dashboard",
  "Almost ready",
];

// ─── Live network background (canvas, no external libraries) ───
function NetworkCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrame;
    let nodes = [];

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const W = () => canvas.width / window.devicePixelRatio;
    const H = () => canvas.height / window.devicePixelRatio;

    class Node {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = Math.random() * Math.PI * 2;
        this.turnSpeed = (Math.random() - 0.5) * 0.03;
        this.baseOpacity = 0.35 + Math.random() * 0.55;
        this.radius = 1.2 + Math.random() * 1.8;
        this.pulseSpeed = 0.004 + Math.random() * 0.008;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }
      update(t) {
        this.turnSpeed += (Math.random() - 0.5) * 0.01;
        this.turnSpeed = Math.max(-0.05, Math.min(0.05, this.turnSpeed));
        this.angle += this.turnSpeed;
        this.x += Math.cos(this.angle) * 0.5;
        this.y += Math.sin(this.angle) * 0.5;

        const w = W(), h = H();
        if (this.x < -20) this.x = w + 20;
        if (this.x > w + 20) this.x = -20;
        if (this.y < -20) this.y = h + 20;
        if (this.y > h + 20) this.y = -20;

        this.currentOpacity = this.baseOpacity * (0.7 + 0.3 * Math.sin(t * this.pulseSpeed + this.pulsePhase));
      }
      draw(color) {
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = this.radius * 5;
        ctx.globalAlpha = this.currentOpacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
      }
    }

    const init = () => {
      handleResize();
      const w = W(), h = H();
      nodes = Array.from({ length: 55 }, () => new Node(Math.random() * w, Math.random() * h));
    };
    init();
    window.addEventListener("resize", init);

    const animate = () => {
      const w = W(), h = H();
      const t = performance.now();
      ctx.clearRect(0, 0, w, h);

      const lineColor = "108, 92, 231"; // brand violet
      const dotColor = "#a78bfa";

      nodes.forEach((n) => n.update(t));

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const proximity = 1 - dist / 150;
            const opacity = proximity * Math.min(a.currentOpacity, b.currentOpacity) * 0.8;
            if (opacity > 0.01) {
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
      }

      nodes.forEach((n) => n.draw(dotColor));
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", init);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ display: "block" }}
    />
  );
}

// ─── Circular progress ring (replaces the linear bar) ───
function ProgressRing({ progress }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(100, progress) / 100);

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="3"
        />
        <motion.circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="url(#ring-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transition={{ ease: "easeOut" }}
          style={{ filter: "drop-shadow(0 0 6px rgba(108,92,231,0.6))" }}
        />
        <defs>
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6C5CE7" />
            <stop offset="100%" stopColor="#4A90E2" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-xs font-semibold text-white/70">
        {Math.min(100, Math.round(progress))}%
      </span>
    </div>
  );
}

// ─── Interactive magnetic wordmark ───
function InteractiveWordmark() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-40, 40], [10, -10]), { stiffness: 200, damping: 18 });
  const rotateY = useSpring(useTransform(x, [-120, 120], [-10, 10]), { stiffness: 200, damping: 18 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
        transformStyle: "preserve-3d",
      }}
      className="cursor-default select-none"
    >
      <motion.span
        className="block text-6xl sm:text-7xl md:text-8xl font-display font-black tracking-[-0.04em] leading-none"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "linear-gradient(90deg, #fff 0%, #6C5CE7 30%, #4A90E2 60%, #fff 100%)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        ExperimentX
      </motion.span>
    </motion.div>
  );
}

export default function Preloader({ onComplete }) {
  const [visible, setVisible] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 600);

    const progressTimer = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 8 + 2;
        return next >= 100 ? 100 : next;
      });
    }, 200);

    const exitTimer = setTimeout(() => {
      setVisible(false);
      clearInterval(msgTimer);
      clearInterval(progressTimer);
    }, 2800);

    return () => {
      clearInterval(msgTimer);
      clearInterval(progressTimer);
      clearTimeout(exitTimer);
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-brand-black"
        >
          {/* Live network background */}
          <NetworkCanvas />

          {/* Subtle centered glow for depth behind text */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-violet/10 blur-[120px]" />
          </div>

          {/* Interactive wordmark, no icon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
          >
            <InteractiveWordmark />
          </motion.div>

          {/* Rotating messages */}
          <div className="relative z-10 h-7 mt-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
                className="text-sm text-white/50 font-medium"
              >
                {LOADING_MESSAGES[messageIndex]}
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block ml-0.5"
                >
                  ...
                </motion.span>
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Circular progress ring, replaces the linear bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative z-10 mt-8"
          >
            <ProgressRing progress={progress} />
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1 }}
            className="relative z-10 absolute bottom-8 text-[10px] text-white/10 font-light"
          >
            ExperimentX • A/B Testing Platform
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}