import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, token, authLoading } = useAuth();

  if (authLoading) return null;

  // 1. Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Role protection
  if (roles) {
    // Check if the user has the required role globally (on the User object)
    // OR if their first branch has the required role.
    const userGlobalRole = user.role; // e.g., "OWNER"
    const userBranchRole = user.branches?.[0]?.role;

    const hasAccess = roles.includes(userGlobalRole) || roles.includes(userBranchRole);

    if (!hasAccess) {
      // If they are authenticated but don't have the right role, 
      // maybe send them to a "Not Authorized" page instead of login 
      // to prevent loops.
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}