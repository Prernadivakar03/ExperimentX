
import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

export default function NetworkBackground({
  nodeCount = 80,
  maxDistance = 150,
  speed = 1.5,
  className = "absolute inset-0 w-full h-full pointer-events-none",
}) {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
        this.turnSpeed = (Math.random() - 0.5) * 0.03; // gentle continuous drift in turning
        this.baseOpacity = 0.35 + Math.random() * 0.55;
        this.radius = 1.2 + Math.random() * 1.8;
        this.pulseSpeed = 0.004 + Math.random() * 0.008;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }
      update(t) {
        // Randomly nudge turning direction so paths curve organically over time,
        // instead of moving in a straight line or orbiting a fixed point.
        this.turnSpeed += (Math.random() - 0.5) * 0.01;
        this.turnSpeed = Math.max(-0.05, Math.min(0.05, this.turnSpeed));
        this.angle += this.turnSpeed;

        this.x += Math.cos(this.angle) * speed;
        this.y += Math.sin(this.angle) * speed;

        const w = W(), h = H();
        // Wrap around edges instead of bouncing — reads as continuous flow, not trapped bouncing
        if (this.x < -20) this.x = w + 20;
        if (this.x > w + 20) this.x = -20;
        if (this.y < -20) this.y = h + 20;
        if (this.y > h + 20) this.y = -20;

        this.currentOpacity = this.baseOpacity * (0.7 + 0.3 * Math.sin(t * this.pulseSpeed + this.pulsePhase));
      }
      draw(color, glow) {
        ctx.save();
        if (glow) {
          ctx.shadowColor = color;
          ctx.shadowBlur = this.radius * 5;
        }
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
      nodes = Array.from(
        { length: nodeCount },
        () => new Node(Math.random() * w, Math.random() * h)
      );
    };
    init();
    window.addEventListener("resize", init);

    const animate = () => {
      const w = W(), h = H();
      const t = performance.now();
      ctx.clearRect(0, 0, w, h);

      const lineColor = isDark ? "59, 130, 246" : "37, 99, 235";
      const dotColor = isDark ? "#60A5FA" : "#2563EB";

      nodes.forEach((n) => n.update(t));

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDistance) {
            const proximityFactor = 1 - dist / maxDistance;
            const opacity = proximityFactor * Math.min(a.currentOpacity, b.currentOpacity) * (isDark ? 0.8 : 0.6);
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

      nodes.forEach((n) => n.draw(dotColor, isDark));

      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", init);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isDark, nodeCount, maxDistance, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block" }}
    />
  );
}
