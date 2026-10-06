import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { decodeToken } from "../utils/decodeToken";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await loginUser({ email, password });

      const token = res.data?.token;

      if (!token) {
        alert("Token not received from server");
        return;
      }

      localStorage.setItem("token", token);

      const decoded = decodeToken(token);

      if (!decoded || !decoded.role) {
        alert("Invalid token received");
        return;
      }

      localStorage.setItem("role", decoded.role);

      if (decoded.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-wrapper">

      {/* Animated Background */}
      <div className="floating-bg">
        <span className="blob blob1"></span>
        <span className="blob blob2"></span>
        <span className="blob blob3"></span>
      </div>
      

      <div className="login-card">
        <button className="back-btn" onClick={() => navigate("/home")}>
          ←
        </button>
        <div className="login-header">
          <span className="login-logo">🏦</span>
          <h2>Mini Bank</h2>
        </div>

        <p className="login-subtitle">
          Login to access your secure banking dashboard
        </p>

        <div className="login-inputs">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>

        <p className="login-register">
          New user?
          <span onClick={() => navigate("/register")}>
            Create Account
          </span>
        </p>

      </div>
    </div>
  );
}