import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import { useNavigate } from "react-router-dom";
import bgAuth from "../assets/images/bg-auth.png";
import "./auth.css";

const Login = () => {
  const { login } = useGame();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <img src={bgAuth} alt="" />
      </div>

      <div className="auth-card">
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div className="auth-logo">
            <i className="fas fa-chess-rook"></i>
          </div>
          <h1 className="auth-title">
            THE LOST
            <br />
            SPECTRUM
          </h1>
          <p className="auth-subtitle">
            Enter the misty realm of forgotten magic.
          </p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
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

          <div className="auth-field">
            <label className="auth-label">Secret Incantation</label>
            <div className="auth-input-wrap">
              <i className="fas fa-lock auth-icon-left"></i>
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"} auth-icon-right`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
            <span
              className="auth-forgot"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </span>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> AUTHENTICATING...
              </>
            ) : (
              <>
                <i className="fas fa-shield-alt"></i> ENTER THE REALM
              </>
            )}
          </button>
        </form>

        <div className="auth-bottom">
          Don't have a mage ID?{" "}
          <span className="auth-link" onClick={() => navigate("/register")}>
            Register for the Archives
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

export default Login;
