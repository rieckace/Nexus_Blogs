import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import '../Styles/Profile.css';
import { apiFetch } from '../api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [avatarBuster, setAvatarBuster] = useState(0);
  const [status, setStatus] = useState('');
  const { user: contextUser, setUser: setContextUser, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!contextUser?.username) {
      navigate('/login');
      return;
    }
    fetchUserProfile(contextUser.username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextUser?.username, loading]);

  const fetchUserProfile = async (username) => {
    try {
      setStatus('');
      const response = await apiFetch(`/profile/${encodeURIComponent(username)}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setUser(data.user);
      setEditedUser(data.user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setStatus('Failed to load profile.');
    }
  };

  const getAvatarSrc = () => {
    if (imagePreview) return imagePreview;
    if (!user?.avatar) return '/default-avatar.png';
    if (typeof user.avatar === 'string' && user.avatar.startsWith('data:')) return user.avatar;
    return `${user.avatar}${user.avatar.includes('?') ? '&' : '?'}v=${avatarBuster}`;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setStatus('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const username = contextUser?.username;
        if (!username) {
          setStatus('Please login again.');
          return;
        }

        setStatus('Uploading photo...');
        const response = await apiFetch(`/profile/${encodeURIComponent(username)}/avatar`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) throw new Error('Failed to upload image');
        const data = await response.json();
        setUser(prev => (prev ? { ...prev, avatar: data.avatarUrl } : prev));
        setContextUser(prev => (prev ? { ...prev, avatar: data.avatarUrl } : prev));
        setAvatarBuster(Date.now());
        setImagePreview(null);
        setStatus('Photo updated.');
      } catch (error) {
        console.error('Error uploading image:', error);
        setStatus('Photo upload failed.');
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const username = contextUser?.username;
      if (!username) {
        setStatus('Please login again.');
        return;
      }
      setStatus('Saving...');
      const response = await apiFetch(`/profile/${encodeURIComponent(username)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: editedUser?.email,
          location: editedUser?.location,
          phone: editedUser?.phone,
          bio: editedUser?.bio,
        }),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      const data = await response.json();
      setUser(data.user);
      setIsEditing(false);
      setContextUser(prev => (prev ? { ...prev, ...data.user } : data.user));
      setStatus('Profile updated.');
    } catch (error) {
      console.error('Error updating profile:', error);
      setStatus('Failed to update profile.');
    }
  };

  const handleLogout = async () => {
    try {
      await apiFetch(`/auth/logout`, {
        method: 'POST',
      });
      setContextUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading || !user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
        <div className="avatar-section">
          <img 
            src={getAvatarSrc()} 
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

        {status ? <div className="profile-status">{status}</div> : null}

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
              placeholder="Username"
              disabled
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
    </div>
  );
};

export default Profile;