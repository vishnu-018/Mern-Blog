import { useEffect } from 'react'; // Only import useEffect
import PropTypes from 'prop-types'; // Import PropTypes
import { useSelector } from 'react-redux';

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);

  // Apply the theme class to the <html> or <body> element for global styling
  useEffect(() => {
    // Remove existing theme classes and apply the current theme
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]); // Dependency array ensures that the effect runs when 'theme' changes

  return (
    <div className="min-h-screen">
      <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen">
        {children}
      </div>
    </div>
  );
}

// Prop validation for 'children' prop
ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired, // Validate 'children' prop as a React node
};
