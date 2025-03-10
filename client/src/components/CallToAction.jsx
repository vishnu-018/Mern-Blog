

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
        <div className="flex-1 justify-center flex flex-col">
            <h2 className='text-2xl'>
            Showcase Student Success!
            </h2>
            <p className='text-gray-500 my-2'>
            Explore and share the remarkable achievements of our college students on our dedicated platform.
            </p>
        </div>
        <div className="p-1 flex-1">
            <img src="https://www.bitsathy.ac.in/wp-content/themes/baiotsathycollege/assets/images/header%2006.png" className="w-full max-w-2xl"/>
        </div>
    </div>
  )
}