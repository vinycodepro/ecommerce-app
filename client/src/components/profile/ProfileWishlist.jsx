// ProfileWishlist.jsx
import React from "react";

const ProfileWishlist = ({ wishlist }) => {
  if (!wishlist || wishlist.length === 0) return <p>No items in wishlist.</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {wishlist.map(item => (
        <div key={item._id} className="p-2 border rounded">
          <img src={item.image} alt={item.name} className="w-full h-32 object-cover" />
          <p>{item.name}</p>
          <p>${item.price}</p>
        </div>
      ))}
    </div>
  );
};

export default ProfileWishlist;