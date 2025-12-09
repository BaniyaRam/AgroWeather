import { useEffect, useState } from "react";
import { HiMenu, HiX, HiUser, HiLogout } from "react-icons/hi";
import { Navigate, useNavigate } from "react-router-dom";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [user, setUser] = useState({ fullname: "", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("registeredUser"));
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser({ fullname: "", email: "" });
    setShowMenu(false);
    setShowProfilePanel(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 shadow-xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg">
              <span className="text-2xl">🌾</span>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">
                AgroWeather
              </h1>
              <p className="text-xs font-medium text-green-100">
                Smart Weather Insights for Farmers
              </p>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="relative items-center hidden space-x-4 md:flex">
            <button
              onClick={() => setShowProfilePanel(true)}
              className="group flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold rounded-xl border border-white/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <HiUser className="w-5 h-5 transition-transform group-hover:rotate-12" />
              <span>Profile</span>
            </button>

            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <HiLogout className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              <span>Logout</span>
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-white transition-all duration-300 border rounded-lg bg-white/20 backdrop-blur-md hover:bg-white/30 border-white/30"
            >
              {showMenu ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute z-50 top-20 right-4 left-4 md:hidden animate-slideDown">
            <div className="overflow-hidden bg-white border border-gray-200 shadow-2xl rounded-2xl">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-white rounded-full shadow-lg bg-gradient-to-br from-green-400 to-emerald-500">
                    {user.fullname.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {user.fullname}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-3.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                >
                  <HiLogout className="w-6 h-6" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Slide-out Profile Panel */}
      {showProfilePanel && (
        <>
          {/* overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowProfilePanel(false)}
          />

          {/* panel */}
          <div className="fixed top-0 right-0 z-50 h-full text-white transition-transform duration-300 transform shadow-2xl w-80 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600">
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <h2 className="text-xl font-bold">Profile</h2>
              <button
                onClick={() => setShowProfilePanel(false)}
                className="text-2xl font-bold text-white"
              >
                &times;
              </button>
            </div>

            <div className="flex flex-col items-center gap-4 mt-10">
              <div className="flex items-center justify-center w-24 h-24 text-3xl font-bold text-green-600 bg-white rounded-full">
                {user.fullname.charAt(0).toUpperCase()}
              </div>
              <p className="text-xl font-bold">{user.fullname}</p>
              <p className="text-sm text-green-100">{user.email}</p>
            </div>

            {/* Additional user details (optional) */}
            <div className="flex flex-col gap-4 px-6 mt-10 text-white">
              {/* <div>
                <span className="font-semibold"></span> {user.fullname}
              </div> */}
              {/* Add more fields if needed */}
            </div>

            <div className="p-6 mt-auto">
              <button
                onClick={handleLogout}
                className="w-full py-4 font-semibold text-white transition-all duration-300 bg-red-500 hover:bg-red-600 rounded-xl"
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
