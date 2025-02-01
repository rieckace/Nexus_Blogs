import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import '../Styles/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { user: contextUser, setUser: setContextUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, [contextUser.username]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/profile/${contextUser.username}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setUser(data.user);
      setEditedUser(data.user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const response = await fetch(`http://localhost:4000/api/profile/upload-avatar`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
        if (!response.ok) throw new Error('Failed to upload image');
        const data = await response.json();
        setUser(prev => ({ ...prev, avatar: data.avatarUrl }));
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/api/profile/update`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      const data = await response.json();
      setUser(data.user);
      setIsEditing(false);
      setContextUser(data.user);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:4000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setContextUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="avatar-section">
          <img 
            src={imagePreview || user.avatar || '/default-avatar.png'} 
            alt={user.username} 
            className="profile-avatar" 
          />
          <input
            type="file"
            id="avatar-upload"
            className="avatar-upload"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label htmlFor="avatar-upload" className="upload-button">
            Change Photo
          </label>
        </div>

        {!isEditing ? (
          <div className="profile-info">
            <h1 className="profile-name">{user.username}</h1>
            <p className="profile-email"><strong>Email:</strong> {user.email}</p>
            <p className="profile-location"><strong>Location:</strong> {user.location}</p>
            <p className="profile-phone"><strong>Phone:</strong> {user.phone}</p>
            <p className="profile-bio">{user.bio}</p>
            <div className="profile-actions">
              <button 
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
              <button 
                className="logout-button"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          </div>
        ) : (
          <form className="edit-form" onSubmit={handleEditSubmit}>
            <input
              type="text"
              value={editedUser.username}
              onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
              placeholder="Username"
            />
            <input
              type="email"
              value={editedUser.email}
              onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
              placeholder="Email"
            />
            <input
              type="text"
              value={editedUser.location}
              onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
              placeholder="Location"
            />
            <input
              type="tel"
              value={editedUser.phone}
              onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
              placeholder="Phone"
            />
            <textarea
              value={editedUser.bio}
              onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
              placeholder="Bio"
            />
            <div className="edit-actions">
              <button type="submit" className="save-button">Save Changes</button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => {
                  setIsEditing(false);
                  setEditedUser(user);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;