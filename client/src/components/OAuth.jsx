import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
export default function OAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: resultsFromGoogle.user.displayName,
            email: resultsFromGoogle.user.email,
            googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
    })
    const data = await res.json()
    if (res.ok){
        dispatch(signInSuccess(data))
        navigate('/home')
    }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <Button
    type="button"
    className="relative font-semibold px-0.5 py-0.5 rounded-lg flex items-center border-1 border-transparent transition-all duration-300
    before:absolute before:inset-0 before:bg-gradient-to-r before:from-pink-500 before:to-orange-500 before:-z-10 before:rounded-lg
    after:absolute after:inset-[2px] after:bg-white dark:after:bg-gray-900 after:-z-[9] after:rounded-lg
    hover:text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500"
    onClick={handleGoogleClick}
  >
    <AiFillGoogleCircle className="w-6 h-6 mr-2 text-pink-500 dark:text-orange-400" />
    <span className="text-black dark:text-white">Continue with Google</span>
  </Button>
  
  
  );
}
