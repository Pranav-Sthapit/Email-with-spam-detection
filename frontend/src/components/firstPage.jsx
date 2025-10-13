import { useState } from "react";
import Login from "./login";
import Register from "./register";

export default function SignInUp() {
  const [register, setRegister] = useState(false);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-white">
      {/* Two static halves with forms */}
      <div className="flex h-full w-full">
        {/* Left: Login */}
        <div className="w-1/2 flex items-center justify-center bg-gray-50">
          <div className={`w-full max-w-md px-8 transition-opacity duration-300 ${register ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <Login />
          </div>
        </div>

        {/* Right: Register */}
        <div className="w-1/2 flex items-center justify-center bg-gray-100">
          <div className={`w-full max-w-md px-8 transition-opacity duration-300 ${register ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <Register />
          </div>
        </div>
      </div>

      {/* Sliding overlay panel (width = 50%); starts on the right half */}
      <div
        className={`font-aldrich text-lg absolute top-0 left-1/2 h-full w-1/2 transform transition-transform duration-700 ease-in-out z-20 ${register ? '-translate-x-full' : 'translate-x-0'}`}
      >
        <div className="h-full flex flex-col items-center justify-center bg-secondary text-white px-8">
          <h2 className="text-2xl font-bold mb-2">{register ? 'Welcome Back!' : 'Hello, Friend!'}</h2>
          <p className="mb-6 max-w-sm text-center">
            {register ? 'Sign in to continue to your account.' : 'Create an account to get started.'}
          </p>

          <button
            onClick={() => setRegister((s) => !s)}
            className="px-6 py-3 bg-white text-secondary font-aldrich font-semibold rounded-lg shadow-md"
          >
            {register ? 'Go To Login' : 'Go To Register'}
          </button>
        </div>
      </div>
    </div>
  );
}
