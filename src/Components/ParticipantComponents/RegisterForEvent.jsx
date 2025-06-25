import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function RegisterForEvent() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:3000/events/getParticipantEvents");

        // Debug log to inspect API response
        console.log("Events API Response:", res.data);

        // Defensive assignment in case response is nested
        const fetchedEvents = Array.isArray(res.data)
          ? res.data
          : res.data.events || [];

        setEvents(fetchedEvents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading events...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span>🗓️</span> Register for Events
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <motion.div
            key={event._id}
            whileHover={{ scale: 1.03 }}
            className="bg-white p-5 rounded-xl shadow-md border"
          >
            <h2 className="text-xl font-semibold mb-2 capitalize">{event.title}</h2>
            <p><strong>Organizer:</strong> {event.organizer || "N/A"}</p>
            <p><strong>Venue:</strong> {event.location || "N/A"}</p>
            <p>
              <strong>Date:</strong>{' '}
              {event.startDate && event.endDate
                ? `${new Date(event.startDate).toLocaleDateString()} to ${new Date(event.endDate).toLocaleDateString()}`
                : "Invalid Date"}
            </p>
            <button
              onClick={() => navigate(`/register/${event._id}`)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md mt-4 hover:bg-blue-700 w-full"
            >
              Register
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
