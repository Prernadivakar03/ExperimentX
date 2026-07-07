import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function FormField({
  label, type = "text", value, onChange,
  error, placeholder, autoComplete, icon: Icon,
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [focused, setFocused] = useState(false);

  return (
    <div className="mb-4">
      <label className={`block text-xs font-medium mb-1.5 ${
        isDark ? "text-white/50" : "text-gray-600"
      }`}>
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
            focused
  ? "text-brand-violet"
  : isDark
  ? "text-white/25"
  : "text-gray-400"
          }`}>
            <Icon size={15} />
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full ${Icon ? "pl-9" : "pl-3.5"} pr-3.5 py-2.5 rounded-lg text-sm
                     focus:outline-none transition-colors duration-200
                     ${isDark
                       ? "bg-white/[0.05] text-white placeholder:text-white/25"
                       : "bg-white text-gray-900 placeholder:text-gray-400"
                     }
                     border ${error
                       ? "border-red-400/60"
                       : isDark ? "border-white/10" : "border-gray-200"
                     }`}
          style={focused ? { borderColor: "rgba(108,92,231,0.7)" } : {}}
        />

        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          animate={{
            boxShadow: focused
              ? "0 0 0 3px rgba(108,92,231,0.18), 0 0 20px rgba(108,92,231,0.15)"
              : "0 0 0 0px rgba(108,92,231,0)",
          }}
          transition={{ duration: 0.2 }}
        />

        <motion.div
          className="absolute bottom-0 left-0 h-[2px] rounded-b-lg pointer-events-none
                     bg-gradient-to-r from-brand-violet to-brand-blue"
          animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0 }}
          style={{ transformOrigin: "left" }}
          transition={{ duration: 0.25 }}
        />
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400 mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}