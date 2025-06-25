import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const EventRegister = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user?.data?.user);


 
  const [event, setEvent] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch event details
useEffect(() => {
  const fetchEvent = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/events/getEventById/${eventId}`, {
        headers: {
          "Cache-Control": "no-cache"
        }
      });

      console.log("Fetched event:", res.data);

      setEvent(res.data.event); // Adjust based on your response
      setLoading(false);
    } catch (err) {
      console.error("Error fetching event:", err);
      setLoading(false);
    }
  };

  fetchEvent();
}, [eventId]);


  const handleRegister = async () => {
    try {
      const res = await axios.post(`http://localhost:3000/events/${eventId}/register`, {
        userId: user.id,

       
      });

      alert("You have been registered successfully!");
      navigate("/dashboard/register-event"); // Redirect to events page or dashboard
    } catch (err) {
      console.error("Registration error:", err);
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  if (loading) return <p>Loading event...</p>;
  if (!event) return <p>Event not found.</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Register for: {event.title}</h2>
      <p><strong>Organizer:</strong> {event.organizer || "N/A"}</p>
      <p><strong>Venue:</strong> {event.location || "N/A"}</p>
      <p>
              <strong>Date:</strong>{' '}
              {event.startDate && event.endDate
                ? `${new Date(event.startDate).toLocaleDateString()} to ${new Date(event.endDate).toLocaleDateString()}`
                : "Invalid Date"}
            </p>

      <button
        onClick={handleRegister}
        style={{
          padding: "10px 20px",
          backgroundColor: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          marginTop: "1rem",
          cursor: "pointer"
        }}
      >
        Confirm Registration
      </button>
    </div>
  );
};

export default EventRegister;
