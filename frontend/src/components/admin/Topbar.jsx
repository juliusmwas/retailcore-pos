import { useAuth } from "../../auth/AuthContext";

export default function Topbar({ collapsed, toggleSidebar }) {
  const { branches, activeBranch, selectBranch, logout } = useAuth();

  const handleBranchChange = (e) => {
    const value = e.target.value;
    if (value === "ALL") {
      selectBranch(null);
    } else {
      const branch = branches.find((b) => b.id === value);
      selectBranch(branch);
    }
  };

  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-4">
      <button
        onClick={toggleSidebar}
        className="text-xl font-bold"
      >
        ☰
      </button>

      <div className="flex items-center gap-4">
        <select
          className="border rounded px-3 py-1"
          value={activeBranch?.id || "ALL"}
          onChange={handleBranchChange}
        >
          <option value="ALL">All Branches</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <button
          onClick={logout}
          className="text-red-600 font-semibold"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
