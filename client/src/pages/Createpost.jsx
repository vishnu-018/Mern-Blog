import { Alert, Button, FileInput, TextInput, Checkbox, Label } from "flowbite-react";
import { useRef, useState } from "react";
import 'react-quill/dist/quill.snow.css';
import axios from 'axios'; 
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import ReactQuill from "react-quill";

export default function CreatePost() {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [videoUploadProgress, setVideoUploadProgress] = useState(null);
    const [videoUploadError, setVideoUploadError] = useState(null);
    const [formData, setFormData] = useState({ categories: [], year: "", title: "", content: "" });
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
        console.log("File to upload:", file); // Debugging: Log the file
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
            console.log("Upload response:", response.data); // Debugging: Log the response
            setImageUploadProgress(100);
            setFormData({ ...formData, image: response.data.url });
            console.log("Updated formData:", formData); // Debugging: Log the updated formData
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            setImageUploadError('Image upload failed');
            setImageUploadProgress(null);
        }
    };

    const handleUploadVideo = async () => {
        if (!videoFile) {
            setVideoUploadError('Please select a video');
            return;
        }
        setVideoUploadError(null);
        setVideoUploadProgress(0);
        const formDataCloud = new FormData();
        formDataCloud.append('file', videoFile);

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
                        setVideoUploadProgress(progress);
                    },
                }
            );
            setVideoUploadProgress(100);
            setFormData({ ...formData, video: response.data.url });
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            setVideoUploadError('Video upload failed');
            setVideoUploadProgress(null);
        }
    };

    const handleCheckboxChange = (category) => {
        setFormData((prevData) => {
            const updatedCategories = prevData.categories.includes(category)
                ? prevData.categories.filter((c) => c !== category)
                : [...prevData.categories, category];
                console.log("Updated Categories:", updatedCategories);
            return { ...prevData, categories: updatedCategories };
        });
    };

    const handleSubmit = async (e) => {
        console.log("Submitting Form Data:", formData);
        e.preventDefault();
        try {
            const res = await fetch('/api/post/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, categories: [...formData.categories] }), // Ensure array format
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
                <TextInput
                    type='text'
                    placeholder='Title'
                    required
                    id='title'
                    className='flex-1'
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />

                {/* Multiple Category Selection */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                        "Project Innovations",
                        "Certifications",
                        "Academic Excellence",
                        "Competitions",
                        "Product Development",
                        "Patent",
                        "Paper Presentation"
                    ].map((category) => (
                        <Label key={category} className="flex items-center space-x-2">
                            <Checkbox
                                checked={formData.categories.includes(category)}
                                onChange={() => handleCheckboxChange(category)}
                            />
                            <span>{category}</span>
                        </Label>
                    ))}
                </div>

                {/* Year Selection */}
                <select
                    className="p-2 border rounded-md"
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                </select>

                {/* Image Upload */}
                <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                <FileInput 
    type="file" 
    accept="image/*" 
    onChange={(e) => {
        console.log("Selected file:", e.target.files[0]); // Debugging: Log the selected file
        setFile(e.target.files[0]);
    }} 
/>
                    <Button
                        type="button"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-lg border-none hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                        onClick={handleUploadImage}
                        disabled={imageUploadProgress !== null && imageUploadProgress < 100}
                    >
                        {imageUploadProgress && imageUploadProgress < 100 ? (
                            <div className='w-16 h-16'>
                                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                            </div>
                        ) : (
                            'Upload Image'
                        )}
                    </Button>
                </div>

                {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
                {formData.image && (
                    <img src={formData.image} alt='upload' className='w-full h-72 object-cover' />
                )}

                {/* Video Upload */}
                <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                    <FileInput type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
                    <Button
                        type="button"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-lg border-none hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                        onClick={handleUploadVideo}
                        disabled={videoUploadProgress !== null && videoUploadProgress < 100}
                    >
                        {videoUploadProgress && videoUploadProgress < 100 ? (
                            <div className='w-16 h-16'>
                                <CircularProgressbar value={videoUploadProgress} text={`${videoUploadProgress || 0}%`} />
                            </div>
                        ) : (
                            'Upload Video'
                        )}
                    </Button>
                </div>

                {videoUploadError && <Alert color='failure'>{videoUploadError}</Alert>}
                {formData.video && (
                    <video controls className='w-full h-72 object-cover'>
                        <source src={formData.video} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
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
                {publishError && <Alert className='mt-5' color='failure'>{publishError}</Alert>}
            </form>
        </div>
    );
}