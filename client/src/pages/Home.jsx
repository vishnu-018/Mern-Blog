import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { Autoplay, Navigation } from 'swiper/modules';

export default function Home() {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);

  const categories = [
    'Project Innovations',
    'Certifications',
    'Academic Excellence',
    'Competitions',
    'Product Development',
    'Patent',
    'Paper Presentation',
  ];

  const imageUrls = [
    'https://www.bitsathy.ac.in/wp-content/uploads/hack4purpose.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/home-slider-tata-technologies-innovent-2023.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/indiaskilla.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/sauvc_2024.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/brics_2024_3rd_place_with_bronze_medal.jpg',


    'https://www.bitsathy.ac.in/wp-content/uploads/slider-18-msme.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/abhyjit-bronze-medal.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/SHAASTRA-2025-IIT-Madras.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/SIH.jpg',
   
    
  ];
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getPosts?limit=10&approved=true'); // Fetch more initially to ensure we get 10 approved
        const data = await res.json();
        if (res.ok) {
          const filteredPosts = data.posts.filter((post) => {
            return post.isAdmin || post.approved;
          }).slice(0, 10); // Take first 10 approved/admin posts
          setPosts(filteredPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPosts();
  }, [currentUser]);

  return (
    <div>
      {/* Full-width sections */}
      <div className='relative'>
  <Swiper
    modules={[Autoplay, Navigation]}
    spaceBetween={0}
    slidesPerView={1}
    loop={true}
    autoplay={{ delay: 3000, disableOnInteraction: false }}
    navigation
    className='w-full h-[50vh] md:h-[70vh]' // Removed bg-gray-100
  >
    {imageUrls.map((url, index) => (
      <SwiperSlide key={index} > {/* Added bg-black */}
        <img
          src={url}
          alt={`Slide ${index + 1}`}
          className='w-full h-full object-contain'
        />
      </SwiperSlide>
    ))}
  </Swiper>
</div>

     

      {/* Main content with sidebar */}
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto">
        {/* Recent Posts Section (Left side) */}
        <div className="w-full md:w-3/4 p-3">
          {posts.length > 0 && (
            <div className='flex flex-col gap-6'>
              <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
              <div className='flex flex-wrap gap-4'>
                {posts.slice(0, 10).map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
              <Link
                to={'/search'}
                className='text-lg text-teal-500 hover:underline text-center'
              >
                View all posts
              </Link>
            </div>
          )}
        </div>

        {/* Categories Sidebar (Right side) - Now appears after Create Post section */}
        <div className="w-full md:w-1/4 p-4">
          <div className="sticky top-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4 text-center">Explore by Category</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category}
                    to={`/search?category=${encodeURIComponent(category)}`}
                    className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}