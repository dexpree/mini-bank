import axiosInstance from "./axiosInstance";

export const fetchAllUsers = () => {
  return axiosInstance.get("/admin/users");
};

export const toggleBlockUser = (userId) => {
  return axiosInstance.put(`/admin/block/${userId}`);
};

export const fetchAllTransactions = () => {
  return axiosInstance.get("/admin/transactions");
};

export const createUser = (data) => {
  return axiosInstance.post("/admin/create-user", data);
};

export const fetchAllGoals = () => {
  return axiosInstance.get("/admin/goals");
};

export const toggleFreezeUser = (userId) => {
  return axiosInstance.put(`/admin/freeze/${userId}`);
};

export const fetchAutoSavings = () => {
  return axiosInstance.get("/admin/auto-savings");
};

export const fetchDisabledGoals = () => {
  return axiosInstance.get("/admin/disabled-goals");
};

export const approveUser = (id) =>
  axiosInstance.put(`/admin/approve-user/${id}`);
