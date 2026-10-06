import axiosInstance from "./axiosInstance";

// user
export const sendFeedback = (data) => axiosInstance.post("/feedback", data);
export const fetchMyFeedbacks = () => axiosInstance.get("/feedback/my");

// admin
export const fetchAllFeedbacks = () => axiosInstance.get("/admin/feedbacks");
export const replyToFeedback = (id, reply) =>
  axiosInstance.put(`/admin/feedbacks/reply/${id}`, { reply });

export const resolveFeedback = (id) =>
  axiosInstance.put(`/admin/feedbacks/resolve/${id}`);
