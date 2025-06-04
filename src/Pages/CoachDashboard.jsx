import React from 'react';
import Sidebar from "../Components/CoachComponents/Sidebar.jsx";
import Dashboard from '../Components/CoachComponents/Dashboard.jsx';

function CoachDashboard() {
  return (
    <div className="flex w-full min-h-screen bg-gray-100 fixed">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex col-3 w-full  mx-10 gap-10 p-6 overflow-y-auto">
        <Dashboard />
      </div>
    </div>
  );
}

export default CoachDashboard;