import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.info("Creating your account...", { autoClose: 1000 });

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success("Account created successfully! Redirecting to login...", {
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage: `url('/images/todo3.jpg')`, // 📸 Put your image inside public/images/bg.jpg
      }}
    >
      <div className="backdrop-blur-md bg-white/30 max-w-md w-full rounded-3xl shadow-2xl p-10 border border-white/40">
        <h2 className="text-4xl font-bold text-center text-gray-800 drop-shadow-md mb-8">
          Create Your Account
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm shadow">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-5">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-md"
          >
            Register
          </button>
        </form>

        <p className="mt-10 text-center text-black font-medium text-lg drop-shadow">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-black hover:text-blue-500 underline transition"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
