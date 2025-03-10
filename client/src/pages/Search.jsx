import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { useSelector } from 'react-redux';

export default function Search() {
  const { currentUser } = useSelector((state) => state.user); // Get the current user
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized',
    year: '',
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');
    const yearFromUrl = urlParams.get('year');

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl || yearFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
        year: yearFromUrl || '',
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const urlParams = new URLSearchParams(location.search);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getposts?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();

        // Filter posts based on visibility rules
        const filteredPosts = data.posts.filter((post) => {
          if (currentUser?.isAdmin) {
            // Admin can see all posts
            return true;
          } else if (post.approved) {
            // Approved posts are visible to all users
            return true;
          } else if (post.userId === currentUser?._id) {
            // Users can see their own unapproved posts
            return true;
          } else if (post.isAdmin) {
            // Posts created by admin are visible to all users
            return true;
          }
          // Denied posts and other users' unapproved posts are not visible
          return false;
        });

        setPosts(filteredPosts);
        setLoading(false);

        if (filteredPosts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };

    fetchPosts();
  }, [location.search, currentUser]); // Re-fetch posts when the search query or current user changes

  const handleChange = (e) => {
    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === 'sort') {
      const order = e.target.value || 'desc';
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === 'category') {
      const category = e.target.value || 'uncategorized';
      setSidebarData({ ...sidebarData, category });
    }
    if (e.target.id === 'year') {
      const year = e.target.value || '';
      setSidebarData({ ...sidebarData, year });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', sidebarData.category);
    urlParams.set('year', sidebarData.year);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();

      // Filter additional posts based on visibility rules
      const filteredPosts = data.posts.filter((post) => {
        if (currentUser?.isAdmin) {
          return true;
        } else if (post.approved) {
          return true;
        } else if (post.userId === currentUser?._id) {
          return true;
        } else if (post.isAdmin) {
          return true;
        }
        return false;
      });

      setPosts([...posts, ...filteredPosts]);
      if (filteredPosts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Search Term:
            </label>
            <TextInput
              placeholder='Search...'
              id='searchTerm'
              type='text'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id='sort'>
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Category:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id='category'
            >
              <option value='Uncategorized'>Uncategorized</option>
              <option value='Project innovations'>Project Innovations</option>
              <option value='Certifications'>Certifications</option>
              <option value='Academic Excellence'>Academic Excellence</option>
              <option value='Competitions'>Competitions</option>
              <option value='Product Development'>Product Development</option>
              <option value='Patent'>Patent</option>
              <option value='Paper Presentation'>Paper Presentation</option>
            </Select>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Year:</label>
            <Select onChange={handleChange} value={sidebarData.year} id='year'>
              <option value=''>Select Year</option>
              <option value='1st Year'>1st Year</option>
              <option value='2nd Year'>2nd Year</option>
              <option value='3rd Year'>3rd Year</option>
              <option value='4th Year'>4th Year</option>
            </Select>
          </div>
          <Button
            type='submit'
            gradientDuoTone='purpleToPink'
            className='px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg border-1 border-transparent hover:border-purple-500 transition'
          >
            Apply Filters
          </Button>
        </form>
      </div>
      <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 '>
          Posts results:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && posts.length === 0 && (
            <p className='text-xl text-gray-500'>No posts found.</p>
          )}
          {loading && <p className='text-xl text-gray-500'>Loading...</p>}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className='text-teal-500 text-lg hover:underline p-7 w-full'
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}