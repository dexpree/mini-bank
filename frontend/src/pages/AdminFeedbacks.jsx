import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import {
  fetchAllFeedbacks,
  replyToFeedback,
  resolveFeedback
} from "../api/feedbackApi";

export default function AdminFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [replyText, setReplyText] = useState({});

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const loadFeedbacks = async () => {
    try {
      const res = await fetchAllFeedbacks();
      setFeedbacks(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load feedbacks ❌");
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const handleReply = async (id) => {
    try {
      clearMessages();

      if (!replyText[id] || replyText[id].trim() === "") {
        return setError("Reply message cannot be empty ❌");
      }

      const res = await replyToFeedback(id, replyText[id]);

      setSuccess(res.data.message || "Reply sent successfully ✅");

      setReplyText((prev) => ({
        ...prev,
        [id]: ""
      }));

      loadFeedbacks();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to send reply ❌");
    }
  };

  const handleResolve = async (id) => {
    try {
      clearMessages();

      const res = await resolveFeedback(id);

      setSuccess(res.data.message || "Marked resolved ✅");

      loadFeedbacks();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to resolve feedback ❌");
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
      

      <h2 style={{ marginBottom: "15px" }}>📩 Admin - Feedback Requests</h2>

      {/* Messages */}
      {error && <p className="error-text">❌ {error}</p>}
      {success && <p className="success-text">✅ {success}</p>}

      {feedbacks.length === 0 ? (
        <p>No feedback requests found.</p>
      ) : (
        feedbacks.map((f) => (
          <div
            key={f._id}
            className="card"
            style={{
              border: "1px solid #334155",
              marginBottom: "15px"
            }}
          >
            <h3>📌 {f.subject}</h3>

            <p style={{ fontSize: "14px", color: "#cbd5e1" }}>
              {f.message}
            </p>

            <p style={{ marginTop: "8px", fontWeight: "bold" }}>
              Status:{" "}
              <span style={{ color: getStatusColor(f.status) }}>
                {f.status}
              </span>
            </p>

            <p style={{ marginTop: "8px", fontSize: "13px" }}>
              👤 User:{" "}
              <b>
                {f.userId?.name} ({f.userId?.email})
              </b>
            </p>

            <p style={{ fontSize: "12px", color: "#94a3b8" }}>
              Created: {new Date(f.createdAt).toLocaleString()}
            </p>

            {/* Admin Reply */}
            <div style={{ marginTop: "15px" }}>
              <textarea
                rows={3}
                placeholder="Write reply to user..."
                value={replyText[f._id] || ""}
                onChange={(e) =>
                  setReplyText((prev) => ({
                    ...prev,
                    [f._id]: e.target.value
                  }))
                }
                style={{ width: "100%" }}
              />

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  style={{ background: "#16a34a" }}
                  onClick={() => handleReply(f._id)}
                >
                  📩 Send Reply
                </button>

                <button
                  style={{ background: "#2563eb" }}
                  onClick={() => handleResolve(f._id)}
                >
                  ✅ Mark Resolved
                </button>
              </div>
            </div>

            {/* Show Existing Reply */}
            {f.adminReply && (
              <div
                style={{
                  marginTop: "15px",
                  padding: "10px",
                  borderRadius: "10px",
                  background: "#0f172a",
                  border: "1px solid #475569"
                }}
              >
                <p style={{ fontWeight: "bold", color: "#22c55e" }}>
                  Admin Reply:
                </p>
                <p style={{ fontSize: "14px" }}>{f.adminReply}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
