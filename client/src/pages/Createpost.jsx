import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useRef, useState } from "react";
import 'react-quill/dist/quill.snow.css';
import axios from 'axios'; // Added for Cloudinary upload
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import ReactQuill from "react-quill";

export default function Createpost() {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const navigate = useNavigate();
    const quillRef = useRef(null);

    const handleUploadImage = async () => {
        if (!file) {
            setImageUploadError('Please select an image');
            return;
        }
        setImageUploadError(null);
        setImageUploadProgress(0);
        const formDataCloud = new FormData();
        formDataCloud.append('file', file);

        try {
            const response = await axios.post(
                'http://localhost:3000/api/upload',
                formDataCloud,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setImageUploadProgress(progress);
                    },
                }
            );
            setImageUploadProgress(100);
            setFormData({ ...formData, image: response.data.url });
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            setImageUploadError('Image upload failed');
            setImageUploadProgress(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/post/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
                return;
            }
            setPublishError(null);
            navigate(`/post/${data.slug}`);
        } catch {
            setPublishError('Something went wrong');
        }
    };

    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                    <TextInput
                        type='text'
                        placeholder='Title'
                        required
                        id='title'
                        className='flex-1'
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                    />
                    <Select
                        onChange={(e) =>
                            setFormData({ ...formData, category: e.target.value })
                        }
                    >
                        <option value='Uncategorized'>Select a category</option>
                        <option value='Project Innovations'>Project Innovations</option>
                        <option value='Certifications'>Certifications</option>
                        <option value='Academic Excellence'>Academic Excellence</option>
                        <option value='Competitions'>Competitions</option>
                        <option value='Product Development'>Product Development</option>
                        <option value='Patent'>Patent</option>
                        <option value='Paper Presentation'>Paper Presentation</option>
                    </Select>
                    <Select
                        onChange={(e) =>
                            setFormData({ ...formData, year: e.target.value })
                        }
                    >
                        <option value=''>Select Year</option>
                        <option value='1st Year'>1st Year</option>
                        <option value='2nd Year'>2nd Year</option>
                        <option value='3rd Year'>3rd Year</option>
                        <option value='4th Year'>4th Year</option>
                    </Select>
                </div>

                <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                    <FileInput
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                    />

                    <Button
                        type="button"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-lg border-none hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                        onClick={handleUploadImage}
                        disabled={imageUploadProgress !== null && imageUploadProgress < 100}
                    >
                        {imageUploadProgress && imageUploadProgress < 100 ? (
                            <div className='w-16 h-16'>
                                <CircularProgressbar
                                    value={imageUploadProgress}
                                    text={`${imageUploadProgress || 0}%`}
                                />
                            </div>
                        ) : (
                            'Upload Image'
                        )}
                    </Button>
                </div>

                {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
                {formData.image && (
                    <img
                        src={formData.image}
                        alt='upload'
                        className='w-full h-72 object-cover'
                    />
                )}

                <ReactQuill
                    theme="snow"
                    placeholder='Write something...'
                    className='h-72 mb-12'
                    required
                    ref={quillRef}
                    onChange={(value) => {
                        setFormData({ ...formData, content: value });
                    }}
                />

                <Button type='submit' gradientDuoTone='purpleToPink'>Publish</Button>
                {publishError && (
                    <Alert className='mt-5' color='failure'>
                        {publishError}
                    </Alert>
                )}
            </form>
        </div>
    );
}
