// src/components/Sidebar.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Sidebar({ userType }) {
  const navItems = userType === 'participant'
    ? [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'My Events', path: '/dashboard/register-event' },
        { label: 'My Teams', path: '/dashboard/join-team' },
        
          { label: 'Chats', path: '/feed' },
        { label: 'Performance', path: '/dashboard/stats' },
        

      ]
    : [
        // fallback to admin links if needed
      ];

  return (
    <aside className="h-screen bg-white text-gray-800 shadow-lg p-6 border-r border-gray-200">
      <motion.h2
        className="text-2xl font-bold mb-8"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        User Panel
      </motion.h2>

      <nav className="space-y-3">
        {navItems.map(({ label, path }) => (
          <motion.div
            key={label}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
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
    </aside>
  );
}
