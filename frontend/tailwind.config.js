// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,jsx}"],
//   darkMode: "class",
//   theme: {
//     extend: {
//       colors: {
//         // brand: {
//         //   violet: "#6C5CE7",
//         //   blue: "#4F8CFF",
//         //   black: "#0A0B14",
//         //   surface: "#11131F",
//         //   card: "#161827",
//         // },
//         brand: {
//   violet: "#6C5CE7",
//   blue: "#4F8CFF",
//   black: "#0A0B14",
//   surface: "#11131F",
//   card: "#161827",
//   "light-bg": "#F7F8FC",        // ← add
//   "light-surface": "#FFFFFF",   // ← add
// },
//       },
//       fontFamily: {
//         display: ["'Sora'", "sans-serif"],
//         body: ["'Inter'", "sans-serif"],
//       },
//       animation: {
//         "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
//         float: "float 6s ease-in-out infinite",
//       },
//       keyframes: {
//         float: {
//           "0%, 100%": { transform: "translateY(0px)" },
//           "50%": { transform: "translateY(-12px)" },
//         },
//       },
//     },
//   },
//   plugins: [],
// };














/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          ember: "#C2410C",    // primary — action, variant, CTA
          gold: "#D9A441",     // signal — statistical significance, highlights only
          control: "#3B6E64",  // control group, secondary/informational state
          black: "#16150F",
          surface: "#1D1B15",
          card: "#232019",
          "light-bg": "#F5F5F2",
          "light-surface": "#FFFFFF",
        },
        neutral: {
          950: "#16150F",
          900: "#1D1B15",
          800: "#232019",
          200: "#E7E7E2",
          100: "#F0F0EC",
          50: "#F5F5F2",
        },
      },
      fontFamily: {
        display: ["'Instrument Sans'", "sans-serif"],
        body: ["'IBM Plex Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};