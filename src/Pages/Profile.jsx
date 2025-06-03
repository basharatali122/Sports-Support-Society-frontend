import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EditProfileForm({ profile, onCancel, onSave }) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    sportsPreferences: profile?.sportsPreferences?.join(', ') || '',
    achievements: profile?.achievements?.join(', ') || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      ...formData,
      sportsPreferences: formData.sportsPreferences.split(',').map(item => item.trim()),
      achievements: formData.achievements.split(',').map(item => item.trim()),
    };

    try {
      const userId = localStorage.getItem('userId'); // Make sure userId is stored in localStorage
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:3000/users/${userId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSave(response.data); // update profile in parent
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
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
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Must store userId in localStorage during login
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Error fetching profile');
      }
    };

    fetchProfile();
  }, []);

  const handleSave = (updatedProfile) => {
    setProfile(updatedProfile);
    setEditMode(false);
  };

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
        <EditProfileForm profile={profile} onCancel={() => setEditMode(false)} onSave={handleSave} />
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


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';


// const ViewProfile = () => {
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await axios.get(`http://localhost:3000/profile/getProfile`, { withCredentials: true });
//         setUser(res?.data?.data);
//       } catch (err) {
//         setError(err.response?.data || 'Failed to fetch profile.');
//       }
//     };

//     fetchProfile();
//   }, []);

//   if (error) return <p className="text-red-500 text-center mt-5">{error}</p>;
//   if (!user) return <p className="text-center mt-5">Loading profile...</p>;

//   return (
//     <div className="flex justify-center mt-10">
//       <div className="card bg-base-200 shadow-xl w-96">
//         <figure>
//           <img
//             src={user.photoUrl || "https://via.placeholder.com/150"}
//             alt="User"
//             className="w-full h-60 object-cover"
//           />
//         </figure>
//         <div className="card-body">
//           <h2 className="card-title text-xl justify-center">{user.firstName} {user.lastName}</h2>
//           <p><strong>Email:</strong> {user.email}</p>
//           <p><strong>Age:</strong> {user.age || 'N/A'}</p>
//           <p><strong>Gender:</strong> {user.gender || 'N/A'}</p>
//           <p><strong>About:</strong> {user.about || 'N/A'}</p>
//           <p><strong>Role:</strong> {user.role}</p>
//           <p><strong>Status:</strong> {user.accountStatus}</p>
//           <p><strong>Approval Status:</strong> {user.approvalStatus}</p>

//           {user.sportsPreferences?.length > 0 && (
//             <div>
//               <strong>Sports Preferences:</strong>
//               <ul className="list-disc ml-5">
//                 {user.sportsPreferences.map((sport, i) => (
//                   <li key={i}>{sport}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewProfile;
