import React, { useState, useEffect } from "react";

// Static data for demonstration
const statsData = {
  2023: {
    wins: 11,
    losses: 7,
    mvps: 3,
    recentMatches: [
      { id: 1, opponent: "Uni A", result: "Win", score: "3-1", date: "2023-10-01" },
      { id: 2, opponent: "Uni B", result: "Loss", score: "1-2", date: "2023-09-24" },
      { id: 3, opponent: "Uni C", result: "Win", score: "2-0", date: "2023-09-15" },
      { id: 4, opponent: "Uni D", result: "Win", score: "4-3", date: "2023-09-08" },
    ],
  },
  2024: {
    wins: 15,
    losses: 7,
    mvps: 5,
    recentMatches: [
      { id: 1, opponent: "Uni X", result: "Win", score: "4-2", date: "2024-05-01" },
      { id: 2, opponent: "Uni Y", result: "Win", score: "3-0", date: "2024-04-25" },
      { id: 3, opponent: "Uni Z", result: "Loss", score: "0-1", date: "2024-04-15" },
      { id: 4, opponent: "Uni W", result: "Win", score: "5-1", date: "2024-04-10" },
    ],
  },
};

const seasons = Object.keys(statsData);

const StatCard = ({ label, value, previous, bg }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 500;
    const increment = end / 20;
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setDisplayValue(Math.round(start));
    }, duration / 20);
    return () => clearInterval(timer);
  }, [value]);

  const getTrendIcon = () => {
    if (previous === undefined) return null;
    if (value > previous) return "▲";
    if (value < previous) return "▼";
    return "=";
  };

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl p-6 shadow-lg transition transform hover:scale-105 ${bg} text-white min-w-[140px]`}
    >
      <div className="text-4xl font-bold flex items-center gap-2">
        {displayValue} <span className="text-sm">{getTrendIcon()}</span>
      </div>
      <div className="mt-2 text-lg uppercase tracking-wide font-semibold opacity-90">
        {label}
      </div>
    </div>
  );
};

const Reports = () => {
  const [selectedSeason, setSelectedSeason] = useState("2024");
  const stats = statsData[selectedSeason];
  const previousSeason = (parseInt(selectedSeason) - 1).toString();
  const prevStats = statsData[previousSeason];

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Player Info Card */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 bg-gray-800 p-6 rounded-2xl shadow-lg">
          <img
            src="https://via.placeholder.com/80"
            alt="Player"
            className="rounded-full border-4 border-green-400 w-20 h-20 object-cover"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2 text-sm text-gray-300 w-full">
            <div>
              <span className="text-gray-500">Name:</span> <span className="text-white font-medium">John Doe</span>
            </div>
            <div>
              <span className="text-gray-500">Email:</span> <span className="text-white font-medium">johndoe@example.com</span>
            </div>
            <div>
              <span className="text-gray-500">Team:</span> <span className="text-white font-medium">University Team</span>
            </div>
            <div>
              <span className="text-gray-500">Position:</span> <span className="text-white font-medium">Forward</span>
            </div>
            <div>
              <span className="text-gray-500">Jersey No:</span> <span className="text-white font-medium">10</span>
            </div>
            <div>
              <span className="text-gray-500">Years Active:</span> <span className="text-white font-medium">2021 - Present</span>
            </div>
            <div>
              <span className="text-gray-500">Age:</span> <span className="text-white font-medium">21</span>
            </div>
            <div>
              <span className="text-gray-500">Height / Weight:</span> <span className="text-white font-medium">5'11" / 72kg</span>
            </div>
            <div>
              <span className="text-gray-500">Sport:</span> <span className="text-white font-medium">Football</span>
            </div>
            <div>
              <span className="text-gray-500">Coach:</span> <span className="text-white font-medium">Mr. Allen Smith</span>
            </div>
          </div>
        </div>

        {/* Season Selector */}
        <div className="mb-8 text-center">
          <label htmlFor="season" className="mr-3 text-lg">
            Select Season:
          </label>
          <select
            id="season"
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none"
          >
            {seasons.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard label="Wins" value={stats.wins} previous={prevStats?.wins} bg="bg-green-600" />
          <StatCard label="Losses" value={stats.losses} previous={prevStats?.losses} bg="bg-red-600" />
          <StatCard label="MVP Awards" value={stats.mvps} previous={prevStats?.mvps} bg="bg-yellow-500" />
        </div>

        {/* Recent Matches Table */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-xl mb-10">
          <h2 className="text-xl font-semibold mb-6 text-center text-yellow-400">
            Recent Matches ({selectedSeason})
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left border-collapse border border-gray-700">
              <thead>
                <tr>
                  <th className="border border-gray-700 px-4 py-2">Date</th>
                  <th className="border border-gray-700 px-4 py-2">Opponent</th>
                  <th className="border border-gray-700 px-4 py-2">Result</th>
                  <th className="border border-gray-700 px-4 py-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentMatches.map(({ id, date, opponent, result, score }) => (
                  <tr key={id} className="hover:bg-gray-700">
                    <td className="border border-gray-700 px-4 py-2">{date}</td>
                    <td className="border border-gray-700 px-4 py-2">{opponent}</td>
                    <td
                      className={`border border-gray-700 px-4 py-2 font-semibold ${
                        result === "Win" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {result}
                    </td>
                    <td className="border border-gray-700 px-4 py-2">{score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
