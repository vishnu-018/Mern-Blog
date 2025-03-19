import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Modal, Table } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          currentUser?.isAdmin 
          ? `/api/post/getposts` // Admins fetch all posts
          : `/api/post/getposts?userId=${currentUser._id}` // Regular users fetch only their posts
        );
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser) {
      fetchPosts();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        currentUser?.isAdmin 
        ? `/api/post/getposts?startIndex=${startIndex}` 
        : `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
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
      const res = await fetch(`/api/post/approve-post/${postId}`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) =>
          prev.map((post) =>
            post._id === postId ? { ...post, status: 'Approved' } : post
          )
        );
        console.log('Post approved successfully:', data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDenyPost = async (postId) => {
    try {
      const res = await fetch(`/api/post/deny-post/${postId}`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) =>
          prev.map((post) =>
            post._id === postId ? { ...post, status: 'Rejected' } : post
          )
        );
        console.log('Post denied successfully:', data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      <div className="flex-grow overflow-y-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-gray-500 w-full">
        {userPosts.length > 0 ? (
          <>
            <div className="w-full min-h-screen flex flex-col items-center p-4">
              <div className="w-full overflow-x-auto">
                <Table hoverable className="relative w-full min-w-full shadow-md">
                  <Table.Head className="relative bg-gray-200 dark:bg-gray-900 w-full">
                    <Table.HeadCell className="py-4 text-left pl-4 w-1/6">
                      DATE UPDATED
                    </Table.HeadCell>
                    <Table.HeadCell className="py-4 text-left pl-4 w-1/6">
                      POST IMAGE
                    </Table.HeadCell>
                    <Table.HeadCell className="py-4 text-center w-1/6">
                      POST TITLE
                    </Table.HeadCell>
                    <Table.HeadCell className="py-4 text-left pl-4 w-1/6">
                      CATEGORY
                    </Table.HeadCell>
                    <Table.HeadCell className="py-4 text-center w-1/6">
                      APPROVAL STATUS
                    </Table.HeadCell>
                    <Table.HeadCell className="py-4 text-left pl-4 w-1/6">
                      DELETE
                    </Table.HeadCell>
                    <Table.HeadCell className="py-4 text-left pl-4 w-1/6">
                      EDIT
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {userPosts.map((post) => (
                      <Table.Row
                        key={post._id}
                        className="relative bg-white dark:border-gray-700 dark:bg-gray-800 py-4"
                      >
                        <Table.Cell className="py-4 w-1/6">
                          {new Date(post.updatedAt).toLocaleDateString()}
                        </Table.Cell>
                        <Table.Cell className="py-4 w-1/6">
                          <Link to={`/post/${post.slug}`}>
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-20 h-12 object-cover bg-gray-500"
                            />
                          </Link>
                        </Table.Cell>
                        <Table.Cell className="py-4 w-1/6 text-center">
                          <Link
                            className="font-medium text-gray-900 dark:text-white"
                            to={`/post/${post.slug}`}
                          >
                            {post.title}
                          </Link>
                        </Table.Cell>
                        <Table.Cell className="py-4 w-1/6">
                          {Array.isArray(post.category) ? post.category.join(', ') : post.category}
                        </Table.Cell>
                        <Table.Cell className="py-4 w-1/6 text-center">
                          {post.status === 'Approved' ? (
                            <span className="text-green-500">Approved</span>
                          ) : post.status === 'Rejected' ? (
                            <span className="text-red-500">Rejected</span>
                          ) : (
                            <span className="text-yellow-500">Pending</span>
                          )}
                          {currentUser.isAdmin && post.status === 'Pending' && (
                            <div className="flex gap-2 mt-2 justify-center">
                              <Button
                                size="xs"
                                color="success"
                                onClick={() => handleApprovePost(post._id)}
                              >
                                Approve
                              </Button>
                              <Button
                                size="xs"
                                color="failure"
                                onClick={() => handleDenyPost(post._id)}
                              >
                                Deny
                              </Button>
                            </div>
                          )}
                        </Table.Cell>
                        <Table.Cell className="py-4 w-1/6">
                          <span
                            onClick={() => {
                              setShowModal(true);
                              setPostIdToDelete(post._id);
                            }}
                            className="font-medium text-red-500 hover:underline cursor-pointer"
                          >
                            Delete
                          </span>
                        </Table.Cell>
                        <Table.Cell className="py-4 w-1/6">
                          <Link
                            className="text-teal-500 hover:underline"
                            to={`/update-post/${post._id}`}
                          >
                            <span>Edit</span>
                          </Link>
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
          <p>{currentUser.isAdmin ? 'No posts available' : 'You have no posts yet!'}</p>
        )}

        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          popup
          size="md"
          className="flex items-center justify-center min-h-screen"
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                Are you sure you want to delete your post?
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