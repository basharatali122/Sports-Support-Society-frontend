import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

      setEvents((prev) => prev.filter((event) => event._id !== eventId));
      toast.success("Event approved successfully");
    } catch (error) {
      console.error("Error approving event:", error);
      toast.error("Error approving event");
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="left">
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-500">
            Pending Events
          </h2>
          {events.length === 0 ? (
            <p className="text-gray-500">No events awaiting approval.</p>
          ) : (
            <ul className="divide-y">
              {events.map((event) => {
                const start = new Date(event.startDate).toLocaleDateString("en-GB");
                const end = new Date(event.endDate).toLocaleDateString("en-GB");

                return (
                  <li key={event._id} className="py-4 flex justify-between">
                    <div>
                      <p className="font-semibold text-gray-950">{event.title}</p>
                      <p className="text-sm text-gray-950">{event.location}</p>
                      <p className="text-sm text-gray-950">
                        {start} to {end}
                      </p>
                    </div>
                    <button
                      onClick={() => approveEvent(event._id)}
                      className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600"
                    >
                      Approve
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default PendingEvents;
