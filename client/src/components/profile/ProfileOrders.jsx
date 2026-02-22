// ProfileOrders.jsx
import React from "react";

const ProfileOrders = ({ orders }) => {
  if (!orders || orders.length === 0) return <p>No orders yet.</p>;

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <div key={order._id} className="p-4 border rounded shadow-sm">
          <p>Order ID: {order._id}</p>
          <p>Status: {order.status}</p>
          <p>Total: ${order.total}</p>
        </div>
      ))}
    </div>
  );
};

export default ProfileOrders;