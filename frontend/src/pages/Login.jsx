import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ Added useLocation
import { useAuth } from "../auth/AuthContext";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { login } = useAuth();

  const [activeTab, setActiveTab] = useState("login");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if we arrived here because of an expiry
  const sessionExpired = new URLSearchParams(location.search).get("reason") === "expired";

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register state
  const [regData, setRegData] = useState({
    fullName: "",
    businessName: "",
    email: "",
    phone: "",
    country: "Kenya",
    industryType: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegChange = (e) => {
    setRegData({ ...regData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      const parsed = JSON.parse(storedAuth);
      const role = parsed.user?.role || parsed.user?.branches?.[0]?.role || "OWNER";

      if (role === "OWNER" || role === "ADMIN") {
        const hasBranches = parsed.user?.branches?.length > 0 || parsed.branches?.length > 0;
        const target = hasBranches ? "/admin/dashboard" : "/admin/branches";
        navigate(target, { replace: true });
      } else if (role === "CASHIER") {
        navigate("/select-branch", { replace: true });
      }
    }
    setCheckingAuth(false);
  }, [navigate]);

  if (checkingAuth) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      const { token, user, business, branches } = res.data;

      login({ token, user, business, branches });

      const userRole = user.role || user.branches?.[0]?.role || "OWNER";
      
      if (userRole === "OWNER" || userRole === "ADMIN") {
        navigate("/admin/branches", { replace: true }); 
      } else {
        navigate("/select-branch", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (regData.password !== regData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", regData);
      if (res.data.token) {
        login(res.data);
        navigate("/admin/branches", { replace: true });
      } else {
        alert("Registration successful! Please log in.");
        setActiveTab("login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">

        {sessionExpired && (
          <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 animate-pulse">
            <div className="mt-0.5 font-bold">⚠️</div>
            <div>
              <p className="font-bold text-sm">Session Expired</p>
              <p className="text-xs">For your security, you've been logged out. Please sign in again.</p>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Business Management System
        </h2>

        <div className="flex mb-6 border-b">
          <button
            className={`flex-1 py-2 font-semibold transition ${activeTab === "login" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 font-semibold transition ${activeTab === "register" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("register")}
          >
            Register Business
          </button>
        </div>

        {error && <p className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4 text-center border border-red-100">{error}</p>}

        {activeTab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-blue-300"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        )}

        {activeTab === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="fullName" type="text" placeholder="Owner Full Name" className="p-3 border rounded-lg" onChange={handleRegChange} required />
              <input name="businessName" type="text" placeholder="Business Name" className="p-3 border rounded-lg" onChange={handleRegChange} required />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="email" type="email" placeholder="Business Email" className="p-3 border rounded-lg" onChange={handleRegChange} required />
              <input name="phone" type="tel" placeholder="Business Phone" className="p-3 border rounded-lg" onChange={handleRegChange} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select name="country" className="p-3 border rounded-lg" onChange={handleRegChange} value={regData.country}>
                <option value="Kenya">Kenya</option>
                <option value="Nigeria">Nigeria</option>
                <option value="South Africa">South Africa</option>
                <option value="USA">USA</option>
              </select>
              <select name="industryType" className="p-3 border rounded-lg" onChange={handleRegChange} required>
                <option value="">Select Industry</option>
                <option value="Retail">Retail</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Warehouse">Warehouse</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="password" type="password" placeholder="Password" className="p-3 border rounded-lg" onChange={handleRegChange} required />
              <input name="confirmPassword" type="password" placeholder="Confirm Password" className="p-3 border rounded-lg" onChange={handleRegChange} required />
            </div>

            <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
              {loading ? "Creating Business..." : "Create Business & Start"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;