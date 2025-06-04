import { motion } from "framer-motion";

export default function DashboardCard({ title, icon, sub = [], type }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-all"
    >
      <div className="flex items-center space-x-4">
        <div className="text-blue-600 text-3xl">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>

      {sub.length > 0 && (
        <ul className="mt-4 text-gray-600 text-sm list-disc list-inside space-y-1">
          {sub.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}

      {type === "chart" && (
        <div className="h-24 bg-gray-100 mt-4 rounded-lg animate-pulse" />
      )}
    </motion.div>
  );
}
