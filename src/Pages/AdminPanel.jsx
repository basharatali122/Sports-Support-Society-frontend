import React from "react";
import Sidebar from "../Components/AdminComponents/Sidebar";
import Dashboard from "../Components/AdminComponents/Dashboard";

export default function AdminPanel() {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md border-r border-gray-200 z-10">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
        <Dashboard />
      </main>
    </div>
  );
}
