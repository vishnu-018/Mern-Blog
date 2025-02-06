import {Sidebar} from 'flowbite-react'
import { useEffect, useState } from 'react';
import {
    HiArrowRight,
    HiUser,
   
  } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';
export default function DashSidebar() {
    const location = useLocation();
      const [tab, setTab] = useState('');
    
      useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        setTab(tabFromUrl || ''); // Set to empty string if no tab parameter
        if (tabFromUrl) {
          setTab(tabFromUrl);
        }
      }, [location.search]);
  return (
    <Sidebar className='w-full md:w-56'>
     <Sidebar.Items>
        <Sidebar.ItemGroup>
        <Link to='/dashboard?tab=profile'>
            <Sidebar.Item
              active={tab === 'profile'}
              icon={HiUser}
              label={'User'}
              labelColor='dark'
              as='div'
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item
              icon={HiArrowRight}
             className='cursor-pointer'
            >
              SignOut
            </Sidebar.Item>
        </Sidebar.ItemGroup>
     </Sidebar.Items>



    </Sidebar>
  )
}
