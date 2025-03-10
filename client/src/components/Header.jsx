import { Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate  } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";



export default function Header() {
  const { pathname } = useLocation();
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);
  const { theme } = useSelector((state) => state.theme);
  const dispatch=useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSignout = async () => {
      try {
        const res = await fetch('/api/user/signout', {
          method: 'POST',
        });
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
        } else {
          dispatch(signoutSuccess());
        }
      } catch (error) {
        console.log(error.message);
      }
    };
  
  const isActive = (path) => pathname === path;

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };


  return (
    <Navbar className="border-b-2 flex justify-between items-center bg-white dark:bg-gray-900">
      <Link to="/" className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          BIT
        </span>
        Blog
      </Link>

      <form className="flex items-center gap-2"  onSubmit={handleSubmit}>
        <Button className="w-12 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" pill>
         <Link to="/search">
         <AiOutlineSearch className="text-gray-800 dark:text-gray-200" size={20} />
         </Link> 
        </Button>
        <TextInput type="text" placeholder="Search..." className="hidden lg:inline dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"  value={searchTerm}  onChange={(e) => setSearchTerm(e.target.value)} />
      </form>

      <div className="flex items-center gap-6">
        {/* Dark Mode Toggle */}
        <Button
          className="w-12 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-gray-300" />}
        </Button>

        <div className="hidden sm:flex gap-4">
          {["/", "/about"].map((path, index) => (
            <Link key={index} to={path} className={`font-bold hover:underline ${isActive(path) ? "text-blue-500" : "text-gray-900 dark:text-white"}`}>
              {path === "/" ? "Home" : path.substring(1).charAt(0).toUpperCase() + path.slice(2)}
            </Link>
          ))}
        </div>

        {currentUser ? (
          <Dropdown
            label={
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
                <img src={currentUser.profilePicture} alt="user" className="w-full h-full object-cover"
                 />
              </div>
            }
            arrowIcon={false}
          >
            <Dropdown.Header>
              <span className="block text-sm">{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">{currentUser.email}</span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button className="py-2 px-6 text-blue-500 font-semibold rounded-lg bg-transparent hover:bg-blue-600 hover:text-white border-2 border-transparent border-gradient-to-r from-purple-500 to-blue-500" pill>
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </Navbar>
  );
}
