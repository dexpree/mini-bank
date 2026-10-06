import axiosInstance from "./axiosInstance";

export const fetchUserProfile = () => {
  return axiosInstance.get("/user/profile");
};

export const depositMoney = (amount) => {
  return axiosInstance.post("/user/deposit", { amount });
};

export const withdrawMoney = (amount) => {
  return axiosInstance.post("/user/withdraw", { amount });
};

export const fetchMyTransactions = () => {
  return axiosInstance.get("/user/transactions");
};
