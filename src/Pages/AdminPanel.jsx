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
    const fetchSportsCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/sportsCategories");
        setSportsCategories(response.data);
      } catch (error) {
        console.error("Error fetching sports categories:", error);
      }
    };

    fetchUsers();
    fetchEvents();
    fetchSportsCategories();
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

      {/* Event Management Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Manage Events</h2>
        <div className="flex space-x-4 mb-6">
          <select onChange={(e) => setSelectedEvent(e.target.value)} className="px-4 py-2 border rounded">
            {events.map(event => (
              <option key={event._id} value={event._id}>{event.name}</option>
            ))}
          </select>
          <button onClick={handleEventCreation} className="px-4 py-2 bg-blue-500 text-white rounded">Create Event</button>
        </div>
      </div>

      {/* Send Notifications Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Send Notifications</h2>
        <textarea onChange={(e) => setMessage(e.target.value)} value={message} className="w-full p-4 border rounded" rows="4" placeholder="Enter your message..."></textarea>
        <button onClick={handleSendMessage} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">Send Message</button>
      </div>

      {/* Sports Categories Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Manage Sports Categories</h2>
        <ul>
          {sportsCategories.map(category => (
            <li key={category._id} className="flex justify-between items-center">
              <span>{category.name}</span>
              <button onClick={() => handleCategoryManagement("delete", category._id)} className="text-red-600 hover:text-red-900">Delete</button>
            </li>
          ))}
        </ul>
        <button onClick={() => handleCategoryManagement("add")} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Add New Category</button>
      </div>
    </div>
  );
}

export default AdminPanel;


