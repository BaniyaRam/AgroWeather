import { useState, useRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const emailRef = useRef();
  const passwordRef = useRef();
  const maleRef = useRef();
  const femaleRef = useRef();
  const provinceRef = useRef();
  const districtRef = useRef();
  const registerRef = useRef();

  const districts = {
    "Koshi Province": ["Morang", "Sunsari", "Jhapa", "Illam", "Dhankuta"],
    "Madhesh Province": ["Dhanusha", "Mahottari", "Sarlahi", "Bara", "Parsa"],
    "Bagmati Province": [
      "Kathmandu",
      "Lalitpur",
      "Bhaktapur",
      "Chitwan",
      "Makwanpur",
    ],
    "Gandaki Province": ["Kaski", "Gorkha", "Lamjung", "Tanahun", "Syangja"],
    "Lumbini Province": [
      "Rupandehi",
      "Kapilvastu",
      "Nawalparasi",
      "Dang",
      "Banke",
    ],
    "Karnali Province": ["Dailekh", "Jajarkot", "Surkhet", "Dolpa", "Mugu"],
    "Sudurpashchim Province": [
      "Kailali",
      "Kanchanpur",
      "Doti",
      "Dadeldhura",
      "Baitadi",
    ],
  };

  const handleKeyDown = (e, nextRef, currentValue) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!currentValue) {
        toast.error("Please fill this field before proceeding");
        return;
      }
      if (nextRef && nextRef.current) nextRef.current.focus();
    }
  };

  const handleSubmit = () => {
    if (!fullname || !email || !password || !gender || !province || !district) {
      toast.error("Please fill all fields");
      return;
    }
    const userData = { fullname, email, password, gender, province, district };
    localStorage.setItem("registeredUser", JSON.stringify(userData));
    toast.success("User Registered Successfully!");
    setFullname("");
    setEmail("");
    setPassword("");
    setGender("");
    setProvince("");
    setDistrict("");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-xl">
        <h1 className="mb-6 text-2xl font-bold text-center">
          Registration Form
        </h1>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, emailRef, fullname)}
            type="text"
            placeholder="Enter your Full Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            ref={emailRef}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, passwordRef, email)}
            type="text"
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <div className="relative">
            <input
              ref={passwordRef}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, maleRef, password)}
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

        <div className="mb-4">
          <label className="block mb-1 font-medium">Gender</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                ref={maleRef}
                type="radio"
                name="gender"
                value="male"
                checked={gender === "male"}
                onChange={(e) => setGender(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, femaleRef, gender)}
              />
              <span>Male</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                ref={femaleRef}
                type="radio"
                name="gender"
                value="female"
                checked={gender === "female"}
                onChange={(e) => setGender(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, provinceRef, gender)}
              />
              <span>Female</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Province</label>
          <select
            ref={provinceRef}
            value={province}
            onChange={(e) => {
              setProvince(e.target.value);
              setDistrict("");
            }}
            onKeyDown={(e) => handleKeyDown(e, districtRef, province)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Province</option>
            {Object.keys(districts).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {province && (
            <div className="mt-4">
              <label className="block mb-1 font-medium">District</label>
              <select
                ref={districtRef}
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, registerRef, district)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select District</option>
                {districts[province].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button
          ref={registerRef}
          onClick={handleSubmit}
          className="w-full py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Register
        </button>
      </div>
    </div>
  );
}
