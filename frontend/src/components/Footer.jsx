
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { Atom, Zap, Database, Sparkles } from "lucide-react";

// ── Custom social icons (SVG) ────────────────────────────────────────────────
const GithubIcon = ({ size = 16, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedInIcon = ({ size = 16, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// ── Link Columns ──────────────────────────────────────────────────────────────
const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", to: "/product#features" },
      { label: "Pricing", to: "/pricing" },
      { label: "Integrations", to: "/integrations" },
      { label: "Changelog", to: "/changelog" },
      { label: "Roadmap", to: "/roadmap" },
      { label: "Status", to: "/status" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "E-commerce", to: "/solutions#ecommerce" },
      { label: "SaaS", to: "/solutions#saas" },
      { label: "Marketing", to: "/solutions#marketing" },
      { label: "Enterprise", to: "/solutions#enterprise" },
      { label: "Startups", to: "/solutions#startups" },
      { label: "Agencies", to: "/solutions#agencies" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", to: "/docs" },
      { label: "Blog", to: "/blog" },
      { label: "Guides", to: "/guides" },
      { label: "API Reference", to: "/api" },
      { label: "Webinars", to: "/webinars" },
      { label: "Help Center", to: "/help" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Careers", to: "/careers" },
      { label: "Contact", to: "/contact" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
      { label: "Security", to: "/security" },
    ],
  },
];

const socialLinks = [
  { icon: GithubIcon, href: "https://github.com/Prernadivakar03", label: "GitHub" },
  { icon: LinkedInIcon, href: "https://www.linkedin.com/in/prerna-d-130045283", label: "LinkedIn" },
];

const techIcons = [
  { icon: Atom, label: "React" },
  { icon: Zap, label: "FastAPI" },
  { icon: Database, label: "PostgreSQL" },
  { icon: Sparkles, label: "OpenAI" },
];

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <footer
      className={`relative overflow-hidden border-t transition-colors duration-300 ${
        isDark
          ? "border-white/10 bg-[#0D0E1A]"
          : "border-gray-200/80 bg-white"
      }`}
    >
      {/* Subtle glow – very faint so it doesn't wash out text */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full blur-3xl bg-brand-violet/5 dark:bg-brand-violet/10" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl bg-brand-blue/5 dark:bg-brand-blue/10" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-8 md:py-10">
        {/* ── Brand + Social Icons ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-200/60 dark:border-white/10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className={`text-xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              ExperimentX
            </span>
          </motion.div>

          <div className="flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark
                    ? "text-white/60 hover:text-white hover:bg-white/10"
                    : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                }`}
                aria-label={label}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* ── Link Columns ── */}
        <div className="py-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className={`font-display font-semibold text-sm mb-3 ${isDark ? "text-white/70" : "text-gray-700"}`}>
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className={`text-sm transition-colors ${
                        isDark
                          ? "text-white/60 hover:text-white"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Tech Stack Icons ── */}
        <div className="flex justify-center gap-5 py-4 border-t border-gray-200/60 dark:border-white/10">
          {techIcons.map(({ icon: Icon, label }) => (
            <Icon
              key={label}
              size={18}
              className={isDark ? "text-white/50" : "text-gray-400"}
            />
          ))}
        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-4 border-t border-gray-200/60 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <span className={isDark ? "text-white/50" : "text-gray-400"}>
            © {new Date().getFullYear()} ExperimentX &middot; Experiment fearlessly.
          </span>
          <span className={isDark ? "text-white/40" : "text-gray-400"}>
            Powered by AI
          </span>
        </div>
      </div>
    </footer>
  );
}