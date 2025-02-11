import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table } from 'flowbite-react';

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [ setShowMore] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
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

    if (currentUser?.isAdmin) {
      fetchPosts();
    }
  }, [currentUser?._id]);

  return (
    <div className="max-h-[500px] overflow-y-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-gray-500">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <Table hoverable className="shadow-md w-full">
        <Table.Head className="relative bg-gray-200 dark:bg-gray-900">

            <Table.HeadCell>DATE UPDATED</Table.HeadCell>
            <Table.HeadCell>POST IMAGE</Table.HeadCell>
            <Table.HeadCell>POST TITLE</Table.HeadCell>
            <Table.HeadCell>CATEGORY</Table.HeadCell>
            <Table.HeadCell>DELETE</Table.HeadCell>
            <Table.HeadCell>
              <span>Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {userPosts.map((post) => (
             <Table.Row key={post._id} className="relative bg-white dark:border-gray-700 dark:bg-gray-800">

                <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                <Table.Cell>
                  <Link to={`/post/${post.slug}`}>
                    <img src={post.image} alt={post.title} className="w-20 h-10 object-cover bg-gray-500" />
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Link className="font-medium text-gray-900 dark:text-white" to={`/post/${post.slug}`}>
                    {post.title}
                  </Link>
                </Table.Cell>
                <Table.Cell>{post.category}</Table.Cell>
                <Table.Cell>
                  <span className="font-medium text-red-500 hover:underline cursor-pointer">Delete</span>
                </Table.Cell>
                <Table.Cell>
                  <Link className="text-teal-500 hover:underline" to={`/update-post/${post._id}`}>
                    <span>Edit</span>
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <p>You have no posts yet!</p>
      )}
    </div>
  );
}
