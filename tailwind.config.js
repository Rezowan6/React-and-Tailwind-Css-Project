/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Accent colors
        primary: "#10B981",      // Emerald / Teal accent
        "primary-light": "#6EE7B7",

        // Neutral backgrounds
        light: "#F9FAFB",         // Near-white background
        "light-card": "#FFFFFF",  // White cards / sections

        // Dark mode palette
        secondary: "#111827",     // Deep graphite background
        "secondary-card": "#1F2937", // Card color in dark mode
        "secondary-text": "#D1D5DB", // Muted text in dark

        // Warning / error tones (optional)
        danger: "#EF4444",
        warning: "#F59E0B",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
};



