import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import BackButton from "../components/BackButton";

export default function AdminDisabledGoals() {
  const [disabledGoals, setDisabledGoals] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadDisabledGoals = async () => {
    try {
      setError("");
      const res = await axiosInstance.get("/admin/disabled-goals");
      setDisabledGoals(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load disabled goals");
    }
  };

  useEffect(() => {
    loadDisabledGoals();
  }, []);

  // Enable Goal (Admin)
  const handleEnableGoal = async (goalId) => {
    try {
      setError("");
      setSuccess("");

      const res = await axiosInstance.put(`/admin/enable-goal/${goalId}`);

      setSuccess(res.data.message || "Goal enabled successfully ✅");
      loadDisabledGoals();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to enable goal");
    }
  };

  return (
    <div className="page-container page-transition">
      
      <h2 style={{ marginBottom: "20px" }}>🚫 Disabled Goals</h2>

      {/* Messages */}
      {error && <p className="error-text">❌ {error}</p>}
      {success && <p className="success-text">✅ {success}</p>}

      {disabledGoals.length === 0 ? (
        <p style={{ color: "white" }}>No disabled goals found.</p>
      ) : (
        <div className="goal-grid">
          {disabledGoals.map((goal) => (
            <div key={goal._id} className="goal-card">
              <h3 style={{ marginBottom: "10px" }}>
                🎯 {goal.title}
              </h3>

              <p style={{ color: "#93c5fd", fontWeight: "600" }}>
                User: {goal.userId?.name || "Unknown"} ({goal.userId?.email})
              </p>

              <p style={{ marginTop: "10px", color: "white" }}>
                ₹{goal.savedAmount} / ₹{goal.targetAmount}
              </p>

              <p style={{ marginTop: "5px", color: "#fca5a5" }}>
                Status: Disabled 🚫
              </p>

              <button
                style={{ marginTop: "15px", background: "#16a34a" }}
                onClick={() => handleEnableGoal(goal._id)}
              >
                ✅ Enable Goal
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
