
import Logo from "./Logo";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const links = ["Product", "Solutions", "Pricing", "Resources", "Docs"];

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md
                 bg-white/70 dark:bg-brand-black/60 border-b border-gray-200 dark:border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-violet to-brand-blue" />
          <span className="font-display font-bold text-lg text-gray-900 dark:text-white">
            ExperimentX
          </span>
        </div> */}
        <Logo size={30} />

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l}
              href="#"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-brand-violet dark:hover:text-white transition-colors"
            >
              {l}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <Link
            to="/login"
            className="hidden sm:block text-sm text-gray-700 dark:text-gray-300 hover:text-brand-violet dark:hover:text-white transition-colors"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="text-sm font-medium px-4 py-2 rounded-lg text-white bg-gradient-to-r from-brand-violet to-brand-blue hover:opacity-90 transition-opacity"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </nav>
  );
}