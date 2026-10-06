import { useEffect, useState } from "react";
import { fetchUserProfile } from "../api/userApi";
import Counter from "../components/Counter";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";


export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetchUserProfile();
        setUser(res.data);
      } catch (error) {
        console.error(error);
        alert("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (!user) return <p>User not found</p>;

  const getStatus = () => {
    if (user.isBlocked) return "BLOCKED";
    if (user.isFrozen) return "FROZEN";
    return "ACTIVE";
  };

  const status = getStatus();

  return (
    <div className="page-container">
      <h2>User Dashboard</h2>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Account Balance</h4>
          <p>
            ₹<Counter value={user.balance} />
          </p>
        </div>

        <div className="stat-card">
          <h4>Account Number</h4>
          <p style={{ fontSize: "18px" }}>{user.accountNumber}</p>
        </div>

        <div className="stat-card">
          <h4>User Name</h4>
          <p style={{ fontSize: "18px" }}>{user.name}</p>
        </div>

        <div className="stat-card">
          <h4>Account Status</h4>
          <p>
            <span className={`status-badge ${status.toLowerCase()}`}>
              {status}
            </span>
          </p>
        </div>
      </div>
{/* Quick Actions */}
<div className="card">
  <h3>Quick Actions</h3>

  {user.isBlocked && (
    <div className="status-message blocked-msg">
      🚫 Your account is BLOCKED
      <br />
      Reason: {user.blockReason}
    </div>
  )}

  {user.isFrozen && (
    <div className="status-message frozen-msg">
      ❄ Your account is FROZEN
      <br />
      Reason: {user.freezeReason}
    </div>
  )}

  <div className="btn-row">

    <Link to="/deposit">
      <button
        className="action-btn deposit-btn"
        disabled={user.isBlocked || user.isFrozen}
      >
        💰 Deposit
      </button>
    </Link>

    <Link to="/withdraw">
      <button
        className="action-btn withdraw-btn"
        disabled={user.isBlocked || user.isFrozen}
      >
        Withdraw
      </button>
    </Link>

    <Link to="/transfer">
      <button
        className="action-btn transfer-btn"
        disabled={user.isBlocked || user.isFrozen}
      >
        💸 Transfer
      </button>
    </Link>

    <Link to="/transactions">
      <button
        className="action-btn transaction-btn"
        disabled={user.isBlocked}
      >
        Transactions
      </button>
    </Link>

    <Link to="/goals">
      <button
        className="action-btn goals-btn"
        disabled={user.isBlocked || user.isFrozen}
      >
        Goals
      </button>
    </Link>

    <Link to="/profile">
      <button className="action-btn profile-btn">
        👤 Profile
      </button>
    </Link>

    <Link to="/feedback">
      <button className="action-btn feedback-btn">
        🆘 Help
      </button>
    </Link>

  </div>
</div>

    </div>
  );
}
  
