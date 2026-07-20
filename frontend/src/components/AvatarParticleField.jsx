import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

const INITIALS = [
  "PS", "RM", "AK", "JD", "NK", "SR", "VB", "MP",
  "TG", "LS", "RA", "KP", "SD", "MN", "YT", "CS",
];

export default function AvatarParticleField() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrame;
    let particles = [];

    // ---------- Resize handler ----------
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // ---------- Helpers ----------
    const W = () => canvas.width / window.devicePixelRatio;
    const H = () => canvas.height / window.devicePixelRatio;
    const CX = () => W() / 2;
    const CY = () => H() / 2;

    const COLORS_A = ["#A78BFA", "#8B5CF6", "#7C3AED", "#C4B5FD"];
    const COLORS_B = ["#60A5FA", "#3B82F6", "#2563EB", "#93C5FD"];

    // ---------- Particle class ----------
    class AvatarParticle {
      constructor() { this.reset(); }

      reset() {
        this.branch = Math.random() < 0.5 ? "A" : "B";
        this.initials = INITIALS[Math.floor(Math.random() * INITIALS.length)];
        this.color = this.branch === "A"
          ? COLORS_A[Math.floor(Math.random() * COLORS_A.length)]
          : COLORS_B[Math.floor(Math.random() * COLORS_B.length)];

        // Start from far left (A) or far right (B)
        if (this.branch === "A") {
          this.x = -30;
          this.y = CY() + (Math.random() - 0.5) * H() * 0.9;
        } else {
          this.x = W() + 30;
          this.y = CY() + (Math.random() - 0.5) * H() * 0.9;
        }

        this.size = 14 + Math.random() * 12;
        this.speed = 0.6 + Math.random() * 1.2;
        this.opacity = 0;
        this.phase = "entering"; // entering → converging → absorbed
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.02 + Math.random() * 0.02;
        this.glowRadius = this.size * 2.5;
      }

      update() {
        this.wobble += this.wobbleSpeed;
        const cx = CX(), cy = CY();

        if (this.phase === "entering") {
          // Move toward center horizontal axis
          const targetX = this.branch === "A" ? cx * 0.45 : cx * 1.55;
          const targetY = cy + Math.sin(this.wobble) * 40;
          this.x += (targetX - this.x) * 0.025;
          this.y += (targetY - this.y) * 0.025;
          this.opacity = Math.min(this.opacity + 0.03, 0.9);

          const dist = Math.abs(this.x - targetX);
          if (dist < 20) this.phase = "converging";
        } else {
          // Curve toward center orb
          this.x += (cx - this.x) * 0.035;
          this.y += (cy - this.y) * 0.035;

          const distToCenter = Math.sqrt((this.x - cx) ** 2 + (this.y - cy) ** 2);
          this.opacity = Math.max(0, (distToCenter - 30) / 80);

          if (distToCenter < 35) this.reset();
        }
      }

      draw() {
        const x = this.x, y = this.y;

        // Glow halo using shadowBlur (cleaner)
        ctx.save();
        ctx.globalAlpha = this.opacity * 0.3;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.glowRadius * 1.2;
        ctx.beginPath();
        ctx.arc(x, y, this.size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();

        // Circle border
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(x, y, this.size / 2, 0, Math.PI * 2);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Fill (semi-transparent)
        ctx.beginPath();
        ctx.arc(x, y, this.size / 2 - 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color + "30";
        ctx.fill();

        // Initials
        ctx.font = `bold ${this.size * 0.38}px Inter, sans-serif`;
        ctx.fillStyle = this.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.initials, x, y);
        ctx.restore();
      }
    }

    // ---------- Particle initialisation ----------
    const createParticles = (count = 28) => {
      const arr = [];
      for (let i = 0; i < count; i++) {
        const p = new AvatarParticle();
        // Stagger initial positions
        if (i % 2 === 0) {
          p.x = W() * 0.05 + Math.random() * W() * 0.35;
        } else {
          p.x = W() * 0.6 + Math.random() * W() * 0.35;
        }
        p.y = CY() + (Math.random() - 0.5) * H() * 0.8;
        p.opacity = Math.random() * 0.7;
        p.phase = "entering";
        arr.push(p);
      }
      return arr;
    };
    particles = createParticles();

    // ---------- Drawing functions ----------
    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          if (a.branch !== b.branch) continue;
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const op = (1 - dist / 120) * Math.min(a.opacity, b.opacity) * 0.25;
            ctx.save();
            ctx.globalAlpha = op;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = a.branch === "A" ? "#8B5CF6" : "#3B82F6";
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }

    function drawCentralOrb() {
      const cx = CX(), cy = CY();
      const t = performance.now() * 0.001;

      // Outer rings
      for (let r = 80; r <= 200; r += 40) {
        ctx.save();
        ctx.globalAlpha = 0.4 - r * 0.0015;
        ctx.beginPath();
        ctx.arc(cx, cy, r + Math.sin(t * 0.5) * 5, 0, Math.PI * 2);
        ctx.strokeStyle = "#8B5CF6";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      // Core glow
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 70);
      const pulse = 0.35 + Math.sin(t) * 0.05;
      grd.addColorStop(0, `rgba(168,130,255,${pulse})`);
      grd.addColorStop(0.4, `rgba(108,92,231,${0.2 + Math.sin(t * 0.7) * 0.03})`);
      grd.addColorStop(1, "rgba(108,92,231,0)");
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 70, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.restore();

      // Central dot
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#A78BFA";
      ctx.shadowColor = "#8B5CF6";
      ctx.shadowBlur = 30;
      ctx.fill();
      ctx.restore();
    }

    // ---------- Animation loop ----------
    const animate = () => {
      const w = W(), h = H();
      ctx.clearRect(0, 0, w, h);

      // Background (subtle dark/light overlay)
      ctx.fillStyle = isDark ? "rgba(13,14,26,0.2)" : "rgba(255,255,255,0.1)";
      ctx.fillRect(0, 0, w, h);

      drawConnections();
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      drawCentralOrb();

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    // ---------- Cleanup ----------
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ display: "block" }}
    />
  );
}





















































































































