import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import BackButton from "../components/BackButton";
import "../styles/table.css";
import "../styles/admin.css";

export default function AdminUsers() {

  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  /* ---------------- LOAD USERS ---------------- */

  const loadUsers = async () => {
    try {
      const res = await axiosInstance.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users ❌");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  /* ---------------- APPROVE USER ---------------- */

  const handleApprove = async (id) => {
    try {
      clearMessages();
      const res = await axiosInstance.put(`/admin/approve-user/${id}`);
      setSuccess(res.data.message || "User approved ✅");
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Approval failed ❌");
    }
  };

  /* ---------------- REJECT USER ---------------- */

  const handleReject = async (id) => {
    try {
      clearMessages();

      if (!window.confirm("Reject this user?")) return;

      const res = await axiosInstance.put(`/admin/reject-user/${id}`);

      setSuccess(res.data.message || "User rejected ❌");
      loadUsers();

    } catch (err) {
      setError(err.response?.data?.message || "Reject failed ❌");
    }
  };

  /* ---------------- VIEW USER DETAILS ---------------- */

  const openUserDetails = async (id) => {
    try {
      const res = await axiosInstance.get(`/admin/user-details/${id}`);
      setSelectedUser(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load user details");
    }
  };

  /* ---------------- EDIT USER ---------------- */

  const handleEditUser = (user) => {
    setEditingUser({
      _id: user._id,
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
      gender: user.gender || "",
      dob: user.dob ? user.dob.split("T")[0] : "",
      aadhaarNumber: user.aadhaarNumber || "",
      panNumber: user.panNumber || ""
    });
  };

  const handleUpdateUser = async () => {
    try {

      clearMessages();

      const res = await axiosInstance.put(
        `/admin/update-user/${editingUser._id}`,
        editingUser
      );

      setSuccess(res.data.message || "User updated successfully ✅");

      setEditingUser(null);

      loadUsers();

    } catch (err) {
      setError(err.response?.data?.message || "Update failed ❌");
    }
  };

  /* ---------------- BLOCK USER ---------------- */

  const handleBlockToggle = async (id) => {
    try {

      clearMessages();

      const user = users.find((u) => u._id === id);

      let reason = "";

      if (!user.isBlocked) {
        reason = prompt("Enter block reason:");
        if (!reason) return;
      }

      const res = await axiosInstance.put(`/admin/block/${id}`, { reason });

      setSuccess(res.data.message);

      loadUsers();

    } catch (err) {
      setError("Block update failed ❌");
    }
  };

  /* ---------------- FREEZE USER ---------------- */

  const handleFreezeToggle = async (id) => {
    try {

      clearMessages();

      const user = users.find((u) => u._id === id);

      let reason = "";

      if (!user.isFrozen) {
        reason = prompt("Enter freeze reason:");
        if (!reason) return;
      }

      const res = await axiosInstance.put(`/admin/freeze/${id}`, { reason });

      setSuccess(res.data.message);

      loadUsers();

    } catch (err) {
      setError("Freeze update failed ❌");
    }
  };

  /* ---------------- DELETE USER ---------------- */

  const handleDeleteUser = async (id) => {
    try {

      clearMessages();

      if (!window.confirm("Delete this user?")) return;

      const res = await axiosInstance.delete(`/admin/delete-user/${id}`);

      setSuccess(res.data.message);

      loadUsers();

    } catch (err) {
      setError("Delete failed ❌");
    }
  };

  /* ---------------- SEARCH ---------------- */

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const getStatus = (u) => {
    if (u.isRejected) return "rejected";
    if (!u.isApproved && !u.isRejected) return "pending";
    if (u.isBlocked) return "blocked";
    if (u.isFrozen) return "frozen";
    return "approved";
  };

  return (
    <div className="page-container page-transition">

      

      <div className="table-wrapper">

        <div className="table-header">
          <h2>👥 Admin - Manage Users</h2>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name / email / role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="error-text">❌ {error}</p>}
        {success && <p className="success-text">✅ {success}</p>}

        <table className="smart-table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id}>

                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>₹{u.balance}</td>

                <td>
                  <span className={`status-pill ${getStatus(u)}`}>
                    {u.isRejected
                      ? "Rejected"
                      : !u.isApproved && !u.isRejected
                      ? "Pending"
                      : u.isBlocked
                      ? "Blocked"
                      : u.isFrozen
                      ? "Frozen"
                      : "Approved"}
                  </span>
                </td>

                <td>{u.role}</td>

                <td>
                  <div className="table-btn-row">

                    <button
                      className="table-btn btn-blue"
                      onClick={() => handleEditUser(u)}
                    >
                      ✏ Edit
                    </button>

                    <button
                      className="table-btn btn-blue"
                      onClick={() => openUserDetails(u._id)}
                    >
                      👁 View
                    </button>

                    {!u.isApproved && !u.isRejected && (
                      <>
                        <button
                          className="table-btn btn-green"
                          onClick={() => handleApprove(u._id)}
                        >
                          Approve
                        </button>

                        <button
                          className="table-btn btn-red"
                          onClick={() => handleReject(u._id)}
                        >
                          Reject
                        </button>
                      </>
                    )}

                    <button
                      className={`table-btn ${
                        u.isBlocked ? "btn-green" : "btn-red"
                      }`}
                      onClick={() => handleBlockToggle(u._id)}
                    >
                      {u.isBlocked ? "Unblock" : "Block"}
                    </button>

                    <button
                      className={`table-btn ${
                        u.isFrozen ? "btn-green" : "btn-blue"
                      }`}
                      onClick={() => handleFreezeToggle(u._id)}
                    >
                      {u.isFrozen ? "Unfreeze" : "Freeze"}
                    </button>

                    <button
                      className="table-btn btn-dark"
                      onClick={() => handleDeleteUser(u._id)}
                    >
                      Delete
                    </button>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

      {/* ---------------- VIEW PANEL ---------------- */}

      {/* ================= CRM SIDE PANEL ================= */}

{selectedUser && (
  <div className="crm-overlay">

    <div className="crm-panel">

      <div className="crm-header">
        <h3>👤 User Details</h3>

        <button
          className="btn-red"
          onClick={() => setSelectedUser(null)}
        >
          Close
        </button>
      </div>

      {/* USER PROFILE */}
      <div className="crm-section">
        <h4>Profile</h4>

        <p><strong>Name:</strong> {selectedUser.user?.name}</p>
        <p><strong>Email:</strong> {selectedUser.user?.email}</p>
        <p><strong>Account:</strong> {selectedUser.user?.accountNumber}</p>
        <p><strong>Balance:</strong> ₹{selectedUser.user?.balance}</p>
        <p><strong>Phone:</strong> {selectedUser.user?.phone}</p>
        <p><strong>Gender:</strong> {selectedUser.user?.gender}</p>
      </div>

      {/* TRANSACTIONS */}
      <div className="crm-section">

        <h4>Transactions</h4>

        {selectedUser.transactions?.length === 0 && (
          <p>No transactions found</p>
        )}

        {selectedUser.transactions?.map((t) => (
          <div key={t._id} className="crm-card">
            <span>{t.type}</span>
            <span>₹{t.amount}</span>
          </div>
        ))}

      </div>

      {/* GOALS */}
      <div className="crm-section">

        <h4>Saving Goals</h4>

        {selectedUser.goals?.length === 0 && (
          <p>No goals</p>
        )}

        {selectedUser.goals?.map((g) => (
          <div key={g._id} className="crm-card">
            <span>{g.title}</span>
            <span>
              ₹{g.savedAmount} / ₹{g.targetAmount}
            </span>
          </div>
        ))}

      </div>

    </div>

  </div>
)}

      {/* ---------------- EDIT PANEL ---------------- */}

     {editingUser && (
  <div className="crm-overlay">

    <div className="crm-panel">

      <div className="crm-header">
        <h3>✏ Edit User</h3>

        <button
          className="btn-red"
          onClick={() => setEditingUser(null)}
        >
          Close
        </button>
      </div>

      <div className="crm-section">

        <label>Name</label>
        <input
          value={editingUser.name}
          onChange={(e) =>
            setEditingUser({ ...editingUser, name: e.target.value })
          }
        />

        <label>Phone</label>
        <input
          value={editingUser.phone}
          onChange={(e) =>
            setEditingUser({ ...editingUser, phone: e.target.value })
          }
        />

        <label>Address</label>
        <input
          value={editingUser.address}
          onChange={(e) =>
            setEditingUser({ ...editingUser, address: e.target.value })
          }
        />

        <label>Date of Birth</label>
        <input
          type="date"
          value={editingUser.dob}
          onChange={(e) =>
            setEditingUser({ ...editingUser, dob: e.target.value })
          }
        />

        <label>Gender</label>
        <br />
        <select
          value={editingUser.gender}
          onChange={(e) =>
            setEditingUser({ ...editingUser, gender: e.target.value })
          }
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select><br />
        

        <label>Aadhaar</label>
        <input
          value={editingUser.aadhaarNumber}
          onChange={(e) =>
            setEditingUser({
              ...editingUser,
              aadhaarNumber: e.target.value
            })
          }
        />

        <label>PAN</label>
        <input
          value={editingUser.panNumber}
          onChange={(e) =>
            setEditingUser({
              ...editingUser,
              panNumber: e.target.value
            })
          }
        />

        <button
          className="btn-green"
          onClick={handleUpdateUser}
          style={{ marginTop: "20px" }}
        >
          Save Changes
        </button>

      </div>

    </div>

  </div>
)}

    </div>
  );
}