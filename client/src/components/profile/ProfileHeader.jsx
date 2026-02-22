// ProfileHeader.jsx
import React from "react";

const ProfileHeader = ({ user }) => {
  return (
    <div className="profile-header flex items-center space-x-4 mb-6">
      <img
        src={user.profilePic || "/default-avatar.png"}
        alt="Profile"
        className="w-24 h-24 rounded-full object-cover"
      />
      <div>
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;