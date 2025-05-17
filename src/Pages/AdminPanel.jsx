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


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { Bar } from "react-chartjs-2";
// import { Chart, registerables } from 'chart.js';
// Chart.register(...registerables);

// function AdminPanel() {
//   // ... existing state declarations ...
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [eventFormData, setEventFormData] = useState({
//     name: "",
//     date: "",
//     venue: "",
//     equipment: "",
//     category: "",
//     organizer: ""
//   });
//   const [teams, setTeams] = useState([]);
//   const [reports, setReports] = useState([]);
//   const [stats, setStats] = useState({});

//   // Add to existing useEffect
//   useEffect(() => {
//     const fetchTeams = async () => {
//       try {
//         const response = await axios.get("http://localhost:3000/teams");
//         setTeams(response.data);
//       } catch (error) {
//         console.error("Error fetching teams:", error);
//       }
//     };
    
//     const fetchStats = async () => {
//       try {
//         const response = await axios.get("http://localhost:3000/stats");
//         setStats(response.data);
//       } catch (error) {
//         console.error("Error fetching stats:", error);
//       }
//     };

//     fetchTeams();
//     fetchStats();
//   }, []);

//   // Modify Profiles
//   const handleEditUser = (user) => {
//     setSelectedUser(user);
//     setShowEditModal(true);
//   };

//   const updateUserProfile = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.put(
//         `http://localhost:3000/users/${selectedUser._id}`,
//         selectedUser
//       );
//       setAllUsers(prevUsers =>
//         prevUsers.map(user => 
//           user._id === selectedUser._id ? response.data.user : user
//         )
//       );
//       toast.success("Profile updated successfully");
//       setShowEditModal(false);
//     } catch (error) {
//       toast.error("Error updating profile");
//     }
//   };

//   // Team Approvals
//   const handleTeamApproval = async (teamId, action) => {
//     try {
//       await axios.patch(`http://localhost:3000/teams/${teamId}/${action}`);
//       setTeams(prevTeams =>
//         prevTeams.map(team =>
//           team._id === teamId ? { ...team, status: action } : team
//         )
//       );
//       toast.success(`Team ${action} successfully`);
//     } catch (error) {
//       toast.error(`Error ${action} team`);
//     }
//   };

//   // Enhanced Event Management
//   const handleEventInputChange = (e) => {
//     setEventFormData({
//       ...eventFormData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleEventSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://localhost:3000/events",
//         eventFormData
//       );
//       setEvents([...events, response.data.event]);
//       toast.success("Event created successfully");
//       setEventFormData({
//         name: "",
//         date: "",
//         venue: "",
//         equipment: "",
//         category: "",
//         organizer: ""
//       });
//     } catch (error) {
//       toast.error("Error creating event");
//     }
//   };

//   // Assign Organizers to Categories
//   const handleAssignOrganizer = async (categoryId, organizerId) => {
//     try {
//       await axios.patch(`http://localhost:3000/sportsCategories/${categoryId}/organizer`, {
//         organizer: organizerId
//       });
//       fetchSportsCategories();
//       toast.success("Organizer assigned successfully");
//     } catch (error) {
//       toast.error("Error assigning organizer");
//     }
//   };

//   // Generate Report
//   const generateReport = async (type) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:3000/reports?type=${type}`,
//         { responseType: 'blob' }
//       );
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `${type}_report.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       toast.success("Report generated successfully");
//     } catch (error) {
//       toast.error("Error generating report");
//     }
//   };

//   // Add to the return statement
//   return (
//     <div className="p-6 min-h-screen bg-gray-100">
//       {/* ... existing components ... */}

//       {/* Edit User Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-96">
//             <h3 className="text-xl font-bold mb-4">Edit User Profile</h3>
//             <form onSubmit={updateUserProfile}>
//               <div className="mb-4">
//                 <label className="block mb-2">Name</label>
//                 <input
//                   type="text"
//                   className="w-full p-2 border rounded"
//                   value={selectedUser.name}
//                   onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
//                 />
//               </div>
//               {/* Add more fields as needed */}
//               <div className="flex justify-end space-x-4">
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   className="px-4 py-2 bg-gray-500 text-white rounded"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-500 text-white rounded"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Team Management Section */}
//       <div className="mt-6">
//         <h2 className="text-2xl font-semibold mb-4">Team Approvals</h2>
//         <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left">Team Name</th>
//                 <th className="px-6 py-3 text-left">Sport</th>
//                 <th className="px-6 py-3 text-left">Status</th>
//                 <th className="px-6 py-3 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {teams.map(team => (
//                 <tr key={team._id}>
//                   <td className="px-6 py-4">{team.name}</td>
//                   <td className="px-6 py-4">{team.sport}</td>
//                   <td className="px-6 py-4">{team.status}</td>
//                   <td className="px-6 py-4">
//                     {team.status === 'pending' && (
//                       <>
//                         <button onClick={() => handleTeamApproval(team._id, 'approve')} className="text-green-600 mr-4">
//                           Approve
//                         </button>
//                         <button onClick={() => handleTeamApproval(team._id, 'reject')} className="text-red-600">
//                           Reject
//                         </button>
//                       </>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Enhanced Event Creation Form */}
//       <div className="mt-6">
//         <h2 className="text-2xl font-semibold mb-4">Create New Event</h2>
//         <form onSubmit={handleEventSubmit} className="bg-white p-6 rounded-lg shadow">
//           <div className="grid grid-cols-2 gap-4">
//             <input
//               type="text"
//               name="name"
//               placeholder="Event Name"
//               className="p-2 border rounded"
//               value={eventFormData.name}
//               onChange={handleEventInputChange}
//             />
//             <input
//               type="datetime-local"
//               name="date"
//               className="p-2 border rounded"
//               value={eventFormData.date}
//               onChange={handleEventInputChange}
//             />
//             <input
//               type="text"
//               name="venue"
//               placeholder="Venue"
//               className="p-2 border rounded"
//               value={eventFormData.venue}
//               onChange={handleEventInputChange}
//             />
//             <select
//               name="category"
//               className="p-2 border rounded"
//               value={eventFormData.category}
//               onChange={handleEventInputChange}
//             >
//               {sportsCategories.map(cat => (
//                 <option key={cat._id} value={cat._id}>{cat.name}</option>
//               ))}
//             </select>
//           </div>
//           <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
//             Create Event
//           </button>
//         </form>
//       </div>

//       {/* Statistics Section */}
//       <div className="mt-6">
//         <h2 className="text-2xl font-semibold mb-4">Participation Statistics</h2>
//         <div className="bg-white p-6 rounded-lg shadow">
//           <Bar
//             data={{
//               labels: stats.labels || [],
//               datasets: [{
//                 label: 'Participants',
//                 data: stats.data || [],
//                 backgroundColor: 'rgba(59, 130, 246, 0.5)'
//               }]
//             }}
//           />
//         </div>
//       </div>

//       {/* Report Generation */}
//       <div className="mt-6">
//         <h2 className="text-2xl font-semibold mb-4">Generate Reports</h2>
//         <div className="flex space-x-4">
//           <button onClick={() => generateReport('participants')} className="px-4 py-2 bg-green-500 text-white rounded">
//             Participant Report
//           </button>
//           <button onClick={() => generateReport('events')} className="px-4 py-2 bg-blue-500 text-white rounded">
//             Event Report
//           </button>
//         </div>
//       </div>

//       {/* Enhanced Sports Categories Management */}
//       <div className="mt-6">
//         <h2 className="text-2xl font-semibold mb-4">Sports Categories</h2>
//         <div className="bg-white p-6 rounded-lg shadow">
//           {sportsCategories.map(category => (
//             <div key={category._id} className="flex items-center justify-between mb-4">
//               <div className="flex-1">
//                 <span className="font-medium">{category.name}</span>
//                 <span className="text-sm text-gray-600 ml-4">
//                   Organizer: {category.organizer?.name || 'None'}
//                 </span>
//               </div>
//               <select
//                 className="p-2 border rounded"
//                 onChange={(e) => handleAssignOrganizer(category._id, e.target.value)}
//               >
//                 <option value="">Assign Organizer</option>
//                 {allUsers
//                   .filter(user => user.role === 'organizer')
//                   .map(organizer => (
//                     <option key={organizer._id} value={organizer._id}>
//                       {organizer.name}
//                     </option>
//                   ))}
//               </select>
//               <button
//                 onClick={() => handleCategoryManagement("delete", category._id)}
//                 className="ml-4 text-red-600 hover:text-red-900"
//               >
//                 Delete
//               </button>
//             </div>
//           ))}
//           <button
//             onClick={() => handleCategoryManagement("add")}
//             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
//           >
//             Add New Category
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminPanel;