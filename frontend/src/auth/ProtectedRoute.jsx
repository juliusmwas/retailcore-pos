import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, roles }) {
  // Extract 'role' directly—this is the one we normalized in AuthContext
  const { user, token, role, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 animate-pulse">Verifying credentials...</p>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (roles) {
    // We use the 'role' from useAuth which we already forced to UPPERCASE
    const userRole = role?.toUpperCase();
    const normalizedRequiredRoles = roles.map(r => r.toUpperCase());

    console.log("Guard Check:", { userRole, allowed: normalizedRequiredRoles });

    if (!userRole || !normalizedRequiredRoles.includes(userRole)) {
      console.error("Access Denied: Missing required role", roles);
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}