import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInSuccess, signInStart, signInFailure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setformData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill out all the fields"));
    }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/home"); // Redirect to /home after successful sign-in
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen mt-32"> {/* Adjusted margin-top to mt-28 */}
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1 flex flex-col items-center md:items-start">
          {/* College Logo */}
          <img
            src="https://bip.bitsathy.ac.in/images/login-logo-light-mode.png"
            alt="Bannari Amman Institute of Technology Logo"
            className="w-40 h-40 mb-4" // Increased size to 160px
          />
          {/* BIT Blog Text */}
          <Link className="font-bold dark:text-white text-3xl"> {/* Reduced text size */}
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-md text-white ml-5">
              BIT
            </span>
            {" "}
            Blog
          </Link>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div>
                <Label value="Your email" className="mb-2" />
                <TextInput
                  type="email"
                  placeholder="Email"
                  id="email"
                  className="w-3/4 h-10 text-base p-2"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label value="Your password" className="mb-2" />
                <TextInput
                  type="password"
                  placeholder="**************"
                  id="password"
                  className="w-3/4 h-10 text-base p-2"
                  onChange={handleChange}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-pink-500/50 transition duration-300"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth />
          </form>
          {/* Corrected error message rendering */}
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
          <div className="flex gap-2 text-sm mt-5">
            <span>Do not have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}