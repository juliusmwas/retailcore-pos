import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, token, role } = useAuth();

  // ⛔ Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // ⛔ Role protection
  if (roles && (!role || !roles.includes(role))) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
