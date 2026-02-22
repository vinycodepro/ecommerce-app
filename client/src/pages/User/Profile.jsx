// ProfilePage.jsx
import React, { useState, useEffect } from "react";
import ProfileHeader from "../components/ProfileHeader";
import ProfileTabs from "../components/ProfileTabs";

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // or use cookies
    fetch("/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));
  }, []);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-page max-w-4xl mx-auto p-4">
      <ProfileHeader user={user} />
      <ProfileTabs user={user} />
    </div>
  );
};

export default ProfilePage;