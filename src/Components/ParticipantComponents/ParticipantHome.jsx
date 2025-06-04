import React from 'react';
import { Link } from 'react-router-dom';

const quickActions = [
  { title: 'Register for Events', icon: '🗓️', path: '/dashboard/register-event' },
  { title: 'Join a Team', icon: '🤝', path: '/dashboard/join-team' },
  { title: 'My Profile', icon: '👤', path: '/dashboard/profile' },
  { title: 'Performance', icon: '📊', path: '/dashboard/stats' },
];

export default function ParticipantHome() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Your Dashboard!</h1>
        <p className="text-gray-600 mt-1">Quick access to everything you need.</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {quickActions.map(({ title, icon, path }) => (
          <Link
            key={title}
            to={path}
            className="flex flex-col items-center bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow duration-300"
          >
            <div className="text-5xl mb-3">{icon}</div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          </Link>
        ))}
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Summary</h2>
        <div className="flex flex-wrap gap-6">
          <div className="flex-1 min-w-[150px] p-4 bg-blue-100 rounded-lg text-blue-700">
            <h3 className="text-2xl font-bold">3</h3>
            <p>Upcoming Events</p>
          </div>
          <div className="flex-1 min-w-[150px] p-4 bg-green-100 rounded-lg text-green-700">
            <h3 className="text-2xl font-bold">2</h3>
            <p>Teams Joined</p>
          </div>
          <div className="flex-1 min-w-[150px] p-4 bg-yellow-100 rounded-lg text-yellow-700">
            <h3 className="text-2xl font-bold">5</h3>
            <p>New Notifications</p>
          </div>
        </div>
      </section>
    </div>
  );
}
