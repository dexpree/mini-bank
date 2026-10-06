import { useEffect, useState } from "react";
import {
  fetchGoals,
  createGoal,
  addMoneyToGoal,
  withdrawMoneyFromGoal,
  withdrawCompletedGoal,
  toggleAutoSaving,
  deleteGoal,
  toggleDisableGoal
} from "../api/goalApi";

import { fetchUserProfile } from "../api/userApi";
import BackButton from "../components/BackButton";
import Confetti from "react-confetti";
import "../styles/goals.css";

export default function Goals() {

  const [goals, setGoals] = useState([]);
  const [user, setUser] = useState(null);

  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("EMERGENCY");
  const [isLocked, setIsLocked] = useState(false);

  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const [autoSaveAmount, setAutoSaveAmount] = useState("");
  const [autoSaveFrequency, setAutoSaveFrequency] = useState("MONTHLY");

  const [goalAmounts, setGoalAmounts] = useState({});
  const [withdrawAmounts, setWithdrawAmounts] = useState({});

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showConfetti, setShowConfetti] = useState(false);
  const [completedGoalName, setCompletedGoalName] = useState("");

    const [recommendedWeekly, setRecommendedWeekly] = useState(0);
  const [recommendedMonthly, setRecommendedMonthly] = useState(0);
  const [savingMode, setSavingMode] = useState("MONTHLY");

const [prediction, setPrediction] = useState(null);

  

  const calculateRecommendation = (targetAmount, deadline) => {

    if (!targetAmount || !deadline) {
      setRecommendedWeekly(0);
      setRecommendedMonthly(0);
      return;
    }

    const today = new Date();
    const endDate = new Date(deadline);

    const diffTime = endDate - today;

    if (diffTime <= 0) {
  setRecommendedWeekly(0);
  setRecommendedMonthly(0);
  return;
}

    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const weeks = Math.ceil(days / 7);
    const months = Math.ceil(days / 30);

    const weekly = weeks > 0 ? Math.ceil(targetAmount / weeks) : targetAmount;
    const monthly = months > 0 ? Math.ceil(targetAmount / months) : targetAmount;

    setRecommendedWeekly(weekly);
    setRecommendedMonthly(monthly);
     if (savingMode === "WEEKLY") {

    const completionWeeks = Math.ceil(targetAmount / weekly);
    const completionDate = new Date(today);
    completionDate.setDate(today.getDate() + completionWeeks * 7);

    setPrediction(completionDate.toDateString());

  } else {

    const completionMonths = Math.ceil(targetAmount / monthly);
    const completionDate = new Date(today);
    completionDate.setMonth(today.getMonth() + completionMonths);

    setPrediction(completionDate.toDateString());

  }

  };

  

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const loadGoals = async () => {
    try {
      const res = await fetchGoals();
      setGoals(res.data);
    } catch {
      setError("Failed to load goals");
    }
  };

  const loadProfile = async () => {
    try {
      const res = await fetchUserProfile();
      setUser(res.data);
    } catch {}
  };

  useEffect(() => {
    loadGoals();
    loadProfile();
  }, []);

    useEffect(() => {
    calculateRecommendation(Number(target), deadline);
  }, [target, deadline, savingMode]);

  /* CREATE GOAL */

  const handleCreate = async () => {
    try {

      clearMessages();

      if (!title.trim()) return setError("Goal title required");

      await createGoal({
        title,
        targetAmount: Number(target),
        deadline,
        category,
        isLocked,
        autoSaveEnabled,
        autoSaveAmount: autoSaveEnabled ? Number(autoSaveAmount) : 0,
        autoSaveFrequency
      });

      setSuccess("Goal created successfully ✅");

      setTitle("");
      setTarget("");
      setDeadline("");
      setIsLocked(false);
      setAutoSaveEnabled(false);
      setAutoSaveAmount("");

      loadGoals();

    } catch (err) {

      setError(err.response?.data?.message || "Goal creation failed");

    }
  };

  /* ADD MONEY */

  const handleAdd = async (goalId) => {
    try {

      clearMessages();

      const amount = Number(goalAmounts[goalId]);

      const res = await addMoneyToGoal({ goalId, amount });

      setGoalAmounts(prev => ({ ...prev, [goalId]: "" }));

      if (res.data.goal?.isCompleted) {

        setCompletedGoalName(res.data.goal.title);
        setShowConfetti(true);

        setTimeout(() => {
          setShowConfetti(false);
        }, 4000);

      }

      setSuccess("Money added successfully");

      loadGoals();
      loadProfile();

    } catch (err) {

      setError(err.response?.data?.message || "Add failed");

    }
  };

  /* WITHDRAW CUSTOM */

  const handleWithdraw = async (goalId) => {

    try {

      clearMessages();

      const amount = Number(withdrawAmounts[goalId]);

      await withdrawMoneyFromGoal({
        goalId,
        amount
      });

      setWithdrawAmounts(prev => ({
        ...prev,
        [goalId]: ""
      }));

      setSuccess("Withdrawal successful");

      loadGoals();
      loadProfile();

    } catch (err) {

      setError(err.response?.data?.message || "Withdraw failed");

    }
  };

  /* WITHDRAW COMPLETED */

  const handleWithdrawCompleted = async (goalId) => {

    try {

      clearMessages();

      const res = await withdrawCompletedGoal(goalId);

      setSuccess(res.data.message);

      loadGoals();
      loadProfile();

    } catch (err) {

      setError(err.response?.data?.message);

    }

  };

  const handleToggleAutoSaving = async (goalId) => {
    const res = await toggleAutoSaving(goalId);
    setSuccess(res.data.message);
    loadGoals();
  };

  const handleToggleDisableGoal = async (goalId) => {
    const res = await toggleDisableGoal(goalId);
    setSuccess(res.data.message);
    loadGoals();
  };

  const handleDeleteGoal = async (goalId) => {

    const confirmDelete = window.confirm("Delete this goal?");
    if (!confirmDelete) return;

    const res = await deleteGoal(goalId);

    setSuccess(res.data.message);

    loadGoals();

  };

  const getCategoryIcon = (cat) => {

    switch (cat) {
      case "BIKE":
        return "🏍";
      case "MOBILE":
        return "📱";
      case "TRAVEL":
        return "✈";
      case "HOUSE":
        return "🏠";
      case "EDUCATION":
        return "🎓";
      default:
        return "💰";
    }

  };

  const accountDisabled = user?.isBlocked || user?.isFrozen;

  return (

    <div className="page-container">

      {showConfetti && <Confetti />}

     

      <h2>🎯 My Savings Goals</h2>

      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}

      {/* CREATE GOAL */}

      <div className="goal-create-card">

        <h3>Create Goal</h3>

        <input
          placeholder="Goal Title"
          value={title}
         onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          placeholder="Target Amount"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        {/* ⭐ SAVING MODE SELECTOR */}

<div className="saving-mode">

  <label>
    <input
      type="radio"
      value="WEEKLY"
      checked={savingMode === "WEEKLY"}
      onChange={(e) => setSavingMode(e.target.value)}
    />
    Weekly Saving
  </label>

  <label>
    <input
      type="radio"
      value="MONTHLY"
      checked={savingMode === "MONTHLY"}
      onChange={(e) => setSavingMode(e.target.value)}
    />
    Monthly Saving
  </label>

</div>
        

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="BIKE">Bike</option>
          <option value="MOBILE">Mobile</option>
          <option value="TRAVEL">Travel</option>
          <option value="HOUSE">House</option>
          <option value="EDUCATION">Education</option>
          <option value="EMERGENCY">Emergency</option>
        </select>

        <label> <input type="checkbox"  checked={autoSaveEnabled} onChange={(e) => setAutoSaveEnabled(e.target.checked)}/> Enable Auto Saving </label>

        <label>
          <input
            type="checkbox"
            checked={isLocked}
            onChange={(e) => setIsLocked(e.target.checked)}
          />
          Lock Goal
        </label><br />

        {autoSaveEnabled && (
          <>
            <input
              type="number"
              placeholder="Auto Save Amount"
              value={autoSaveAmount}
              onChange={(e) => setAutoSaveAmount(Number(e.target.value))}
            />

            <select
              value={autoSaveFrequency}
              onChange={(e) =>
                setAutoSaveFrequency(e.target.value)
              }
            >
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
          </>
        )}

       {/* ⭐ SAVING MODE SELECTOR */}
       {(recommendedWeekly > 0 || recommendedMonthly > 0) && (

  <div className="goal-plan-preview">

    <p className="goal-plan-title">
      💡 Recommended Saving Plan
    </p>

    {savingMode === "MONTHLY" && (
      <p>Save ₹{recommendedMonthly} every month</p>
    )}

    {savingMode === "WEEKLY" && (
      <p>Save ₹{recommendedWeekly} every week</p>
    )}

    {prediction && (
      <p className="goal-prediction">
        🎯 Goal completion around <b>{prediction}</b>
      </p>
    )}

  </div>

)}

<button
  onClick={handleCreate}
  disabled={accountDisabled}
>
  Create Goal
</button>

      </div>

      {/* GOAL LIST */}

      <div className="goal-grid">

        {goals.map((g) => {

          const progress = Math.min(
            (g.savedAmount / g.targetAmount) * 100,
            100
          );

          return (

            <div key={g._id} className="goal-card">

              <h3>
                {getCategoryIcon(g.category)} {g.title}
              </h3>

            <p>₹{g.savedAmount} / ₹{g.targetAmount}</p>

{/* ⭐ SMART SAVINGS PLAN */}

{/* {g.recommendedMonthly > 0 && (
  <div className="goal-plan">

    <p className="goal-plan-title">
      💡 Recommended Saving Plan
    </p>

    <p className="goal-plan-item">
      ₹{g.recommendedMonthly} / month
    </p>

    <p className="goal-plan-item">
      ₹{g.recommendedWeekly} / week
    </p>

  </div>
)} */}

<div className="progress-bar">
  <div
    className="progress-fill"
    style={{ width: `${progress}%` }}
  />
</div>

<p>{progress.toFixed(0)}%</p>

              {/* COMPLETED GOAL */}

              {g.isCompleted && (
                <button
                  className="withdraw-btn"
                  onClick={() =>
                    handleWithdrawCompleted(g._id)
                  }
                >
                  💰 Withdraw Savings
                </button>
              )}

              {!g.isCompleted && (

                <>

                  <input
                    type="number"
                    placeholder="Add Amount"
                    value={goalAmounts[g._id] || ""}
                    onChange={(e) =>
                      setGoalAmounts(prev => ({
                        ...prev,
                        [g._id]: e.target.value
                      }))
                    }
                  />

                  <button
                    onClick={() => handleAdd(g._id)}
                  >
                    Add Money
                  </button>

                  <input
                    type="number"
                    placeholder="Withdraw"
                    value={withdrawAmounts[g._id] || ""}
                    onChange={(e) =>
                      setWithdrawAmounts(prev => ({
                        ...prev,
                        [g._id]: e.target.value
                      }))
                    }
                  />

                  <button
                    className="withdraw-btn"
                    onClick={() =>
                      handleWithdraw(g._id)
                    }
                  >
                    Withdraw
                  </button>

                </>

              )}

              <button
                onClick={() =>
                  handleToggleAutoSaving(g._id)
                }
              >
                Toggle Auto Save
              </button>

             <button
  onClick={() => handleToggleDisableGoal(g._id)}
>
  {g.isDisabled ? "Enable Goal" : "Disable Goal"}
</button>

              <button
                onClick={() =>
                  handleDeleteGoal(g._id)
                }
              >
                Delete Goal
              </button>

            </div>

          );

        })}

      </div>

    </div>
  );
}