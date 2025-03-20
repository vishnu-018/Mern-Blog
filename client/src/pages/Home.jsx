import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { useSelector } from 'react-redux';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

// Import required modules
import { Autoplay, Navigation } from 'swiper/modules';

export default function Home() {
  const { currentUser } = useSelector((state) => state.user); // Get the current user
  const [posts, setPosts] = useState([]);

  // List of categories
  const categories = [
    'Project Innovations',
    'Certifications',
    'Academic Excellence',
    'Competitions',
    'Product Development',
    'Patent',
    'Paper Presentation',
  ];

  // List of image URLs
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
    'https://www.bitsathy.ac.in/wp-content/uploads/605-IIT-BOMBAY.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/615-Micro-Mouse-Maze-01.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/667-Water-Conclave.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/730-BioMed-Bharat-Hackathon.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/933-BRICS-05-scaled.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/933-BRICS-06-scaled.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/1006-H-Baja.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/1077-Himashield-Event.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/Achievement-Grabbed-2nd-Prize-with-a-Cash-Reward-of-%E2%82%B915000-in-MythoNova-IIIT-48-Hours-Hackathon.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/Achievement-Grabbed-3rd-Prize-with-a-Cash-Reward-of-%E2%82%B91-Lakh-in-TECHNEXT-EXPO-2024.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/Achievement-Secured-3rd-and-4th-place-in-Seismic-and-won-the-overall-trophy-for-Best-Performing-College-in-Aakaar-16th-Edition.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/Achievement-Won-1st-Prize-with-a-Cash-Prize-of-%E2%82%B930000-in-Anveshana.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/Achievement-Won-Cash-Prize-of-%E2%82%B91-Lakh-in-BioMed-Bharat.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/BAGGED-RS.-3-LAKH-IN-DRDO-DARE-TO-DREAM-2.0-CONTEST.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/BIT-team-wins-first-place-I-in-HACK4PURPOSE.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/Dot-Robotics.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/Grabbed-1st-Prize-with-a-Cash-Reward-of-%E2%82%B91-Lakh-in-TANCAM.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/In-Focus-ADCx-India-2025.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/In-Focus-BRICS2024-1.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/In-Focus-H-Baja-1.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/In-Focus-Himashield-Event-2025.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/In-Focus-IIT-Madras-Pravartak-EIR-Grant.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/1st-Prize-in-Dare-to-Dream-3.0-Innovation-Contest-%E2%80%93-DRDO.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/2nd-Place-in-Devbhoomi-Cyber-Hackathon-Sponsored-by-the-Government-of-India.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/In-Focus-IndiaSkills-2024.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/In-Focus-Ninjacart-Hackathon-2024.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/In-Focus-SIH2024-1.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/In-Focus-SIH2024-2.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/In-Focus-SIH2024-3.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/In-Focus-Shaastra-2025-1.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/In-Focus-Shaastra-2025-2.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/In-Focus-Singapore-Autonomous-Underwater-Vehicle-Challenge-2024.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/In-Focus-Startup-Mela-6.0.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/In-Focus-Technoxian-2024.jpg',
    
    'https://www.bitsathy.ac.in/wp-content/uploads/Tata-Technologies-InnoVent-InFocas.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/Team-AI-evAnGelIst-emerged-as-the-winner-securing-the-first-prize-with-a-cash-reward-of-%E2%82%B9-1-lakh-in-SIH-2023-1.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/Team-House-Stark-Winterfell-attained-the-top-position-capturing-the-first-prize-with-a-cash-award-of-%E2%82%B9-1-lakh-in-SIH-2023-1.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/Team-Spartans-clinched-the-top-prize-receiving-a-cash-award-of-%E2%82%B9-1-lakh-in-SIH-2023-1.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/Team-Tech-Hoppers-triumphed-claiming-the-first-prize-along-with-a-cash-award-of-%E2%82%B9-1-lakh-in-SIH-2023-1.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/Top-Finalist-in-National-Level-Event-Hackademic.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/Won-1st-Place-with-a-Cash-Price-of-%E2%82%B9-1-Lakh-in-KAVACH-2023-1.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/Won-1st-Place-with-a-Cash-Prize-of-%E2%82%B9-5-Lakhs-in-Forensic-Hackathon-2023-1.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/Won-1st-Prize-with-a-cash-reward-of-%E2%82%B9100000-in-Hack4Purpose-2024-In-Fous.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/Won-Best-Employees-Choice-Award-in-TECHgium-2023-1.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/Won-Runner-Up-with-a-Cash-Price-of-%E2%82%B9-25000-in-Technoxian-2023-World-Robotics-Competition-7.0.jpg',
   
   
    'https://www.bitsathy.ac.in/wp-content/uploads/grabbed-5th-Position-at-the-National-level-in-Technoxian-2023-World-Robotics-Competition-7.0.jpg',
    'https://www.bitsathy.ac.in/wp-content/uploads/vTeam-Agastrix-secured-the-first-prize-earning-a-cash-reward-of-%E2%82%B9-50000-in-SIH-2023.jpg',
    // Add more image URLs as needed
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getPosts');
        const data = await res.json();
        if (res.ok) {
          // Filter posts based on visibility rules
          const filteredPosts = data.posts.filter((post) => {
            if (post.isAdmin) {
              return true; // Admin-created posts are visible to everyone
            } else if (post.approved) {
              return true; // Approved posts are visible to everyone
           
            }
            return false; // Hide other unapproved posts
          });

          setPosts(filteredPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchPosts();
  }, [currentUser]); // Re-fetch posts when the current user changes

  return (
    <div>
      {/* Swiper Slider Section */}
      <div className='relative'>
        <Swiper
          modules={[Autoplay, Navigation]} // Removed Pagination module
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation
          className='w-full h-[50vh] md:h-[70vh] bg-gray-100' // Responsive height with background color
        >
          {imageUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <img
                src={url}
                alt={`Slide ${index + 1}`}
                className='w-full h-full object-contain' // Ensure the entire image is visible
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Call to Action Section */}
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        <div className='bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg p-8 text-center text-white shadow-lg'>
          <h2 className='text-3xl font-bold mb-4'>Share Your Achievements</h2>
          <p className='text-lg mb-6'>
            Inspire others by sharing your projects, certifications, and innovations. Let the world know about your success!
          </p>
          <Link
            to='/create-post'
            className='inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all'
          >
            Create a Post
          </Link>
        </div>
      </div>

      {/* Category Section */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        <h2 className='text-2xl font-semibold text-center'>Explore by Category</h2>
        <div className='flex flex-wrap gap-4 justify-center'>
          {categories.map((category) => (
            <div
              key={category}
              className='border border-teal-500 rounded-lg p-4 w-full sm:w-[300px] text-center'
            >
              <h3 className='text-xl font-semibold'>{category}</h3>
              <Link
                to={`/search?category=${encodeURIComponent(category)}`}
                className='mt-4 inline-block px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all'
              >
                View Posts
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className='flex flex-wrap gap-4'>
              {posts.slice(0, 6).map((post) => (
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
    </div>
  );
}