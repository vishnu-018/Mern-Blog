import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Modal, Table } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function AdminApproval() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]); // Posts created by users (non-admins)
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getposts?onlyUserPosts=true'); // Fetch all posts
        const data = await res.json();
        if (res.ok) {
          // Filter out admin-created posts
          const filteredPosts = data.posts.filter((post) => !post.isAdmin);
          setUserPosts(filteredPosts);
          if (filteredPosts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser && currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`/api/post/getposts?startIndex=${startIndex}&onlyUserPosts=true`);
      const data = await res.json();
      if (res.ok) {
        // Filter out admin-created posts
        const filteredPosts = data.posts.filter((post) => !post.isAdmin);
        setUserPosts((prev) => [...prev, ...filteredPosts]);
        if (filteredPosts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleApprovePost = async (postId) => {
    try {
      const res = await fetch(`/api/post/approvePost/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved: true }),
      });
      const data = await res.json();
      if (res.ok) {
        // Update the post's approval status in the UI
        setUserPosts((prev) =>
          prev.map((post) =>
            post._id === postId ? { ...post, approved: true } : post
          )
        );
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDenyPost = async (postId) => {
    try {
      const res = await fetch(`/api/post/denyPost/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved: false }),
      });
      const data = await res.json();
      if (res.ok) {
        // Remove the denied post from the UI
        setUserPosts((prev) => prev.filter((post) => post._id !== postId));
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      <div className="flex-grow overflow-y-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-gray-500">
        {userPosts.length > 0 ? (
          <>
            <Table hoverable className="shadow-md w-full">
              <Table.Head className="relative bg-gray-200 dark:bg-gray-900 w-full">
                <Table.HeadCell className="py-4 text-center">DATE UPDATED</Table.HeadCell>
                <Table.HeadCell className="py-4 text-center">POST IMAGE</Table.HeadCell>
                <Table.HeadCell className="py-4 text-center">POST TITLE</Table.HeadCell>
                <Table.HeadCell className="py-4 text-center">CATEGORY</Table.HeadCell>
                <Table.HeadCell className="py-4 text-center">APPROVE</Table.HeadCell>
                <Table.HeadCell className="py-4 text-center">DENY</Table.HeadCell>
                <Table.HeadCell className="py-4 text-center">DELETE</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {userPosts.map((post) => (
                  <Table.Row key={post._id} className="relative bg-white dark:border-gray-700 dark:bg-gray-800 py-4">
                    <Table.Cell className="py-4 text-center">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell className="py-4 text-center">
                      <Link to={`/post/${post.slug}`}>
                        <img src={post.image} alt={post.title} className="w-20 h-12 object-cover bg-gray-500 mx-auto" />
                      </Link>
                    </Table.Cell>
                    <Table.Cell className="py-4 text-center">
                      <Link className="font-medium text-gray-900 dark:text-white" to={`/post/${post.slug}`}>
                        {post.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell className="py-4 text-center">
                      {Array.isArray(post.category) ? post.category.join(', ') : post.category}
                    </Table.Cell>
                    <Table.Cell className="py-4 text-center">
                      <Button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                        onClick={() => handleApprovePost(post._id)}
                        disabled={post.approved}
                      >
                        {post.approved ? 'Approved' : 'Approve'}
                      </Button>
                    </Table.Cell>
                    <Table.Cell className="py-4 text-center">
                      <Button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                        onClick={() => handleDenyPost(post._id)}
                      >
                        Deny
                      </Button>
                    </Table.Cell>
                    <Table.Cell className="py-4 text-center">
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setPostIdToDelete(post._id);
                        }}
                        className="font-medium text-red-600 hover:underline cursor-pointer"
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
                className="w-full text-teal-500 self-center text-sm py-7"
              >
                Show more
              </button>
            )}
          </>
        ) : (
          <p>No posts pending approval.</p>
        )}

        <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md" className="flex items-center justify-center min-h-screen">
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this post?
              </h3>
              <div className="flex justify-center gap-4">
                <Button
                  className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                  onClick={handleDeletePost}
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