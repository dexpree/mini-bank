import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import { sendFeedback, fetchMyFeedbacks } from "../api/feedbackApi";
import "../styles/feedback.css";

export default function Feedback() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [feedbacks, setFeedbacks] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const loadFeedbacks = async () => {
    try {
      const res = await fetchMyFeedbacks();
      setFeedbacks(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load feedbacks ❌");
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const handleSubmit = async () => {
    try {
      clearMessages();

      if (!subject.trim() || !message.trim()) {
        return setError("Subject and Message are required ❌");
      }

      const res = await sendFeedback({
        subject,
        message
      });

      setSuccess(res.data.message || "Feedback sent successfully ✅");

      setSubject("");
      setMessage("");

      loadFeedbacks();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to send feedback ❌");
    }
  };

  const getStatusColor = (status) => {
    if (status === "PENDING") return "#facc15";
    if (status === "REPLIED") return "#22c55e";
    if (status === "RESOLVED") return "#3b82f6";
    return "white";
  };

  return (
    <div className="page-container page-transition">
     

      <h2 style={{ marginBottom: "15px" }}>📩 Feedback & Help</h2>

      {/* Messages */}
      {error && <p className="error-text">❌ {error}</p>}
      {success && <p className="success-text">✅ {success}</p>}

      {/* Send Feedback */}
      <div className="card">
        <h3>Send Feedback / Complaint</h3>

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <textarea
          placeholder="Write your problem / feedback..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          style={{ width: "100%", marginTop: "10px" }}
        />

        <button style={{ marginTop: "10px" }} onClick={handleSubmit}>
          📩 Send Feedback
        </button>
      </div>

      {/* Feedback List */}
      <div className="card">
        <h3>📌 My Feedback Requests</h3>

        {feedbacks.length === 0 ? (
          <p>No feedback requests found.</p>
        ) : (
          feedbacks.map((f) => (
            <div
              key={f._id}
              style={{
                border: "1px solid #334155",
                padding: "12px",
                borderRadius: "10px",
                marginBottom: "12px"
              }}
            >
              <h4 style={{ marginBottom: "5px" }}>📌 {f.subject}</h4>

              <p style={{ fontSize: "14px", color: "#cbd5e1" }}>
                {f.message}
              </p>

              <p style={{ marginTop: "8px", fontWeight: "bold" }}>
                Status:{" "}
                <span style={{ color: getStatusColor(f.status) }}>
                  {f.status}
                </span>
              </p>

              {f.adminReply && (
                <div
                  style={{
                    marginTop: "10px",
                    padding: "10px",
                    borderRadius: "10px",
                    background: "#0f172a",
                    border: "1px solid #475569"
                  }}
                >
                  <p style={{ fontWeight: "bold", color: "#22c55e" }}>
                    ✅ Admin Reply:
                  </p>
                  <p style={{ fontSize: "14px", color: "#e2e8f0" }}>
                    {f.adminReply}
                  </p>
                </div>
              )}

              <p style={{ fontSize: "12px", marginTop: "8px", color: "#94a3b8" }}>
                Created: {new Date(f.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
