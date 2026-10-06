export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const getRole = () => {
  return localStorage.getItem("role");
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/";
};
