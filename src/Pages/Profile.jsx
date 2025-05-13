import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EditProfileForm({ profile, onCancel }) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    sportsPreferences: profile?.sportsPreferences?.join(', ') || '',
    achievements: profile?.achievements?.join(', ') || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle profile update logic
    console.log('Updated Profile:', formData);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-white shadow-lg p-4">
      <label className="block mb-2">Name:
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="input input-bordered w-full" />
      </label>
      <label className="block mb-2">Email:
        <input type="email" name="email" value={formData.email} onChange={handleChange} className="input input-bordered w-full" />
      </label>
      <label className="block mb-2">Sports Preferences:
        <input type="text" name="sportsPreferences" value={formData.sportsPreferences} onChange={handleChange} className="input input-bordered w-full" />
      </label>
      <label className="block mb-2">Achievements:
        <input type="text" name="achievements" value={formData.achievements} onChange={handleChange} className="input input-bordered w-full" />
      </label>
      <div className="flex justify-end mt-4">
        <button type="button" onClick={onCancel} className="btn btn-secondary mr-2">Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  );
}

function Profile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3000/users/:userId/approve', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(response => setProfile(response.data))
      .catch(() => alert('Error fetching profile'));
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Profile</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>
      {editMode ? (
        <EditProfileForm profile={profile} onCancel={() => setEditMode(false)} />
      ) : (
        profile && (
          <div className="card bg-white shadow-lg p-4">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Sports Preferences:</strong> {profile.sportsPreferences?.join(', ')}</p>
            <p><strong>Achievements:</strong> {profile.achievements?.join(', ')}</p>
          </div>
        )
      )}
    </div>
  );
}

export default Profile;