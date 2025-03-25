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
        const res = await fetch('/api/post/getPosts?limit=10&approved=true');
        const data = await res.json();
        if (res.ok) {
          const filteredPosts = data.posts.filter((post) => {
            return post.isAdmin || post.approved;
          }).slice(0, 10);
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
      {/* Image Slider with custom mobile arrow sizes */}
      <div className='relative w-full overflow-hidden'>
        <style>
          {`
            @media (max-width: 768px) {
              .swiper-button-next, 
              .swiper-button-prev {
                --swiper-navigation-size: 20px;
                padding: 8px;
              }
            }
          `}
        </style>
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation
          className='w-full'
        >
          {imageUrls.map((url, index) => (
            <SwiperSlide key={index} className='!h-auto'>
              <div className='w-full h-0 pb-[40%] md:pb-[35%] relative'>
                <img
                  src={url}
                  alt={`Slide ${index + 1}`}
                  className='absolute w-full h-full object-contain'
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Rest of your existing code remains unchanged */}
      <div className="md:hidden px-4 py-4">
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

      <div className="flex flex-col md:flex-row max-w-6xl mx-auto px-4 md:px-0">
        <div className="w-full md:w-3/4 p-2 md:p-3">
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

        <div className="hidden md:block w-full md:w-1/4 p-3">
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