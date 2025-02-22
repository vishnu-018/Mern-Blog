/** @type {import('tailwindcss').Config} */
import flowbite from 'flowbite/plugin';
import tailwindScrollbar from 'tailwind-scrollbar';


export default {
  content: [
    "./index.html", // Add this if using Vite
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./public/**/*.html", // Ensure it detects Tailwind classes in public files
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    flowbite,
    tailwindScrollbar,
    // Use the imported plugin here
  ],
};
