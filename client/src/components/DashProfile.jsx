import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase"; 
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const filePickerRef = useRef();

  const HandleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));  // Temporary preview
    }
  };

  const uploadImage = useCallback(async () => {
    if (!imageFile) return;

    setImageFileUploadProgress(0); // Reset progress before new upload

    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload Progress: ${progress}%`);
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        console.error("Upload error:", error);
        setImageFileUploadError("Could not upload image (File must be less than 2MB)");
        setImageFileUploadProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          
          // Delay progress bar reset by 1 second for smooth transition
          setTimeout(() => setImageFileUploadProgress(null), 1000);
        });
      }
    );
  }, [imageFile]);

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile, uploadImage]);

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <input type="file" accept="image/*" onChange={HandleImageChange} ref={filePickerRef} hidden />
        <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>

          {/* Progress Bar (Correctly Wraps Image) */}
          {imageFileUploadProgress !== null && (
            <div className="absolute inset-0 flex items-center justify-center">
              <CircularProgressbar
                value={imageFileUploadProgress}
                text={`${imageFileUploadProgress}%`}
                strokeWidth={8}
                styles={buildStyles({
                  pathColor: `rgba(62, 152, 199, 1)`, // Solid blue color
                  textSize: "18px",
                  textColor: "#4A90E2",
                  trailColor: "#d6d6d6",
                })}
              />
            </div>
          )}

          {/* Profile Image */}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="Profile"
            className="absolute top-0 left-0 w-full h-full rounded-full object-cover border-8 border-[lightgray]"
          />
        </div>

        {imageFileUploadError && <Alert color="failure">{imageFileUploadError}</Alert>}

        <TextInput type="text" id="username" placeholder="username" defaultValue={currentUser.username} />
        <TextInput type="email" id="email" placeholder="email" defaultValue={currentUser.email} />
        <TextInput type="password" id="password" placeholder="password" />

        <Button type="submit" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-1 rounded-lg outline">
          Update
        </Button>
      </form>

      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
