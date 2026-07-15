import { Toaster } from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

export default function Toast() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Toaster
      position="bottom-right"
      gutter={8}
      toastOptions={{
        duration: 3500,
        style: {
          background: isDark ? "#161827" : "#ffffff",
          color: isDark ? "rgba(255,255,255,0.85)" : "#111827",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          borderRadius: "12px",
          fontSize: "13px",
          fontWeight: "500",
          padding: "10px 14px",
          boxShadow: isDark
            ? "0 8px 32px rgba(0,0,0,0.5)"
            : "0 8px 32px rgba(0,0,0,0.12)",
        },
        success: {
          iconTheme: {
            primary: "#10B981",
            secondary: isDark ? "#161827" : "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#EF4444",
            secondary: isDark ? "#161827" : "#ffffff",
          },
        },
      }}
    />
  );
}