import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { mainLinks } from "@/config/navigation";
import NavItem from "./Navbar/NavItem";
import UserMenu from "./UserMenu";
import Searchbar from "../UI/Searchbar";
import { Menu as Bars3Icon, ShoppingCart, X as XMarkIcon } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const cartCount = getCartItemCount();
  const isProductRoute =
    location.pathname === "/products" || location.pathname.startsWith("/products/");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      className="sticky top-0 z-50 bg-gradient-to-r from-blue-600/70 via-indigo-600/70 to-purple-600/70 shadow-lg backdrop-blur-xl"
    >
      <div className={`mx-auto max-w-7xl px-4 ${isProductRoute ? "py-2 md:h-14 md:py-0" : "py-3 md:h-16 md:py-0"}`}>
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className={`shrink-0 font-bold text-white drop-shadow-lg ${isProductRoute ? "text-base sm:text-lg" : "text-lg sm:text-xl"}`}
          >
            Vincy<span className="text-yellow-300">Shop</span>
          </Link>

          {!isProductRoute && (
            <Searchbar className="hidden md:block md:flex-1 md:max-w-sm lg:max-w-md" />
          )}

          <div className="hidden items-center space-x-4 md:flex lg:space-x-5">
            {mainLinks.map((link) => (
              <NavItem key={link.path} to={link.path}>
                {link.name}
              </NavItem>
            ))}

            <Link to="/cart" className="relative group">
              <ShoppingCart
                className={`${isProductRoute ? "h-6 w-6" : "h-7 w-7"} text-white transition drop-shadow-lg group-hover:scale-110 group-hover:text-yellow-300`}
              />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-black shadow-lg animate-pulse">
                  {cartCount}
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

          <div className="flex items-center gap-3 md:hidden">
            <Link to="/cart" className="relative text-white">
              <ShoppingCart className={`${isProductRoute ? "h-5 w-5" : "h-6 w-6"}`} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-400 px-1 text-[10px] font-bold text-black">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className="text-white"
              aria-label="Toggle menu"
            >
              {open ? (
                <XMarkIcon className={`${isProductRoute ? "h-5 w-5" : "h-6 w-6"}`} />
              ) : (
                <Bars3Icon className={`${isProductRoute ? "h-5 w-5" : "h-6 w-6"}`} />
              )}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="space-y-3 border-t border-white/20 bg-gradient-to-r from-blue-600/80 via-indigo-600/80 to-purple-600/80 px-4 pb-4 pt-4 shadow-2xl md:hidden backdrop-blur-xl">
          {!isProductRoute && <Searchbar className="w-full" />}

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
                className="w-full px-3 py-2 text-left text-red-100"
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
