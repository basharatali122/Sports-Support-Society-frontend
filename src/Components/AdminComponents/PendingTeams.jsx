import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

function PendingTeams() {
  // States
  const [teams, setTeams] = useState([]);
  const fetchTeams = async () => {
    const res = await axios.get("http://localhost:3000/team/pending-teams", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    setTeams(Array.isArray(res.data) ? res.data : []);
  };
  
  useEffect(() => {
      fetchTeams();
    }, []);

   const approveTeam = async (teamId) => {
    await axios.patch(
      `http://localhost:3000/team/approve/${teamId}`,
      {},
      { withCredentials: true }
    );
    fetchTeams();
  };
  return (
    <div>
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-blue-500">
          Pending Teams
        </h2>
        {teams.length === 0 ? (
          <p className="text-gray-500">No teams awaiting approval.</p>
        ) : (
          <ul className="divide-y">
            {teams.map((team) => (
              <li key={team._id} className="py-4 flex justify-between">
                <div>
                  <p className="font-semibold">{team.name}</p>
                  <p className="text-sm text-gray-600">
                    Created by: {team.createdBy?.name}
                  </p>
                </div>
                <button
                  onClick={() => approveTeam(team._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Approve
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default PendingTeams