import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserCard from './UserCard';

const Feed = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllUsers = async () => {
  const response = await axios.get("http://localhost:3000/users/getAllUsers");
  return response.data;
};

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchAllUsers();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading users...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6 text-center">User Feed</h2>
      {users.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <ul className="space-y-4">
          {users.map(user => (
            <li key={user._id}>
              <UserCard user={user} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Feed;
