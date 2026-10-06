import axiosInstance from "./axiosInstance";

/* Fetch Goals */
export const fetchGoals = () => {
  return axiosInstance.get("/goals");
};

/* Create Goal */
export const createGoal = (data) => {
  return axiosInstance.post("/goals", data);
};

/* Add Money To Goal */
export const addMoneyToGoal = (data) => {
  return axiosInstance.post("/goals/add", data);
};

/* Withdraw Custom Amount */
export const withdrawMoneyFromGoal = (data) => {
  return axiosInstance.post("/goals/withdraw", data);
};

/* Withdraw Completed Goal */
export const withdrawCompletedGoal = (goalId) => {
  return axiosInstance.post(`/goals/withdraw-completed/${goalId}`);
};

/* Toggle Auto Saving */
export const toggleAutoSaving = (goalId) => {
  return axiosInstance.put(`/goals/toggle-auto/${goalId}`);
};

/* Disable / Enable Goal */
export const toggleDisableGoal = (goalId) => {
  return axiosInstance.put(`/goals/disable-goal/${goalId}`);
};

/* Delete Goal */
export const deleteGoal = (goalId) => {
  return axiosInstance.delete(`/goals/delete/${goalId}`);
};