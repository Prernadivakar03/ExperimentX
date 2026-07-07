
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

export default function AIOrb() {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-40, 40], [10, -10]), { stiffness: 200, damping: 15 });
  const rotateY = useSpring(useTransform(x, [-40, 40], [-10, 10]), { stiffness: 200, damping: 15 });

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
    <div className="flex flex-col items-center">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformPerspective: 600 }}
        className="relative w-24 h-24 rounded-full flex items-center justify-center cursor-pointer
                   bg-gradient-to-br from-brand-violet via-fuchsia-500/70 to-brand-blue
                   shadow-[0_0_70px_rgba(108,92,231,0.7)]"
        whileHover={{ scale: 1.08 }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Glassy highlight */}
        <div className="absolute top-2 left-3 w-8 h-6 rounded-full bg-white/30 blur-md pointer-events-none" />

        <span className="text-white font-display font-bold text-base pointer-events-none drop-shadow">
          AI
        </span>

        <motion.div
          className="absolute inset-0 rounded-full border border-brand-violet/40 pointer-events-none"
          animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border border-brand-blue/30 pointer-events-none"
          animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
        />
      </motion.div>

      {/* Platform rings beneath the orb, like the reference */}
      <div className="relative mt-3 w-28 h-6">
        <motion.div
          className="absolute inset-0 rounded-[50%] border border-brand-violet/30"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <div
          className="absolute top-1 left-1/2 -translate-x-1/2 w-20 h-3 rounded-[50%]"
          style={{ background: "radial-gradient(ellipse at center, rgba(108,92,231,0.5), transparent 70%)" }}
        />
      </div>
    </div>
  );
}