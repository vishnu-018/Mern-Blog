import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';
import DashBoardComp from '../components/DashBoardComp';
import AdminApproval from '../components/AdminApproval';
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
      {tab === 'posts' && <DashPosts />}
      {/* users... */}
      {tab === 'users' && <DashUsers />}
       {/* comments  */}
       {tab === 'comments' && <DashComments />}
        {/* dashboard comp */}
        {tab === 'dash' && <DashBoardComp />}
         {/* admin approval */}
         {tab === 'approval' && <AdminApproval />}
    </div>
  );

}