import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import SelectBranch from "./pages/SelectBranch";
import POS from "./pages/POS";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />

          {/* After login */}
          <Route
            path="/select-branch"
            element={
              <ProtectedRoute>
                <SelectBranch />
              </ProtectedRoute>
            }
          />

          {/* Staff POS */}
          <Route
            path="/pos"
            element={
              <ProtectedRoute>
                <POS />
              </ProtectedRoute>
            }
          />

          {/* Admin / Owner */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Index />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
