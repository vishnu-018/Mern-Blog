import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { Button, Modal, Table } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);


  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
        const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        if (res.ok) {
            setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
            setShowModal(false);
        } else {
            console.log(data.message);
        }
    } catch (error) {
        console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
    <div className="flex-grow overflow-y-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-gray-500 w-full">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <div className="w-full min-h-screen flex flex-col items-center p-4">
  <div className="w-full overflow-x-auto">
    <Table hoverable className="relative w-full min-w-full shadow-md">
      <Table.Head className="relative bg-gray-200 dark:bg-gray-900 w-full ">
        <Table.HeadCell className='py-4 text-left pl-4 w-1/6'>DATE CREATED</Table.HeadCell>
        <Table.HeadCell className='py-4 text-left pl-4 w-1/6'>USER IMAGE</Table.HeadCell>
        <Table.HeadCell className='py-4 text-center w-1/6'>USERNAME</Table.HeadCell>
        <Table.HeadCell className='py-4 text-left pl-4 w-1/6'>EMAIL</Table.HeadCell>
        <Table.HeadCell className='py-4 text-left pl-4 w-1/6'>ADMIN</Table.HeadCell>
        <Table.HeadCell className='py-4 text-left pl-4 w-1/6'>DELETE</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {users.map((user) => (
          <Table.Row key={user._id} className="relative bg-white dark:border-gray-700 dark:bg-gray-800 py-4">
            <Table.Cell className="py-4 w-1/6">{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
            <Table.Cell className="py-4 w-1/6">
              <img src={user.profilePicture} alt={user.username} className="w-10 h-10 object-cover bg-gray-500 rounded-full" />
            </Table.Cell>
            <Table.Cell className="py-4 w-1/6">{user.username}</Table.Cell>
            <Table.Cell className="py-4 w-1/6">{user.email}</Table.Cell>
            <Table.Cell className="py-4 w-1/6">
              {user.isAdmin ? <FaCheck className='text-green-500' /> : <FaTimes className='text-red-500' />}
            </Table.Cell>
            <Table.Cell className="py-4 w-1/6">
              <span onClick={() => { setShowModal(true); setUserIdToDelete(user._id); }} 
                    className="font-medium text-red-500 hover:underline cursor-pointer">
                Delete
              </span>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </div>
</div>


          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no users yet!</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md"  className="flex items-center justify-center min-h-screen">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your post?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button 
                className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600" 
                onClick={handleDeleteUser}
              >
                Yes, I am sure
              </Button>
              <Button 
                className="bg-gray-300 text-gray-700 hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600" 
                onClick={() => setShowModal(false)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
    </div>
  );
}
