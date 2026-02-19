import { Link } from "react-router-dom";
import { UserIcon } from "@heroicons/react/24/outline";
import { userLinks, adminLinks } from "../../config/navigation";

export default function UserMenu({ user, logout }) {
  return (
    <div className="relative group">
      <button className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2">
        <UserIcon className="h-5 w-5 mr-1" />
        {user?.name}
      </button>

      <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
        {userLinks.map((item) => (
          <Link key={item.path} to={item.path} className="block px-4 py-2 hover:bg-gray-100">
            {item.name}
          </Link>
        ))}

        {user?.role === "admin" &&
          adminLinks.map((item) => (
            <Link key={item.path} to={item.path} className="block px-4 py-2 hover:bg-gray-100">
              {item.name}
            </Link>
          ))}

        <button
          onClick={logout}
          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
