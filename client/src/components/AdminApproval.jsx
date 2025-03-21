import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Modal, Table, Textarea } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function AdminApproval() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]); // Posts created by users (non-admins)
  const [showMore, setShowMore] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [postIdToReject, setPostIdToReject] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // Fetch posts created by users (non-admins)
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

  // Handle "Show More" button
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

  // Handle post approval
  const handleApprovePost = async (postId) => {
    try {
      const res = await fetch(`/api/post/approvePost/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok) {
        // Update the post status to "Approved"
        setUserPosts((prev) =>
          prev.map((post) =>
            post._id === postId ? { ...post, status: 'Approved', rejectionReason: '' } : post
          )
        );
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Handle post rejection with a reason
  const handleRejectPost = async () => {
    setShowRejectModal(false);
    try {
      const res = await fetch(`/api/post/denyPost/${postIdToReject}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rejectionReason }),
      });
      const data = await res.json();
      if (res.ok) {
        // Update the post status to "Rejected" and store the rejection reason
        setUserPosts((prev) =>
          prev.map((post) =>
            post._id === postIdToReject
              ? { ...post, status: 'Rejected', rejectionReason }
              : post
          )
        );
        setRejectionReason(''); // Clear the rejection reason
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
                <Table.HeadCell className="py-4 text-center">REJECT</Table.HeadCell>
                <Table.HeadCell className="py-4 text-center">REJECTION REASON</Table.HeadCell>
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
                        className={`${
                          post.status === 'Approved'
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-blue-500 hover:bg-blue-600'
                        } text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105`}
                        onClick={() => handleApprovePost(post._id)}
                      >
                        {post.status === 'Approved' ? 'Approved' : 'Approve'}
                      </Button>
                    </Table.Cell>
                    <Table.Cell className="py-4 text-center">
                      <Button
                        className={`${
                          post.status === 'Rejected'
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-blue-500 hover:bg-blue-600'
                        } text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105`}
                        onClick={() => {
                          setPostIdToReject(post._id);
                          setShowRejectModal(true);
                        }}
                      >
                        {post.status === 'Rejected' ? 'Rejected' : 'Reject'}
                      </Button>
                    </Table.Cell>
                    <Table.Cell className="py-4 text-center">
                      {post.rejectionReason || 'N/A'}
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

        {/* Reject Modal */}
        <Modal show={showRejectModal} onClose={() => setShowRejectModal(false)} popup size="md">
  <Modal.Header className="border-b border-gray-200 dark:border-gray-700 p-4">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
      Reject Post
    </h3>
  </Modal.Header>
  <Modal.Body className="p-6">
    <div className="text-center">
      <HiOutlineExclamationCircle className="h-16 w-16 text-gray-400 dark:text-gray-200 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Enter the reason for rejection:
      </h3>
      <Textarea
        value={rejectionReason}
        onChange={(e) => setRejectionReason(e.target.value)}
        placeholder="Reason for rejection..."
        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
        rows={4}
      />
    </div>
  </Modal.Body>
  <Modal.Footer className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
    <Button
      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
      onClick={handleRejectPost}
    >
      Reject
    </Button>
    <Button
      className="bg-gray-300 hover:bg-gray-400 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
      onClick={() => setShowRejectModal(false)}
    >
      Cancel
    </Button>
  </Modal.Footer>
</Modal>
      </div>
    </div>
  );
}