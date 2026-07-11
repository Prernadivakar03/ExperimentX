
import { NavLink, Link } from "react-router-dom";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";

const links = [
  { label: "Home", to: "/" },
  { label: "Product", to: "/product" },
  { label: "Solutions", to: "/solutions" },
  { label: "Pricing", to: "/Pricing" },
  { label: "Resources", to: "/resources" },
  { label: "Docs", to: "/docs" },
];

export default function Navbar() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xl ${
        isDark
          ? "bg-[#0B0C15] border-b border-white/5"      // was bg-[#0B0C15]/80
        : "bg-white border-b border-gray-200"         // was bg-white/80
      }`}
    >
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">

        {/* Logo */}
        <Link to="/">
          <Logo size={30} />
        </Link>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `relative text-sm font-medium transition-colors duration-300 ${
                  isActive
                    ? "text-brand-violet"
                    : isDark
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {label}

                  {isActive && (
                    <span className="absolute -bottom-2 left-0 w-full h-0.5 rounded-full bg-gradient-to-r from-brand-violet to-brand-blue"></span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          <ThemeToggle />

          <Link
            to="/login"
            className={`hidden sm:block text-sm transition-colors ${
              isDark
                ? "text-gray-300 hover:text-white"
                : "text-gray-700 hover:text-black"
            }`}
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-brand-violet to-brand-blue shadow-lg hover:scale-105 transition-transform"
          >
            Get Started Free
          </Link>

        </div>

      </div>
    </nav>
  );
}







