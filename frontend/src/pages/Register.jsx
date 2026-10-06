import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import "../styles/register.css";

export default function Register() {

  const navigate = useNavigate();

  const genderOptions = ["male", "female", "other"];

  const [form, setForm] = useState({
    name:"",
    email:"",
    password:"",
    phone:"",
    dob:"",
    gender:"",
    address:"",
    aadhaarNumber:"",
    panNumber:""
  });

  const [errors,setErrors] = useState({});

  const validateForm = (data)=>{

    const newErrors = {};

    const aadhaarRegex = /^[0-9]{12}$/;
    const phoneRegex = /^[6-9][0-9]{9}$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!data.name.trim()) newErrors.name="Name required";

    if(!data.email.trim()) newErrors.email="Email required";
    else if(!emailRegex.test(data.email)) newErrors.email="Invalid email";

    if(!data.password.trim()) newErrors.password="Password required";
    else if(data.password.length<6) newErrors.password="Min 6 characters";

    if(!data.phone.trim()) newErrors.phone="Phone required";
    else if(!phoneRegex.test(data.phone)) newErrors.phone="Invalid phone";

    if(!data.dob) newErrors.dob="DOB required";

    if(!data.gender) newErrors.gender="Gender required";

    if(!data.address.trim()) newErrors.address="Address required";

    if(!aadhaarRegex.test(data.aadhaarNumber))
      newErrors.aadhaarNumber="Aadhaar must be 12 digits";

    if(!panRegex.test(data.panNumber))
      newErrors.panNumber="Format ABCDE1234F";

    return newErrors;

  };

  const handleChange=(field,value)=>{
    const updated={...form,[field]:value};
    setForm(updated);
    setErrors(validateForm(updated));
  };

  const handleRegister = async()=>{

    const validationErrors = validateForm(form);

    setErrors(validationErrors);

    if(Object.keys(validationErrors).length>0) return;

    try{

      await registerUser(form);

      alert("Registration successful ✅");

      navigate("/login");

    }catch(err){

      alert(err.response?.data?.message || "Registration failed");

    }

  };

  const isFormValid =
    Object.keys(errors).length === 0 &&
    Object.values(form).every(Boolean);

  return (
    <div className="register-wrapper">

      {/* floating background */}
      <div className="floating-bg">
        <span className="blob blob1"></span>
        <span className="blob blob2"></span>
        <span className="blob blob3"></span>
      </div>

      <div className="register-card">

        <button className="back-btn" onClick={()=>navigate("/home")}>
          ←
        </button>

        <div className="register-header">
          <span className="register-logo">🏦</span>
          <h2>Create Account</h2>
        </div>

        <p className="register-subtitle">
          Open your Mini Bank account
        </p>

        <div className="register-form">

          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e)=>handleChange("name",e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e)=>handleChange("email",e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e)=>handleChange("password",e.target.value)}
          />

          <input
            placeholder="Phone"
            maxLength={10}
            value={form.phone}
            onChange={(e)=>handleChange("phone",e.target.value.replace(/[^0-9]/g,""))}
          />

          <input
            type="date"
            value={form.dob}
            onChange={(e)=>handleChange("dob",e.target.value)}
          />

          <select
            value={form.gender}
            onChange={(e)=>handleChange("gender",e.target.value)}
          >
            <option value="">Gender</option>
            {genderOptions.map(g=>(
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <input
            placeholder="Address"
            value={form.address}
            onChange={(e)=>handleChange("address",e.target.value)}
          />

          <input
            placeholder="Aadhaar"
            maxLength={12}
            value={form.aadhaarNumber}
            onChange={(e)=>handleChange("aadhaarNumber",e.target.value.replace(/[^0-9]/g,""))}
          />

          <input
            placeholder="PAN"
            maxLength={10}
            value={form.panNumber}
            onChange={(e)=>handleChange("panNumber",e.target.value.toUpperCase())}
          />

        </div>

        <button
          className="register-btn"
          disabled={!isFormValid}
          onClick={handleRegister}
        >
          Create Account
        </button>

        <p className="register-footer">
          Already have account?
          <span onClick={()=>navigate("/login")}>
            Login
          </span>
        </p>

      </div>
    </div>
  );
}