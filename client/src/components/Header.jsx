import { Button, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation(); // Get current path

  // Define a function to determine if a link is active
  const isActive = (path) => pathname === path;

  return (
    <Navbar className="border-b-2 flex justify-between items-center">
      {/* Logo */}
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Vishnu
        </span>
        Blog
      </Link>

      {/* Search Bar */}
      <form className="flex items-center gap-2">
        <Button className="w-12 h-10 flex items-center justify-center" color="gray" pill>
          <AiOutlineSearch className="text-black dark:text-white" size={20} />
        </Button>
        <TextInput type="text" placeholder="Search..." className="hidden lg:inline" />
      </form>

      {/* Navbar Links and Theme Toggle */}
      <div className="flex items-center gap-6">
        {/* Theme Toggle Button */}
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
          <FaMoon className="text-black dark:text-white" size={24} />
        </Button>

        {/* Toggle Menu Button for Small Screens */}
        <Button
          className="w-10 h-10 sm:hidden flex items-center justify-center"
          color="gray"
          pill
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="text-xl text-black dark:text-white">☰</span>
        </Button>

        {/* Links for Larger Screens */}
        <div className="hidden sm:flex gap-4">
          {["/", "/about", "/projects"].map((path, index) => (
            <Link
              key={index}
              to={path}
              className={`text-gray-900 dark:text-white hover:underline ${
                isActive(path) ? "font-bold text-blue-500" : ""
              }`}
            >
              {path === "/" ? "Home" : path.substring(1).charAt(0).toUpperCase() + path.slice(2)}
            </Link>
          ))}
        </div>

        {/* Sign In Button */}
        <Link to="/sign-in">
  <Button
    className="py-2 px-6 text-blue-500 font-semibold rounded-lg border-2 border-blue-500 bg-transparent hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    pill
  >
    Sign In
  </Button>
</Link>





      </div>

      {/* Dropdown Menu for Small Screens */}
      {isMenuOpen && (
        <div className="absolute top-16 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex flex-col gap-4 sm:hidden">
          {["/", "/about", "/projects"].map((path, index) => (
            <Link
              key={index}
              to={path}
              className={`text-gray-900 dark:text-white hover:underline ${
                isActive(path) ? "font-bold text-blue-500" : ""
              }`}
            >
              {path === "/" ? "Home" : path.substring(1).charAt(0).toUpperCase() + path.slice(2)}
            </Link>
          ))}
        </div>
      )}
    </Navbar>
  );
}
