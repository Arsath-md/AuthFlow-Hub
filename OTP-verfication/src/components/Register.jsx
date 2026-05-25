import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Login from "./Login";

export default function Register() {
  const navi = useNavigate();

  const [datam, setDatam] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setDatam((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    if (!datam.name || !datam.email || !datam.password) {
      toast.error("All fields are required");
      return false;
    }
    if (datam.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const sender = await fetch(`${import.meta.env.VITE_API_URL}/register`,
 {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datam),
      });

      const res = await sender.json();

      if (res?.msg) {
        toast.success(res.msg);
      } else {
        toast.success("Registered successfully");
      }

      setDatam({ name: "", email: "", password: "" });

      setTimeout(() => {
        navi(`/wait/${datam.email}`);
      }, 800);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 px-4">
      <ToastContainer position="top-center" />

      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Create Account
        </h1>
        <p className="text-center text-gray-500 mt-2 mb-6">
          Join us and get started
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={datam.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="email"
            name="email"
            value={datam.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            name="password"
            value={datam.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition duration-300 ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-gray-400 text-sm">OR</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        <Login />
      </div>
    </div>
  );
}