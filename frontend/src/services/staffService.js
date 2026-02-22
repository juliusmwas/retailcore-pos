import api from "../api/axios";

// Fetch staff for a specific branch or all branches
export const getStaff = (branchId = null) => {
  // Ensure we send branchId as a query param if it exists
  const url = branchId ? `/staff?branchId=${branchId}` : "/staff";
  return api.get(url);
};

// Onboard new staff
export const addStaff = (staffData) => {
  // staffData now contains { fullName, staffNumber, phone, etc. }
  return api.post("/staff", staffData);
};