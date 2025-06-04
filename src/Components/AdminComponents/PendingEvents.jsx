import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

function PendingEvents() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:3000/events");
        setEvents(response.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);
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
  // Function
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
    <div className="left">
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-blue-500">
          Pending Events
        </h2>
        {events.length === 0 ? (
          <p className="text-gray-500">No events awaiting approval.</p>
        ) : (
          <ul className="divide-y">
            {events.map((event) => (
              <li key={event._id} className="py-4 flex justify-between">
                <div>
                  <p className="font-semibold text-gray-950">{event.title}</p>
                  <p className="text-sm text-gray-950">{event.location}</p>
                  <p className="text-sm text-gray-950">{event.date}</p>
                  <p className="text-sm text-gray-950">{event._id}</p>
                </div>
                <button
                  onClick={() => approveEvent(event._id)}
                  className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600"
                >
                  Approve
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>);
}

export default PendingEvents;
