import { Navigate } from "react-router-dom";
import { getRole } from "../utils/auth";

export default function AdminRoute({ children }) {
  return getRole() === "ADMIN" ? children : <Navigate to="/dashboard" />;
}

