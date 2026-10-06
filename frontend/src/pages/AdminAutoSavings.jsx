import { useEffect, useState } from "react";
import { fetchAutoSavings } from "../api/adminApi";
import BackButton from "../components/BackButton";

export default function AdminAutoSavings() {
  const [goals, setGoals] = useState([]);

  const loadData = async () => {
    try {
      const res = await fetchAutoSavings();
      setGoals(res.data);
    } catch (err) {
      alert("Failed to load auto savings data",err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="page-container page-transition">
      <BackButton />
      <h2>📌 Auto Savings Users</h2>

      <div className="card">
        <table width="100%" border="1" cellPadding="8">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Account No</th>
              <th>Goal</th>
              <th>Auto Save Amount</th>
              <th>Frequency</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {goals.map((g) => (
              <tr key={g._id}>
                <td>{g.userId?.name}</td>
                <td>{g.userId?.email}</td>
                <td>{g.userId?.accountNumber}</td>
                <td>{g.title}</td>
                <td>₹{g.autoSaveAmount}</td>
                <td>{g.autoSaveFrequency}</td>
                <td>
                  {g.userId?.isBlocked
                    ? "Blocked"
                    : g.userId?.isFrozen
                    ? "Frozen"
                    : "Active"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {goals.length === 0 && <p>No auto saving users found.</p>}
      </div>
    </div>
  );
}
