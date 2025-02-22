import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Button, Modal, Table } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);


  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
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
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <div className="w-full min-h-screen flex flex-col items-center p-4">
  <div className="w-full overflow-x-auto">
    <Table hoverable className="relative w-full min-w-full shadow-md">
      <Table.Head className="relative bg-gray-200 dark:bg-gray-900 w-full ">
        <Table.HeadCell className='py-4 text-left pl-4 w-1/6'>DATE UPDATED</Table.HeadCell>
        <Table.HeadCell className='py-4 text-left pl-4 w-1/6'>COMMENT CONTENT</Table.HeadCell>
        <Table.HeadCell className='py-4 text-center w-1/6'>NUMBER OF LIKES</Table.HeadCell>
        <Table.HeadCell className='py-4 text-left pl-4 w-1/6'>POST ID</Table.HeadCell>
        <Table.HeadCell className='py-4 text-left pl-4 w-1/6'>USER ID</Table.HeadCell>
        <Table.HeadCell className='py-4 text-left pl-4 w-1/6'>DELETE</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {comments.map((comment) => (
          <Table.Row key={comment._id} className="relative bg-white dark:border-gray-700 dark:bg-gray-800 py-4">
            <Table.Cell className="py-4 w-1/6">{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
          
            <Table.Cell className="py-4 w-1/6">{comment.content}</Table.Cell>
            <Table.Cell className="py-4 w-1/6">{comment.numberOfLikes}</Table.Cell>
            <Table.Cell className="py-4 w-1/6">{comment.postId}</Table.Cell>
                  <Table.Cell className="py-4 w-1/6">{comment.userId}</Table.Cell>
            <Table.Cell className="py-4 w-1/6">
              <span onClick={() => { setShowModal(true); setCommentIdToDelete(comment._id); }} 
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
        <p>You have no comments yet!</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md"  className="flex items-center justify-center min-h-screen">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your comment?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button 
                className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600" 
                onClick={handleDeleteComment}
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
