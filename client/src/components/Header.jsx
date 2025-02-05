import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const currentUser = useSelector((state) => state.user.currentUser);

  const isActive = (path) => pathname === path;

  return (
    <Navbar className="border-b-2 flex justify-between items-center">
      <Link to="/" className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Inspire
        </span>
        Blog
      </Link>

      <form className="flex items-center gap-2">
        <Button className="w-12 h-10 flex items-center justify-center" color="gray" pill>
          <AiOutlineSearch className="text-black dark:text-white" size={20} />
        </Button>
        <TextInput type="text" placeholder="Search..." className="hidden lg:inline" />
      </form>

      <div className="flex items-center gap-6">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
          <FaMoon className="text-black dark:text-white" size={24} />
        </Button>

        <Button className="w-10 h-10 sm:hidden flex items-center justify-center" color="gray" pill onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="text-xl text-black dark:text-white">☰</span>
        </Button>

        <div className="hidden sm:flex gap-4">
          {["/", "/about", "/projects"].map((path, index) => (
            <Link key={index} to={path} className={`font-bold hover:underline ${isActive(path) ? "text-blue-500" : "text-gray-900 dark:text-white"}`}>
              {path === "/" ? "Home" : path.substring(1).charAt(0).toUpperCase() + path.slice(2)}
            </Link>
          ))}
        </div>

        {currentUser ? (
         <Dropdown 
         label={
           <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
             <img 
               src={currentUser.profilePicture} 
               alt="user" 
               className="w-full h-full object-cover"
             />
           </div>
         } 
         arrowIcon={false}
       >
       
       

            <Dropdown.Header>
              <span className="block text-sm ">{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">{currentUser.email}</span>
            </Dropdown.Header>
           
           
            <Link to={"/dashboard?tab=profile"}>
            <Dropdown.Item>
              Profile
            </Dropdown.Item>
</Link>
<Dropdown.Divider/>
<Dropdown.Item>
              Sign Out
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button className="py-2 px-6 text-blue-500 font-semibold rounded-lg bg-transparent hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border-2 border-transparent border-gradient-to-r from-purple-500 to-blue-500" pill>
              Sign In
            </Button>
          </Link>
        )}
      </div>

      {isMenuOpen && (
        <div className="absolute top-16 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex flex-col gap-4 sm:hidden">
          {["/", "/about", "/projects"].map((path, index) => (
            <Link key={index} to={path} className={`font-bold hover:underline ${isActive(path) ? "text-blue-500" : "text-gray-900 dark:text-white"}`}>
              {path === "/" ? "Home" : path.substring(1).charAt(0).toUpperCase() + path.slice(2)}
            </Link>
          ))}
        </div>
      )}
    </Navbar>
  );
}
