import { useState } from "react";
import BackButton from "../components/BackButton";
import { transferMoney } from "../api/transferApi";
import "../styles/transfer.css";

export default function Transfer() {
  const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
  const [amount, setAmount] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleTransfer = async () => {
    try {
      setError("");
      setSuccess("");

      if (!receiverAccountNumber || !amount) {
        return setError("All fields are required ❌");
      }

      if (Number(amount) <= 0) {
        return setError("Amount must be greater than 0 ❌");
      }

      const res = await transferMoney({
        receiverAccountNumber,
        amount: Number(amount)
      });

      setSuccess(res.data.message || "Transfer successful ✅");

      setReceiverAccountNumber("");
      setAmount("");

    } catch (err) {
      setError(err.response?.data?.message || "Transfer failed ❌");
    }
  };

  return (
    <div className="page-container page-transition">
     
      {error && <p className="error-text">❌ {error}</p>}
      {success && <p className="success-text">✅ {success}</p>}

      <div className="card">
        <h2 style={{ marginBottom: "15px" }}>💸 Transfer Money</h2>
        <h3>Send Money</h3>

        <input
          type="text"
          placeholder="Receiver Account Number"
          value={receiverAccountNumber}
          onChange={(e) => setReceiverAccountNumber(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button onClick={handleTransfer}>
          💸 Transfer
        </button>
      </div>
    </div>
  );
}
