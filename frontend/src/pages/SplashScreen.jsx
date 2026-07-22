
// // C:\prerna\ExperimentX\frontend\src\pages\SplashScreen.jsx

// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import {
//   BarChart3,
//   CheckCircle2,
//   Brain,
//   Target,
//   Sparkles,
//   Share2,
//   Copy,
//   Sun,
//   Moon,
// } from "lucide-react";
// import Navbar from "../components/Navbar";
// import HowItWorks from "../components/HowItWorks";
// import FeatureCards from "../components/FeatureCards";
// import Floating3DCards from "../components/Floating3DCards";
// import HeroExperimentVisual from "../components/HeroExperimentVisual";
// import AvatarParticleField from "../components/AvatarParticleField";
// import NetworkBackground from "../components/NetworkBackground";
// import { useTheme } from "../context/ThemeContext";

// const getAssignment = () => {
//   const stored = localStorage.getItem("experimentAssignment");
//   if (stored) {
//     try {
//       return JSON.parse(stored);
//     } catch {
//       // fall through
//     }
//   }

//   const variant = Math.random() < 0.5 ? "A" : "B";
//   const initialTheme = Math.random() < 0.5 ? "light" : "dark";
//   const assignment = {
//     variant,
//     initialTheme,
//     currentTheme: initialTheme,
//     experimentId: `EXP-${String(Math.floor(1000 + Math.random() * 9000))}`,
//     confidence: 98.4,
//   };
//   localStorage.setItem("experimentAssignment", JSON.stringify(assignment));
//   return assignment;
// };

// export default function SplashScreen() {
//   const { theme } = useTheme();
//   const [assignment, setAssignment] = useState(null);
//   const [themeSwitched, setThemeSwitched] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [stats, setStats] = useState({
//     timeOnPage: "2m 54s",
//     scrollDepth: 94,
//     interactions: 18,
//     pagesViewed: 1,
//   });

//   useEffect(() => {
//     const data = getAssignment();
//     setAssignment(data);
//     if (data.initialTheme !== theme) {
//       setThemeSwitched(true);
//       data.currentTheme = theme;
//       localStorage.setItem("experimentAssignment", JSON.stringify(data));
//     }
//   }, [theme]);

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
//       setStats((prev) => ({ ...prev, scrollDepth: Math.min(100, Math.round(scrollPercent)) }));
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleShare = () => {
//     navigator.clipboard.writeText(window.location.href);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   if (!assignment) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white dark:bg-brand-black">
//         <div className="w-8 h-8 rounded-full border-2 border-brand-violet border-t-transparent animate-spin" />
//       </div>
//     );
//   }

//   const heroVariant = assignment.variant;
//   const initialThemeLabel = assignment.initialTheme === "light" ? "Light" : "Dark";
//   const currentThemeLabel = theme === "light" ? "Light" : "Dark";

//   return (
//     <div className="relative min-h-screen bg-white dark:bg-brand-black transition-colors duration-500 overflow-hidden">
//       {/* Network background — covers the whole page, live in both themes */}
//       <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
//         <NetworkBackground />
//       </div>

//       <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
//         <AvatarParticleField />
//       </div>

//       <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full
//                       bg-brand-violet/10 dark:bg-brand-violet/25 blur-[120px] pointer-events-none" />
//       <div className="absolute top-40 right-0 w-[400px] h-[400px] rounded-full
//                       bg-brand-blue/10 dark:bg-brand-blue/25 blur-[120px] pointer-events-none" />

//       <div className="relative z-10">
//         <Navbar />

//         {/* ─── Hero ──────────────────────────────────────────── */}
//         <section className="pt-32 pb-16 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             <span className="inline-block text-xs font-medium px-3 py-1 rounded-full
//                               bg-brand-violet/10 text-brand-violet mb-5">
//               AI-Powered A/B Testing Platform
//             </span>
//             <h1 className="text-4xl md:text-5xl font-display font-extrabold leading-tight text-gray-900 dark:text-white">
//               Measure. Experiment.{" "}
//               <span className="bg-gradient-to-r from-brand-violet to-brand-blue bg-clip-text text-transparent">
//                 Optimize.
//               </span>
//             </h1>
//             <p className="mt-5 text-gray-600 dark:text-gray-300 text-lg max-w-md">
//               Run A/B tests with confidence. Get AI-powered insights and grow your business faster.
//             </p>

//             <div className="mt-8 flex items-center gap-4">
//               <Link
//                 to="/register"
//                 className="px-6 py-3 rounded-lg text-white font-medium
//                            bg-gradient-to-r from-brand-violet to-brand-blue hover:opacity-90
//                            shadow-[0_0_30px_rgba(108,92,231,0.4)] hover:shadow-[0_0_45px_rgba(108,92,231,0.6)]
//                            transition-all duration-300"
//               >
//                 Start Free Trial
//               </Link>
//               <button className="px-6 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-200
//                                  border border-gray-300 dark:border-white/15 hover:border-brand-violet transition-colors">
//                 ▶ Watch Demo
//               </button>
//             </div>

//             <div className="mt-6 flex gap-6 text-xs text-gray-500 dark:text-gray-400">
//               <span>✓ No credit card required</span>
//               <span>✓ 14-day free trial</span>
//               <span>✓ Cancel anytime</span>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//           >
//             <HeroExperimentVisual />
//           </motion.div>
//         </section>

//         {/* ─── Trusted by ────────────────────────────────────── */}
//         <section className="py-10 border-y border-gray-200 dark:border-white/10">
//           <p className="text-center text-xs text-gray-500 dark:text-gray-400 mb-6">Trusted by ambitious companies</p>
//           <div className="flex justify-center gap-10 flex-wrap px-6 opacity-50 dark:opacity-40 grayscale">
//             {["Shiprocket", "Meesho", "Razorpay", "CRED", "Zepto"].map((name) => (
//               <span key={name} className="text-sm font-semibold text-gray-600 dark:text-gray-400">
//                 {name}
//               </span>
//             ))}
//           </div>
//           <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 mt-4">
//             (Placeholder names for design preview only — replace before going live)
//           </p>
//         </section>

//         <HowItWorks />

//         <div className="relative">
//           <Floating3DCards />
//         </div>

//         {/* ─── Feature Cards ────────────────────────────────── */}
//         <FeatureCards />

//         {/* ─── Divider ───────────────────────────────────────── */}
//         <div className="max-w-6xl mx-auto px-6">
//           <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-violet/30 to-transparent" />
//         </div>

//         {/* ─── EXPERIMENT REPORT ────────────────────────────── */}
//         <section className="relative py-16 md:py-24 px-6 overflow-hidden">
//           <div className="absolute inset-0 pointer-events-none">
//             <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-violet/5 dark:bg-brand-violet/20 blur-[140px]" />
//             <div className="absolute right-10 top-20 h-72 w-72 rounded-full bg-brand-blue/5 dark:bg-brand-blue/20 blur-[120px]" />
//             <div className="absolute left-10 bottom-0 h-64 w-64 rounded-full bg-brand-violet/5 dark:bg-brand-violet/10 blur-[120px]" />
//           </div>

//           <div className="relative max-w-6xl mx-auto">
//             {/* Header with Experiment ID badge */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="text-center mb-12"
//             >
//               <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-brand-violet/10 dark:bg-brand-violet/20 border border-brand-violet/20 text-xs font-medium text-brand-violet mb-4">
//                 <span>Experiment ID</span>
//                 <span className="font-mono font-bold">{assignment.experimentId}</span>
//               </div>
//               <h2 className="text-4xl md:text-5xl font-display font-extrabold leading-tight text-gray-900 dark:text-white">
//                 Here's Your Experiment Report
//               </h2>
//               <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
//                 Thank you for helping improve ExperimentX.
//               </p>
//             </motion.div>

//             {/* Three columns */}
//             <div className="grid md:grid-cols-3 gap-6">
//               {/* Assignment Card */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.1 }}
//                 className="rounded-2xl border p-6 bg-white dark:bg-[#111319] border-gray-200 dark:border-white/10 shadow-sm"
//               >
//                 <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-2">
//                   <Target size={16} className="text-brand-violet" />
//                   Your Assignment
//                 </h3>
//                 <div className="mt-4 space-y-3">
//                   <div>
//                     <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Hero Variant</p>
//                     <p className="text-2xl font-bold text-brand-violet">Variant {heroVariant}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Theme Journey</p>
//                     <div className="flex items-center gap-2">
//                       <span className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
//                         {assignment.initialTheme === "light" ? (
//                           <Sun size={14} className="text-amber-500" />
//                         ) : (
//                           <Moon size={14} className="text-indigo-300" />
//                         )}
//                         {initialThemeLabel}
//                       </span>
//                       {themeSwitched && <span className="text-gray-400">→</span>}
//                       {themeSwitched && (
//                         <span className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
//                           {theme === "light" ? (
//                             <Sun size={14} className="text-amber-500" />
//                           ) : (
//                             <Moon size={14} className="text-indigo-300" />
//                           )}
//                           {currentThemeLabel}
//                         </span>
//                       )}
//                     </div>
//                     {themeSwitched && (
//                       <span className="inline-block mt-1 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
//                         Theme Changed ✓
//                       </span>
//                     )}
//                   </div>
//                   <div>
//                     <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Experiment ID</p>
//                     <p className="text-sm font-mono text-gray-800 dark:text-gray-200">{assignment.experimentId}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Confidence</p>
//                     <div className="flex items-center gap-2">
//                       <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden relative">
//                         <motion.div
//                           className="h-full bg-gradient-to-r from-brand-violet to-brand-blue absolute inset-0"
//                           initial={{ width: 0 }}
//                           whileInView={{ width: `${assignment.confidence}%` }}
//                           transition={{ duration: 1 }}
//                         />
//                         <motion.div
//                           className="h-full bg-gradient-to-r from-brand-violet to-brand-blue absolute inset-0"
//                           animate={{
//                             opacity: [0.6, 1, 0.6],
//                             scaleX: [0.98, 1.02, 0.98],
//                           }}
//                           transition={{
//                             duration: 1.5,
//                             repeat: Infinity,
//                             delay: 1.2,
//                           }}
//                           style={{ width: `${assignment.confidence}%` }}
//                         />
//                       </div>
//                       <span className="text-sm font-mono text-gray-800 dark:text-gray-200">
//                         {assignment.confidence}%
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>

//               {/* Session Stats Card */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.2 }}
//                 className="rounded-2xl border p-6 bg-white dark:bg-[#111319] border-gray-200 dark:border-white/10 shadow-sm"
//               >
//                 <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-2">
//                   <BarChart3 size={16} className="text-brand-blue" />
//                   Your Session
//                 </h3>
//                 <div className="mt-4 space-y-4">
//                   <div>
//                     <div className="flex justify-between text-xs">
//                       <span className="text-gray-600 dark:text-gray-400">Time</span>
//                       <span className="font-mono text-gray-800 dark:text-gray-200">{stats.timeOnPage}</span>
//                     </div>
//                     <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden mt-1">
//                       <motion.div
//                         className="h-full bg-brand-violet"
//                         initial={{ width: 0 }}
//                         whileInView={{ width: "100%" }}
//                         transition={{ duration: 1 }}
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <div className="flex justify-between text-xs">
//                       <span className="text-gray-600 dark:text-gray-400">Scroll</span>
//                       <span className="font-mono text-gray-800 dark:text-gray-200">{stats.scrollDepth}%</span>
//                     </div>
//                     <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden mt-1">
//                       <motion.div
//                         className="h-full bg-brand-blue"
//                         initial={{ width: 0 }}
//                         whileInView={{ width: `${stats.scrollDepth}%` }}
//                         transition={{ duration: 1 }}
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <div className="flex justify-between text-xs">
//                       <span className="text-gray-600 dark:text-gray-400">Interactions</span>
//                       <span className="font-mono text-gray-800 dark:text-gray-200">{stats.interactions}</span>
//                     </div>
//                     <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden mt-1">
//                       <motion.div
//                         className="h-full bg-emerald-500"
//                         initial={{ width: 0 }}
//                         whileInView={{ width: `${Math.min(100, (stats.interactions / 20) * 100)}%` }}
//                         transition={{ duration: 1 }}
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <div className="flex justify-between text-xs">
//                       <span className="text-gray-600 dark:text-gray-400">Pages Viewed</span>
//                       <span className="font-mono text-gray-800 dark:text-gray-200">{stats.pagesViewed}</span>
//                     </div>
//                     <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden mt-1">
//                       <motion.div
//                         className="h-full bg-amber-500"
//                         initial={{ width: 0 }}
//                         whileInView={{ width: `${Math.min(100, stats.pagesViewed * 30)}%` }}
//                         transition={{ duration: 1 }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>

//               {/* Behavior Analysis */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.3 }}
//                 className="rounded-2xl border p-6 bg-gradient-to-br from-brand-violet/5 to-brand-blue/5 border-brand-violet/20 dark:border-brand-violet/30 shadow-sm"
//               >
//                 <h3 className="text-sm font-bold uppercase tracking-wider text-brand-violet flex items-center gap-2">
//                   <Brain size={16} className="text-brand-violet" />
//                   AI Observations
//                 </h3>
//                 <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
//                   <li className="flex items-start gap-2">
//                     <CheckCircle2 size={14} className="text-brand-violet shrink-0 mt-0.5" />
//                     <span>Engaged with {heroVariant === "B" ? "Variant B" : "Variant A"} hero</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <CheckCircle2 size={14} className="text-brand-violet shrink-0 mt-0.5" />
//                     <span>{themeSwitched ? "Switched to dark theme" : "Maintained light theme preference"}</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <CheckCircle2 size={14} className="text-brand-violet shrink-0 mt-0.5" />
//                     <span>Read Comparison Section</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <CheckCircle2 size={14} className="text-brand-violet shrink-0 mt-0.5" />
//                     <span>Viewed Feature Cards</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <CheckCircle2 size={14} className="text-brand-violet shrink-0 mt-0.5" />
//                     <span>High engagement</span>
//                   </li>
//                 </ul>
//               </motion.div>
//             </div>

//             {/* Closing message + CTA with Share button */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.4 }}
//               className="mt-16 text-center"
//             >
//               <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-brand-violet/10 dark:bg-brand-violet/20 border border-brand-violet/20 mb-8">
//                 <Sparkles size={16} className="text-brand-violet" />
//                 <span className="font-medium text-gray-800 dark:text-white">
//                   You were assigned <span className="font-bold text-brand-violet">Variant {heroVariant}</span>
//                 </span>
//               </div>

//               <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
//                 Every visitor teaches your product something.
//                 <br />
//                 <span className="bg-gradient-to-r from-brand-violet to-brand-blue bg-clip-text text-transparent font-semibold text-xl">
//                   Today, you taught ours.
//                 </span>
//               </p>

//               <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
//                 <Link
//                   to="/register"
//                   className="inline-block px-10 py-4 rounded-xl text-white font-semibold
//                              bg-gradient-to-r from-brand-violet to-brand-blue
//                              shadow-[0_0_40px_rgba(108,92,231,0.4)] hover:shadow-[0_0_60px_rgba(108,92,231,0.6)]
//                              hover:scale-105 transition-all duration-300"
//                 >
//                   Create My First Experiment
//                 </Link>

//                 <button
//                   onClick={handleShare}
//                   className="inline-flex items-center gap-2 px-5 py-4 rounded-xl border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-brand-violet hover:text-brand-violet transition-colors"
//                 >
//                   {copied ? (
//                     <>
//                       <Copy size={18} />
//                       Copied!
//                     </>
//                   ) : (
//                     <>
//                       <Share2 size={18} />
//                       Share
//                     </>
//                   )}
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

















































// C:\prerna\ExperimentX\frontend\src\pages\SplashScreen.jsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Brain,
  Target,
  Sparkles,
  Share2,
  Copy,
  Sun,
  Moon,
} from "lucide-react";
import Navbar from "../components/Navbar";
import HowItWorks from "../components/HowItWorks";
import FeatureCards from "../components/FeatureCards";
import Floating3DCards from "../components/Floating3DCards";
import HeroExperimentVisual from "../components/HeroExperimentVisual";
import AvatarParticleField from "../components/AvatarParticleField";
import NetworkBackground from "../components/NetworkBackground";
import { useTheme } from "../context/ThemeContext";

const getAssignment = () => {
  const stored = localStorage.getItem("experimentAssignment");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fall through
    }
  }

  const variant = Math.random() < 0.5 ? "A" : "B";
  const initialTheme = Math.random() < 0.5 ? "light" : "dark";
  const assignment = {
    variant,
    initialTheme,
    currentTheme: initialTheme,
    experimentId: `EXP-${String(Math.floor(1000 + Math.random() * 9000))}`,
    confidence: 98.4,
  };
  localStorage.setItem("experimentAssignment", JSON.stringify(assignment));
  return assignment;
};

export default function SplashScreen() {
  const { theme } = useTheme();
  const [assignment, setAssignment] = useState(null);
  const [themeSwitched, setThemeSwitched] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    timeOnPage: "2m 54s",
    scrollDepth: 94,
    interactions: 18,
    pagesViewed: 1,
  });

  useEffect(() => {
    const data = getAssignment();
    setAssignment(data);
    if (data.initialTheme !== theme) {
      setThemeSwitched(true);
      data.currentTheme = theme;
      localStorage.setItem("experimentAssignment", JSON.stringify(data));
    }
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setStats((prev) => ({ ...prev, scrollDepth: Math.min(100, Math.round(scrollPercent)) }));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-brand-black">
        <div className="w-8 h-8 rounded-full border-2 border-brand-violet border-t-transparent animate-spin" />
      </div>
    );
  }

  const heroVariant = assignment.variant;
  const initialThemeLabel = assignment.initialTheme === "light" ? "Light" : "Dark";
  const currentThemeLabel = theme === "light" ? "Light" : "Dark";

  return (
    <div className="relative min-h-screen bg-white dark:bg-brand-black transition-colors duration-500 overflow-hidden">
      {/* Network background — covers the whole page, live in both themes */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <NetworkBackground />
      </div>

      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <AvatarParticleField />
      </div>

      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full
                      bg-brand-violet/10 dark:bg-brand-violet/25 blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-0 w-[400px] h-[400px] rounded-full
                      bg-brand-blue/10 dark:bg-brand-blue/25 blur-[120px] pointer-events-none" />

      <div className="relative z-10">
        <Navbar />

        {/* ─── Hero ──────────────────────────────────────────── */}
        <section className="pt-32 pb-16 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* --- REPLACED HERO COPY --- */}
            <span className="inline-block text-xs font-medium px-3 py-1 rounded-full
                              bg-brand-violet/10 text-brand-violet mb-5">
              You're already part of an experiment on this page
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold leading-tight text-gray-900 dark:text-white">
              Stop guessing what works.{" "}
              <span className="bg-gradient-to-r from-brand-violet to-brand-blue bg-clip-text text-transparent">
                Start proving it.
              </span>
            </h1>
            <p className="mt-5 text-gray-600 dark:text-gray-300 text-lg max-w-md">
              Run statistically honest A/B tests with an AI copilot that catches
              peeking, flags sample ratio mismatches, and never lets you fool
              yourself with your own data.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <Link
                to="/register"
                className="px-6 py-3 rounded-lg text-white font-medium
                           bg-gradient-to-r from-brand-violet to-brand-blue hover:opacity-90
                           shadow-[0_0_30px_rgba(108,92,231,0.4)] hover:shadow-[0_0_45px_rgba(108,92,231,0.6)]
                           transition-all duration-300"
              >
                Start Free Trial
              </Link>
              <button
                onClick={() => document.getElementById("experiment-report")?.scrollIntoView({ behavior: "smooth" })}
                className="px-6 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-200
                           border border-gray-300 dark:border-white/15 hover:border-brand-violet transition-colors"
              >
                See your experiment report ↓
              </button>
            </div>
            {/* --- END REPLACED HERO COPY --- */}

            <div className="mt-6 flex gap-6 text-xs text-gray-500 dark:text-gray-400">
              <span>✓ No credit card required</span>
              <span>✓ 14-day free trial</span>
              <span>✓ Cancel anytime</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <HeroExperimentVisual />
          </motion.div>
        </section>

        {/* ─── Trusted by section REMOVED ─────────────────── */}

        <HowItWorks />

        <div className="relative">
          <Floating3DCards />
        </div>

        {/* ─── Feature Cards ────────────────────────────────── */}
        <FeatureCards />

        {/* ─── Divider ───────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-violet/30 to-transparent" />
        </div>

        {/* ─── EXPERIMENT REPORT ────────────────────────────── */}
        <section
          id="experiment-report"
          className="relative py-16 md:py-24 px-6 overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-violet/5 dark:bg-brand-violet/20 blur-[140px]" />
            <div className="absolute right-10 top-20 h-72 w-72 rounded-full bg-brand-blue/5 dark:bg-brand-blue/20 blur-[120px]" />
            <div className="absolute left-10 bottom-0 h-64 w-64 rounded-full bg-brand-violet/5 dark:bg-brand-violet/10 blur-[120px]" />
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Header with Experiment ID badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-brand-violet/10 dark:bg-brand-violet/20 border border-brand-violet/20 text-xs font-medium text-brand-violet mb-4">
                <span>Experiment ID</span>
                <span className="font-mono font-bold">{assignment.experimentId}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-extrabold leading-tight text-gray-900 dark:text-white">
                Here's Your Experiment Report
              </h2>
              <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
                Thank you for helping improve ExperimentX.
              </p>
            </motion.div>

            {/* Three columns */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Assignment Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-2xl border p-6 bg-white dark:bg-[#111319] border-gray-200 dark:border-white/10 shadow-sm"
              >
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Target size={16} className="text-brand-violet" />
                  Your Assignment
                </h3>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Hero Variant</p>
                    <p className="text-2xl font-bold text-brand-violet">Variant {heroVariant}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Theme Journey</p>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                        {assignment.initialTheme === "light" ? (
                          <Sun size={14} className="text-amber-500" />
                        ) : (
                          <Moon size={14} className="text-indigo-300" />
                        )}
                        {initialThemeLabel}
                      </span>
                      {themeSwitched && <span className="text-gray-400">→</span>}
                      {themeSwitched && (
                        <span className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                          {theme === "light" ? (
                            <Sun size={14} className="text-amber-500" />
                          ) : (
                            <Moon size={14} className="text-indigo-300" />
                          )}
                          {currentThemeLabel}
                        </span>
                      )}
                    </div>
                    {themeSwitched && (
                      <span className="inline-block mt-1 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Theme Changed ✓
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Experiment ID</p>
                    <p className="text-sm font-mono text-gray-800 dark:text-gray-200">{assignment.experimentId}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Confidence</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden relative">
                        <motion.div
                          className="h-full bg-gradient-to-r from-brand-violet to-brand-blue absolute inset-0"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${assignment.confidence}%` }}
                          transition={{ duration: 1 }}
                        />
                        <motion.div
                          className="h-full bg-gradient-to-r from-brand-violet to-brand-blue absolute inset-0"
                          animate={{
                            opacity: [0.6, 1, 0.6],
                            scaleX: [0.98, 1.02, 0.98],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: 1.2,
                          }}
                          style={{ width: `${assignment.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono text-gray-800 dark:text-gray-200">
                        {assignment.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Session Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-2xl border p-6 bg-white dark:bg-[#111319] border-gray-200 dark:border-white/10 shadow-sm"
              >
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <BarChart3 size={16} className="text-brand-blue" />
                  Your Session
                </h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Time</span>
                      <span className="font-mono text-gray-800 dark:text-gray-200">{stats.timeOnPage}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden mt-1">
                      <motion.div
                        className="h-full bg-brand-violet"
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Scroll</span>
                      <span className="font-mono text-gray-800 dark:text-gray-200">{stats.scrollDepth}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden mt-1">
                      <motion.div
                        className="h-full bg-brand-blue"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${stats.scrollDepth}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Interactions</span>
                      <span className="font-mono text-gray-800 dark:text-gray-200">{stats.interactions}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden mt-1">
                      <motion.div
                        className="h-full bg-emerald-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min(100, (stats.interactions / 20) * 100)}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Pages Viewed</span>
                      <span className="font-mono text-gray-800 dark:text-gray-200">{stats.pagesViewed}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden mt-1">
                      <motion.div
                        className="h-full bg-amber-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min(100, stats.pagesViewed * 30)}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Behavior Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-2xl border p-6 bg-gradient-to-br from-brand-violet/5 to-brand-blue/5 border-brand-violet/20 dark:border-brand-violet/30 shadow-sm"
              >
                <h3 className="text-sm font-bold uppercase tracking-wider text-brand-violet flex items-center gap-2">
                  <Brain size={16} className="text-brand-violet" />
                  AI Observations
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-brand-violet shrink-0 mt-0.5" />
                    <span>Engaged with {heroVariant === "B" ? "Variant B" : "Variant A"} hero</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-brand-violet shrink-0 mt-0.5" />
                    <span>{themeSwitched ? "Switched to dark theme" : "Maintained light theme preference"}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-brand-violet shrink-0 mt-0.5" />
                    <span>Read Comparison Section</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-brand-violet shrink-0 mt-0.5" />
                    <span>Viewed Feature Cards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-brand-violet shrink-0 mt-0.5" />
                    <span>High engagement</span>
                  </li>
                </ul>
              </motion.div>
            </div>

            {/* Closing message + CTA with Share button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 text-center"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-brand-violet/10 dark:bg-brand-violet/20 border border-brand-violet/20 mb-8">
                <Sparkles size={16} className="text-brand-violet" />
                <span className="font-medium text-gray-800 dark:text-white">
                  You were assigned <span className="font-bold text-brand-violet">Variant {heroVariant}</span>
                </span>
              </div>

              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Every visitor teaches your product something.
                <br />
                <span className="bg-gradient-to-r from-brand-violet to-brand-blue bg-clip-text text-transparent font-semibold text-xl">
                  Today, you taught ours.
                </span>
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="inline-block px-10 py-4 rounded-xl text-white font-semibold
                             bg-gradient-to-r from-brand-violet to-brand-blue
                             shadow-[0_0_40px_rgba(108,92,231,0.4)] hover:shadow-[0_0_60px_rgba(108,92,231,0.6)]
                             hover:scale-105 transition-all duration-300"
                >
                  Create My First Experiment
                </Link>

                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-5 py-4 rounded-xl border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-brand-violet hover:text-brand-violet transition-colors"
                >
                  {copied ? (
                    <>
                      <Copy size={18} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Share2 size={18} />
                      Share
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}