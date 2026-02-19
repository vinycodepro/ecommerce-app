import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useContext } from "react";
import { CartContext } from "../../contexts/CartContext";

function Cart() {
  const { cart, removeFromCart } = useContext(CartContext);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty, 0
  );

  return (
    <div>
      <h2>Your Cart</h2>

      {cart.map(item => (
        <div key={item._id}>
          <h4>{item.name}</h4>
          <p>Qty: {item.qty}</p>
          <p>KES {item.price * item.qty}</p>
          <button onClick={() => removeFromCart(item._id)}>Remove</button>
        </div>
      ))}

      <h3>Total: KES {total}</h3>
      <button>Checkout</button>
    </div>
  );
}

export default Cart;
