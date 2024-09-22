import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ProfilePage.css';

type User = {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
};

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const { userId } = useParams<{ userId: string }>();

   // Get the logged-in user's ID from localStorage
   const loggedInUser = localStorage.getItem('user');
   const loggedInUserId = loggedInUser ? JSON.parse(loggedInUser)._id : null;

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const profileUrl = userId === 'me' ? '/me' : `/${userId}`; // If URL is `/me`, fetch the logged-in user's profile

      try {
        const response = await fetch(`http://localhost:7999/api/profile${profileUrl}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in Authorization header
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadProfileImage(file);
    }
  };

  const uploadProfileImage = async (file: File) => {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const response = await fetch(`http://localhost:7999/api/profile/update-profile-image/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
        body: formData,
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
      } else {
        console.error('Failed to upload profile image');
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img
          src={user.profileImage ? `http://localhost:7999/${user.profileImage}` : 'https://github.com/malhaouit/helper/blob/main/default%20profile.png?raw=true'}
          alt={user.name}
          className="profile-image"
        />
        <h2>{user.name}</h2>
        
        {/* Buttons container */}
        <div className="profile-buttons">
          <button className="follow-button">Follow</button>
          <button className="contact-button">Contact</button>
        </div>
      </div>

      {/* Show profile image upload input only if the logged-in user is the profile owner */}
      {userId === 'me' || loggedInUserId === user._id ? (
        <div className="profile-image-upload">
          <input type="file" accept="image/*" onChange={handleProfileImageUpload} />
        </div>
      ) : null}
    </div>
  );
  
};

export default ProfilePage;