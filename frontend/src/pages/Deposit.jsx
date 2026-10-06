import { useState } from "react";
import { depositMoney } from "../api/userApi";
import "../styles/deposit.css";
import BackButton from "../components/BackButton";

export default function Deposit() {
  const [amount, setAmount] = useState("");

  const handleDeposit = async () => {
    try {
      await depositMoney(Number(amount));
      alert("Deposit successful");
      setAmount("");
    } catch (err) {
      alert(err.response?.data?.message || "Deposit failed");
    }
  };

  return (
    // <div className="page-container page-transition" >
    //   <BackButton />
      

      <div className="card">
          <h2>Deposit Money</h2>
        <p>Min ₹100 • Max ₹50,000 per transaction</p>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleDeposit}>Deposit</button>
      </div>
    // </div>
  );
}
