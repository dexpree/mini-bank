import { useEffect, useState } from "react";
import { fetchAllGoals } from "../api/adminApi";
import BackButton from "../components/BackButton";

export default function AdminGoals() {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    fetchAllGoals()
      .then(res => setGoals(res.data))
      .catch(() => alert("Failed to load goals"));
  }, []);

  return (
    <div>
      
    <div className="card">
      <h2>All User Goals</h2>
        <table width="100%" border="1" cellPadding="8">
          <thead>
            <tr>
              <th>User</th>
              <th>Account No</th>
              <th>Goal</th>
              <th>Target</th>
              <th>Saved</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {goals.map(goal => (
              <tr key={goal._id}>
                <td>{goal.userId?.name}</td>
                <td>{goal.userId?.accountNumber}</td>
                <td>{goal.title}</td>
                <td>₹{goal.targetAmount}</td>
                <td>₹{goal.savedAmount}</td>
                <td>
                  {goal.isCompleted ? "Completed" : "In Progress"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {goals.length === 0 && <p>No goals found</p>}
      </div>
    </div>
  );
}
