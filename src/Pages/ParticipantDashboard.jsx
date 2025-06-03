import axios from 'axios';
import React, { useEffect, useState } from 'react'

const ParticipantDashboard = () => {

  const [events, setEvents] = useState([])
  const [teams, setTeams] = useState([]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:3000/events/getParticipantEvents");
      setEvents(response.data.events);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };



  useEffect(() => {
    fetchEvents();
  }, []);


  const fetchTeams = async () => {
    const res = await axios.get("http://localhost:3000/team/approved-teams", {
      withCredentials: true, headers: {
        "Content-Type": "application/json",
      },
    });
    setTeams(Array.isArray(res.data) ? res.data : []);

  };

  useEffect(() => {
    fetchTeams();
  }, []);




  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Participant Dashboard</h1>

      {/* Table Container */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-3">Register for Events ..</h2>
        {events.length === 0 ? (
          <p>No events available to Register.</p>
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

                  >
                    Register
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>


      {/* create or join team  */}


      <div className="p-6 max-w-3xl mx-auto bg-gray-50 rounded-xl shadow-md space-y-6">
  <div className="flex items-center justify-between">
    <h2 className="text-2xl font-semibold text-gray-800">Join or Create a Team</h2>
    <button className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-lg transition duration-200 shadow-sm">
      + Create Team
    </button>
  </div>

  {teams.length === 0 ? (
    <p className="text-gray-600 text-center italic">No teams available at the moment.</p>
  ) : (
    <ul className="space-y-4">
      {teams.map((team) => (
        <li key={team._id} className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-gray-800">Team: {team.name}</p>
              <p className="text-sm text-gray-500">Created by: {team.createdBy?.name}</p>
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg transition duration-200 shadow">
              Join Team
            </button>
          </div>
        </li>
      ))}
    </ul>
  )}
</div>

    </div>

  )
}

export default ParticipantDashboard