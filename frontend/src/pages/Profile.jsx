import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import { fetchUserProfile } from "../api/userApi";
import axios from "axios";
import "../styles/profile.css";

export default function Profile() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [updateData, setUpdateData] = useState({
    name: "",
    phone: "",
    address: ""
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: ""
  });

  const token = localStorage.getItem("token");

  /* ----------------------------- */
  /* Load Profile                  */
  /* ----------------------------- */

  const loadProfile = async () => {
    try {

      const res = await fetchUserProfile();

      setUser(res.data);

      setUpdateData({
        name: res.data.name || "",
        phone: res.data.phone || "",
        address: res.data.address || ""
      });

    } catch (error) {
      console.error(error);
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  /* ----------------------------- */
  /* Update Profile                */
  /* ----------------------------- */

  const updateProfile = async () => {
    try {

      await axios.put(
        "http://localhost:5000/api/user/profile/update",
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Profile updated successfully ✅");

      loadProfile();

    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  /* ----------------------------- */
  /* Change Password               */
  /* ----------------------------- */

  const changePassword = async () => {
    try {

      await axios.put(
        "http://localhost:5000/api/user/profile/change-password",
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Password changed successfully 🔐");

      setPasswordData({
        oldPassword: "",
        newPassword: ""
      });

    } catch (error) {
      alert(error.response?.data?.message || "Password change failed");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>Unable to load profile</p>;

  return (
    <div>

     

      {/* PROFILE INFO */}

      <div className="card">

        <h2>My Profile</h2>

        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Account Number:</strong> {user.accountNumber}</p>
        <p><strong>Balance:</strong> ₹{user.balance}</p>
        <p><strong>Gender:</strong> {user.gender}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Address:</strong> {user.address}</p>
        <p><strong>DOB:</strong> {user.dob}</p>


      </div>


      {/* UPDATE PROFILE */}

      <div className="card">

        <h3>Update Profile</h3>

        <input
          value={updateData.name}
          placeholder="Name"
          onChange={(e) =>
            setUpdateData({ ...updateData, name: e.target.value })
          }
        />

        <input
          value={updateData.phone}
          placeholder="Phone"
          onChange={(e) =>
            setUpdateData({ ...updateData, phone: e.target.value })
          }
        />

        <input
          value={updateData.address}
          placeholder="Address"
          onChange={(e) =>
            setUpdateData({ ...updateData, address: e.target.value })
          }
        />

        <button onClick={updateProfile}>
          Update Profile
        </button>

      </div>


      {/* CHANGE PASSWORD */}

      <div className="card">

        <h3>Change Password</h3>

        <input
          type="password"
          placeholder="Old Password"
          value={passwordData.oldPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              oldPassword: e.target.value
            })
          }
        />

        <input
          type="password"
          placeholder="New Password"
          value={passwordData.newPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              newPassword: e.target.value
            })
          }
        />

        <button onClick={changePassword}>
          Change Password
        </button>

      </div>

    </div>
  );
}
