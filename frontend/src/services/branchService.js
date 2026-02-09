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
