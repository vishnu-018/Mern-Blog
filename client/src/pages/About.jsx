export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-3xl font-semibold text-center my-7'>
            About Inspire Blog
          </h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>
              Welcome to <strong>Inspire Blog</strong>! This platform was created to share
              insights, ideas, and knowledge with a vibrant community of readers.
              Our mission is to inspire, educate, and connect people through engaging 
              articles and valuable content.
            </p>

            <p>
              At <strong>Inspire Blog</strong>, we publish weekly articles and tutorials 
              on a wide range of topics, including web development, software engineering, 
              project management, and personal growth. Whether you are a tech enthusiast, 
              a developer, or someone looking for inspiration, you will find something valuable here.
            </p>

            <p>
              We encourage our readers to share their thoughts, participate in discussions, 
              and connect with others. You can like and reply to comments, fostering a 
              supportive and insightful community. Our goal is to create a space where 
              knowledge is shared freely, and everyone feels motivated to learn and grow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
