import React, { useEffect, useState } from "react";
import axios from "axios";

const CoachRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch registrations
  useEffect(() => {
    const fetchRegistrations = async () => {
  try {
    const res = await axios.get("http://localhost:3000/events/coach/registrations", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    setRegistrations(res.data.registrations);
    console.log(res.data.registrations);
    setLoading(false);
  } catch (err) {
    console.error("Error fetching registrations:", err.response?.data || err);
    setLoading(false);
  }
};


    fetchRegistrations();
  }, []);

  // Update registration status
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:3000/events/coach/registrations/${id}`,
        { status }, // ✅ Sending status in request body
        {
          headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
        }
      );

      // Update UI after successful status change
      setRegistrations((prev) =>
        prev.map((reg) =>
          reg._id === id ? { ...reg, status } : reg
        )
      );

      alert(`Status updated to ${status}`);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    }
  };

  if (loading) return <p>Loading registrations...</p>;
  if (registrations.length === 0) return <p>No registrations found.</p>;

  return (
   <div className="p-8 min-h-screen bg-gray-100">
  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Coach Registrations</h2>

  <div className="overflow-x-auto bg-white rounded-xl shadow-md">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="px-6 py-3 text-left text-sm font-medium uppercase">Event</th>
          <th className="px-6 py-3 text-left text-sm font-medium uppercase">User Name</th>
          <th className="px-6 py-3 text-left text-sm font-medium uppercase">Email</th>
          <th className="px-6 py-3 text-left text-sm font-medium uppercase">Status</th>
          <th className="px-6 py-3 text-left text-sm font-medium uppercase">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {registrations.map((reg, index) => (
          <tr
            key={reg._id}
            className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
          >
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {reg.eventId?.title || "N/A"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {reg.userId?.name || "N/A"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {reg.userId?.email || "N/A"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold
                ${reg.status === "accepted"
                  ? "bg-green-100 text-green-700"
                  : reg.status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
                }`}>
                {reg.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap space-x-2">
              <button
                onClick={() => updateStatus(reg._id, "accepted")}
                className="px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium"
              >
                Accept
              </button>
              <button
                onClick={() => updateStatus(reg._id, "rejected")}
                className="px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
              >
                Reject
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default CoachRegistrations;
