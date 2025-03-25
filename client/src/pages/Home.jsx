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
          className='w-full h-[50vh] md:h-[70vh] bg-gray-100'
        >
          {imageUrls.map((url, index) => (
            <SwiperSlide key={index}>
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