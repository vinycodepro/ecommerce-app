// ProfilePage.jsx
import React, { useState, useEffect } from "react";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import ProfileTabs from "@/components/Profile/ProfileTabs";

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me", {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        console.log("Fetched user profile:", data);
      })
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