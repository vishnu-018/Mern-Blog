import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');

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
    <div className='flex-grow overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-gray-200 scrollbar-thumb-gray-400 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-gray-500'>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className='shadow-md bg-transparent'>
          <Table.Head className="relative bg-gray-200 dark:bg-gray-900">
              <Table.HeadCell className='py-4 text-left pl-4 '>DATE CREATED</Table.HeadCell>
              <Table.HeadCell className='py-4 text-left pl-4'>USER IMAGE</Table.HeadCell>
              <Table.HeadCell className='py-4 text-left pl-4'>USERNAME</Table.HeadCell>
              <Table.HeadCell className='py-4 text-left pl-4'>EMAIL</Table.HeadCell>
              <Table.HeadCell className='py-4 text-left pl-4'>ADMIN</Table.HeadCell>
              <Table.HeadCell className='py-4 text-left pl-4'>DELETE</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {users.map((user) => (
                <Table.Row
                  className='bg-white dark:bg-gray-800 border-b dark:border-gray-700'
                  key={user._id}
                >
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className='w-10 h-10 object-cover rounded-full'
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className='text-green-500' />
                    ) : (
                      <FaTimes className='text-red-500' />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-4'
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p className='text-center text-gray-500 dark:text-gray-300'>
          No users found!
        </p>
      )}

      {/* Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
        className='bg-transparent'
      >
        <Modal.Body className='bg-white dark:bg-gray-800 rounded-lg p-6'>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-600 dark:text-gray-300'>
              Are you sure you want to delete this user?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, Delete
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
