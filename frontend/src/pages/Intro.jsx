import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../assets/Happy pig.json";
import "../styles/intro.css";

export default function Intro() {

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

    // If user refreshed on /home, skip intro
    if (location.pathname !== "/") {
      navigate(location.pathname, { replace: true });
      return;
    }

    const timer = setTimeout(() => {
      navigate("/home", { replace: true });
    }, 4000);

    return () => clearTimeout(timer);

  }, [navigate, location]);

  return (
    <div className="intro-container">

      <div className="intro-animation">
        <Lottie animationData={animationData} loop />
      </div>

      <h1 className="intro-title">
        Welcome to Mini Bank System
      </h1>

      <p className="intro-subtitle">
        Secure • Smart • Simple Banking
      </p>

    </div>
  );
}
