import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.info("Logging in...", { autoClose: 1000 });
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/login`,
        formData
      );
      localStorage.setItem("token", response.data.token);
      toast.success("Successfully logged in!");
      navigate("/todos");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/images/todo4.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/30 backdrop-blur-md shadow-2xl rounded-3xl p-10 border border-white/20">
        <h2 className="text-4xl font-extrabold text-center text-white drop-shadow mb-10">
          Please log in to begin creating your list✨
        </h2>

        {error && (
          <div className="mb-5 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-pink-300 focus:outline-none transition-all duration-300"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-purple-300 focus:outline-none transition-all duration-300"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Login
          </button>
        </form>

        <p className="mt-8 text-center text-white/90">
          Don&apos;t have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-white font-semibold underline underline-offset-2 hover:text-blue-500 transition"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
