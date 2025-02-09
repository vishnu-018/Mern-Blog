import { Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function Createpost() {
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
      <form className='flex flex-col gap-4' >
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            
          />
          <Select
            
          >
            <option value='uncategorized'>Select a category</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>React.js</option>
            <option value='nextjs'>Next.js</option>
          </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
          
          />
    <Button
  type="button"
  className="relative py-2 px-6 font-semibold rounded-full border-2 border-transparent text-transparent bg-clip-text 
             bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] 
             dark:from-[#7C3AED] dark:to-[#2563EB] 
             before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r 
             before:from-[#8B5CF6] before:to-[#3B82F6] 
             dark:before:from-[#7C3AED] dark:before:to-[#2563EB] 
             before:-z-10 before:border-2 before:border-transparent
            border-[#8B5CF6] hover:border-b-[#3B82F6] hover:bg-transparent"
>
  Upload Image
</Button>



          </div>
          <ReactQuill theme="snow"  placeholder='Write something...' className='h-72 mb-12' required/>
          <Button type='submit' gradientDuoTone='purpleToPink'>
          Publish
        </Button>
        </form>
      </div>
  )
}
