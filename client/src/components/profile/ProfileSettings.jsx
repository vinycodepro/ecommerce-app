// ProfileSettings.jsx
import React, { useState } from "react";
import { useEffect } from "react";

const ProfileSettings = ({ user }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, []);

  const handleUpdate = async e => {
    e.preventDefault();
  
    try 
    {
      const response = await fetch("https://ecommerce-app-1-pxaw.onrender.com/api/profile", {
        credentials: "include",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });
      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating your profile. Please try again.");
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