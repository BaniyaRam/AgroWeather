import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    const savedUsers =
      JSON.parse(localStorage.getItem("registeredUsers")) || [];
    if (savedUsers.length === 0) {
      toast.error("No registered user found. Please register first.");
      return;
    }

    const user = savedUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      toast.success("Login Successful!");
      navigate("/dashboard");
    } else {
      toast.error("Invalid email or password");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-xl">
        <h1 className="mb-6 text-2xl font-bold text-center">Login Form</h1>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              className="absolute text-gray-600 cursor-pointer right-3 top-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Login
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/")}
              className="font-semibold text-blue-600 cursor-pointer hover:underline"
            >
              Create Account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
