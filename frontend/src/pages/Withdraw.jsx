import { useState } from "react";
import { withdrawMoney } from "../api/userApi";
import "../styles/withdraw.css";
import BackButton from "../components/BackButton";

export default function Withdraw() {
  const [amount, setAmount] = useState("");

  const handleWithdraw = async () => {
    try {
      await withdrawMoney(Number(amount));
      alert("Withdrawal successful");
      setAmount("");
    } catch (err) {
      alert(err.response?.data?.message || "Withdrawal failed");
    }
  };

  return (
    // <div className="page-container page-transition">
    //       <BackButton />  
      <div className="card">
        <div>
      <h2>Withdraw Money</h2>
      <p>Min ₹100 • Max ₹20,000 per transaction</p>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleWithdraw}>Withdraw</button>
      </div>
      </div>
      // </div>
  );
}
