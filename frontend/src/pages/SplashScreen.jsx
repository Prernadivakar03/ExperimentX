

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
// import ParticleSplit from "../components/ParticleSplit";
// import AIOrb from "../components/AIOrb";
import HowItWorks from "../components/HowItWorks";
import FeatureCards from "../components/FeatureCards";
import Footer from "../components/Footer";
import SparkleField from "../components/SparkleField";
import Floating3DCards from "../components/Floating3DCards";
// import VariantLabelCard from "../components/VariantLabelCard";
import HeroExperimentVisual from "../components/HeroExperimentVisual";

export default function SplashScreen() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-brand-black transition-colors duration-500 overflow-hidden">
      <SparkleField />

      {/* Ambient glow blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full
                      bg-brand-violet/20 dark:bg-brand-violet/25 blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-0 w-[400px] h-[400px] rounded-full
                      bg-brand-blue/20 dark:bg-brand-blue/25 blur-[120px] pointer-events-none" />

      <div className="relative z-10">
        <Navbar />

        {/* Hero */}
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

            {/* Particle split visual */}
            {/* <motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8, delay: 0.2 }}
  className="relative h-[460px] rounded-3xl overflow-hidden
             bg-gray-50/80 dark:bg-[#05060d] backdrop-blur-sm
             border border-gray-200 dark:border-white/10
             shadow-[0_0_60px_rgba(108,92,231,0.15)]"
>
  <ParticleSplit />

  <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg
                  bg-white dark:bg-brand-card border border-gray-200 dark:border-white/10 text-xs font-medium
                  text-gray-700 dark:text-gray-200 z-10">
    10,000 Visitors
  </div>

  <VariantLabelCard
    position="left"
    badge="A"
    label="Variant A"
    percent={50}
    visitors="5,000"
    color="violet"
    barHeights={[40, 70, 55, 90, 60, 80, 45, 65]}
  />
  <VariantLabelCard
    position="right"
    badge="B"
    label="Variant B"
    percent={50}
    visitors="5,000"
    color="blue"
    barHeights={[50, 65, 80, 55, 95, 70, 60, 85]}
  />

  <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
    <AIOrb />
  </div>
</motion.div> */}
        <motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8, delay: 0.2 }}
>
  <HeroExperimentVisual />
</motion.div>
        </section>
           

        {/* Trusted by */}
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
        <FeatureCards />

        {/* CTA banner */}
        {/* <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="rounded-3xl bg-gradient-to-r from-brand-violet to-brand-blue px-8 py-12 text-center
                          shadow-[0_0_60px_rgba(108,92,231,0.35)]">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white">
              Make data-driven decisions with confidence
            </h3>
            <Link
              to="/register"
              className="inline-block mt-6 px-6 py-3 rounded-lg bg-white text-brand-violet font-medium hover:opacity-90 transition-opacity"
            >
              Start Free Trial
            </Link>
          </div>
        </section> */}


        {/* Premium CTA */}
<section className="relative py-28 px-6 overflow-hidden">
  {/* Background Glow */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-violet/20 blur-[140px]" />
    <div className="absolute right-10 top-20 h-72 w-72 rounded-full bg-brand-blue/20 blur-[120px]" />
    <div className="absolute left-10 bottom-0 h-64 w-64 rounded-full bg-brand-violet/10 blur-[120px]" />
  </div>

  <div
    className="relative max-w-6xl mx-auto rounded-[32px]
               border border-gray-200 dark:border-white/10
               bg-white/80 dark:bg-brand-surface/80
               backdrop-blur-xl
               px-10 py-20 text-center
               shadow-[0_40px_120px_rgba(108,92,231,0.18)]"
  >
    {/* Badge */}
    <span className="inline-flex items-center gap-2 rounded-full bg-brand-violet/10 px-4 py-2 text-sm font-medium text-brand-violet">
      ✨ AI-Powered Experimentation
    </span>

    {/* Heading */}
    <h2 className="mt-8 text-4xl md:text-6xl font-display font-extrabold leading-tight text-gray-900 dark:text-white">
      Stop Guessing.
      <br />
      <span className="bg-gradient-to-r from-brand-violet to-brand-blue bg-clip-text text-transparent">
        Start Winning.
      </span>
    </h2>

    {/* Description */}
    <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 dark:text-gray-400">
      Build experiments, discover winning variants with AI, and make every
      decision backed by real user data.
    </p>

    {/* Buttons */}
    <div className="mt-10 flex flex-wrap justify-center gap-5">
      <Link
        to="/register"
        className="rounded-xl bg-gradient-to-r from-brand-violet to-brand-blue px-8 py-4 font-semibold text-white shadow-[0_0_40px_rgba(108,92,231,0.45)] hover:scale-105 transition-all duration-300"
      >
        Start Free Trial
      </Link>

      <button
        className="rounded-xl border border-gray-300 dark:border-white/10 px-8 py-4 font-medium text-gray-700 dark:text-gray-200 hover:border-brand-violet hover:bg-brand-violet/5 transition-all duration-300"
      >
        Book a Demo
      </button>
    </div>

    {/* Trust Indicators */}
    <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
      <span>✓ No Credit Card</span>
      <span>✓ 14-Day Free Trial</span>
      <span>✓ Unlimited Experiments</span>
      <span>✓ AI Insights Included</span>
    </div>
  </div>
</section>

        <Footer />
      </div>
    </div>
  );

  
}