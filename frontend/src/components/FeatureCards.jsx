// import { motion } from "framer-motion";

// const features = [
//   { title: "Real-Time Analytics", desc: "Watch conversions roll in live, no refresh needed." },
//   { title: "Statistical Significance", desc: "Built-in Z-test tells you exactly when a result is trustworthy." },
//   { title: "AI Recommendations", desc: "Get a plain-English call on which variant is winning, and why." },
//   { title: "Deterministic Assignment", desc: "Visitors always see the same variant on repeat visits." },
//   { title: "Custom Goals", desc: "Track signups, purchases, clicks — whatever moves your business." },
//   { title: "Team Dashboards", desc: "Everyone sees the same source of truth, in one clean view." },
// ];

// export default function FeatureCards() {
//   return (
//     <section className="max-w-6xl mx-auto px-6 py-24">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {features.map((f, i) => (
//           <motion.div
//             key={f.title}
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: i * 0.08 }}
//             whileHover={{ y: -4 }}
//             className="p-6 rounded-2xl bg-white dark:bg-brand-card border border-gray-200 dark:border-white/10"
//           >
//             <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-violet/20 to-brand-blue/20
//                             flex items-center justify-center mb-4">
//               <div className="w-4 h-4 rounded bg-gradient-to-br from-brand-violet to-brand-blue" />
//             </div>
//             <h3 className="font-display font-semibold text-gray-900 dark:text-white">{f.title}</h3>
//             <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{f.desc}</p>
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   );
// }























































// import { motion } from "framer-motion";
// import { useTheme } from "../context/ThemeContext";
// import { BarChart3, CheckCircle2, Brain, Target, Goal, Users } from "lucide-react";

// const features = [
//   {
//     icon: BarChart3,
//     title: "Real-Time Analytics",
//     description: "Watch conversions roll in live, no refresh needed.",
//   },
//   {
//     icon: CheckCircle2,
//     title: "Statistical Significance",
//     description: "Built-in Z-test tells you exactly when a result is trustworthy.",
//   },
//   {
//     icon: Brain,
//     title: "AI Recommendations",
//     description: "Get a plain-English call on which variant is winning, and why.",
//   },
//   {
//     icon: Target,
//     title: "Deterministic Assignment",
//     description: "Visitors always see the same variant on repeat visits.",
//   },
//   {
//     icon: Goal,
//     title: "Custom Goals",
//     description: "Track signups, purchases, clicks — whatever moves your business.",
//   },
//   {
//     icon: Users,
//     title: "Team Dashboards",
//     description: "Everyone sees the same source of truth, in one clean view.",
//   },
// ];

// export default function FeatureCards() {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";

//   return (
//     <section className="max-w-6xl mx-auto px-6 py-24 mb-16 md:mb-24">
//       <h2 className="text-3xl font-display font-bold text-center mb-12">
//         Built for Experimenters
//       </h2>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {features.map((feature, i) => {
//           const Icon = feature.icon;
//           return (
//             <motion.div
//               key={feature.title}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: i * 0.08 }}
//               whileHover={{ y: -4 }}
//               className={`p-6 rounded-2xl border transition-all ${
//                 isDark
//                   ? "bg-[#111319] border-white/10 hover:border-brand-violet/40"
//                   : "bg-white border-gray-200 hover:border-brand-violet/30 shadow-sm hover:shadow-md"
//               }`}
//             >
//               <div
//                 className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
//                   isDark
//                     ? "bg-brand-violet/20"
//                     : "bg-gradient-to-br from-brand-violet/20 to-brand-blue/20"
//                 }`}
//               >
//                 <Icon
//                   size={20}
//                   className="text-brand-violet"
//                   strokeWidth={1.5}
//                 />
//               </div>
//               <h3 className="font-display font-semibold text-gray-900 dark:text-white">
//                 {feature.title}
//               </h3>
//               <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
//                 {feature.description}
//               </p>
//             </motion.div>
//           );
//         })}
//       </div>
//     </section>
//   );
// }














// import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
// import { useTheme } from "../context/ThemeContext";
// import { useRef, useState } from "react";
// import { BarChart3, CheckCircle2, Brain, Target, Goal, Users, TrendingUp, Clock } from "lucide-react";

// const cardData = [
//   {
//     icon: BarChart3,
//     title: "Real-Time Analytics",
//     description: "Watch conversions roll in live, no refresh needed.",
//     metric: "12.4k",
//     change: "+23%",
//     sparklineData: [20, 35, 28, 42, 38, 55, 48, 62, 58, 70, 65, 80],
//     color: "from-violet-500 to-indigo-500",
//   },
//   {
//     icon: CheckCircle2,
//     title: "Statistical Significance",
//     description: "Built-in Z-test tells you exactly when a result is trustworthy.",
//     metric: "98.7%",
//     change: "+5.2%",
//     sparklineData: [85, 88, 82, 90, 92, 88, 94, 96, 93, 98, 99, 98.7],
//     color: "from-blue-500 to-cyan-500",
//   },
//   {
//     icon: Brain,
//     title: "AI Recommendations",
//     description: "Get a plain-English call on which variant is winning, and why.",
//     metric: "42",
//     change: "+18%",
//     sparklineData: [10, 15, 18, 22, 28, 30, 35, 38, 40, 42, 45, 42],
//     color: "from-purple-500 to-pink-500",
//   },
//   {
//     icon: Target,
//     title: "Deterministic Assignment",
//     description: "Visitors always see the same variant on repeat visits.",
//     metric: "100%",
//     change: "Guaranteed",
//     sparklineData: [90, 95, 92, 98, 97, 99, 98, 100, 100, 100, 100, 100],
//     color: "from-emerald-500 to-teal-500",
//   },
//   {
//     icon: Goal,
//     title: "Custom Goals",
//     description: "Track signups, purchases, clicks — whatever moves your business.",
//     metric: "∞",
//     change: "Unlimited",
//     sparklineData: [5, 8, 12, 10, 15, 18, 20, 22, 25, 28, 30, 35],
//     color: "from-amber-500 to-orange-500",
//   },
//   {
//     icon: Users,
//     title: "Team Dashboards",
//     description: "Everyone sees the same source of truth, in one clean view.",
//     metric: "6",
//     change: "+2",
//     sparklineData: [1, 2, 2, 3, 4, 4, 5, 5, 6, 6, 6, 6],
//     color: "from-rose-500 to-red-500",
//   },
// ];

// function FeatureCard({ data, index, isDark }) {
//   const Icon = data.icon;
//   const ref = useRef(null);
//   const [isHovering, setIsHovering] = useState(false);

//   // Motion values for 3D tilt
//   const x = useMotionValue(0);
//   const y = useMotionValue(0);
//   const rotateX = useTransform(y, [-0.5, 0.5], ["10deg", "-10deg"]);
//   const rotateY = useTransform(x, [-0.5, 0.5], ["-10deg", "10deg"]);
//   const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 });
//   const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 });

//   const handleMouseMove = (e) => {
//     if (!ref.current) return;
//     const rect = ref.current.getBoundingClientRect();
//     const xVal = (e.clientX - rect.left) / rect.width - 0.5;
//     const yVal = (e.clientY - rect.top) / rect.height - 0.5;
//     x.set(xVal);
//     y.set(yVal);
//   };

//   // Sparkline path
//   const sparkHeight = 30;
//   const sparkWidth = 80;
//   const min = Math.min(...data.sparklineData);
//   const max = Math.max(...data.sparklineData);
//   const range = max - min || 1;
//   const path = data.sparklineData
//     .map(
//       (val, i) =>
//         `${i === 0 ? "M" : "L"} ${(i / (data.sparklineData.length - 1)) * sparkWidth} ${
//           sparkHeight - ((val - min) / range) * sparkHeight
//         }`
//     )
//     .join(" ");

//   return (
//     <motion.div
//       ref={ref}
//       initial={{ opacity: 0, y: 30 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }}
//       transition={{ delay: index * 0.08 }}
//       whileHover={{ scale: 1.03 }}
//       onMouseEnter={() => setIsHovering(true)}
//       onMouseLeave={() => {
//         setIsHovering(false);
//         x.set(0);
//         y.set(0);
//       }}
//       onMouseMove={handleMouseMove}
//       style={{
//         rotateX: springRotateX,
//         rotateY: springRotateY,
//         transformStyle: "preserve-3d",
//       }}
//       className={`relative p-6 rounded-2xl border overflow-hidden transition-shadow duration-300 ${
//         isDark
//           ? "bg-[#111319]/80 backdrop-blur-xl border-white/10"
//           : "bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-sm"
//       }`}
//     >
//       {/* Animated gradient background on hover */}
//       <motion.div
//         className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0"
//         style={{
//           background: `linear-gradient(135deg, ${data.color.split(" ")[0]}10, ${data.color.split(" ")[2]}10)`,
//         }}
//         animate={{ opacity: isHovering ? 1 : 0 }}
//         transition={{ duration: 0.4 }}
//       />

//       {/* Card header */}
//       <div className="relative z-10 flex items-start justify-between">
//         <div className="flex items-center gap-3">
//           <div
//             className={`w-10 h-10 rounded-xl flex items-center justify-center ${
//               isDark ? "bg-white/5" : "bg-gray-50"
//             }`}
//           >
//             <Icon size={20} className="text-brand-violet" strokeWidth={1.5} />
//           </div>
//           <div>
//             <h3 className="font-display font-semibold text-gray-900 dark:text-white">
//               {data.title}
//             </h3>
//             <span className="text-xs text-gray-500 dark:text-gray-400">
//               {data.description}
//             </span>
//           </div>
//         </div>
//         <motion.div
//           animate={{ rotate: isHovering ? 90 : 0 }}
//           transition={{ type: "spring", stiffness: 200 }}
//         >
//           <TrendingUp
//             size={16}
//             className={`${data.change.includes("+") ? "text-emerald-500" : "text-gray-400"}`}
//           />
//         </motion.div>
//       </div>

//       {/* Metric & sparkline */}
//       <div className="relative z-10 mt-4 flex items-end justify-between">
//         <div>
//           <motion.p
//             className="text-2xl font-bold text-gray-900 dark:text-white font-mono"
//             initial={{ scale: 0.8, opacity: 0 }}
//             whileInView={{ scale: 1, opacity: 1 }}
//             transition={{ delay: index * 0.1 + 0.2 }}
//           >
//             {data.metric}
//           </motion.p>
//           <span
//             className={`text-xs font-medium ${
//               data.change.includes("+") || data.change === "Guaranteed" || data.change === "Unlimited"
//                 ? "text-emerald-500"
//                 : "text-gray-400"
//             }`}
//           >
//             {data.change}
//           </span>
//         </div>
//         <div className="relative">
//           <svg width={sparkWidth} height={sparkHeight} className="overflow-visible">
//             {/* Gradient line */}
//             <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
//               <stop offset="0%" stopColor={isDark ? "#8B5CF6" : "#6C5CE7"} stopOpacity="0.6" />
//               <stop offset="100%" stopColor={isDark ? "#3B82F6" : "#4A9EFF"} stopOpacity="0.6" />
//             </linearGradient>
//             <motion.path
//               d={path}
//               fill="none"
//               stroke={`url(#grad-${index})`}
//               strokeWidth={2}
//               strokeLinecap="round"
//               initial={{ pathLength: 0 }}
//               whileInView={{ pathLength: 1 }}
//               transition={{ duration: 1.2, ease: "easeInOut", delay: index * 0.1 }}
//             />
//             {/* Glowing dot at end */}
//             <motion.circle
//               r="3"
//               fill="#6C5CE7"
//               initial={{ scale: 0 }}
//               whileInView={{ scale: 1 }}
//               transition={{ delay: index * 0.1 + 1 }}
//               cx={sparkWidth}
//               cy={sparkHeight - ((data.sparklineData[data.sparklineData.length - 1] - min) / range) * sparkHeight}
//             />
//           </svg>
//         </div>
//       </div>

//       {/* Glow pulse on hover */}
//       <motion.div
//         className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-brand-violet/10 blur-2xl pointer-events-none"
//         animate={{
//           scale: isHovering ? 1.8 : 0.8,
//           opacity: isHovering ? 0.6 : 0,
//         }}
//         transition={{ duration: 0.6 }}
//       />
//     </motion.div>
//   );
// }

// export default function FeatureCards() {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";

//   return (
//     <section className="max-w-6xl mx-auto px-6 py-24 mb-16 md:mb-24">
//       <motion.h2
//         initial={{ opacity: 0, y: -10 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         className="text-3xl font-display font-bold text-center mb-12"
//       >
//         Built for Experimenters
//       </motion.h2>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ perspective: "800px" }}>
//         {cardData.map((data, i) => (
//           <FeatureCard key={data.title} data={data} index={i} isDark={isDark} />
//         ))}
//       </div>
//     </section>
//   );
// }














































































import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useRef, useState } from "react";
import { BarChart3, CheckCircle2, Brain, Target, Goal, Users, TrendingUp } from "lucide-react";

const cardData = [
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Watch conversions roll in live, no refresh needed.",
    metric: "12.4k",
    label: "Visitors",
    change: "+23%",
    sparklineData: [20, 35, 28, 42, 38, 55, 48, 62, 58, 70, 65, 80],
  },
  {
    icon: CheckCircle2,
    title: "Statistical Significance",
    description: "Built-in Z-test tells you exactly when a result is trustworthy.",
    metric: "98.7%",
    label: "Confidence",
    change: "+5.2%",
    sparklineData: [85, 88, 82, 90, 92, 88, 94, 96, 93, 98, 99, 98.7],
  },
  {
    icon: Brain,
    title: "AI Recommendations",
    description: "Get a plain-English call on which variant is winning, and why.",
    metric: "42",
    label: "Recommendations",
    change: "+18%",
    sparklineData: [10, 15, 18, 22, 28, 30, 35, 38, 40, 42, 45, 42],
  },
  {
    icon: Target,
    title: "Deterministic Assignment",
    description: "Visitors always see the same variant on repeat visits.",
    metric: "100%",
    label: "Consistency",
    change: "Guaranteed",
    sparklineData: [90, 95, 92, 98, 97, 99, 98, 100, 100, 100, 100, 100],
  },
  {
    icon: Goal,
    title: "Custom Goals",
    description: "Track signups, purchases, clicks — whatever moves your business.",
    metric: "∞",
    label: "Goals",
    change: "Unlimited",
    sparklineData: [5, 8, 12, 10, 15, 18, 20, 22, 25, 28, 30, 35],
  },
  {
    icon: Users,
    title: "Team Dashboards",
    description: "Everyone sees the same source of truth, in one clean view.",
    metric: "6",
    label: "Team Members",
    change: "+2",
    sparklineData: [1, 2, 2, 3, 4, 4, 5, 5, 6, 6, 6, 6],
  },
];

function FeatureCard({ data, index, isDark }) {
  const Icon = data.icon;
  const ref = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(x, [-0.5, 0.5], ["-10deg", "10deg"]);
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xVal = (e.clientX - rect.left) / rect.width - 0.5;
    const yVal = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xVal);
    y.set(yVal);
  };

  const sparkHeight = 30;
  const sparkWidth = 80;
  const min = Math.min(...data.sparklineData);
  const max = Math.max(...data.sparklineData);
  const range = max - min || 1;
  const path = data.sparklineData
    .map(
      (val, i) =>
        `${i === 0 ? "M" : "L"} ${(i / (data.sparklineData.length - 1)) * sparkWidth} ${
          sparkHeight - ((val - min) / range) * sparkHeight
        }`
    )
    .join(" ");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ scale: 1.03 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        x.set(0);
        y.set(0);
      }}
      onMouseMove={handleMouseMove}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative p-6 rounded-2xl border overflow-hidden transition-shadow duration-300 ${
        isDark
          ? "bg-[#111319]/80 backdrop-blur-xl border-white/10"
          : "bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-sm"
      }`}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0"
        style={{
          background: `linear-gradient(135deg, ${"#6C5CE7"}10, ${"#4A9EFF"}10)`,
        }}
        animate={{ opacity: isHovering ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDark ? "bg-white/5" : "bg-gray-50"
            }`}
          >
            <Icon size={20} className="text-brand-violet" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-display font-semibold text-gray-900 dark:text-white">
              {data.title}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {data.description}
            </span>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isHovering ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <TrendingUp
            size={16}
            className={`${data.change.includes("+") || data.change === "Guaranteed" || data.change === "Unlimited" ? "text-emerald-500" : "text-gray-400"}`}
          />
        </motion.div>
      </div>

      <div className="relative z-10 mt-4 flex items-end justify-between">
        <div>
          <motion.p
            className="text-2xl font-bold text-gray-900 dark:text-white font-mono"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            {data.metric}
          </motion.p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
              {data.label}
            </span>
            <span
              className={`text-xs font-medium ${
                data.change.includes("+") || data.change === "Guaranteed" || data.change === "Unlimited"
                  ? "text-emerald-500"
                  : "text-gray-400"
              }`}
            >
              {data.change}
            </span>
          </div>
        </div>
        <div className="relative">
          <svg width={sparkWidth} height={sparkHeight} className="overflow-visible">
            <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isDark ? "#8B5CF6" : "#6C5CE7"} stopOpacity="0.6" />
              <stop offset="100%" stopColor={isDark ? "#3B82F6" : "#4A9EFF"} stopOpacity="0.6" />
            </linearGradient>
            <motion.path
              d={path}
              fill="none"
              stroke={`url(#grad-${index})`}
              strokeWidth={2}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut", delay: index * 0.1 }}
            />
            <motion.circle
              r="3"
              fill="#6C5CE7"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 1 }}
              cx={sparkWidth}
              cy={sparkHeight - ((data.sparklineData[data.sparklineData.length - 1] - min) / range) * sparkHeight}
            />
          </svg>
        </div>
      </div>

      <motion.div
        className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-brand-violet/10 blur-2xl pointer-events-none"
        animate={{
          scale: isHovering ? 1.8 : 0.8,
          opacity: isHovering ? 0.6 : 0,
        }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
}

export default function FeatureCards() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="max-w-6xl mx-auto px-6 py-24 mb-16 md:mb-24">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl font-display font-bold text-center mb-12"
      >
        Built for Experimenters
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ perspective: "800px" }}>
        {cardData.map((data, i) => (
          <FeatureCard key={data.title} data={data} index={i} isDark={isDark} />
        ))}
      </div>
    </section>
  );
}