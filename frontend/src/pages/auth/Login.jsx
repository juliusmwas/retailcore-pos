import { useState } from "react";

function Login() {
  const [tab, setTab] = useState("login"); // "login" or "signup"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        {/* Tabs */}
        <div className="flex justify-around mb-6 border-b-2">
          <button
            onClick={() => setTab("login")}
            className={`pb-2 font-semibold ${tab === "login" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
          >
            Login
          </button>
          <button
            onClick={() => setTab("signup")}
            className={`pb-2 font-semibold ${tab === "signup" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
          >
            Sign Up
          </button>
        </div>

        {/* Forms */}
        {tab === "login" ? (
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
        ) : (
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
