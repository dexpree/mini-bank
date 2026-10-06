import { useState } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";


export default function AdminCreateUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    aadhaarNumber: "",
    panNumber: ""
  });
  const genderOptions = ["male", "female", "other"];

  // ✅ Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Validation function
  const validateInputs = () => {
    const aadhaarRegex = /^[0-9]{12}$/;
    const phoneRegex = /^[6-9]{1}[0-9]{9}$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    if (!phoneRegex.test(form.phone)) {
      alert("❌ Invalid Phone Number (must be 10 digits and start with 6-9)");
      return false;
    }

    if (!aadhaarRegex.test(form.aadhaarNumber)) {
      alert("❌ Invalid Aadhaar Number (must be exactly 12 digits)");
      return false;
    }

    if (!panRegex.test(form.panNumber.toUpperCase())) {
      alert("❌ Invalid PAN Number (Example: ABCDE1234F)");
      return false;
    }

    return true;
  };

  // ✅ Create user submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation check
    if (!validateInputs()) return;

    try {
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/api/admin/create-user", form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("✅ User created successfully");

      // reset form after success
      setForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        dob: "",
        gender: "",
        address: "",
        aadhaarNumber: "",
        panNumber: ""
      });
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || "❌ Failed to create user");
    }
  };

  return (
    <div className="page-container page-transition">
      <div className="card">
          <h2>Create New User (Admin)</h2>  
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Name */}
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* Password */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {/* Phone */}
          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            maxLength={10}
            onChange={(e) => {
              // only numbers
              const value = e.target.value.replace(/[^0-9]/g, "");
              setForm({ ...form, phone: value });
            }}
            required
          />

          {/* DOB */}
          <input
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
            required
          /><br/ >
          {/* Gender */}
         <input
  list="genderOptions"
  name="gender"
  placeholder="Gender"
  value={form.gender}
  onChange={handleChange}
  required
/>

<datalist id="genderOptions">
  <option value="Male" />
  <option value="Female" />
  <option value="Other" />
</datalist>
            

          {/* Address */}
          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
          />

          {/* Aadhaar */}
          <input
            name="aadhaarNumber"
            placeholder="Aadhaar Number"
            value={form.aadhaarNumber}
            maxLength={12}
            onChange={(e) => {
              // only numbers
              const value = e.target.value.replace(/[^0-9]/g, "");
              setForm({ ...form, aadhaarNumber: value });
            }}
            required
          />

          {/* PAN */}
          <input
            name="panNumber"
            placeholder="PAN Number (ABCDE1234F)"
            value={form.panNumber}
            maxLength={10}
            onChange={(e) =>
              setForm({
                ...form,
                panNumber: e.target.value.toUpperCase()
              })
            }
            required
          />

          <button type="submit">Create User</button>
        </form>
      </div>
    </div>
  );
}
