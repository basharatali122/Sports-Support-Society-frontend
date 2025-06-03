import React, { useEffect, useState } from "react";

import axios from "axios";
import { toast } from "react-toastify"; // For showing toast notifications

function AdminPanel() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'pending', 'approved', 'rejected'
  const [events, setEvents] = useState([]);
  const [sportsCategories, setSportsCategories] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [message, setMessage] = useState("");


   // states for creating events 
     const [title, setTitle] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");

    //states for categories 
     const [categories, setCategories] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedOrganizer, setSelectedOrganizer] = useState({});

  // state for fetching teams 

  const [teams, setTeams] = useState([]);
  const fetchTeams = async () => {
    const res = await axios.get("http://localhost:3000/team/pending-teams", { withCredentials: true,headers: {
      "Content-Type": "application/json",
    }, });
setTeams(Array.isArray(res.data) ? res.data : []);

  };

  const approveTeam = async (teamId) => {
    await axios.patch(`http://localhost:3000/team/approve/${teamId}`, {}, { withCredentials: true });
    fetchTeams();
  };


  useEffect(() => {
    fetchTeams();
  }, []);
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/users/getAllusers");
        setAllUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:3000/events");
        setEvents(response.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
  const fetchCategories = async () => {
  try {
    const { data } = await axios.get("http://localhost:3000/sport-categories");
    setCategories(Array.isArray(data.categories) ? data.categories : []);
  } catch (error) {
    console.error("Error fetching sports categories:", error);
  }
};

     // Fetch organizer list (from users)
  const fetchOrganizers = async () => {
    const res = await axios.get("http://localhost:3000/users/getAllUsers?role=coach");
    setOrganizers(res.data);
  };

    fetchUsers();
    fetchEvents();
    fetchCategories();
     fetchOrganizers();
  }, []);
  

  const handleApproval = async (userId, userType) => {
    try {
      const response = await axios.patch(`http://localhost:3000/users/${userId}/approve`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });

      if (response.data.success) {
        setAllUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === userId ? { ...user, approved: true, status: "approved" } : user
          )
        );
        toast.success(`${userType} approved successfully`);
      } else {
        throw new Error(response.data.message || "Approval failed");
      }
    } catch (error) {
      toast.error("Approval failed: " + (error.response?.data?.message || error.message));
    }
  };

  const handleRejection = async (userId, userType) => {
    if (window.confirm(`Are you sure you want to reject this ${userType}?`)) {
      try {
        await axios.delete(`http://localhost:3000/users/${userId}/reject`);
        setAllUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        toast.success(`${userType} rejected and removed from the system`);
      } catch (error) {
        toast.error("Rejection failed");
      }
    }
  };

  const handleEventApproval = async (eventId) => {
    try {
      const response = await axios.patch(`http://localhost:3000/events/${eventId}/approve`);
      if (response.data.success) {
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event._id === eventId ? { ...event, approved: true } : event
          )
        );
        toast.success("Event approved successfully");
      } else {
        toast.error("Event approval failed");
      }
    } catch (error) {
      toast.error("Error approving event");
    }
  };

  const handleEventCreation = async () => {
    try {
      const response = await axios.post("http://localhost:3000/events", { ...selectedEvent });
      setEvents([...events, response.data.event]);
      toast.success("Event created successfully");
    } catch (error) {
      toast.error("Error creating event");
    }
  };

  const handleSendMessage = async () => {
    try {
      await axios.post("http://localhost:3000/messages", { message });
      toast.success("Message sent to participants");
    } catch (error) {
      toast.error("Error sending message");
    }
  };

  const handleCategoryManagement = async (action, categoryId) => {
    try {
      if (action === 'add') {
        await axios.post("http://localhost:3000/sportsCategories", { name: "New Category" });
        toast.success("New category added");
      } else if (action === 'delete') {
        await axios.delete(`http://localhost:3000/sportsCategories/${categoryId}`);
        toast.success("Category deleted");
      }
      fetchSportsCategories(); // Refresh the categories
    } catch (error) {
      toast.error("Error managing category");
    }
  };


  const filteredUsers = allUsers.filter(user => {
    if (filter === "all") return true;
    if (filter === "pending") return user.status === "pending";
    if (filter === "approved") return user.status === "approved";
    if (filter === "rejected") return user.status === "rejected";
    return true;
  });

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


const approveEvent = async (eventId) => {
  try {
    const token = localStorage.getItem("token");
    await axios.patch(
      `http://localhost:3000/events/${eventId}/approve`,
      {},
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ✅ Remove the approved event from the list
    setEvents((prev) => prev.filter((event) => event._id !== eventId));
  } catch (error) {
    console.error("Error approving event:", error);
  }
};



  // Add new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return alert("Category name required");
    await axios.post("http://localhost:3000/sport-categories", { name: newCategory });
    setNewCategory("");
    fetchCategories();
  };
 // Assign organizer
  const handleAssignOrganizer = async (categoryId, organizerId) => {
    await axios.put(`http://localhost:3000/sport-categories/${categoryId}/assign-organizer`, {
      organizerId,
    });
    fetchCategories();
  };


  
  // Delete category
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    await axios.delete(`http://localhost:3000/sport-categories/${categoryId}`);
    fetchCategories();
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* User Filters */}
      <div className="mb-6 flex space-x-4">
        <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-white"}`}>
          All Users
        </button>
        <button onClick={() => setFilter("pending")} className={`px-4 py-2 rounded ${filter === "pending" ? "bg-blue-600 text-white" : "bg-white"}`}>
          Pending Approval
        </button>
        <button onClick={() => setFilter("approved")} className={`px-4 py-2 rounded ${filter === "approved" ? "bg-blue-600 text-white" : "bg-white"}`}>
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
                  filteredUsers.map(user => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === "approved" ? "bg-green-100 text-green-800" : user.status === "rejected" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
                          {user.status || "pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {user.status !== "approved" && (
                          <>
                            <button onClick={() => handleApproval(user._id, user.role)} className="text-green-600 hover:text-green-900 mr-4">Approve</button>
                            <button onClick={() => handleRejection(user._id, user.role)} className="text-red-600 hover:text-red-900">Reject</button>
                          </>
                        )}
                        {user.status === "approved" && <span className="text-gray-400">Approved</span>}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Event section  */}

   <br />

<div className="max-w-2xl mx-auto p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border border-gray-200">
  <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Create New Event</h2>

  <div className="space-y-5">
    <div>
      <label className="block text-gray-700 font-medium mb-2">Event Name</label>
      <input
        type="text"
        placeholder="Enter event name"
        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">Description</label>
      <textarea
        placeholder="Enter event description"
        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[100px]"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">Date</label>
      <input
        type="date"
        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-2">Location</label>
      <input
        type="text"
        placeholder="Enter location"
        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
    </div>

    <button
      onClick={handleCreateEvent}
      className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition duration-200"
    >
      Create Event
    </button>
  </div>
</div>

{/* approve event section  */}

 <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Pending Events</h2>
      {events.length === 0 ? (
        <p>No events awaiting approval.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event._id} className="p-4 bg-white rounded shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p><strong>Title:</strong> {event.title}</p>
                  <p><strong>Organizer:</strong> {event.createdBy?.name || "N/A"}</p>

                  <p><strong>Venue:</strong> {event.location}</p>
                 <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>

                </div>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => approveEvent(event._id)}
                >
                  Approve
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>

{/* team approve section  */}

<div className="p-4">
      <h2 className="text-xl font-bold mb-3">Pending Teams</h2>
      {teams.length === 0 ? (
        <p>No teams awaiting approval.</p>
      ) : (
        <ul className="space-y-4">
          {teams.map((team) => (
            <li key={team._id} className="p-4 bg-white rounded shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p><strong>Team:</strong> {team.name}</p>
                  <p><strong>Created By:</strong> {team.createdBy?.name}</p>

                </div>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={() => approveTeam(team._id)}
                >
                  Approve
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>

      {/* Send Notifications Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Send Notifications</h2>
        <textarea onChange={(e) => setMessage(e.target.value)} value={message} className="w-full p-4 border rounded" rows="4" placeholder="Enter your message..."></textarea>
        <button onClick={handleSendMessage} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">Send Message</button>
      </div>

      {/* Sports Categories Section */}
     <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Sports Categories</h2>

      {/* Add New Category */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="New Category Name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleAddCategory}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {/* List Categories */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Organizer</th>
            <th className="p-2 border">Assign Organizer</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td className="p-2 border">{cat.name}</td>
              <td className="p-2 border">
                {cat.organizer ? cat.organizer.name : "Not Assigned"}
              </td>
              <td className="p-2 border">
                <select
                  onChange={(e) =>
                    handleAssignOrganizer(cat._id, e.target.value)
                  }
                  defaultValue={cat.organizer?._id || ""}
                  className="border px-2 py-1"
                >
                  <option value="">-- Select Organizer --</option>
                  {organizers.map((org) => (
                    <option key={org._id} value={org._id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => handleDeleteCategory(cat._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                No categories available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
}

export default AdminPanel;


