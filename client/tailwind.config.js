/** @type {import('tailwindcss').Config} */
import flowbite from 'flowbite/plugin';
export default {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", 
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',// Ensure it matches your project file extensions
  ],
  theme: {
    extend: {},
  },
  plugins: [flowbite],
};
