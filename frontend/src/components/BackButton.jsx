import { useNavigate } from "react-router-dom";

export default function BackButton() {

  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/home");
    }
  };

  return (
    <button
      onClick={handleBack}
      style={{
        marginBottom: "15px",
        background: "#6b7280"
      }}
    >
      ← Back
    </button>
  );
}
