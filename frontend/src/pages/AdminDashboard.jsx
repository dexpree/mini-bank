import { useEffect, useState } from "react";
import { fetchAllUsers, fetchAllTransactions } from "../api/adminApi";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "../styles/admin.css";

export default function AdminDashboard() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    transactions: 0,
    totalBalance: 0,
    frozen: 0,
    blocked: 0
  });

  const [rate, setRate] = useState("");
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ---------------- ADD INTEREST ---------------- */

  const handleInterest = async () => {

    try {

      setError("");
      setSuccess("");

      if (!rate || Number(rate) <= 0) {
        return setError("Enter valid interest percentage");
      }

      await axiosInstance.post("/admin/add-interest", {
        rate: Number(rate)
      });

      setSuccess("Interest added successfully ✅");
      setRate("");

      loadData();

    } catch (err) {

      console.error(err);

      setError(err.response?.data?.message || "Failed to add interest");

    }
  };

  /* ---------------- LOAD DATA ---------------- */

  const loadData = async () => {

    try {

      setError("");

      const usersRes = await fetchAllUsers();
      const txRes = await fetchAllTransactions();

      const users = usersRes.data;
      const transactions = txRes.data;

      const totalBalance = users.reduce(
        (sum, user) => sum + (user.balance || 0),
        0
      );

      const frozen = users.filter(u => u.isFrozen).length;
      const blocked = users.filter(u => u.isBlocked).length;

      setStats({
        users: users.length,
        transactions: transactions.length,
        totalBalance,
        frozen,
        blocked
      });

      setLoading(false);

    } catch (err) {

      console.error(err);

      setError(err.response?.data?.message || "Admin access denied ❌");

      setLoading(false);

    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <p style={{padding:"40px"}}>Loading dashboard...</p>;
  }

  return (
    <div className="page-container page-transition">

      <h2 style={{ marginBottom: "25px" }}>
        👨‍💼 Admin Dashboard
      </h2>

      {/* ERROR / SUCCESS */}

      {error && <p className="error-text">❌ {error}</p>}
      {success && <p className="success-text">✅ {success}</p>}

      {/* ---------------- ANALYTICS ---------------- */}

      <div className="analytics-grid">

        <div className="analytics-card">
          <h4>Total Users</h4>
          <p>{stats.users}</p>
        </div>

        <div className="analytics-card">
          <h4>Total Transactions</h4>
          <p>{stats.transactions}</p>
        </div>

        <div className="analytics-card">
          <h4>Total Balance</h4>
          <p>₹{stats.totalBalance.toLocaleString()}</p>
        </div>

        <div className="analytics-card">
          <h4>Frozen Accounts</h4>
          <p>{stats.frozen}</p>
        </div>

        <div className="analytics-card">
          <h4>Blocked Accounts</h4>
          <p>{stats.blocked}</p>
        </div>

      </div>

      {/* ---------------- QUICK ACTIONS ---------------- */}
<div className="card">

  <h3>⚡ Quick Actions</h3>

  <div className="btn-row">

    <button
      className="action-btn success-btn"
      onClick={() => navigate("/admin/create-user")}
    >
      ➕ Create User
    </button>

    <Link to="/admin/users">
      <button className="action-btn primary-btn">
        👥 Manage Users
      </button>
    </Link>

    <Link to="/admin/transactions">
      <button className="action-btn info-btn">
        📄 View Transactions
      </button>
    </Link>

    <Link to="/admin/goals">
      <button className="action-btn warning-btn">
        🎯 View Goals
      </button>
    </Link>

    <Link to="/admin/disabled-goals">
      <button className="action-btn danger-btn">
        🚫 Disabled Goals
      </button>
    </Link>

    <Link to="/admin/feedbacks">
      <button className="action-btn purple-btn">
        📩 User Feedbacks
      </button>
    </Link>

  </div>

</div>


      {/* ---------------- ADD INTEREST ---------------- */}

      <div className="card">

        <h3>💰 Add Interest</h3>

        <div className="interest-row"><br />

          <input
            type="number"
            placeholder="Interest % (Example: 5)"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />

          <button onClick={handleInterest}>
            Apply Interest
          </button>

        </div>

      </div>

    </div>
  );
}