// ProfileSettings.jsx
import React, { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

const ProfileSettings = ({ user }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleUpdate = async e => {
    e.preventDefault();
  
    try 
    {
      const response = await api.put("/users/profile", {
        name,
        email
      });
      if (response.status === 200) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating your profile. Please try again.");
    }

  };

  return (
    <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
      <div>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Update Profile
      </button>
    </form>
  );
};

export default ProfileSettings;