
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

function SunIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        d="M12 2.5v2M12 19.5v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2.5 12h2M19.5 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      />
    </svg>
  );
}

function MoonIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const btnRef = useRef(null);
  const [ripple, setRipple] = useState(null);
  const [sparks, setSparks] = useState([]);

  const isDark = theme === "dark";

  const handleClick = () => {
    const rect = btnRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const nextTheme = isDark ? "light" : "dark";

    setRipple({ x, y, id: Date.now(), nextTheme });

    const sparkId = Date.now();
    const thumbX = isDark ? rect.left + 18 : rect.right - 18;
    const newSparks = Array.from({ length: 8 }, (_, i) => ({
      id: `${sparkId}-${i}`,
      angle: (i / 8) * Math.PI * 2,
      x: thumbX,
      y: rect.top + rect.height / 2,
    }));
    setSparks(newSparks);

    toggleTheme();

    setTimeout(() => setRipple(null), 700);
    setTimeout(() => setSparks([]), 600);
  };

  return (
    <>
      <motion.button
        ref={btnRef}
        onClick={handleClick}
        aria-label="Toggle theme"
        whileTap={{ scale: 0.96 }}
        className="relative w-[68px] h-9 rounded-full flex items-center px-2 z-[10000]
                   backdrop-blur-xl border overflow-hidden
                   bg-white/60 dark:bg-white/[0.05]
                   border-gray-200/80 dark:border-white/15
                   shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]
                   transition-colors duration-300"
      >
        {/* Static icons, sun left / moon right, dim until active side glows */}
        <SunIcon
          className={`absolute left-2 w-3.5 h-3.5 transition-colors duration-300 ${
            !isDark ? "text-amber-500" : "text-gray-400 dark:text-white/30"
          }`}
        />
        <MoonIcon
          className={`absolute right-2 w-3.5 h-3.5 transition-colors duration-300 ${
            isDark ? "text-brand-violet" : "text-gray-400 dark:text-white/30"
          }`}
        />

        {/* Sliding glowing knob */}
        <motion.div
          className="relative z-10 w-6 h-6 rounded-full"
          animate={{ x: isDark ? 32 : 0 }}
          transition={{ type: "spring", stiffness: 480, damping: 30 }}
        >
          {/* outer glow halo */}
          <motion.div
            className="absolute -inset-1.5 rounded-full pointer-events-none"
            animate={{
              background: isDark
                ? "radial-gradient(circle, rgba(108,92,231,0.55), transparent 70%)"
                : "radial-gradient(circle, rgba(251,191,36,0.4), transparent 70%)",
            }}
            transition={{ duration: 0.4 }}
          />

          {/* knob body */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              background: isDark
                ? "linear-gradient(135deg, #A78BFA, #6C5CE7 55%, #4F8CFF)"
                : "linear-gradient(135deg, #FDE68A, #FBBF24 55%, #F59E0B)",
              boxShadow: isDark
                ? "0 0 16px rgba(108,92,231,0.85), inset 0 1px 1px rgba(255,255,255,0.4)"
                : "0 0 12px rgba(251,191,36,0.7), inset 0 1px 1px rgba(255,255,255,0.5)",
            }}
            transition={{ duration: 0.4 }}
          />

          {/* idle pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ border: `1px solid ${isDark ? "rgba(168,130,255,0.5)" : "rgba(251,191,36,0.5)"}` }}
            animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        </motion.div>
      </motion.button>

      {/* Spark particles emitted on toggle */}
      <AnimatePresence>
        {sparks.map((s) => (
          <motion.div
            key={s.id}
            className="fixed w-1 h-1 rounded-full pointer-events-none z-[10001]"
            style={{ left: s.x, top: s.y, backgroundColor: isDark ? "#A78BFA" : "#FBBF24" }}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{ opacity: 0, x: Math.cos(s.angle) * 26, y: Math.sin(s.angle) * 26, scale: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Full-screen color morph sweep */}
      <AnimatePresence>
        {ripple && (
          <motion.div
            key={ripple.id}
            initial={{ clipPath: `circle(0px at ${ripple.x}px ${ripple.y}px)` }}
            animate={{ clipPath: `circle(170% at ${ripple.x}px ${ripple.y}px)` }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
            className={`fixed inset-0 z-[9998] pointer-events-none ${
              ripple.nextTheme === "dark"
                ? "bg-gradient-to-br from-brand-violet/25 via-brand-black to-brand-black"
                : "bg-gradient-to-br from-amber-100/40 via-white to-white"
            }`}
          />
        )}
      </AnimatePresence>
    </>
  );
}



















































