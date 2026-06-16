// ProfilePage.jsx
import React, { useState, useEffect } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import Loading from "@/components/Shared/Loading";
import api from "@/services/api";

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/users/profile")
      .then(res => {
        setUser(res.data);
        console.log("Fetched user profile:", res.data);
      })
      .catch(err => console.error(err));
  }, []);

  if (!user) return <Loading />;

  return (
    <div className="profile-page max-w-4xl mx-auto p-4">
      <ProfileHeader user={user} />
      <ProfileTabs user={user} />
    </div>
  );
};

export default ProfilePage;
