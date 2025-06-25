import { Link } from 'react-router-dom';
import DashboardCard from './DashboardCard';

const cards = [

  { title: 'Manage Participants', icon: '🧑‍🤝‍🧑', path: '/admin/user-management' },
  { title: 'Approve Teams', icon: '✅', path: '/admin/pending-teams' },
  { title: 'Approve Events', icon: '✅', path: '/admin/pending-event' },
  { title: 'Schedule Events', icon: '🗓️', path: '/admin/events' },

  { title: 'Manage Sports Categories', icon: '🏆', path: '/admin/sports-categories' },

  { title: 'Reports', icon: '📊', path: '/admin/reports' },
];

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, i) => (
        <Link to={card.path} key={i}>
          <DashboardCard {...card} />
        </Link>
      ))}
    </div>
  );
}
