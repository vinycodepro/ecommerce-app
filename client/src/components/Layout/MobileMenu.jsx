import { Link } from 'react-router-dom';

const MobileMenu = ({ isOpen, isAuthenticated, user, handleLogout, setIsMenuOpen }) => {
  if (!isOpen) return null;

  const close = () => setIsMenuOpen(false);

  return (
    <div className="md:hidden bg-white border-t border-gray-200">
      <div className="px-2 pt-2 pb-3 space-y-1">
        <Link to="/products" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md" onClick={close}>
          Products
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/wishlist" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md" onClick={close}>
              Wishlist
            </Link>
            <Link to="/profile" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md" onClick={close}>
              Profile
            </Link>
            <Link to="/orders" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md" onClick={close}>
              Orders
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md" onClick={close}>
                Admin Dashboard
              </Link>
            )}
            <button
              onClick={() => { handleLogout(); close(); }}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md" onClick={close}>
              Login
            </Link>
            <Link to="/register" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md" onClick={close}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;