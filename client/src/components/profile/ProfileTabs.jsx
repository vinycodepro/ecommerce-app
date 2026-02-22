// ProfileTabs.jsx
import React, { useState } from "react";
import ProfileOrders from "./ProfileOrders";
import ProfileSettings from "./ProfileSettings";
import ProfileWishlist from "./ProfileWishlist";

const ProfileTabs = ({ user }) => {
  const [tab, setTab] = useState("orders");

  return (
    <div>
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 ${tab === "orders" ? "border-b-2 font-bold" : ""}`}
          onClick={() => setTab("orders")}
        >
          Orders
        </button>
        <button
          className={`px-4 py-2 ${tab === "settings" ? "border-b-2 font-bold" : ""}`}
          onClick={() => setTab("settings")}
        >
          Settings
        </button>
        <button
          className={`px-4 py-2 ${tab === "wishlist" ? "border-b-2 font-bold" : ""}`}
          onClick={() => setTab("wishlist")}
        >
          Wishlist
        </button>
      </div>

      <div className="tab-content">
        {tab === "orders" && <ProfileOrders orders={user.orders} />}
        {tab === "settings" && <ProfileSettings user={user} />}
        {tab === "wishlist" && <ProfileWishlist wishlist={user.wishlist} />}
      </div>
    </div>
  );
};

export default ProfileTabs;