import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Pages/Home.jsx';
import EventPage from './Pages/EventPage.jsx';
import TeamPage from './Pages/TeamPage.jsx';
import Profile from './Pages/Profile.jsx';
import AdminPanel from './Pages/AdminPanel.jsx';
import Navbar from './Components/Navbar.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx';
import CoachDashboard from './Pages/CoachDashboard.jsx';
import CreateEventForm from './Components/CreateEventForm.jsx';
import PerformanceTracker from './Components/PerformanceTracker.jsx';
import TeamManagement from './Components/TeamManagement.jsx';
import NotificationSystem from './Components/NotificationSystem.jsx';
import SportsPreferencesSelector from './Components/SportsPreferencesSelector.jsx';
import AuthRedirect from './Components/AuthRedirect'; // Ensure this is the correct import
import ParticipantDashboard from './Pages/ParticipantDashboard.jsx';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Authenticated Routes (All Roles) */}
        <Route path="/auth-redirect" element={<AuthRedirect />} />

        {/* All users (Authenticated) */}
        <Route path='/dashboard' element={<ParticipantDashboard/>}/>
        <Route path="/dashboardsdf" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/events" element={<EventPage />} />
        <Route path="/teams" element={<TeamPage />} />
        <Route path="/performance" element={<PerformanceTracker />} />
        <Route path="/notifications" element={<NotificationSystem />} />
        <Route path="/sports-preferences" element={<SportsPreferencesSelector />} />

        {/* Coach-specific Routes */}
        <Route path="/coach-dashboard" element={<CoachDashboard />} />
        <Route path="/create-event" element={<CreateEventForm />} />
        <Route path="/manage-teams" element={<TeamManagement />} />

        {/* Admin-specific Routes */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* Redirects */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
