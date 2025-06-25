import { Link } from 'react-router-dom';
import DashboardCard from './DashboardCard';

const cards = [
  { title: 'Manage Participants', icon: '🧑‍🤝‍🧑', path: '/coach-dashboard/view-users' },
  { title: 'Schedule Events', icon: '🗓️', path: '/coach-dashboard/create-events' },
  { title: 'Manage Chats', icon: '📨',  path: '/feed' },
  { title: 'Schedule Teams', icon: '👥', path: '/coach-dashboard/create-teams' },
  { title: 'Reports', icon: '📊', path: '/coach-dashboard/reports' },
  { title: 'Event Registrations', icon: '📊', path: '/coach-dashboard/eventRegister' },
];

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <Link to={card.path} key={index}>
            <DashboardCard title={card.title} icon={card.icon} />
          </Link>
        ))}
      </div>
    </div>
  );
}
