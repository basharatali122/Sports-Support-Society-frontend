import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function JoinTeam() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get("http://localhost:3000/team/approved-teams", {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        setTeams(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Join or Create a Team</h2>
          <button
            onClick={() => navigate('/participant/create-team')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-xl transition duration-300"
          >
            + Create Team
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading teams...</p>
        ) : teams.length === 0 ? (
          <p className="text-center text-gray-600 italic">No teams available at the moment.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {teams.map((team, index) => (
              <motion.div
                key={team._id}
                className="bg-gray-50 rounded-xl p-5 shadow-sm hover:shadow-md transition duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Team: {team.name}</h3>
                <p className="text-sm text-gray-500 mb-4">Created by: {team.createdBy?.name || 'N/A'}</p>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-full transition duration-300">
                  Join Team
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
