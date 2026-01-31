import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import axios from "axios";

function Login() {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const { login, user: authUser } = useAuth();

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Register state
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);


  // ===== AUTO REDIRECT IF ALREADY LOGGED IN =====
  useEffect(() => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (token && storedUser) {
    const parsedUser = JSON.parse(storedUser);
    const role = parsedUser.branches?.[0]?.role;

    if (role === "OWNER" || role === "ADMIN") {
      navigate("/admin/dashboard", { replace: true });
    } else if (role === "CASHIER") {
      navigate("/select-branch", { replace: true });
    }
  }

  setCheckingAuth(false);
}, []);

if (checkingAuth) {
  return null; // or spinner
}


  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      // Save token & user in AuthContext and localStorage
      login({ token, user });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Role-based redirect
      const role = user.branches?.[0]?.role;
      if (role === "OWNER" || role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "CASHIER") {
        navigate("/select-branch", { replace: true });
      } else {
        setError("Unauthorized role");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  // ================= REGISTER OWNER =================
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (regPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        fullName,
        businessName,
        email: regEmail,
        password: regPassword,
      });

      alert(res.data.message || "Business created successfully. Please log in.");
      setActiveTab("login");

      // Reset registration form
      setFullName("");
      setBusinessName("");
      setRegEmail("");
      setRegPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          Business Management System
        </h2>

        {/* Tabs */}
        <div className="flex mb-6 border-b">
          <button
            className={`flex-1 py-2 font-semibold ${
              activeTab === "login"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 font-semibold ${
              activeTab === "register"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("register")}
          >
            Register Business
          </button>
        </div>

        {/* Error message */}
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        {/* LOGIN FORM */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {activeTab === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border rounded-lg"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Business Name"
              className="w-full p-3 border rounded-lg"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-3 border rounded-lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
              Create Business
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
