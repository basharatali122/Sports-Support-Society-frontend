// DashboardRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../Components/Dashboard';
import ManageUser from '../Components/AdminComponents/ManageUser';
import CreateEvent from '../Components/AdminComponents/CreateEvent';
import PendingEvents from '../Components/AdminComponents/PendingEvents';
import PendingTeams from '../Components/AdminComponents/PendingTeams';
import SendNotification from '../Components/AdminComponents/SendNotification';
import SportsCategories from '../Components/AdminComponents/SportsCategories';
// ... import other components

export default function DashboardRoutes() {
  return (
    // <Routes>
    //   <Route index element={<Dashboard />} />
    //   <Route path="manage-user" element={<ManageUser />} />
    //   <Route path="create-events" element={<CreateEvent />} />
    //   <Route path="pending-events" element={<PendingEvents />} />
    //   <Route path="pending-teams" element={<PendingTeams />} />
    //   <Route path="send-notificaiton" element={<SendNotification />} />
    //   <Route path="sports-categories" element={<SportsCategories />} />
    // </Routes>
    <div>

    <Dashboard />
    {/* <ManageUser /> */}
    </div>
  );
}
