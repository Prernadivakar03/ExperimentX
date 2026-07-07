import { createContext, useContext, useState, useEffect, useCallback } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = window.localStorage?.getItem("experimentx-theme");
    return stored || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      window.localStorage.setItem("experimentx-theme", theme);
    } catch (e) {
      // localStorage unavailable — theme just won't persist
    }
  }, [theme]);

  const toggleTheme = useCallback((originX, originY) => {
    // originX/Y let the toggle button trigger a ripple from its own position
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    return { x: originX, y: originY };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}