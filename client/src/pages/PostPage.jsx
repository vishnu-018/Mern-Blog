import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const navigate = useNavigate();

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
          setRecentPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchRecentPosts();
  }, []);

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
        <img
          src={post.image}
          alt={post.title}
         className="mt-10 p-3 w-full h-[600px] object-contain"
        />
      )}
  
      {/* Display Video */}
      {post?.video && (
        <video
          controls
           className="mt-10 p-3 w-full h-[800px] object-contain"
        >
          <source src={post.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
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