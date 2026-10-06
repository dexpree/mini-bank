import { useEffect, useState } from "react";
import { fetchMyTransactions } from "../api/userApi";
import "../styles/transactions.css";
import BackButton from "../components/BackButton";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const res = await fetchMyTransactions();
        setTransactions(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const getTypeClass = (type) => {
    switch (type) {
      case "DEPOSIT":
        return "tx-deposit";
      case "WITHDRAW":
        return "tx-withdraw";
      case "TRANSFER":
        return "tx-transfer";
      case "INTEREST":
        return "tx-interest";
      case "AUTO_GOAL":
        return "tx-goal";
      default:
        return "";
    }
  };

  if (loading)
    return (
      <div className="page-container">
        <p className="loading-text">Loading transactions...</p>
      </div>
    );

  return (
    // <div className="page-container page-transition">
    //   <BackButton />  
    

      <div className="card transaction-card">
        <div className="page-container">
      <h2 className="page-title">📄 My Transactions</h2>
        {transactions.length === 0 ? (
          <p className="empty-text">No transactions found</p>
        ) : (
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Balance After</th>
                <th>Note</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id}>
                  <td>
                    <span className={`tx-badge ${getTypeClass(tx.type)}`}>
                      {tx.type}
                    </span>
                  </td>

                  <td className="tx-amount">₹{tx.amount}</td>

                  <td>₹{tx.balanceAfter}</td>

                  <td className="tx-note">
                    {tx.note || "-"}
                  </td>

                  <td>
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      </div>
    // </div>
    
  );
}
