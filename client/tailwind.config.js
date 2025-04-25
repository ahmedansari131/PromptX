/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-blue": "#234457",
        "custom-dark": "#132031",
        "custom-white": "#f4f4f4",
        "custom-green": "#165b64",
        mint: "#cbf4f3",
        blue: "#02212d",
        mintExtreme: "#4BDFEC",
        "mintExtreme-200": "#2c7a84",
        "mintExtreme-300": "#144f5b",
        "mintExtreme-400": "#0a3540",
        "mintExtreme-500": "#062a37",
        mintHover: "rgba(117, 188, 179)",
      },
      fontFamily: {
        primary: ["Neue Regrade", "sans-serif"],
        secondary: ["Gantari", "sans-serif"],
      },
      borderColor: {
        light: "rgba(76, 200, 211, 0.2)",
      },
    },
  },
  plugins: [],
};
