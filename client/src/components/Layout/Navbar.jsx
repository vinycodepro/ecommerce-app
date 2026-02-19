import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { mainLinks } from "@/config/navigation";
import NavItem from "./Navbar/NavItem";
import UserMenu from "./UserMenu";
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="  backdrop-blur-xl
  bg-gradient-to-r from-blue-600/70 via-indigo-600/70 to-purple-600/70
  shadow-lg
  sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-white text-xl font-bold drop-shadow-lg">Vincy<span className="text-yellow-300">Web</span></Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-4 items-center">
          {mainLinks.map((link) => (
            <NavItem key={link.path} to={link.path}>{link.name}</NavItem>
          ))}

  <Link to="/cart" className="relative group">
  <ShoppingCartIcon
    className="
      h-7 w-7
      text-white
      group-hover:text-yellow-300
      transition
      drop-shadow-lg
      group-hover:scale-110
    "
  />

  {getCartItemCount() > 0 && (
    <span
      className="
        absolute -top-2 -right-2
        bg-yellow-400
        text-black
        text-xs
        font-bold
        h-5 w-5
        flex items-center justify-center
        rounded-full
        shadow-lg
        animate-pulse
      "
    >
      {getCartItemCount()}
    </span>
  )}
</Link>
     {isAuthenticated ? (
            <UserMenu user={user} logout={handleLogout} />
          ) : (
            <>
              <NavItem to="/login">Login</NavItem>
              <NavItem to="/register">Sign Up</NavItem>
            </>
          )}
        </div>

        {/* Mobile button */}
        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <XMarkIcon className="h-6" /> : <Bars3Icon className="h-6" />}
        </button>
      </div>

{open && (
  <div className="
    md:hidden
    backdrop-blur-xl
    bg-gradient-to-r from-blue-600/80 via-indigo-600/80 to-purple-600/80
    border-t border-white/20
    px-4 pb-4
    space-y-2
    shadow-2xl">

    {mainLinks.map((link) => (
      <NavItem key={link.path} to={link.path} onClick={() => setOpen(false)}>
        {link.name}
      </NavItem>
    ))}

    {isAuthenticated ? (
      <>
        <NavItem to="/wishlist" onClick={() => setOpen(false)}>Wishlist</NavItem>
        <NavItem to="/profile" onClick={() => setOpen(false)}>Profile</NavItem>
        <NavItem to="/orders" onClick={() => setOpen(false)}>Orders</NavItem>

        {user?.role === "admin" && (
          <NavItem to="/admin" onClick={() => setOpen(false)}>Admin</NavItem>
        )}

        <button
          onClick={() => {
            handleLogout();
            setOpen(false);
          }}
          className="w-full text-left px-3 py-2 text-red-600"
        >
          Logout
        </button>
      </>
    ) : (
      <>
        <NavItem to="/login" onClick={() => setOpen(false)}>Login</NavItem>
        <NavItem to="/register" onClick={() => setOpen(false)}>Sign Up</NavItem>
      </>
    )}

  </div>
)}

    </nav>
  );
}
