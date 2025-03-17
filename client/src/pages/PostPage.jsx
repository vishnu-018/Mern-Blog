import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';
import { useSelector } from 'react-redux';

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user); // Get the current user

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

        // Extract post data
        const postData = data.posts[0];

        if (postData) {
          // Ensure category is an array and filter out null/undefined
          postData.category = Array.isArray(postData.category)
            ? postData.category.filter((cat) => cat) // Remove null/undefined
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
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          // Apply visibility rules to filter posts
          const filteredPosts = data.posts.filter((post) => {
            if (post.isAdmin) {
              return true; // Admin-created posts are visible to everyone
            } else if (post.approved) {
              return true; // Approved posts are visible to everyone
            } else if (currentUser && post.userId === currentUser._id) {
              return true; // Users can see their own unapproved posts
            }
            return false; // Hide other unapproved posts
          });

          setRecentPosts(filteredPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchRecentPosts();
  }, [currentUser]); // Re-fetch posts when the current user changes

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

  console.log("Post Data:", post);
  console.log("Post Category:", post?.category);

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post?.title}
      </h1>

      {/* Display Multiple Categories */}
      <div className="flex gap-2 self-center mt-5 flex-wrap">
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
          <span className="text-gray-500">No Category Available</span>
        )}
      </div>

      {/* Year Navigation */}
      <Button
        color="gray"
        pill
        size="xs"
        className="self-center mt-5"
        onClick={() => navigate(`/search?year=${post?.year}`)}
      >
        {post?.year}
      </Button>

      {/* Display Image */}
      {post?.image && (
  <div className="mt-10 p-3 w-full max-w-4xl mx-auto">
    <div className="relative aspect-[16/9] w-full group">
      <img
        src={post.image}
        alt={post.title}
        className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
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
  <div className="mt-10 p-3 w-full max-w-4xl mx-auto">
    <div className="relative aspect-video w-full"> {/* 16:9 aspect ratio container */}
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

      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>

      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post?.content }}
      ></div>

      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>

      <CommentSection postId={post?._id} />

      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent articles</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
}