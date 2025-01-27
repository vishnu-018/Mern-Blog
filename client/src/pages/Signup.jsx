import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

export default function Signup() {
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
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <div>
                <Label value="Your username" className="mb-2" />
                <TextInput
                  type="text"
                  placeholder="Username"
                  id="username"
                  className="w-3/4 h-10 text-base p-2"
                />
              </div>
              <div>
                <Label value="Your email" className="mb-2" />
                <TextInput
                  type="text"
                  placeholder="Email"
                  id="email"
                  className="w-3/4 h-10 text-base p-2"
                />
              </div>
              <div>
                <Label value="Your password" className="mb-2" />
                <TextInput
                  type="password"
                  placeholder="Password"
                  id="password"
                  className="w-3/4 h-10 text-base p-2"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-pink-500/50 transition duration-300"
            >
              Sign Up
            </Button>
          </form>
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
