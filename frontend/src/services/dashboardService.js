import api from "../api/axios";

export const fetchDashboardStats = (branchId = null) => {
  const url = branchId ? `/dashboard/stats?branchId=${branchId}` : "/dashboard/stats";
  return api.get(url);
};