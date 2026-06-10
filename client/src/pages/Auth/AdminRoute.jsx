import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import loading from "@components/Shared/Loading";

const AdminRoute = () => {
    const { user, loading } = useAuth();
   if (loading) {
    return <loading />;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
    if (user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}