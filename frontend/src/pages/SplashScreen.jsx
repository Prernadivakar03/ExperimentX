
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import Navbar from "../components/Navbar";
// // import ParticleSplit from "../components/ParticleSplit";
// // import AIOrb from "../components/AIOrb";
// import HowItWorks from "../components/HowItWorks";
// import FeatureCards from "../components/FeatureCards";
// // import Footer from "../components/Footer";
// import SparkleField from "../components/SparkleField";
// import Floating3DCards from "../components/Floating3DCards";
// // import VariantLabelCard from "../components/VariantLabelCard";
// import HeroExperimentVisual from "../components/HeroExperimentVisual";
// // Pricing removed from home – it’s a separate page now
// // import Pricing from "./Pricing";

// export default function SplashScreen() {
//   return (
//     <div className="relative min-h-screen bg-white dark:bg-brand-black transition-colors duration-500 overflow-hidden">
//       <SparkleField />

//       {/* Ambient glow blobs */}
//       <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full
//                       bg-brand-violet/20 dark:bg-brand-violet/25 blur-[120px] pointer-events-none" />
//       <div className="absolute top-40 right-0 w-[400px] h-[400px] rounded-full
//                       bg-brand-blue/20 dark:bg-brand-blue/25 blur-[120px] pointer-events-none" />

//       <div className="relative z-10">
//         <Navbar />

//         {/* Hero */}
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
//             <p className="mt-5 text-gray-500 dark:text-gray-400 text-lg max-w-md">
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

//             <div className="mt-6 flex gap-6 text-xs text-gray-400">
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

//         {/* Trusted by */}
//         <section className="py-10 border-y border-gray-200 dark:border-white/10">
//           <p className="text-center text-xs text-gray-400 mb-6">Trusted by ambitious companies</p>
//           <div className="flex justify-center gap-10 flex-wrap px-6 opacity-50 dark:opacity-40 grayscale">
//             {["Shiprocket", "Meesho", "Razorpay", "CRED", "Zepto"].map((name) => (
//               <span key={name} className="text-sm font-semibold text-gray-500 dark:text-gray-400">
//                 {name}
//               </span>
//             ))}
//           </div>
//           <p className="text-center text-[10px] text-gray-400 mt-4">
//             (Placeholder names for design preview only — replace before going live)
//           </p>
//         </section>

//         <HowItWorks />
//         <Floating3DCards />

//         {/* Pricing section removed – now a separate page at /pricing */}

//         <FeatureCards />

//         {/* Premium CTA */}
//         <section className="relative py-28 px-6 overflow-hidden">
//           <div className="absolute inset-0 pointer-events-none">
//             <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-violet/20 blur-[140px]" />
//             <div className="absolute right-10 top-20 h-72 w-72 rounded-full bg-brand-blue/20 blur-[120px]" />
//             <div className="absolute left-10 bottom-0 h-64 w-64 rounded-full bg-brand-violet/10 blur-[120px]" />
//           </div>

//           <div
//             className="relative max-w-6xl mx-auto rounded-[32px]
//                        border border-gray-200 dark:border-white/10
//                        bg-white/80 dark:bg-brand-surface/80
//                        backdrop-blur-xl
//                        px-10 py-20 text-center
//                        shadow-[0_40px_120px_rgba(108,92,231,0.18)]"
//           >
//             <span className="inline-flex items-center gap-2 rounded-full bg-brand-violet/10 px-4 py-2 text-sm font-medium text-brand-violet">
//               ✨ AI-Powered Experimentation
//             </span>

//             <h2 className="mt-8 text-4xl md:text-6xl font-display font-extrabold leading-tight text-gray-900 dark:text-white">
//               Stop Guessing.
//               <br />
//               <span className="bg-gradient-to-r from-brand-violet to-brand-blue bg-clip-text text-transparent">
//                 Start Winning.
//               </span>
//             </h2>

//             <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 dark:text-gray-400">
//               Build experiments, discover winning variants with AI, and make every
//               decision backed by real user data.
//             </p>

//             <div className="mt-10 flex flex-wrap justify-center gap-5">
//               <Link
//                 to="/register"
//                 className="rounded-xl bg-gradient-to-r from-brand-violet to-brand-blue px-8 py-4 font-semibold text-white shadow-[0_0_40px_rgba(108,92,231,0.45)] hover:scale-105 transition-all duration-300"
//               >
//                 Start Free Trial
//               </Link>
//               <button
//                 className="rounded-xl border border-gray-300 dark:border-white/10 px-8 py-4 font-medium text-gray-700 dark:text-gray-200 hover:border-brand-violet hover:bg-brand-violet/5 transition-all duration-300"
//               >
//                 Book a Demo
//               </button>
//             </div>

//             <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
//               <span>✓ No Credit Card</span>
//               <span>✓ 14-Day Free Trial</span>
//               <span>✓ Unlimited Experiments</span>
//               <span>✓ AI Insights Included</span>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }





















// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import HowItWorks from "../components/HowItWorks";
// import FeatureCards from "../components/FeatureCards";
// import SparkleField from "../components/SparkleField";
// import Floating3DCards from "../components/Floating3DCards";
// import HeroExperimentVisual from "../components/HeroExperimentVisual";
// import AvatarParticleField from "../components/AvatarParticleField";

// export default function SplashScreen() {
//   return (
//     <div className="relative min-h-screen bg-white dark:bg-brand-black transition-colors duration-500 overflow-hidden">
//       {/* AvatarParticleField as the hero background */}
//       <div className="absolute inset-0 w-full h-full pointer-events-none">
//         <AvatarParticleField />
//       </div>

//       {/* Ambient glow blobs */}
//       <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full
//                       bg-brand-violet/20 dark:bg-brand-violet/25 blur-[120px] pointer-events-none" />
//       <div className="absolute top-40 right-0 w-[400px] h-[400px] rounded-full
//                       bg-brand-blue/20 dark:bg-brand-blue/25 blur-[120px] pointer-events-none" />

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
//             <p className="mt-5 text-gray-500 dark:text-gray-400 text-lg max-w-md">
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

//             <div className="mt-6 flex gap-6 text-xs text-gray-400">
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
//           <p className="text-center text-xs text-gray-400 mb-6">Trusted by ambitious companies</p>
//           <div className="flex justify-center gap-10 flex-wrap px-6 opacity-50 dark:opacity-40 grayscale">
//             {["Shiprocket", "Meesho", "Razorpay", "CRED", "Zepto"].map((name) => (
//               <span key={name} className="text-sm font-semibold text-gray-500 dark:text-gray-400">
//                 {name}
//               </span>
//             ))}
//           </div>
//           <p className="text-center text-[10px] text-gray-400 mt-4">
//             (Placeholder names for design preview only — replace before going live)
//           </p>
//         </section>

//         <HowItWorks />
//         <Floating3DCards />
//         <FeatureCards />

//         {/* ─── EXPERIMENT REVEAL (replaces old CTA) ─────────── */}
//         <section className="relative py-28 px-6 overflow-hidden">
//           <div className="absolute inset-0 pointer-events-none">
//             <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-violet/10 dark:bg-brand-violet/20 blur-[140px]" />
//             <div className="absolute right-10 top-20 h-72 w-72 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 blur-[120px]" />
//             <div className="absolute left-10 bottom-0 h-64 w-64 rounded-full bg-brand-violet/5 dark:bg-brand-violet/10 blur-[120px]" />
//           </div>

//           <div className="relative max-w-5xl mx-auto">
//             {/* Emotional heading */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="text-center"
//             >
//               <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-violet mb-4">
//                 The Experiment Reveal
//               </span>
//               <h2 className="text-4xl md:text-5xl font-display font-extrabold leading-tight text-gray-900 dark:text-white">
//                 You didn't just visit this page.
//                 <br />
//                 You participated in an <span className="bg-gradient-to-r from-brand-violet to-brand-blue bg-clip-text text-transparent">experiment</span>.
//               </h2>
//               <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
//                 While you explored, we were testing two versions of this page.
//                 Here’s what we learned.
//               </p>
//             </motion.div>

//             {/* Comparison cards */}
//             <div className="mt-12 grid md:grid-cols-2 gap-6">
//               {/* Original Hero */}
//               <motion.div
//                 initial={{ opacity: 0, x: -30 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.5, delay: 0.1 }}
//                 className="rounded-2xl border p-6 bg-white dark:bg-[#111319] border-gray-200 dark:border-white/10 shadow-sm"
//               >
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="text-xs font-bold uppercase text-gray-400">Original Hero</span>
//                   <span className="text-xs font-medium text-gray-500">Conversion: 48.7%</span>
//                 </div>
//                 <div className="space-y-3">
//                   <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-white/10" />
//                   <div className="h-4 w-1/2 rounded bg-gray-300 dark:bg-white/10" />
//                   <div className="flex gap-3">
//                     <div className="h-8 w-24 rounded bg-brand-violet/20" />
//                     <div className="h-8 w-24 rounded bg-gray-300 dark:bg-white/10" />
//                   </div>
//                   <div className="h-20 w-full rounded bg-gray-200 dark:bg-white/5" />
//                 </div>
//                 <div className="mt-4 flex items-center justify-between text-sm">
//                   <span className="text-gray-500">Headline:</span>
//                   <span className="font-medium text-gray-900 dark:text-white">“Run better A/B tests.”</span>
//                 </div>
//               </motion.div>

//               {/* The Hero You Saw (Variant B) */}
//               <motion.div
//                 initial={{ opacity: 0, x: 30 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.5, delay: 0.2 }}
//                 className="rounded-2xl border p-6 bg-gradient-to-br from-brand-violet/5 to-brand-blue/5 border-brand-violet/20 dark:border-brand-violet/30 shadow-lg"
//               >
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="text-xs font-bold uppercase text-brand-violet">The Hero You Saw</span>
//                   <span className="text-xs font-medium text-emerald-500">Conversion: 51.3%</span>
//                 </div>
//                 <div className="space-y-3">
//                   <div className="h-4 w-3/4 rounded bg-gradient-to-r from-brand-violet/40 to-brand-blue/40" />
//                   <div className="h-4 w-1/2 rounded bg-gradient-to-r from-brand-violet/30 to-brand-blue/30" />
//                   <div className="flex gap-3">
//                     <div className="h-8 w-24 rounded bg-gradient-to-r from-brand-violet to-brand-blue" />
//                     <div className="h-8 w-24 rounded bg-gray-300 dark:bg-white/10" />
//                   </div>
//                   <div className="h-20 w-full rounded bg-gradient-to-br from-brand-violet/10 to-brand-blue/10" />
//                 </div>
//                 <div className="mt-4 flex items-center justify-between text-sm">
//                   <span className="text-gray-500">Headline:</span>
//                   <span className="font-medium text-gray-900 dark:text-white">“Measure. Experiment. Optimize.”</span>
//                 </div>
//                 {/* AI Insight */}
//                 <div className="mt-3 p-2 rounded-lg bg-brand-violet/10 dark:bg-brand-violet/20 text-xs text-brand-violet">
//                   <span className="font-semibold">AI Insight:</span> Shorter headline, stronger CTA → +5.2% mobile engagement.
//                 </div>
//               </motion.div>
//             </div>

//             {/* Assigned badge with pulse */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5, delay: 0.3 }}
//               className="mt-8 text-center"
//             >
//               <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-brand-violet/10 dark:bg-brand-violet/20 border border-brand-violet/20">
//                 <span className="relative flex h-3 w-3">
//                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-violet opacity-75" />
//                   <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-violet" />
//                 </span>
//                 <span className="font-medium text-gray-900 dark:text-white">
//                   You were assigned <span className="font-bold text-brand-violet">Variant B</span>
//                 </span>
//               </div>
//             </motion.div>

//             {/* Progress bar comparison */}
//             <div className="mt-8 max-w-md mx-auto space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-500">Variant A</span>
//                 <span className="font-mono">48.7%</span>
//               </div>
//               <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
//                 <motion.div
//                   className="h-full bg-brand-violet"
//                   initial={{ width: 0 }}
//                   whileInView={{ width: "48.7%" }}
//                   transition={{ duration: 1, ease: "easeOut" }}
//                 />
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-500">Variant B</span>
//                 <span className="font-mono text-brand-violet font-bold">51.3%</span>
//               </div>
//               <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
//                 <motion.div
//                   className="h-full bg-brand-blue"
//                   initial={{ width: 0 }}
//                   whileInView={{ width: "51.3%" }}
//                   transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
//                 />
//               </div>
//             </div>

//             {/* Final CTA */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.4 }}
//               className="mt-12 text-center"
//             >
//               <Link
//                 to="/register"
//                 className="inline-block px-10 py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-brand-violet to-brand-blue shadow-[0_0_40px_rgba(108,92,231,0.4)] hover:scale-105 transition-all duration-300"
//               >
//                 Create My First Experiment
//               </Link>
//               <p className="mt-4 text-sm text-gray-400">
//                 Every visitor teaches your product something. Start learning today.
//               </p>
//             </motion.div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }



































































// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import HowItWorks from "../components/HowItWorks";
// import FeatureCards from "../components/FeatureCards";
// import Floating3DCards from "../components/Floating3DCards";
// import HeroExperimentVisual from "../components/HeroExperimentVisual";
// import AvatarParticleField from "../components/AvatarParticleField";
// import { useTheme } from "../context/ThemeContext";

// // Helper to assign random variant and theme
// const getAssignment = () => {
//   const stored = localStorage.getItem("experimentAssignment");
//   if (stored) return JSON.parse(stored);

//   const variant = Math.random() < 0.5 ? "A" : "B";
//   const initialTheme = Math.random() < 0.5 ? "light" : "dark";
//   const assignment = { variant, initialTheme, currentTheme: initialTheme };
//   localStorage.setItem("experimentAssignment", JSON.stringify(assignment));
//   return assignment;
// };

// export default function SplashScreen() {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";
//   const [assignment, setAssignment] = useState(null);
//   const [themeSwitched, setThemeSwitched] = useState(false);
//   const [stats, setStats] = useState({
//     timeOnPage: "2m 54s",
//     scrollDepth: 94,
//     interactions: 18,
//     pagesViewed: 1,
//   });

//   // Load assignment and detect theme switch
//   useEffect(() => {
//     const data = getAssignment();
//     setAssignment(data);
//     // Check if current theme differs from initial
//     if (data.initialTheme !== theme) {
//       setThemeSwitched(true);
//       // Update stored current theme
//       data.currentTheme = theme;
//       localStorage.setItem("experimentAssignment", JSON.stringify(data));
//     }
//   }, [theme]);

//   // Simulate scroll depth (just for demo)
//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
//       setStats((prev) => ({ ...prev, scrollDepth: Math.min(100, Math.round(scrollPercent)) }));
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   if (!assignment) return null; // avoid flash

//   const heroVariant = assignment.variant;
//   const initialThemeLabel = assignment.initialTheme === "light" ? "Light ☀️" : "Dark 🌙";
//   const currentThemeLabel = theme === "light" ? "Light ☀️" : "Dark 🌙";

//   return (
//     <div className="relative min-h-screen bg-white dark:bg-brand-black transition-colors duration-500 overflow-hidden">
//       {/* AvatarParticleField as background */}
//       <div className="absolute inset-0 w-full h-full pointer-events-none">
//         <AvatarParticleField />
//       </div>

//       {/* Ambient glow blobs */}
//       <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full
//                       bg-brand-violet/20 dark:bg-brand-violet/25 blur-[120px] pointer-events-none" />
//       <div className="absolute top-40 right-0 w-[400px] h-[400px] rounded-full
//                       bg-brand-blue/20 dark:bg-brand-blue/25 blur-[120px] pointer-events-none" />

//       <div className="relative z-10">
//         <Navbar />

//         {/* ─── Hero ──────────────────────────────────────────── */}
//         <section className="pt-32 pb-16 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
//           {/* ... (your existing hero code) ... */}
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
//             <p className="mt-5 text-gray-500 dark:text-gray-400 text-lg max-w-md">
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

//             <div className="mt-6 flex gap-6 text-xs text-gray-400">
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
//           <p className="text-center text-xs text-gray-400 mb-6">Trusted by ambitious companies</p>
//           <div className="flex justify-center gap-10 flex-wrap px-6 opacity-50 dark:opacity-40 grayscale">
//             {["Shiprocket", "Meesho", "Razorpay", "CRED", "Zepto"].map((name) => (
//               <span key={name} className="text-sm font-semibold text-gray-500 dark:text-gray-400">
//                 {name}
//               </span>
//             ))}
//           </div>
//           <p className="text-center text-[10px] text-gray-400 mt-4">
//             (Placeholder names for design preview only — replace before going live)
//           </p>
//         </section>

//         <HowItWorks />
//         <Floating3DCards />
//         <FeatureCards />

//         {/* ─── EXPERIMENT REPORT (Version 6.5) ──────────────── */}
//         <section className="relative py-28 px-6 overflow-hidden">
//           <div className="absolute inset-0 pointer-events-none">
//             <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-violet/10 dark:bg-brand-violet/20 blur-[140px]" />
//             <div className="absolute right-10 top-20 h-72 w-72 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 blur-[120px]" />
//             <div className="absolute left-10 bottom-0 h-64 w-64 rounded-full bg-brand-violet/5 dark:bg-brand-violet/10 blur-[120px]" />
//           </div>

//           <div className="relative max-w-6xl mx-auto">
//             {/* Header */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="text-center mb-12"
//             >
//               <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-violet mb-2">
//                 Experiment Report
//               </span>
//               <h2 className="text-4xl md:text-5xl font-display font-extrabold leading-tight text-gray-900 dark:text-white">
//                 Here's Your Experiment Report
//               </h2>
//               <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
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
//                 <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Your Assignment</h3>
//                 <div className="mt-4 space-y-3">
//                   <div>
//                     <p className="text-xs text-gray-500">Hero Variant</p>
//                     <p className="text-2xl font-bold text-brand-violet">Variant {heroVariant}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500">Theme Journey</p>
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm">{initialThemeLabel}</span>
//                       <motion.span
//                         animate={{ x: themeSwitched ? 0 : 0 }}
//                         className="text-gray-400"
//                       >
//                         {themeSwitched ? "→" : ""}
//                       </motion.span>
//                       {themeSwitched && <span className="text-sm">{currentThemeLabel}</span>}
//                     </div>
//                     {themeSwitched && (
//                       <span className="inline-block mt-1 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
//                         Theme Changed ✓
//                       </span>
//                     )}
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
//                 <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Your Session</h3>
//                 <div className="mt-4 space-y-3">
//                   <div>
//                     <div className="flex justify-between text-xs">
//                       <span className="text-gray-500">Time</span>
//                       <span className="font-mono">{stats.timeOnPage}</span>
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
//                       <span className="text-gray-500">Scroll</span>
//                       <span className="font-mono">{stats.scrollDepth}%</span>
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
//                       <span className="text-gray-500">Interactions</span>
//                       <span className="font-mono">{stats.interactions}</span>
//                     </div>
//                     <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden mt-1">
//                       <motion.div
//                         className="h-full bg-emerald-500"
//                         initial={{ width: 0 }}
//                         whileInView={{ width: "80%" }}
//                         transition={{ duration: 1 }}
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <div className="flex justify-between text-xs">
//                       <span className="text-gray-500">Pages Viewed</span>
//                       <span className="font-mono">{stats.pagesViewed}</span>
//                     </div>
//                     <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden mt-1">
//                       <motion.div
//                         className="h-full bg-amber-500"
//                         initial={{ width: 0 }}
//                         whileInView={{ width: "30%" }}
//                         transition={{ duration: 1 }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>

//               {/* AI Behavior Analysis Card */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.3 }}
//                 className="rounded-2xl border p-6 bg-gradient-to-br from-brand-violet/5 to-brand-blue/5 border-brand-violet/20 dark:border-brand-violet/30 shadow-sm"
//               >
//                 <h3 className="text-sm font-bold uppercase tracking-wider text-brand-violet">Behavior Analysis</h3>
//                 <ul className="mt-4 space-y-2 text-sm">
//                   <li className="flex items-start gap-2">
//                     <span className="text-brand-violet">✓</span>
//                     <span className="text-gray-700 dark:text-gray-300">
//                       {heroVariant === "B" ? "Preferred Hero Variant B" : "Showed interest in Variant A"}
//                     </span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="text-brand-violet">✓</span>
//                     <span className="text-gray-700 dark:text-gray-300">
//                       {themeSwitched ? "Switched to dark theme" : "Stayed with {initialThemeLabel} theme"}
//                     </span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="text-brand-violet">✓</span>
//                     <span className="text-gray-700 dark:text-gray-300">Read the Comparison Section</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="text-brand-violet">✓</span>
//                     <span className="text-gray-700 dark:text-gray-300">Viewed Feature Cards</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="text-brand-violet">✓</span>
//                     <span className="text-gray-700 dark:text-gray-300">High Engagement — Likely to Convert</span>
//                   </li>
//                 </ul>
//               </motion.div>
//             </div>

//             {/* Journey Timeline (full width) */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               transition={{ duration: 0.6, delay: 0.4 }}
//               className="mt-12 p-6 rounded-2xl border bg-white dark:bg-[#111319] border-gray-200 dark:border-white/10"
//             >
//               <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">Your Journey</h4>
//               <div className="flex items-center justify-between gap-2 flex-wrap">
//                 {["Landing", "Hero", "Comparison", "Features", "Reveal", "CTA"].map((step, i) => (
//                   <motion.div
//                     key={step}
//                     initial={{ opacity: 0, y: 10 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ delay: i * 0.1 }}
//                     className="flex flex-col items-center"
//                   >
//                     <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-brand-violet/10 dark:bg-brand-violet/20 border border-brand-violet/30">
//                       <span className="text-xs font-bold text-brand-violet">{i + 1}</span>
//                       {i < 5 && (
//                         <motion.div
//                           className="absolute -right-4 top-1/2 w-4 h-0.5 bg-brand-violet/30"
//                           initial={{ scaleX: 0 }}
//                           whileInView={{ scaleX: 1 }}
//                           transition={{ delay: i * 0.1 + 0.2 }}
//                         />
//                       )}
//                     </div>
//                     <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mt-1">{step}</span>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>

//             {/* Personalised closing + CTA */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.5 }}
//               className="mt-12 text-center"
//             >
//               <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
//                 Every visitor teaches your product something.
//                 <br />
//                 <span className="font-semibold text-brand-violet">Today, you taught ours.</span>
//               </p>
//               <div className="mt-8">
//                 <Link
//                   to="/register"
//                   className="inline-block px-10 py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-brand-violet to-brand-blue shadow-[0_0_40px_rgba(108,92,231,0.4)] hover:scale-105 transition-all duration-300"
//                 >
//                   Create My First Experiment
//                 </Link>
//               </div>
//             </motion.div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }




























































































































// import { motion, AnimatePresence } from "framer-motion";
// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import HowItWorks from "../components/HowItWorks";
// import FeatureCards from "../components/FeatureCards";
// import Floating3DCards from "../components/Floating3DCards";
// import HeroExperimentVisual from "../components/HeroExperimentVisual";
// import AvatarParticleField from "../components/AvatarParticleField";
// import { useTheme } from "../context/ThemeContext";

// // Helper to assign random variant and theme, plus experiment ID and confidence
// const getAssignment = () => {
//   const stored = localStorage.getItem("experimentAssignment");
//   if (stored) {
//     try {
//       return JSON.parse(stored);
//     } catch {
//       // fall through to new assignment
//     }
//   }

//   const variant = Math.random() < 0.5 ? "A" : "B";
//   const initialTheme = Math.random() < 0.5 ? "light" : "dark";
//   const assignment = {
//     variant,
//     initialTheme,
//     currentTheme: initialTheme,
//     experimentId: `EXP-${String(Math.floor(1000 + Math.random() * 9000))}`,
//     confidence: 98.4, // placeholder – would be computed in real scenario
//   };
//   localStorage.setItem("experimentAssignment", JSON.stringify(assignment));
//   return assignment;
// };

// export default function SplashScreen() {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";
//   const [assignment, setAssignment] = useState(null);
//   const [themeSwitched, setThemeSwitched] = useState(false);
//   const [showAlternateHero, setShowAlternateHero] = useState(false);
//   const [stats, setStats] = useState({
//     timeOnPage: "2m 54s",
//     scrollDepth: 94,
//     interactions: 18,
//     pagesViewed: 1,
//   });

//   // Load assignment and detect theme switch
//   useEffect(() => {
//     const data = getAssignment();
//     setAssignment(data);
//     if (data.initialTheme !== theme) {
//       setThemeSwitched(true);
//       data.currentTheme = theme;
//       localStorage.setItem("experimentAssignment", JSON.stringify(data));
//     }
//   }, [theme]);

//   // Simulate scroll depth (just for demo)
//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
//       setStats((prev) => ({ ...prev, scrollDepth: Math.min(100, Math.round(scrollPercent)) }));
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   if (!assignment) return null;

//   const heroVariant = assignment.variant;
//   const initialThemeLabel = assignment.initialTheme === "light" ? "Light ☀️" : "Dark 🌙";
//   const currentThemeLabel = theme === "light" ? "Light ☀️" : "Dark 🌙";
//   const alternateVariant = heroVariant === "A" ? "B" : "A";

//   return (
//     <div className="relative min-h-screen bg-white dark:bg-brand-black transition-colors duration-500 overflow-hidden">
//       {/* AvatarParticleField as background */}
//       <div className="absolute inset-0 w-full h-full pointer-events-none">
//         <AvatarParticleField />
//       </div>

//       {/* Ambient glow blobs - lighter for light theme, more subtle for dark */}
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
//             <p className="mt-5 text-gray-500 dark:text-gray-400 text-lg max-w-md">
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

//             <div className="mt-6 flex gap-6 text-xs text-gray-400">
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
//           <p className="text-center text-xs text-gray-400 mb-6">Trusted by ambitious companies</p>
//           <div className="flex justify-center gap-10 flex-wrap px-6 opacity-50 dark:opacity-40 grayscale">
//             {["Shiprocket", "Meesho", "Razorpay", "CRED", "Zepto"].map((name) => (
//               <span key={name} className="text-sm font-semibold text-gray-500 dark:text-gray-400">
//                 {name}
//               </span>
//             ))}
//           </div>
//           <p className="text-center text-[10px] text-gray-400 mt-4">
//             (Placeholder names for design preview only — replace before going live)
//           </p>
//         </section>

//         <HowItWorks />
//         <Floating3DCards />
//         <FeatureCards />

//         {/* ─── EXPERIMENT REPORT (Version 6.5 refined) ──────── */}
//         <section className="relative py-28 px-6 overflow-hidden">
//           <div className="absolute inset-0 pointer-events-none">
//             <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-violet/5 dark:bg-brand-violet/20 blur-[140px]" />
//             <div className="absolute right-10 top-20 h-72 w-72 rounded-full bg-brand-blue/5 dark:bg-brand-blue/20 blur-[120px]" />
//             <div className="absolute left-10 bottom-0 h-64 w-64 rounded-full bg-brand-violet/5 dark:bg-brand-violet/10 blur-[120px]" />
//           </div>

//           <div className="relative max-w-6xl mx-auto">
//             {/* Header */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="text-center mb-12"
//             >
//               <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-violet mb-2">
//                 Experiment Report
//               </span>
//               <h2 className="text-4xl md:text-5xl font-display font-extrabold leading-tight text-gray-900 dark:text-white">
//                 Here's Your Experiment Report
//               </h2>
//               <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
//                 Thank you for helping improve ExperimentX.
//               </p>
//             </motion.div>

//             {/* Three columns */}
//             <div className="grid md:grid-cols-3 gap-6">
//               {/* Assignment Card - enhanced with ID and Confidence */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.1 }}
//                 className="rounded-2xl border p-6 bg-white dark:bg-[#111319] border-gray-200 dark:border-white/10 shadow-sm"
//               >
//                 <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Your Assignment</h3>
//                 <div className="mt-4 space-y-3">
//                   <div>
//                     <p className="text-xs text-gray-500">Hero Variant</p>
//                     <p className="text-2xl font-bold text-brand-violet">Variant {heroVariant}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500">Theme Journey</p>
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm">{initialThemeLabel}</span>
//                       {themeSwitched && <span className="text-gray-400">→</span>}
//                       {themeSwitched && <span className="text-sm">{currentThemeLabel}</span>}
//                     </div>
//                     {themeSwitched && (
//                       <span className="inline-block mt-1 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
//                         Theme Changed ✓
//                       </span>
//                     )}
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500">Experiment ID</p>
//                     <p className="text-sm font-mono text-gray-700 dark:text-gray-300">{assignment.experimentId}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500">Confidence</p>
//                     <div className="flex items-center gap-2">
//                       <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
//                         <motion.div
//                           className="h-full bg-gradient-to-r from-brand-violet to-brand-blue"
//                           initial={{ width: 0 }}
//                           whileInView={{ width: `${assignment.confidence}%` }}
//                           transition={{ duration: 1 }}
//                         />
//                       </div>
//                       <span className="text-sm font-mono">{assignment.confidence}%</span>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>

//               {/* Session Stats Card - aligned labels */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.2 }}
//                 className="rounded-2xl border p-6 bg-white dark:bg-[#111319] border-gray-200 dark:border-white/10 shadow-sm"
//               >
//                 <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Your Session</h3>
//                 <div className="mt-4 space-y-4">
//                   <div>
//                     <div className="flex justify-between text-xs">
//                       <span className="text-gray-500">Time</span>
//                       <span className="font-mono text-gray-700 dark:text-gray-300">{stats.timeOnPage}</span>
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
//                       <span className="text-gray-500">Scroll</span>
//                       <span className="font-mono text-gray-700 dark:text-gray-300">{stats.scrollDepth}%</span>
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
//                       <span className="text-gray-500">Interactions</span>
//                       <span className="font-mono text-gray-700 dark:text-gray-300">{stats.interactions}</span>
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
//                       <span className="text-gray-500">Pages Viewed</span>
//                       <span className="font-mono text-gray-700 dark:text-gray-300">{stats.pagesViewed}</span>
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

//               {/* Behavior Analysis - AI header, no overclaiming */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.3 }}
//                 className="rounded-2xl border p-6 bg-gradient-to-br from-brand-violet/5 to-brand-blue/5 border-brand-violet/20 dark:border-brand-violet/30 shadow-sm"
//               >
//                 <h3 className="text-sm font-bold uppercase tracking-wider text-brand-violet">🤖 AI Observations</h3>
//                 <ul className="mt-4 space-y-2 text-sm">
//                   <li className="flex items-start gap-2">
//                     <span className="text-brand-violet">✓</span>
//                     <span className="text-gray-700 dark:text-gray-300">
//                       Engaged with {heroVariant === "B" ? "Variant B" : "Variant A"} hero
//                     </span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="text-brand-violet">✓</span>
//                     <span className="text-gray-700 dark:text-gray-300">
//                       {themeSwitched ? "Switched to dark theme" : "Maintained light theme preference"}
//                     </span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="text-brand-violet">✓</span>
//                     <span className="text-gray-700 dark:text-gray-300">Read Comparison Section</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="text-brand-violet">✓</span>
//                     <span className="text-gray-700 dark:text-gray-300">Viewed Feature Cards</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="text-brand-violet">✓</span>
//                     <span className="text-gray-700 dark:text-gray-300">High engagement (scrolled deep, interacted)</span>
//                   </li>
//                 </ul>
//               </motion.div>
//             </div>

//             {/* Journey Timeline with animated glowing line */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               transition={{ duration: 0.6, delay: 0.4 }}
//               className="mt-12 p-6 rounded-2xl border bg-white dark:bg-[#111319] border-gray-200 dark:border-white/10 overflow-hidden relative"
//             >
//               <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">Your Journey</h4>
//               <div className="relative flex items-center justify-between gap-2 flex-wrap">
//                 {/* Glowing line behind circles */}
//                 <div className="absolute left-6 right-6 top-1/2 h-0.5 -translate-y-1/2 bg-gray-200 dark:bg-white/10" />
//                 <motion.div
//                   className="absolute left-6 right-6 top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-brand-violet to-brand-blue"
//                   initial={{ scaleX: 0 }}
//                   whileInView={{ scaleX: 1 }}
//                   transition={{ duration: 1.5, ease: "easeOut" }}
//                   style={{ transformOrigin: "left" }}
//                 />
//                 {/* Animated pulse along the line */}
//                 <motion.div
//                   className="absolute left-6 top-1/2 h-0.5 w-2 -translate-y-1/2 bg-white shadow-[0_0_12px_rgba(108,92,231,0.8)]"
//                   initial={{ x: 0 }}
//                   whileInView={{
//                     x: "100%",
//                     transition: {
//                       duration: 2,
//                       repeat: Infinity,
//                       ease: "linear",
//                       delay: 1,
//                     },
//                   }}
//                   style={{ transformOrigin: "left" }}
//                 />

//                 {["Landing", "Hero", "Comparison", "Features", "Reveal", "CTA"].map((step, i) => (
//                   <motion.div
//                     key={step}
//                     initial={{ opacity: 0, y: 10 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ delay: i * 0.1 }}
//                     className="flex flex-col items-center z-10"
//                   >
//                     <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-brand-violet/10 dark:bg-brand-violet/20 border border-brand-violet/30">
//                       <span className="text-xs font-bold text-brand-violet">{i + 1}</span>
//                     </div>
//                     <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mt-1 whitespace-nowrap">{step}</span>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>

//             {/* "View Variant A" toggle */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               transition={{ delay: 0.6 }}
//               className="mt-6 flex justify-center"
//             >
//               <button
//                 onClick={() => setShowAlternateHero(!showAlternateHero)}
//                 className="text-sm text-brand-violet hover:underline flex items-center gap-2"
//               >
//                 {showAlternateHero ? "Hide" : "View"} Variant {alternateVariant}
//                 <span className="text-xs">({showAlternateHero ? "—" : "+"})</span>
//               </button>
//             </motion.div>

//             <AnimatePresence>
//               {showAlternateHero && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: "auto" }}
//                   exit={{ opacity: 0, height: 0 }}
//                   transition={{ duration: 0.4 }}
//                   className="mt-4 overflow-hidden"
//                 >
//                   <div className="rounded-2xl border p-6 bg-white dark:bg-[#111319] border-gray-200 dark:border-white/10">
//                     <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
//                       You saw Variant {heroVariant} – Here's Variant {alternateVariant}
//                     </h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
//                         <p className="text-xs text-gray-500">Headline</p>
//                         <p className="font-medium">
//                           {alternateVariant === "A"
//                             ? "Run better A/B tests."
//                             : "Measure. Experiment. Optimize."}
//                         </p>
//                       </div>
//                       <div className="p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
//                         <p className="text-xs text-gray-500">CTA</p>
//                         <p className="font-medium">
//                           {alternateVariant === "A" ? "Start Free Trial" : "Start My First Experiment"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Personalised closing + CTA */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.5 }}
//               className="mt-12 text-center"
//             >
//               <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
//                 Every visitor teaches your product something.
//                 <br />
//                 <span className="bg-gradient-to-r from-brand-violet to-brand-blue bg-clip-text text-transparent font-semibold text-xl">
//                   Today, you taught ours.
//                 </span>
//               </p>
//               <div className="mt-8">
//                 <Link
//                   to="/register"
//                   className="inline-block px-10 py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-brand-violet to-brand-blue shadow-[0_0_40px_rgba(108,92,231,0.4)] hover:scale-105 transition-all duration-300"
//                 >
//                   Create My First Experiment
//                 </Link>
//               </div>
//             </motion.div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }






import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { BarChart3, CheckCircle2, Brain, Target, Sparkles, Share2, Copy } from "lucide-react";
import Navbar from "../components/Navbar";
import HowItWorks from "../components/HowItWorks";
import FeatureCards from "../components/FeatureCards";
import Floating3DCards from "../components/Floating3DCards";
import HeroExperimentVisual from "../components/HeroExperimentVisual";
import AvatarParticleField from "../components/AvatarParticleField";
import { useTheme } from "../context/ThemeContext";

// Helper to assign random variant and theme
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
  const isDark = theme === "dark";
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

  if (!assignment) return null;

  const heroVariant = assignment.variant;
  const initialThemeLabel = assignment.initialTheme === "light" ? "Light" : "Dark";
  const currentThemeLabel = theme === "light" ? "Light" : "Dark";
  const themeEmoji = theme === "light" ? "☀️" : "🌙";
  const initialThemeEmoji = assignment.initialTheme === "light" ? "☀️" : "🌙";

  return (
    <div className="relative min-h-screen bg-white dark:bg-brand-black transition-colors duration-500 overflow-hidden">
      <div className="absolute inset-0 w-full h-full pointer-events-none">
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
            <span className="inline-block text-xs font-medium px-3 py-1 rounded-full
                              bg-brand-violet/10 text-brand-violet mb-5">
              AI-Powered A/B Testing Platform
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold leading-tight text-gray-900 dark:text-white">
              Measure. Experiment.{" "}
              <span className="bg-gradient-to-r from-brand-violet to-brand-blue bg-clip-text text-transparent">
                Optimize.
              </span>
            </h1>
            <p className="mt-5 text-gray-500 dark:text-gray-400 text-lg max-w-md">
              Run A/B tests with confidence. Get AI-powered insights and grow your business faster.
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
              <button className="px-6 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-200
                                 border border-gray-300 dark:border-white/15 hover:border-brand-violet transition-colors">
                ▶ Watch Demo
              </button>
            </div>

            <div className="mt-6 flex gap-6 text-xs text-gray-400">
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

        {/* ─── Trusted by ────────────────────────────────────── */}
        <section className="py-10 border-y border-gray-200 dark:border-white/10">
          <p className="text-center text-xs text-gray-400 mb-6">Trusted by ambitious companies</p>
          <div className="flex justify-center gap-10 flex-wrap px-6 opacity-50 dark:opacity-40 grayscale">
            {["Shiprocket", "Meesho", "Razorpay", "CRED", "Zepto"].map((name) => (
              <span key={name} className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {name}
              </span>
            ))}
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-4">
            (Placeholder names for design preview only — replace before going live)
          </p>
        </section>

        <HowItWorks />
        <Floating3DCards />

        {/* ─── Feature Cards ────────────────────────────────── */}
        <FeatureCards />

        {/* ─── Divider ───────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-violet/30 to-transparent" />
        </div>

        {/* ─── EXPERIMENT REPORT ────────────────────────────── */}
        <section className="relative py-16 md:py-24 px-6 overflow-hidden">
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
              <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
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
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center gap-2">
                  <Target size={16} className="text-brand-violet" />
                  Your Assignment
                </h3>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Hero Variant</p>
                    <p className="text-2xl font-bold text-brand-violet">Variant {heroVariant}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Theme Journey</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{initialThemeEmoji} {initialThemeLabel}</span>
                      {themeSwitched && <span className="text-gray-400">→</span>}
                      {themeSwitched && <span className="text-sm">{themeEmoji} {currentThemeLabel}</span>}
                    </div>
                    {themeSwitched && (
                      <span className="inline-block mt-1 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Theme Changed ✓
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Experiment ID</p>
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300">{assignment.experimentId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Confidence</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden relative">
                        <motion.div
                          className="h-full bg-gradient-to-r from-brand-violet to-brand-blue absolute inset-0"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${assignment.confidence}%` }}
                          transition={{ duration: 1 }}
                        />
                        {/* Pulse animation after load */}
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
                      <span className="text-sm font-mono">{assignment.confidence}%</span>
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
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center gap-2">
                  <BarChart3 size={16} className="text-brand-blue" />
                  Your Session
                </h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Time</span>
                      <span className="font-mono text-gray-700 dark:text-gray-300">{stats.timeOnPage}</span>
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
                      <span className="text-gray-500">Scroll</span>
                      <span className="font-mono text-gray-700 dark:text-gray-300">{stats.scrollDepth}%</span>
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
                      <span className="text-gray-500">Interactions</span>
                      <span className="font-mono text-gray-700 dark:text-gray-300">{stats.interactions}</span>
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
                      <span className="text-gray-500">Pages Viewed</span>
                      <span className="font-mono text-gray-700 dark:text-gray-300">{stats.pagesViewed}</span>
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
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-brand-violet shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Engaged with {heroVariant === "B" ? "Variant B" : "Variant A"} hero
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-brand-violet shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {themeSwitched ? "Switched to dark theme" : "Maintained light theme preference"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-brand-violet shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">Read Comparison Section</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-brand-violet shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">Viewed Feature Cards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-brand-violet shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">High engagement</span>
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
                <span className="font-medium text-gray-900 dark:text-white">
                  You were assigned <span className="font-bold text-brand-violet">Variant {heroVariant}</span>
                </span>
              </div>

              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Every visitor teaches your product something.
                <br />
                <span className="bg-gradient-to-r from-brand-violet to-brand-blue bg-clip-text text-transparent font-semibold text-xl">
                  Today, you taught ours.
                </span>
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="inline-block px-10 py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-brand-violet to-brand-blue shadow-[0_0_40px_rgba(108,92,231,0.4)] hover:scale-105 transition-all duration-300"
                >
                  Create My First Experiment
                </Link>

                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-5 py-4 rounded-xl border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-brand-violet hover:text-brand-violet transition-colors"
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