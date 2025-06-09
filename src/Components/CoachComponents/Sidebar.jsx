import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'View Users', path: '/coach-dashboard/view-users' },
  { label: 'Create Events', path: '/coach-dashboard/create-events' },
  { label: 'Create Teams', path: '/coach-dashboard/create-teams' },
  { label: 'Chats', path: '/feed' },
  { label: 'Reports', path: '/coach-dashboard/reports' }
];

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-64 h-screen bg-white text-gray-800 shadow-lg flex flex-col p-6 border-r border-gray-200"
    >
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold mb-8 text-gray-900"
      >
        Coach Panel
      </motion.h2>

      <nav className="flex-1 space-y-3">
        {navItems.map(({ label, path }, index) => (
          <motion.div
            key={label}
            whileHover={{ x: 6 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Link
              to={path}
              className="block px-4 py-2 rounded-lg text-base font-medium hover:bg-gray-100 transition-colors"
            >
              {label}
            </Link>
          </motion.div>
        ))}
      </nav>
    </motion.aside>
  );
}
