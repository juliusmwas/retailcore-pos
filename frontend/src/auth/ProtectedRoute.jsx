// src/auth/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, token } = useAuth();

  // ⛔ Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // ⛔ Role protection (only if roles are provided)
  if (
    roles &&
    (!user.branches ||
      user.branches.length === 0 ||
      !roles.includes(user.branches[0].role))
  ) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Authorized
  return children;
}
