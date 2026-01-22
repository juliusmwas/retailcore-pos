import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, activeBranch } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!activeBranch) {
    return <Navigate to="/select-branch" replace />;
  }

  return children;
}
