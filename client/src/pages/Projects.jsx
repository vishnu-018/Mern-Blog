import CallToAction from '../components/CallToAction';

export default function Projects() {
  return (
    <div className='min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3'>
      <h1 className='text-3xl font-semibold'>Projects</h1>
      <p className='text-md text-gray-500'>
        Explore our diverse range of projects that demonstrate creativity, innovation, and practical implementation of web technologies.
      </p>
      
      <div className='text-md text-gray-500 flex flex-col gap-4'>
        <p>
          💡 <strong>BookmyRoom:</strong> A hotel room booking app that allows users to search for destinations, select dates, view dynamic hotel listings, and make room reservations. The app features user authentication, admin dashboards, and a smooth user experience.
        </p>

        <p>
          📊 <strong>Expense Tracker:</strong> A budget management tool that helps users track their income and expenses, providing clear insights into their financial health with a simple and intuitive interface.
        </p>

        <p>
          💬 <strong>Real-Time Chat Application:</strong> A communication app built with React Native and Socket.io, enabling secure and efficient room-based group chats with real-time message updates.
        </p>

        <p>
          📈 <strong>Patient State Monitoring from Alcoholic EEG Signal:</strong> A machine learning project utilizing CNN for feature extraction and Random Forest for classification, aiming to analyze and monitor patient states accurately.
        </p>

        <p>
          🚀 <strong>Budget App:</strong> A simple yet effective app for managing personal finances, offering features like budget setting, expense recording, and data persistence through local storage.
        </p>
      </div>

      <CallToAction />
    </div>
  );
}
