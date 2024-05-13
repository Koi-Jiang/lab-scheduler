import type { Config } from "tailwindcss";
import daisyui from "daisyui";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [
    typography,
    daisyui
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["nord"],
          primary: "#a7cef6"
        },
      },
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dim"],
          primary: "#7aaae4"
        },
      },
    ],
  },
};
export default config;
