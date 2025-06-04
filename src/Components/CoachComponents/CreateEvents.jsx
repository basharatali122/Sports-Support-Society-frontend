import React, { useEffect, useState } from "react";
import axios from "axios";
import { frame, motion } from "framer-motion";

function CreateEvent() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
// states for creating events
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  // Function
  const handleEventCreation = async () => {
    try {
      const response = await axios.post("http://localhost:3000/events", { ...selectedEvent });
      setEvents([...events, response.data.event]);
      toast.success("Event created successfully");
    } catch (error) {
      toast.error("Error creating event");
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
  return (<div>
    {/* Create Event Card */}
      <h1 className="text-4xl text-center text-blue-500 font-bold">
        Create Event
      </h1>
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100 px-4 py-10 gap-10">
        {/* Left: Create Event Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-100 rounded-2xl shadow-xl p-8 w-full md:max-w-md space-y-6"
        >
          <h2 className="text-2xl font-bold text-blue-600 text-center">
            Create New Event
          </h2>

          <input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />

          <textarea
            placeholder="Event Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
            rows={4}
          />

          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition text-gray-600"
          />

          <input
            type="text"
            placeholder="Event Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />

          <button
            onClick={handleCreateEvent}
            className="w-full py-3 bg-blue-700 text-white rounded-xl font-semibold shadow-md hover:bg-blue-800 transition"
          >
            Create Event
          </button>
        </motion.div>

        {/* Right: Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:block w-full max-w-md"
        >
          <div className="hidden md:block w-full max-w-lg">
            <svg
              width="400"
              height="400"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto"
            >
              {/* Calendar body */}
              <rect x="6" y="12" width="52" height="40" rx="6" fill="#2563EB" />
              {/* Calendar header */}
              <rect x="6" y="12" width="52" height="12" rx="3" fill="#1E40AF" />
              {/* Date tabs */}
              <rect x="14" y="6" width="8" height="14" rx="3" fill="#1E40AF" />
              <rect x="42" y="6" width="8" height="14" rx="3" fill="#1E40AF" />

              {/* Date grid squares */}
              <g fill="#3B82F6">
                {[14, 24, 34, 44].map((x) => (
                  <rect
                    key={"r1-" + x}
                    x={x}
                    y="28"
                    width="6"
                    height="6"
                    rx="1"
                  />
                ))}
                {[14, 24, 34, 44].map((x) => (
                  <rect
                    key={"r2-" + x}
                    x={x}
                    y="38"
                    width="6"
                    height="6"
                    rx="1"
                  />
                ))}
                {[14, 24, 34, 44].map((x) => (
                  <rect
                    key={"r3-" + x}
                    x={x}
                    y="48"
                    width="6"
                    height="6"
                    rx="1"
                  />
                ))}
              </g>

              {/* Pencil icon for edit (event creation) */}
              <path
                d="M44 36l8-8m-2-2l-8 8-5 5-3 1 1-3 5-5 8-8z"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Pencil tip detail */}
              <path
                d="M46 28l4 4"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>
      </div>
  </div>);
}

export default CreateEvent;
