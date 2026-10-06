import { useLocation, useNavigate } from "react-router-dom";
import { logout, getRole } from "../utils/auth";
import { useState, useEffect } from "react";
import { FiMenu, FiArrowLeft } from "react-icons/fi";
import Sidebar from "./Sidebar";
import "../styles/navbar.css";

export default function Navbar() {
  const role = getRole();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].screenX;

    // 👉 Swipe Right → Open
    if (touchStartX < 50 && touchEndX - touchStartX > 70) {
      setIsOpen(true);
    }

    // 👉 Swipe Left → Close
    if (touchStartX - touchEndX > 70) {
      setIsOpen(false);
    }
  };

  document.addEventListener("touchstart", handleTouchStart);
  document.addEventListener("touchend", handleTouchEnd);

  return () => {
    document.removeEventListener("touchstart", handleTouchStart);
    document.removeEventListener("touchend", handleTouchEnd);
  };
}, []);

  const hideNavbarRoutes = ["/", "/home", "/login", "/register"];
  if (hideNavbarRoutes.includes(location.pathname)) return null;

  return (
    <>
      <nav className="navbar">

        {/* LEFT */}
        <div className="nav-left">
          <button className="icon-btn" onClick={() => navigate(-1)}>
            <FiArrowLeft />
          </button>

          <button className="icon-btn" onClick={() => setIsOpen(!isOpen)}>
            <FiMenu />
          </button>
        </div>

        {/* CENTER TITLE */}
        <h2 className="nav-title">Mini Bank</h2>

        {/* RIGHT */}
        <div className="nav-right">
          {role && (
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* OVERLAY */}
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}

      {/* SIDEBAR */}
      <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
        <Sidebar closeSidebar={() => setIsOpen(false)} />
      </div>
    </>
  );
}