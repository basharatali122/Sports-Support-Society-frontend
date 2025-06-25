import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

function CreateTeams() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const [teamName, setTeamName] = useState("");
  const [sport, setSport] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [coachId, setCoachId] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/users/getAllusers");
        setAllUsers(response.data);
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.role === "coach") {
          setCoachId(user._id);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleApproval = async (userId, userType) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/users/${userId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setAllUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, approved: true, status: "approved" } : user
          )
        );
        toast.success(`${userType} approved successfully`, { position: "top-right", autoClose: 3000 });
      } else {
        throw new Error(response.data.message || "Approval failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve user", { position: "top-right" });
    }
  };

  const handleRejection = async (userId, userType) => {
    if (window.confirm(`Are you sure you want to reject this ${userType}? This will delete their account.`)) {
      try {
        await axios.delete(`http://localhost:3000/users/${userId}/reject`);
        setAllUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        toast.success(`${userType} rejected and removed from system`);
      } catch (error) {
        toast.error("Rejection failed");
      }
    }
  };




  

const handleCreateTeam = async () => {
  if (!teamName || !sport || selectedMembers.length === 0) {
    toast.error("Please fill all fields and select members");
    return;
  }

  try {
    const { data } = await axios.post(
      "http://localhost:3000/team/teams",
      {
        name: teamName,
        sport,
        members: selectedMembers,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    if (data.success) {
      toast.success(data.message || "Team created successfully");
      setTeamName("");
      setSport("");
      setSelectedMembers([]);
    } else {
      toast.error(data.message || "Failed to create team");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to create team");
  }
};






  const approvedParticipants = allUsers.filter(
    (user) => user.role === "participant" && user.status === "approved"
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-3xl mx-auto px-6 py-8"
    >
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create a New Team</h2>

        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-2">Team Name</label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter team name"
          />
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-2">Sport</label>
          <input
            type="text"
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter sport (e.g., Football)"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Select Members</label>
          <select
            multiple
            value={selectedMembers}
            onChange={(e) =>
              setSelectedMembers(Array.from(e.target.selectedOptions, (option) => option.value))
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {approvedParticipants.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">Hold Ctrl (Cmd on Mac) to select multiple</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateTeam}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all"
        >
          Create Team
        </motion.button>
      </div>
    </motion.div>
  );
}

export default CreateTeams;
