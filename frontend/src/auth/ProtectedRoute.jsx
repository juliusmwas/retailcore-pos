import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, token, authLoading } = useAuth();

  // ⏳ Wait for auth to load
  if (authLoading) {
    return null; // or spinner
  }

  // ⛔ Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // ⛔ Role protection
  if (
    roles &&
    (!user.branches?.length ||
      !roles.includes(user.branches[0].role))
  ) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
