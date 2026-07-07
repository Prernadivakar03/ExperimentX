
import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

export default function ParticleSplit() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null, active: false });
  const { theme } = useTheme();

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

    // Orb sits centered, slightly below middle — matches AIOrb's visual position
    const orbX = () => W() / 2;
    const orbY = () => H() * 0.78;

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        // start from top, slightly left or right (the "10,000 visitors" funnel point)
        this.x = W() / 2 + (Math.random() - 0.5) * 14;
        this.y = -10;
        this.branch = Math.random() < 0.5 ? "A" : "B";

        // each branch arcs out wide, then curves back down into the orb
        this.peakX = this.branch === "A" ? W() * 0.15 : W() * 0.85;
        this.peakY = H() * 0.4; // pushed down so the arc opens downward into the orb, not loops back up

        this.t = 0; // progress along the path, 0 to 1
        this.speed = 0.003 + Math.random() * 0.0025;
        this.size = 1 + Math.random() * 2;
        this.opacity = 0.5 + Math.random() * 0.5;
        this.depth = Math.random();
      }
      update(mouse) {
        this.t += this.speed;
        if (this.t >= 1) {
          this.reset();
          return;
        }

        // Quadratic bezier: start (top center) -> peak (wide arc) -> end (orb)
        const start = { x: W() / 2, y: -10 };
        const peak = { x: this.peakX, y: this.peakY };
        const end = { x: orbX(), y: orbY() - 15 };

        const t = this.t;
        const mt = 1 - t;
        this.x = mt * mt * start.x + 2 * mt * t * peak.x + t * t * end.x;
        this.y = mt * mt * start.y + 2 * mt * t * peak.y + t * t * end.y;

        // shrink/fade as it nears the orb
        this.currentOpacity = this.opacity * (t < 0.85 ? 1 : 1 - (t - 0.85) / 0.15);

        if (mouse.active && mouse.x !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            this.x += dx * 0.02;
            this.y += dy * 0.02;
          }
        }
      }
      draw() {
        const colorA = theme === "dark" ? "168, 130, 255" : "124, 58, 237";
        const colorB = theme === "dark" ? "79, 200, 255" : "37, 99, 235";
        const color = this.branch === "A" ? colorA : colorB;
        const op = this.currentOpacity ?? this.opacity;
        const sizeNow = this.size * (0.6 + this.depth * 0.8);

        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, sizeNow * 4);
        gradient.addColorStop(0, `rgba(${color}, ${op * 0.5})`);
        gradient.addColorStop(1, `rgba(${color}, 0)`);
        ctx.beginPath();
        ctx.arc(this.x, this.y, sizeNow * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, sizeNow, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${op})`;
        ctx.fill();
      }
    }

    particles = Array.from({ length: 180 }, () => {
      const p = new Particle();
      p.t = Math.random(); // stagger initial positions along the path
      return p;
    });

    const animate = () => {
      ctx.clearRect(0, 0, W(), H());
      particles.forEach((p) => {
        p.update(mouseRef.current);
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
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
  };
  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  );
}