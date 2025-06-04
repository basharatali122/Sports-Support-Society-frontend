import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'User Management', path: '/admin/user-management' },
  { label: 'Create Event', path: '/admin/events' },
  { label: 'Pending Event', path: '/admin/pending-event' },
  { label: 'Pending Teams', path: '/admin/pending-teams' },
  { label: 'Messages', path: '/admin/messages' },
  { label: 'Sports Categories', path: '/admin/sports-categories' },
  { label: 'Reports', path: '/admin/reports' }
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 80, damping: 12 }}
      className="w-64 h-screen bg-white text-gray-800 border-r border-gray-200 shadow-md p-6"
    >
      <h2 className="text-2xl font-bold mb-8 text-blue-600">Admin Panel</h2>

      <nav className="flex-1 space-y-2">
        {navItems.map(({ label, path }) => {
          const isActive = location.pathname === path;

          return (
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
              key={label}
            >
              <Link
                to={path}
                className={`block px-4 py-2 rounded-lg text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {label}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </motion.aside>
  );
}
