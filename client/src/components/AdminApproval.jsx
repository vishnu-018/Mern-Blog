import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Button } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function AdminApproval() {
  const { currentUser } = useSelector((state) => state.user);
  const [pendingPosts, setPendingPosts] = useState([]);

  useEffect(() => {
    const fetchPendingPosts = async () => {
      try {
        const res = await fetch('/api/post/getpendingposts');
        const data = await res.json();
        if (res.ok) {
          setPendingPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser?.isAdmin) {
      fetchPendingPosts();
    }
  }, [currentUser]);

  const handleApprove = async (postId) => {
    try {
      const res = await fetch(`/api/post/approve/${postId}`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (res.ok) {
        setPendingPosts((prev) => prev.filter((post) => post._id !== postId));
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeny = async (postId) => {
    try {
      const res = await fetch(`/api/post/deny/${postId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setPendingPosts((prev) => prev.filter((post) => post._id !== postId));
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full p-4">
      <h2 className="text-2xl font-semibold text-center mb-4">Admin Approval Panel</h2>
      {pendingPosts.length > 0 ? (
        <Table hoverable className="shadow-md w-full">
          <Table.Head className="bg-gray-200 dark:bg-gray-900">
            <Table.HeadCell>Username</Table.HeadCell>
            <Table.HeadCell>Post Title</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Approval</Table.HeadCell>
            <Table.HeadCell>Denial</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {pendingPosts.map((post) => (
              <Table.Row key={post._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{post.username}</Table.Cell>
                <Table.Cell>{post.title}</Table.Cell>
                <Table.Cell>{new Date(post.createdAt).toLocaleDateString()}</Table.Cell>
                <Table.Cell>{post.category}</Table.Cell>
                <Table.Cell>
                  <Button className="bg-green-500 text-white flex items-center gap-2" onClick={() => handleApprove(post._id)}>
                    <HiOutlineExclamationCircle className="w-5 h-5" /> Approve
                  </Button>
                </Table.Cell>
                <Table.Cell>
                  <Button className="bg-red-500 text-white" onClick={() => handleDeny(post._id)}>
                    Deny
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <p className="text-center text-gray-500">No pending posts for approval.</p>
      )}
    </div>
  );
}
