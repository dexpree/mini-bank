import { NavLink } from "react-router-dom";
import { getRole, logout } from "../utils/auth";
import {
  FiHome,
  FiUser,
  FiCreditCard,
  FiRepeat,
  FiTarget
} from "react-icons/fi";

export default function Sidebar({ closeSidebar }) {
  const role = getRole();

  const linkClass = ({ isActive }) =>
    isActive ? "active-link" : "";

  return (
    <aside className="sidebar">

      {role === "USER" && (
        <>
          <NavLink to="/dashboard" className={linkClass} onClick={closeSidebar}>
            <FiHome /> Dashboard
          </NavLink>

          <NavLink to="/profile" className={linkClass} onClick={closeSidebar}>
            <FiUser /> Profile
          </NavLink>

          <NavLink to="/deposit" className={linkClass} onClick={closeSidebar}>
            <FiCreditCard /> Deposit
          </NavLink>

          <NavLink to="/withdraw" className={linkClass} onClick={closeSidebar}>
            <FiCreditCard /> Withdraw
          </NavLink>

          <NavLink to="/transactions" className={linkClass} onClick={closeSidebar}>
            <FiRepeat /> Transactions
          </NavLink>

          <NavLink to="/transfer" className={linkClass} onClick={closeSidebar}>
            <FiRepeat /> Transfer
          </NavLink>

          <NavLink to="/goals" className={linkClass} onClick={closeSidebar}>
            <FiTarget /> Goals
          </NavLink>
           <button onClick={logout} className="logout-btn">
              Logout
            </button>

        </>
      )}

      {role === "ADMIN" && (
        <>
          <NavLink to="/admin" className={linkClass} onClick={closeSidebar}>
            <FiHome /> Dashboard
          </NavLink>

          <NavLink to="/admin/create-user" className={linkClass} onClick={closeSidebar}>
            <FiUser /> Create-Users
          </NavLink>

          <NavLink to="/admin/users" className={linkClass} onClick={closeSidebar}>
            <FiUser /> Users
          </NavLink>

          <NavLink to="/admin/transactions" className={linkClass} onClick={closeSidebar}>
            <FiRepeat /> Transactions
          </NavLink>

          <NavLink to="/admin/goals" className={linkClass} onClick={closeSidebar}>
            <FiTarget /> Goals
          </NavLink>

          <NavLink to="/admin/feedbacks" className={linkClass} onClick={closeSidebar}>
            <FiUser /> Feedbacks
          </NavLink>

          <NavLink to="/admin/disabled-goals" className={linkClass} onClick={closeSidebar}>
            <FiTarget /> disabled Goals
          </NavLink>
           <button onClick={logout} className="logout-btn">
              Logout
            </button>



        </>
      )}
    </aside>
  );
}