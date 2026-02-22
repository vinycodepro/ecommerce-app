// ProfileSettings.jsx
import React, { useState } from "react";

const ProfileSettings = ({ user }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const handleUpdate = e => {
    e.preventDefault();
    // call your API to update user info
    console.log("Updating user info", { name, email });
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