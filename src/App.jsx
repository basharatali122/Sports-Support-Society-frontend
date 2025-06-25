import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// General Components
import Home from './Pages/Home.jsx';
import Navbar from './Components/Navbar.jsx';


// Authenticate Component
import Register from './Pages/Register.jsx';
import Login from './Pages/Login.jsx';

// Admin Components
import AdminPanel from './Pages/AdminPanel.jsx';
import SendNotification from './Components/AdminComponents/SendNotification.jsx';
import CreateEvent from './Components/AdminComponents/CreateEvent.jsx';
import PendingEvents from './Components/AdminComponents/PendingEvents.jsx';
import PendingTeams from './Components/AdminComponents/PendingTeams.jsx';
import SportsCategories from './Components/AdminComponents/SportsCategories.jsx';
import ManageUser from './Components/AdminComponents/ManageUser.jsx';
import AdminReports from "./Components/AdminComponents/Reports.jsx"

// Coach Components
import CoachDashboard from './Pages/CoachDashboard.jsx';
import CreateTeams from './Components/CoachComponents/CreateTeams.jsx';
import CreateEvents from "./Components/CoachComponents/CreateEvents.jsx"
import ViewUsers from "./Components/CoachComponents/ManageUser.jsx"
import CoachMessage from "./Components/CoachComponents/Message.jsx";
import CoachReports from "./Components/CoachComponents/Reports.jsx";

// Participant/User Component
import ParticipantDashboard from './Pages/ParticipantDashboard.jsx';
import UserStatsDashboard from "./Components/ParticipantComponents/UserStats.jsx";
import RegisterForEvent from './Components/ParticipantComponents/RegisterForEvent.jsx';
import JoinTeam from './Components/ParticipantComponents/JoinTeam.jsx';
import UserMessage from './Components/ParticipantComponents/UserMessage.jsx';
import Feedback from "./Components/ParticipantComponents/Feedback.jsx"
import ViewProfile from './Pages/Profile.jsx';

// UseContext Component
import AuthRedirect from './Components/AuthRedirect'; // Ensure this is the correct import

// Redux Component
import { Provider } from 'react-redux'

import Profile from './Pages/Profile.jsx';
import appStore from './Utils/appStore.js';
import Feed from './Components/Feed.jsx';

import Chat from './Components/Chat.jsx';
import EventRegister from './Components/ParticipantComponents/EventRegister.jsx';
import CoachRegistrations from './Components/CoachEventRegistrations.jsx';


function App() {
  return (
    <Provider store={appStore}>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          

          {/* Authenticated Routes (All Roles) */}
          <Route path="/auth-redirect" element={<AuthRedirect />} />

          {/* All userss feed Component  */}
          <Route path='/feed' element={<Feed />}></Route>
          <Route path="/chat/:requestId" element={<Chat/>}></Route>
          {/* All users (Authenticated) */}
          <Route path='/dashboard' element={<ParticipantDashboard />} />
          <Route path='/dashboard/register-event' element={<RegisterForEvent />} />
          <Route path='/register/:eventId' element={<EventRegister></EventRegister>}></Route>
          <Route path='/dashboard/join-team' element={<JoinTeam />} />
          <Route path="/dashboard/stats" element={<UserStatsDashboard />} />
          <Route path="/dashboard/message" element={<UserMessage />} />
          <Route path="/dashboard/profile" element={<ViewProfile />} />
          <Route path="/dashboard/feedback" element={<Feedback />} />


          {/* Coach-specific Routes */}
          <Route path="/coach-dashboard" element={<CoachDashboard />} />
          <Route path="/coach-dashboard/create-teams" element={<CreateTeams />} />
          <Route path="/coach-dashboard/create-events" element={<CreateEvents />} />
          <Route path="/coach-dashboard/view-users" element={<ViewUsers />} />
          <Route path="/coach-dashboard/messages" element={<CoachMessage />} />
          <Route path="/coach-dashboard/reports" element={<CoachReports />} />
          <Route path='/coach-dashboard/eventRegister' element={<CoachRegistrations></CoachRegistrations>}></Route>

          {/* Admin-specific Routes */}
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/user-management" element={<ManageUser />} />
          <Route path="/admin/messages" element={<SendNotification />} />
          <Route path="/admin/events" element={<CreateEvent />} />
          <Route path="/admin/pending-event" element={<PendingEvents />} />
          <Route path="/admin/pending-teams" element={<PendingTeams />} />
          <Route path="/admin/sports-categories" element={<SportsCategories />} />
          <Route path="/admin/reports" element={<AdminReports />} />

          {/* Redirects */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
