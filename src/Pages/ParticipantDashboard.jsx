// src/pages/ParticipantDashboard.jsx
import React from 'react';
import Sidebar from '../Components/ParticipantComponents/Sidebar';
import { Outlet } from 'react-router-dom';
import ParticipantHome from '../Components/ParticipantComponents/ParticipantHome';
import { motion, AnimatePresence } from 'framer-motion';

export default function ParticipantDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar with slide-in animation */}
      <motion.div
        className="w-64 shadow-md bg-white"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Sidebar userType="participant" />
      </motion.div>

      {/* Main Content with fade and slide animation */}
      <motion.main
        className="flex-1 p-6 overflow-y-auto"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Outlet />
        <ParticipantHome />
      </motion.main>
    </div>
  );
}
