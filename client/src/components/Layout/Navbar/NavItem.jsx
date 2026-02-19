import { Link } from "react-router-dom";

export default function NavItem({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="text-white hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition"
    >
      {children}
    </Link>
  );
}
