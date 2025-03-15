import { Alert, Button, FileInput, TextInput, Checkbox, Label } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios'; // For Cloudinary upload
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoUploadProgress, setVideoUploadProgress] = useState(null);
  const [videoUploadError, setVideoUploadError] = useState(null);
  const [formData, setFormData] = useState({ categories: [], year: "", title: "", content: "", image: "", video: "" });
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();

        console.log("Full API Response:", data); // ✅ Check the entire response

        if (!res.ok) {
          console.log("Error:", data.message);
          setPublishError(data.message);
          return;
        }
        setPublishError(null);

        // Ensure the post exists and has categories
        if (data.posts && data.posts.length > 0) {
          console.log("Fetched Post:", data.posts[0]); // ✅ Log the post data
          console.log("Fetched Categories:", data.posts[0].categories); // ✅ Log categories separately

          setFormData({
            _id: data.posts[0]._id,
            title: data.posts[0].title || "",
            year: data.posts[0].year || "",
            content: data.posts[0].content || "",
            image: data.posts[0].image || "",
            video: data.posts[0].video || "", // Add video field
            categories: data.posts[0].category || [], // ✅ Check if this is null/undefined
          });
        } else {
          console.log("No post found for given ID.");
        }
      } catch (error) {
        console.log("Fetch error:", error.message);
      }
    };

    fetchPost();
  }, [postId]);

  // Use Cloudinary for image upload via backend
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
        '/api/upload',
        formDataCloud,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setImageUploadProgress(progress);
          }
        }
      );
      setImageUploadProgress(100);
      setFormData(prev => ({ ...prev, image: response.data.url }));
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
    }
  };

  // Use Cloudinary for video upload via backend
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
        '/api/upload',
        formDataCloud,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setVideoUploadProgress(progress);
          }
        }
      );
      setVideoUploadProgress(100);
      setFormData(prev => ({ ...prev, video: response.data.url }));
      console.log("Video URL from Cloudinary:", response.data.url); // Debugging
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      setVideoUploadError('Video upload failed');
      setVideoUploadProgress(null);
    }
  };
  {formData.video && (
    <video controls className='w-full h-72 object-cover'>
      <source src={formData.video} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )}
  
  const handleCheckboxChange = (category) => {
    setFormData((prevData) => {
      const updatedCategories = prevData.categories.includes(category)
        ? prevData.categories.filter((c) => c !== category) // Remove if already selected
        : [...prevData.categories, category]; // Add if not selected

      return { ...prevData, categories: updatedCategories };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData._id) {
      setPublishError("Post ID is missing. Try refreshing the page.");
      return;
    }
    try {
      const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
        method: 'PUT',
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
    } catch (error) {
      console.error("Update post error:", error);
      setPublishError('Something went wrong');
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Update post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder='Title'
          required
          id='title'
          className='flex-1'
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          value={formData.title || ''}
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
                checked={formData.categories.includes(category)} // Check if category is selected
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
          value={formData.year || ''}
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
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            onClick={handleUploadImage}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-lg border-none hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
          >
            {imageUploadProgress ? (
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

        {/* Video Upload */}
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
          />
          <Button
            type="button"
            onClick={handleUploadVideo}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-lg border-none hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
          >
            {videoUploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={videoUploadProgress}
                  text={`${videoUploadProgress || 0}%`}
                />
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
          value={formData.content || ''}
          placeholder='Write something...'
          className='h-72 mb-12'
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />

        <Button type='submit' gradientDuoTone='purpleToPink'>Update post</Button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}