import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function Signup() {
  const [formData, setformData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();
  const handleChange = (e) => {
    setformData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all the fields');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.error);
      }
      setLoading(false);
      if(res.ok)
      {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage("An error occurred during signup.");
      console.error("Error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Inspire
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is a demo project. You can sign up with your email and password
            or with Google.
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div>
                <Label value="Your username" className="mb-2" />
                <TextInput
                  type="text"
                  placeholder="Username"
                  id="username"
                  className="w-3/4 h-10 text-base p-2"
                  onChange={handleChange}
                />
              </div>
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
                  placeholder="Password"
                  id="password"
                  className="w-3/4 h-10 text-base p-2"
                  onChange={handleChange}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-pink-500/50 transition duration-300"
           disabled={loading} >
              {
  loading ? (
    <>

      <Spinner size="sm" />
      <span className="pl-3">Loading...</span>
    </>
  ) : 'Sign Up'
}

            </Button>
            <OAuth/>
          </form>
          {/* Corrected error message rendering */}
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>

  );
}
