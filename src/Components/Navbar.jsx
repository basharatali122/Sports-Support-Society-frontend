import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option) => {
    setIsDropdownOpen(false);
    switch (option) {
      case "edit":
        navigate("/edit-profile");
        break;
      case "view":
        navigate("/view-profile");
        break;
      case "logout":
        console.log("Logging out...");
        break;
      default:
        break;
    }
  };
  const handleLogout = async () => {
  try {
    const response = await fetch("http://localhost:3000/auth/logout", {
      method: "GET",
      credentials: "include", // send cookies if you're using them (JWT/cookies)
    });

    if (response.ok) {
      console.log("Logout successful");
      // Optional: Clear local storage, auth context, or any tokens
      // localStorage.removeItem("token");
      // Redirect to login or homepage
      navigate("/login");
    } else {
      console.error("Logout failed");
    }
  } catch (error) {
    console.error("An error occurred during logout:", error);
  }
};


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left side - Logo/Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <svg
                className="h-8 w-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              <span className="ml-2 text-xl font-bold text-blue-600">
                <Link to="/">VU Sports Support Society</Link>
              </span>
            </div>
          </div>

          {/* Right side - Auth buttons and Profile */}
          <div className="flex items-center space-x-4">
            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center space-x-4 mr-2">
              <a
                href="/login"
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                Sign in
              </a>
              <a
                href="/register"
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign up
              </a>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <img
                src="/profile.jpg" // Replace with user profile image path
                alt="Profile"
                className="h-10 w-10 rounded-full cursor-pointer border border-gray-300"
                onClick={handleProfileClick}
              />
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <button
                    onClick={() => handleOptionClick("view")}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => handleOptionClick("edit")}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => handleLogout("logout")}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
