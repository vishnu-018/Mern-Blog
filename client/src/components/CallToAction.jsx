import { Button } from 'flowbite-react';

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
        <div className="flex-1 justify-center flex flex-col">
            <h2 className='text-2xl'>
            Celebrate Student Achievements!
            </h2>
            <p className='text-gray-500 my-2'>
            Discover inspiring stories and accomplishments from talented students.
            </p>
            <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none'>
                <a href="https://www.100jsprojects.com" target='_blank' rel='noopener noreferrer'>
                View Student Achievements
                </a>
            </Button>
        </div>
        <div className="p-7 flex-1">
            <img src="https://media-hosting.imagekit.io//44c7cfb4875645ac/8741017.jpg?Expires=1834980266&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=oI6hMd3mPMn~O0T5DDanIl6LtmWaPmea0TKOolaBvVBfDX9xkRB4xC0ucDJByt~w~ir4wvjQdcNba2A4mlTJaxF~7rhFzxX-kRaue4xhclrA5gtExZTv45aITbp2g7ynAVcwZY93XSlbQqF2RD6gEvYDyNaLjhWEF0eF316c-WETrMk9vg-wRZcKG-g~AgV94DPHmWozJ3vgdUcGjDIYFT-lP9n2jz74LcbZnOokS35aKuc~Kva23gpJmpoeWSZXQPZNV3-vVKTHwjK4eiXYTGdKishQkd356AryOSTx5-6fW0-nWamd6G~zeXZmNuhhW5gY3~d284vSNzdePxncrA__" />
        </div>
    </div>
  )
}