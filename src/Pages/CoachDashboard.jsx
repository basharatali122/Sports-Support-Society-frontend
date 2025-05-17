import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // you already use toast, assuming it's installed

function CoachDashboard() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Team creation states
  const [teamName, setTeamName] = useState("");
  const [sport, setSport] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [coachId, setCoachId] = useState(""); // Assuming coach is logged in user

  // states for creating events 
   const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/users/getAllusers");
        console.log("All Users:", response.data);
        setAllUsers(response.data);
        // Set the coach id (assuming current user is coach)
        const user = JSON.parse(localStorage.getItem("user")); // Or wherever your logged in user is stored
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
        toast.success(`${userType} approved successfully`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        throw new Error(response.data.message || "Approval failed");
      }
    } catch (error) {
      console.error("Approval failed:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to approve user", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handleRejection = async (userId, userType) => {
    if (
      window.confirm(
        `Are you sure you want to reject this ${userType}? This will delete their account.`
      )
    ) {
      try {
        await axios.delete(`http://localhost:3000/users/${userId}/reject`);
        setAllUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        alert(`${userType} rejected and removed from system`);
      } catch (error) {
        console.error("Rejection failed:", error);
        alert("Rejection failed");
      }
    }
  };

  const filteredUsers = allUsers.filter((user) => {
    if (filter === "all") return true;
    if (filter === "pending") return user.status === "pending";
    if (filter === "approved") return user.status === "approved";
    if (filter === "rejected") return user.status === "rejected";
    return true;
  });

const handleCreateTeam = async () => {
    if (!teamName || !sport || selectedMembers.length === 0) {
      toast.error("Please fill all fields and select members");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:3000/team/teams",
        { name: teamName, sport, members: selectedMembers },
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
      console.error("Error creating team:", error);
      toast.error(error.response?.data?.message || "Failed to create team");
    }
  };
  const handleCreateEvent = async () => {
  if (!title || !eventDate || !location || !description) {
    toast.error("Please fill all event fields");
    return;
  }

  try {
    const { data } = await axios.post(
       "http://localhost:3000/events/creatEvent",
      {
       title,
        date: eventDate,
        location,
        description,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    if (data.success || data.message === "Event created successfully") {
      toast.success(data.message || "Event created successfully");
      setTitle("");
      setEventDate("");
      setLocation("");
      setDescription("");
    } else {
      toast.error(data.message || "Failed to create event");
    }
  } catch (error) {
    console.error("Error creating event:", error);
    toast.error(error.response?.data?.message || "Failed to create event");
  }
};


  const approvedParticipants = allUsers.filter(user => user.role === "participant" && user.status === "approved");

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Coach Dashboard</h1>

      {/* --- Team Creation Section --- */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Create a New Team</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Team Name:</label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Enter team name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Sport:</label>
          <input
            type="text"
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Enter sport (e.g., Football)"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Select Members:</label>
          <select
            multiple
            value={selectedMembers}
            onChange={(e) =>
              setSelectedMembers(Array.from(e.target.selectedOptions, (option) => option.value))
            }
            className="w-full border rounded p-2"
          >
            {approvedParticipants.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          <small className="text-gray-500">Hold Ctrl (Cmd on Mac) to select multiple</small>
        </div>

        <button
          onClick={handleCreateTeam}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Team
        </button>
      </div>


<div className="max-w-xl mx-auto p-6 bg-base-100 shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Create Event: </h2>
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Event Name</span>
        </label>
        <input
          type="text"
          placeholder="Event Title"
          className="input input-bordered"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Description: </span>
        </label>
        <textarea
          placeholder="Event Description"
          className="textarea textarea-bordered"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Date: </span>
        </label>
        <input
          type="date"
          className="input input-bordered"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />
      </div>

      <div className="form-control mb-6">
        <label className="label">
          <span className="label-text">Location</span>
        </label>
        <input
          type="text"
          placeholder="Event Location"
          className="input input-bordered"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <button onClick={handleCreateEvent} className="btn btn-primary w-full">
        Create Event
      </button>
    </div>


      {/* --- Existing Filters and Table --- */}
      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-white"}`}
        >
          All Users
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded ${filter === "pending" ? "bg-blue-600 text-white" : "bg-white"}`}
        >
          Pending Approval
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 rounded ${filter === "approved" ? "bg-blue-600 text-white" : "bg-white"}`}
        >
          Approved
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers
                    .filter((user) => user.role === "participant")
                    .map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap capitalize">{user.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : user.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {user.status || "pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {user.status !== "approved" ? (
                            <button
                              onClick={() => handleApproval(user._id, user.role)}
                              className="text-green-600 hover:text-green-900 mr-4"
                            >
                              Approve
                            </button>
                          ) : (
                            <span className="text-gray-400">Approved</span>
                          )}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default CoachDashboard;





