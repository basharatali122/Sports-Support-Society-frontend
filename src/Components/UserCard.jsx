import React from 'react';
import { Link } from 'react-router-dom';

const UserCard = ({ user }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition-shadow">
      <h4 className="text-lg font-semibold text-gray-800">{user.name}</h4>
      <p className="text-sm text-gray-600">{user.email}</p>
     <Link to={"/chat/"+user._id}><button>Chat</button></Link>
      
    </div>
  );
};

export default UserCard;
