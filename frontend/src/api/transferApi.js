import axiosInstance from "./axiosInstance";

export const transferMoney = (data) => axiosInstance.post("/transfer", data);
