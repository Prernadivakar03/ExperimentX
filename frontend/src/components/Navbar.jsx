
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









// import { useState, useEffect } from "react";
// import { NavLink, Link, useLocation } from "react-router-dom";
// import Logo from "./Logo";
// import ThemeToggle from "./ThemeToggle";
// import { useTheme } from "../context/ThemeContext";

// // Define each link with its type: "route" or "anchor"
// const NAV_LINKS = [
//   { label: "Product", to: "/product", type: "route" },
//   { label: "Solutions", to: "/#solutions", type: "anchor" },
//   { label: "Pricing", to: "/pricing", type: "route" },
//   { label: "Resources", to: "/#resources", type: "anchor" },
//   { label: "Docs", to: "/#docs", type: "anchor" },
// ];

// export default function Navbar() {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";
//   const location = useLocation();
//   const [mobileOpen, setMobileOpen] = useState(false);

//   // Close mobile menu on route change
//   useEffect(() => {
//     setMobileOpen(false);
//   }, [location]);

//   // Handle anchor clicks: if on home, scroll; else navigate to home with hash
//   const handleAnchorClick = (e, href) => {
//     e.preventDefault();
//     setMobileOpen(false);

//     const [path, hash] = href.split("#");
//     const isHome = location.pathname === "/";

//     if (isHome && hash) {
//       // Already on home – smooth scroll to the section
//       const el = document.getElementById(hash);
//       if (el) el.scrollIntoView({ behavior: "smooth" });
//     } else {
//       // Navigate to home with hash – will be handled by the router
//       window.location.href = href;
//     }
//   };

//   return (
//     <nav
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xl ${
//         isDark
//           ? "bg-[#0B0C15]/90 border-b border-white/[0.06]"
//           : "bg-white/90 border-b border-gray-200"
//       }`}
//     >
//       <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">

//         {/* Logo */}
//         <Link to="/" onClick={() => setMobileOpen(false)}>
//           <Logo size={30} />
//         </Link>

//         {/* Desktop Navigation */}
//         <div className="hidden md:flex items-center gap-7">
//           {NAV_LINKS.map(({ label, to, type }) => {
//             if (type === "route") {
//               return (
//                 <NavLink
//                   key={to}
//                   to={to}
//                   className={({ isActive }) =>
//                     `relative text-sm font-medium transition-colors duration-200 ${
//                       isActive
//                         ? "text-brand-violet"
//                         : isDark
//                         ? "text-gray-300 hover:text-white"
//                         : "text-gray-600 hover:text-gray-900"
//                     }`
//                   }
//                 >
//                   {({ isActive }) => (
//                     <>
//                       {label}
//                       {isActive && (
//                         <span className="absolute -bottom-2 left-0 w-full h-0.5 rounded-full bg-gradient-to-r from-brand-violet to-brand-blue" />
//                       )}
//                     </>
//                   )}
//                 </NavLink>
//               );
//             } else {
//               // Anchor link – use a button that handles scroll
//               return (
//                 <a
//                   key={to}
//                   href={to}
//                   onClick={(e) => handleAnchorClick(e, to)}
//                   className={`text-sm font-medium transition-colors duration-200 ${
//                     isDark
//                       ? "text-gray-300 hover:text-white"
//                       : "text-gray-600 hover:text-gray-900"
//                   }`}
//                 >
//                   {label}
//                 </a>
//               );
//             }
//           })}
//         </div>

//         {/* Right Side */}
//         <div className="flex items-center gap-3">
//           <ThemeToggle />

//           <Link
//             to="/login"
//             className={`hidden sm:block text-sm font-medium transition-colors ${
//               isDark
//                 ? "text-gray-300 hover:text-white"
//                 : "text-gray-700 hover:text-gray-900"
//             }`}
//           >
//             Sign In
//           </Link>

//           <Link
//             to="/register"
//             className="px-4 py-2 rounded-xl text-sm font-medium text-white
//                        bg-gradient-to-r from-brand-violet to-brand-blue
//                        hover:opacity-90 transition-opacity
//                        shadow-[0_0_20px_rgba(108,92,231,0.3)]"
//           >
//             Get Started Free
//           </Link>

//           {/* Mobile toggle */}
//           <button
//             onClick={() => setMobileOpen(!mobileOpen)}
//             className={`md:hidden p-2 rounded-lg transition-colors ${
//               isDark
//                 ? "text-white/50 hover:text-white hover:bg-white/[0.06]"
//                 : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
//             }`}
//           >
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth={2}
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
//               />
//             </svg>
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {mobileOpen && (
//         <div className={`md:hidden border-t px-6 py-4 space-y-1 ${
//           isDark
//             ? "bg-[#0B0C15] border-white/[0.06]"
//             : "bg-white border-gray-100"
//         }`}>
//           {NAV_LINKS.map(({ label, to, type }) => {
//             if (type === "route") {
//               return (
//                 <NavLink
//                   key={to}
//                   to={to}
//                   onClick={() => setMobileOpen(false)}
//                   className={({ isActive }) =>
//                     `block w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
//                       isActive
//                         ? "text-brand-violet bg-brand-violet/10"
//                         : isDark
//                         ? "text-gray-300 hover:text-white hover:bg-white/[0.05]"
//                         : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
//                     }`
//                   }
//                 >
//                   {label}
//                 </NavLink>
//               );
//             } else {
//               return (
//                 <a
//                   key={to}
//                   href={to}
//                   onClick={(e) => handleAnchorClick(e, to)}
//                   className={`block w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
//                     isDark
//                       ? "text-gray-300 hover:text-white hover:bg-white/[0.05]"
//                       : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
//                   }`}
//                 >
//                   {label}
//                 </a>
//               );
//             }
//           })}
//           <div className={`pt-3 mt-3 border-t flex flex-col gap-2 ${
//             isDark ? "border-white/[0.06]" : "border-gray-100"
//           }`}>
//             <Link
//               to="/login"
//               onClick={() => setMobileOpen(false)}
//               className={`px-3 py-2.5 rounded-xl text-sm font-medium text-center transition-colors ${
//                 isDark
//                   ? "text-gray-300 hover:text-white hover:bg-white/[0.05]"
//                   : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
//               }`}
//             >
//               Sign In
//             </Link>
//             <Link
//               to="/register"
//               onClick={() => setMobileOpen(false)}
//               className="px-3 py-2.5 rounded-xl text-sm font-medium text-white text-center
//                          bg-gradient-to-r from-brand-violet to-brand-blue hover:opacity-90 transition-opacity"
//             >
//               Get Started Free
//             </Link>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }