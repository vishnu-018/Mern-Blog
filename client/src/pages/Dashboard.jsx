import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    setTab(tabFromUrl || ''); // Set to empty string if no tab parameter
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]); // Correct dependency array - NO extra bracket

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56 w-full md:h-screen h-auto bg-gray-50 dark:bg-gray-800 '>
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile... */}
      {tab === 'profile' && <DashProfile />}
      {/* posts... */}
    
    </div>
  );

}