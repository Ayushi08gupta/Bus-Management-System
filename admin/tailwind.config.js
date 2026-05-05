/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A",
        secondary: "#06B6D4",
        accent: {
          start: "#7C3AED",
          end: "#A78BFA",
        },
        background: {
          start: "#0F172A",
          end: "#1E293B",
        },
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        glass: {
          light: "rgba(255, 255, 255, 0.1)",
          DEFAULT: "rgba(255, 255, 255, 0.15)",
          dark: "rgba(15, 23, 42, 0.6)",
        }
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(to right, #7C3AED, #A78BFA)',
        'gradient-bg': 'linear-gradient(to bottom right, #0F172A, #1E293B)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
