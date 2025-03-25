import PropTypes from 'prop-types'; // Add this import
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import About from './pages/About';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Header from './components/Header';
import Createpost from './pages/Createpost';
import UpdatePost from './pages/UpdatePost';
import PostPage from './pages/PostPage';
import ScrollToTop from './components/ScrollToTop';
import Search from './pages/Search';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  
  if (!currentUser) {
    // Store the attempted path before redirecting to login
    sessionStorage.setItem('redirectPath', location.pathname);
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

// Add PropTypes validation for PrivateRoute
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired
};

const App = () => {
  const location = useLocation();
  const hideHeader = ['/sign-in', '/sign-up'].includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      {!hideHeader && <Header />}
      <Routes>
        <Route path='/' element={<Navigate to="/home" replace />} />
        <Route path='/home' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<Signin />} />
        <Route path='/sign-up' element={<Signup />} />
        <Route path='/search' element={<Search />} />
        
        {/* Protected routes */}
        <Route path='/dashboard' element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path='/create-post' element={
          <PrivateRoute>
            <Createpost />
          </PrivateRoute>
        } />
        <Route path='/update-post/:postId' element={
          <PrivateRoute>
            <UpdatePost />
          </PrivateRoute>
        } />
        
        <Route path='/projects' element={<Projects />} />
        <Route path='/post/:postSlug' element={<PostPage />} />
      </Routes>
    </>
  );
};

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}