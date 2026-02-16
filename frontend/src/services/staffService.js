import api from "../api/axios";

// Fetch staff for a specific branch or all branches
export const getStaff = (branchId = null) => {
  const url = branchId ? `/staff?branchId=${branchId}` : "/staff";
  return api.get(url);
};

// Onboard new staff
export const addStaff = (staffData) => {
  return api.post("/staff", staffData);
};