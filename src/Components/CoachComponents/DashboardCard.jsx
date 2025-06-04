import { motion } from 'framer-motion';

export default function DashboardCard({ title, icon, sub = [], type }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center space-x-4">
        <div className="text-3xl">{icon}</div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      {sub.length > 0 && (
        <ul className="mt-4 text-gray-600 text-sm list-disc list-inside">
          {sub.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      )}
    </motion.div>
  );
}
