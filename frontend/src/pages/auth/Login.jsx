import { useEffect, useState } from "react";

function Login() {
  const [activeTab, setActiveTab] = useState("login");

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [rememberDevice, setRememberDevice] = useState(false);

  // Register (Owner) state
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /**
   * Simulated branch fetch
   * In real implementation:
   * - Happens AFTER successful email/password authentication
   * - Backend returns branches user has access to
   */
  useEffect(() => {
    if (email && password) {
      // Simulated response
      const fetchedBranches = [
        { id: "1", name: "Main Branch" },
        { id: "2", name: "Westlands Branch" }
      ];

      setBranches(fetchedBranches);

      // Auto-select if only one branch exists
      if (fetchedBranches.length === 1) {
        setSelectedBranch(fetchedBranches[0].id);
      }
    }
  }, [email, password]);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!selectedBranch) {
      alert("Please select a branch to continue.");
      return;
    }

    /**
     * Submit to backend:
     * POST /auth/login
     * {
     *   email,
     *   password,
     *   branchId: selectedBranch,
     *   rememberDevice
     * }
     */
    console.log("Logging in with:", {
      email,
      password,
      selectedBranch,
      rememberDevice
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (regPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    /**
     * Submit to backend:
     * POST /auth/register
     * {
     *   fullName,
     *   businessName,
     *   email: regEmail,
     *   password: regPassword
     * }
     *
     * Backend will:
     * - Create business
     * - Create first branch
     * - Assign user as Owner/Admin
     */
    console.log("Registering business owner:", {
      fullName,
      businessName,
      regEmail
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
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

        {/* LOGIN */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
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

            {/* Branch Selection */}
            <select
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              required
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                />
                Remember this device
              </label>

              <button
                type="button"
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
        )}

        {/* REGISTER (OWNER ONLY) */}
        {activeTab === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Business Name"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Register Business
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
