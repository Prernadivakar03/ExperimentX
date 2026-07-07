import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

export default function SparkleField() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;
    let stars = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.body.scrollHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    class Star {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 1.4 + 0.3;
        this.baseOpacity = Math.random() * 0.5 + 0.15;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.phase = Math.random() * Math.PI * 2;
        const palette = ["108,92,231", "79,140,255", "236,72,153", "255,255,255"];
        this.color = palette[Math.floor(Math.random() * palette.length)];
      }
      update() {
        this.phase += this.twinkleSpeed;
      }
      draw() {
        const opacity = this.baseOpacity * (0.5 + 0.5 * Math.sin(this.phase));
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${opacity})`;
        ctx.fill();
      }
    }

    stars = Array.from({ length: 220 }, () => new Star());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (theme === "dark") {
        stars.forEach((s) => {
          s.update();
          s.draw();
        });
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: theme === "dark" ? 1 : 0 }}
    />
  );
}