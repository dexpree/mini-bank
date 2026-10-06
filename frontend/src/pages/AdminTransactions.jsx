import { useEffect, useState } from "react";
import { fetchAllTransactions } from "../api/adminApi";
import BackButton from "../components/BackButton";


export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const res = await fetchAllTransactions();
        setTransactions(res.data);
      } catch (error) {
        alert("Failed to load transactions",error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  if (loading) return <p>Loading transactions...</p>;

  return (
    <div>
      
    <div className="card">
         <h2>All Transactions</h2>
        <table width="100%" border="1" cellPadding="8">
          <thead>
            <tr>
              <th>User</th>
              <th>Account No</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Balance After</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id}>
                <td>{tx.userId?.name}</td>
                <td>{tx.userId?.accountNumber}</td>
                <td>{tx.type}</td>
                <td>₹{tx.amount}</td>
                <td>₹{tx.balanceAfter}</td>
                <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {transactions.length === 0 && (
          <p>No transactions found</p>
        )}
      </div>
    </div>
  );
}
