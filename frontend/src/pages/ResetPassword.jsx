import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import bgAuth from "../assets/images/bg-auth.png";
import "./auth.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post("/api/reset-password", { token, password });
      if (response.data.success) {
        setMessage(response.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(response.data.message || "Failed to reset password.");
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
            <i className="fas fa-unlock-alt"></i>
          </div>
          <h1 className="auth-title">
            FORGE NEW
            <br />
            KEY
          </h1>
          <p className="auth-subtitle">
            Create a new secret incantation to access the realm.
          </p>
        </div>

        <form onSubmit={handleReset} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">New Secret Incantation</label>
            <div className="auth-input-wrap">
              <i className="fas fa-lock auth-icon-left"></i>
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <i
                className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"} auth-icon-right`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">Confirm Incantation</label>
            <div className="auth-input-wrap">
              <i className="fas fa-lock auth-icon-left"></i>
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input"
                placeholder="••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}
          {message && <div className="auth-error" style={{ color: "#34d399" }}>{message}</div>}

          <button type="submit" className="auth-btn" disabled={loading || message !== ""}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> FORGING...
              </>
            ) : (
              <>
                <i className="fas fa-hammer"></i> FORGE NEW KEY
              </>
            )}
          </button>
        </form>
      </div>

      <div className="auth-footer">
        © 2025 The Lost Spectrum. All rights reserved. Access to the archives is
        restricted to authorized personnel of the Grand Tower.
      </div>
    </div>
  );
};

export default ResetPassword;
