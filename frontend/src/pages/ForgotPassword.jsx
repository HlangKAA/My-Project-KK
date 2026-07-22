import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgAuth from "../assets/images/bg-auth.png";
import "./auth.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    
    try {
      const response = await axios.post("/api/forgot-password", { email });
      if (response.data.success) {
        setMessage(response.data.message);
      } else {
        setError(response.data.message || "Failed to send reset email.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <img src={bgAuth} alt="" />
      </div>

      <div className="auth-card">
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div className="auth-logo">
            <i className="fas fa-key"></i>
          </div>
          <h1 className="auth-title">
            RECOVER
            <br />
            ACCESS
          </h1>
          <p className="auth-subtitle">
            Enter your arcane mail to retrieve your lost key.
          </p>
        </div>

        <form onSubmit={handleForgot} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Runic Mail</label>
            <div className="auth-input-wrap">
              <i className="fas fa-envelope auth-icon-left"></i>
              <input
                type="email"
                className="auth-input"
                placeholder="Enter your arcane mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}
          {message && <div className="auth-error" style={{ color: "#34d399" }}>{message}</div>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> CASTING...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i> SEND RECOVERY MAGIC
              </>
            )}
          </button>
        </form>

        <div className="auth-bottom">
          Remember your incantation?{" "}
          <span className="auth-link" onClick={() => navigate("/login")}>
            Return to Login
          </span>
        </div>
      </div>

      <div className="auth-footer">
        © 2025 The Lost Spectrum. All rights reserved. Access to the archives is
        restricted to authorized personnel of the Grand Tower.
      </div>
    </div>
  );
};

export default ForgotPassword;
