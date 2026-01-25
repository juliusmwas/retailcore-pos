// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      {user ? (
        <div>
          <p>Welcome, {user.name || user.fullName || "User"}!</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.branches?.[0]?.role}</p>
        </div>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
}

export default Dashboard;
