import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    sportsPreferences: "",
    achievements: "",
  });

  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const { data } = await axios.get("http://localhost:3000/users/profile/getProfile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = data.user;

        setFormData({
          name: user.name || "",
          email: user.email || "",
          sportsPreferences: user.sportsPreferences?.join(", ") || "",
          achievements: user.achievements?.join(", ") || "",
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    const updatedData = {
      ...formData,
      sportsPreferences: formData.sportsPreferences.split(",").map((item) => item.trim()),
      achievements: formData.achievements.split(",").map((item) => item.trim()),
    };

    try {
      await axios.put(
        "http://localhost:3000/users/profile/updateProfile",
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMsg("Profile updated successfully!");
      setError("");
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update profile.");
      setSuccessMsg("");
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading profile...</p>;

  return (
    <div className="max-w-xl mx-auto mt-12 px-6 py-8 bg-white shadow-xl rounded-2xl border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Edit Profile</h2>

      {successMsg && <p className="text-green-600 text-center mb-4 font-medium">{successMsg}</p>}
      {error && <p className="text-red-600 text-center mb-4 font-medium">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Sports Preferences <span className="text-xs text-gray-500">(comma-separated)</span>
          </label>
          <input
            type="text"
            name="sportsPreferences"
            value={formData.sportsPreferences}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Achievements <span className="text-xs text-gray-500">(comma-separated)</span>
          </label>
          <input
            type="text"
            name="achievements"
            value={formData.achievements}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
