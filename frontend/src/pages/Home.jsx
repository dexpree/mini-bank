import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

export default function Home() {

  const navigate = useNavigate();

  const fullText = "Secure. Fast. Smart Banking Experience.";
  const [text, setText] = useState("");

  /* Detect refresh and redirect to Intro */

  useEffect(() => {

    const navType = performance.getEntriesByType("navigation")[0]?.type;

   if (navType === "reload" && location.pathname !== "/home") {
  navigate("/home", { replace: true });
}

  }, [navigate]);


  /* -------------------------------- */
  /* Scroll reveal animation          */
  /* -------------------------------- */

  useEffect(() => {

    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();

  }, []);

  /* -------------------------------- */
  /* Typewriter Effect                */
  /* -------------------------------- */

  useEffect(() => {

    let index = 0;

    const interval = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;

      if (index > fullText.length) {
        clearInterval(interval);
      }

    }, 60);

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="home-wrapper">

      {/* Floating Background */}
      <div className="floating-bg">
        <span className="blob blob1"></span>
        <span className="blob blob2"></span>
        <span className="blob blob3"></span>
      </div>

      {/* Main Card */}
      <div className="home-card reveal">

        {/* Logo */}
        <div className="bank-logo">🏦</div>

        {/* Title */}
       <h1 className="home-title">
  Welcome to <span className="highlight-text">Mini Bank</span>
</h1>
        {/* Subtitle */}
        <p className="home-subtitle">
          {text}
          <span className="cursor">|</span>
        </p>

        {/* Description */}
        <p className="home-description">
          A complete MERN Banking Project with deposit, withdraw, goals, auto
          saving, transfers, and admin control system.
        </p>

        {/* Features */}
        <div className="home-features">

          <div className="feature-box reveal">
            <h3>💰 Deposit & Withdraw</h3>
            <p>Deposit and withdraw money with real transaction history.</p>
          </div>

          <div className="feature-box reveal">
            <h3>💸 Money Transfer</h3>
            <p>Transfer money securely between users with limits.</p>
          </div>

          <div className="feature-box reveal">
            <h3>🎯 Goal Savings</h3>
            <p>Create goals, enable auto saving, disable goals and track progress.</p>
          </div>

          <div className="feature-box reveal">
            <h3>👮 Admin Dashboard</h3>
            <p>Approve users, block/freeze accounts, add interest and view reports.</p>
          </div>
          <div className="feature-box goal-box reveal">
  <h3>🎯 Smart Goal Savings</h3>
  <p>
    Set financial goals, lock funds, and enable auto-saving weekly or monthly.
  </p>

  <div className="goal-mini-card">
    <p>Target: ₹10,000</p>
    <div className="progress-bar">
      <div className="progress"></div>
    </div>
    <span>60% Completed</span>
  </div>
</div>

        </div>

        {/* Buttons */}
        <div className="home-actions">

          <button
            className="home-btn"
            onClick={() => navigate("/login", { replace: true  })}
          >
            🚀 Login
          </button>

          <button
            className="home-btn secondary-btn"
            onClick={() => navigate("/register")}
          >
            📝 Register
          </button>

        </div>

        {/* Footer */}
        <p className="home-footer">
          © 2026 Mini Bank System | MERN Banking Project <br />
              location : 123 Main Street, Bangalore ,Karanataka, India | contact : +91 123-456-7890 | email :banking@gmail.com
            
        </p>

      </div>
    </div>
  );
}
