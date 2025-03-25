import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import { useSelector } from 'react-redux';

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [ setRecentPosts] = useState(null); // Added back the variable declaration
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const categories = [
    'Project Innovations',
    'Certifications',
    'Academic Excellence',
    'Competitions',
    'Product Development',
    'Patent',
    'Paper Presentation',
  ];

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();

        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }

        const postData = data.posts[0];
        if (postData) {
          postData.category = Array.isArray(postData.category)
            ? postData.category.filter((cat) => cat)
            : [];
          setPost(postData);
        }

        setLoading(false);
        setError(false);
      } catch (error) {
        console.log(error);
        setError(true);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=10`);
        const data = await res.json();
        if (res.ok) {
          const filteredPosts = data.posts.filter((post) => {
            if (post.isAdmin) return true;
            else if (post.approved) return true;
            return false;
          });
          setRecentPosts(filteredPosts.slice(0, 3));
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchRecentPosts();
  }, [currentUser, setRecentPosts]); // Added setRecentPosts to dependency array

  // ... rest of your component remains the same ...

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <p>Something went wrong. Please try again.</p>
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row gap-8 p-3 max-w-6xl mx-auto min-h-screen">
      {/* Main Content (Left Side) */}
      <main className="flex-1">
        <h1 className="text-3xl mt-10 p-3 text-center font-serif lg:text-4xl">
          {post?.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-col items-center gap-2 mt-5">
          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2">
            {post?.category && post.category.length > 0 ? (
              post.category.map((cat, index) => (
                <Button
                  key={index}
                  color="gray"
                  pill
                  size="xs"
                  onClick={() => navigate(`/search?category=${encodeURIComponent(cat)}`)}
                >
                  {cat}
                </Button>
              ))
            ) : (
              <span className="text-gray-500 text-sm">No categories</span>
            )}
          </div>

          {/* Year */}
          <Button
            color="gray"
            pill
            size="xs"
            onClick={() => navigate(`/search?year=${post?.year}`)}
          >
            {post?.year}
          </Button>
        </div>

        {/* Display Image */}
        {post?.image && (
          <div className="mt-10 p-3 w-full">
            <div className="relative aspect-[16/9] w-full group">
              <img
                src={post.image}
                alt={post.title}
                className="absolute top-0 left-0 w-full h-full object-contain rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            {post.imageCaption && (
              <p className="text-sm text-gray-600 text-center mt-2">
                {post.imageCaption}
              </p>
            )}
          </div>
        )}

        {/* Display Video */}
        {post?.video && (
          <div className="mt-10 p-3 w-full">
            <div className="relative aspect-video w-full">
              <video
                controls
                className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-lg"
              >
                <source src={post.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}

        <div className="flex justify-between p-3 border-b border-slate-500 w-full text-xs">
          <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
          <span className="italic">
            {post && (post.content.length / 1000).toFixed(0)} mins read
          </span>
        </div>

        <div
          className="p-3 w-full post-content"
          dangerouslySetInnerHTML={{ __html: post?.content }}
        ></div>

        

        <CommentSection postId={post?._id} />

       
      </main>

      {/* Categories Sidebar (Right Side) - Matching Home page style */}
      <aside className="w-full md:w-1/4 mt-10">
        <div className="sticky top-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4 text-center">Explore by Category</h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => navigate(`/search?category=${encodeURIComponent(category)}`)}
                  className="block w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}