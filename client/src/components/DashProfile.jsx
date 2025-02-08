import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateStart, updateSuccess, updateFailure,deleteUserFailure,deleteUserStart,deleteUserSuccess } from '../redux/user/userSlice';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
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
  const [showModal, setShowModal] = useState(false);
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

        // Persist changes in localStorage
        localStorage.setItem("profilePicture", data.profilePicture);
        setImageFileUrl(data.profilePicture);
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




  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };





  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>

      <div className="w-full flex flex-col items-center">
        {error && <Alert color="failure" className="w-full text-center">{error}</Alert>}
       
      </div>

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

        <TextInput type="text" id="username" placeholder="Username" defaultValue={currentUser.username} onChange={handleChange} />
        <TextInput type="email" id="email" placeholder="Email" defaultValue={currentUser.email} onChange={handleChange} />
        <TextInput type="password" id="password" placeholder="New Password" onChange={handleChange} />

        <Button type="submit" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-1 rounded-lg outline" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </Button>
      </form>

      <div className="text-red-500 flex justify-between mt-5">
      <span onClick={() => setShowModal(true)} className="cursor-pointer">
  Delete Account
</span>

        <span className="cursor-pointer">Sign Out</span>
      </div>
       {updateUserError && (<Alert color='failure' className='w-full text-center mt-5'>{updateUserError}</Alert>)}
      {updateUserSuccess && (<Alert color='success' className='w-full text-center mt-5'>{updateUserSuccess}</Alert>)}
      {error && (
        <Alert color='failure' className='mt-5'>
          {error}
        </Alert>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
  <Modal.Header />
  <Modal.Body>
    <div className="text-center">
      <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
      <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
        Are you sure you want to delete your account?
      </h3>
      <div className="flex justify-center gap-4">
        <Button 
          className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600" 
          onClick={handleDeleteUser}
        >
          Yes, I am sure
        </Button>
        <Button 
          className="bg-gray-300 text-gray-700 hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600" 
          onClick={() => setShowModal(false)}
        >
          No, cancel
        </Button>
      </div>
    </div>
  </Modal.Body>
</Modal>

    </div>
  );
}
