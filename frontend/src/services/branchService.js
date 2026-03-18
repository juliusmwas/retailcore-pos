import api from "../api/axios";

export const getBranches = () => {
  return api.get("/branches");
};

export const createBranch = (data) => {
  return api.post("/branches", data);
};

export const toggleBranchStatus = (id) => {
  return api.patch(`/branches/${id}/toggle-status`);
};

export const getBranchById = async (id) => {
  return await api.get(`/branches/${id}`);
};

/**
 * Updates full branch details
 * @param {string} id - The Branch UUID
 * @param {object} data - Fields to update (name, budget, status, etc.)
 */
export const updateBranch = (id, data) => {
  return api.patch(`/branches/${id}`, data);
};