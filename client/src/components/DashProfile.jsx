import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateStart, updateSuccess, updateFailure } from '../redux/user/userSlice';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(localStorage.getItem("profilePicture") || currentUser.profilePicture);
  const filePickerRef = useRef();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setError("File size must be less than 20MB");
      return;
    }

    setImageFile(null);
    setImageFileUrl(null);
    setUploading(true);
    setProgress(10);

    setImageFile(file);
    setImageFileUploading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Image = reader.result;
      localStorage.setItem("profilePicture", base64Image);
      setImageFileUrl(base64Image);
      setFormData({ ...formData, profilePicture: base64Image });

      let progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setUploading(false);
            setImageFileUploading(false);
            return 100;
          }
          return prev + 20;
        });
      }, 300);
    };
  };

  useEffect(() => {
    const savedProfilePic = localStorage.getItem("profilePicture");
    if (savedProfilePic) {
      setImageFileUrl(savedProfilePic);
      setFormData((prevData) => ({ ...prevData, profilePicture: savedProfilePic }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to upload');
      return;
    }

    try {
      dispatch(updateStart());
      setLoading(true);
      setProgress(30);

      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      if (imageFile) {
        formDataToSend.append("profilePictureFile", imageFile);
      }

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`,
        },
        credentials: 'include',
        body: formDataToSend,
      });

      setProgress(70);
      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
      setProgress(100);
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>

      {error && <Alert color="failure">{error}</Alert>}
      {updateUserError && <Alert color='failure' className='mt-5'>{updateUserError}</Alert>}
      {updateUserSuccess && <Alert color='success' className='mt-5'>{updateUserSuccess}</Alert>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />

        {/* Profile Image with Circular Progress Overlay */}
        <div className="relative w-32 h-32 self-center cursor-pointer" onClick={() => filePickerRef.current.click()}>
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <CircularProgressbar
                value={progress}
                styles={buildStyles({
                  pathColor: "#3B82F6",
                  trailColor: "#D1D5DB",
                  strokeLinecap: "round",
                })}
              />
            </div>
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="Profile"
            className="absolute top-0 left-0 w-full h-full rounded-full object-cover border-4 border-gray-300"
          />
        </div>

        <TextInput type="text" id="username" placeholder="username" defaultValue={currentUser.username} onChange={handleChange} />
        <TextInput type="email" id="email" placeholder="email" defaultValue={currentUser.email} onChange={handleChange} />
        <TextInput type="password" id="password" placeholder="password" onChange={handleChange} />

        <Button type="submit" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-1 rounded-lg outline" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </Button>
      </form>

      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
