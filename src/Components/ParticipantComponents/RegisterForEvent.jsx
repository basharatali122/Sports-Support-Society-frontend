import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function RegisterForEvent() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:3000/events/getParticipantEvents");
        setEvents(response.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        📅 Register for Events
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-gray-500">No events available to register.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event._id}
              className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between transition transform hover:scale-[1.02] duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-1"><strong>Organizer:</strong> {event.createdBy?.name || "N/A"}</p>
                <p className="text-sm text-gray-600 mb-1"><strong>Venue:</strong> {event.location}</p>
                <p className="text-sm text-gray-600 mb-3"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              </div>

              <button
                className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition duration-300"
              >
                Register
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
