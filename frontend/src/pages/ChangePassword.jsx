import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FaLock,
  FaKey,
  FaEye,
  FaEyeSlash,
  FaShieldAlt
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) navigate("/login");
  }, [userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.warning("All fields are required ⚠️");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match ❌");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.status === 200) {
        toast.success(data.message);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error || "Error ❌");
      }

    } catch (error) {
      toast.error("Server error ❌");
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="d-flex justify-content-center align-items-center vh-100">

        <div className="card p-4 shadow-lg border-0" style={{
          width: "420px",
          borderRadius: "15px",
          background: "linear-gradient(145deg, #298e4c, #2c2c3e)",
          color: "#fff"
        }}>

          {/* HEADER */}
          <div className="text-center mb-4">
            <FaShieldAlt size={40} className="mb-2 text-info" />
            <h3>Change Password</h3>
            <small className="text-muted">Keep your account secure 🔒</small>
          </div>

          <form onSubmit={handleSubmit}>

            {/* OLD PASSWORD */}
            <div className="mb-3 position-relative">
              <label className="form-label">Old Password</label>
              <div className="input-group">
                <span className="input-group-text bg-dark text-white border-0">
                  <FaLock />
                </span>
                <input
                  type={showOld ? "text" : "password"}
                  className="form-control bg-dark text-white border-0"
                  placeholder="Enter old password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <span
                  className="input-group-text bg-dark text-white border-0"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowOld(!showOld)}
                >
                  {showOld ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* NEW PASSWORD */}
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <div className="input-group">
                <span className="input-group-text bg-dark text-white border-0">
                  <FaKey />
                </span>
                <input
                  type={showNew ? "text" : "password"}
                  className="form-control bg-dark text-white border-0"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span
                  className="input-group-text bg-dark text-white border-0"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="mb-4">
              <label className="form-label">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text bg-dark text-white border-0">
                  <FaLock />
                </span>
                <input
                  type={showConfirm ? "text" : "password"}
                  className="form-control bg-dark text-white border-0"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  className="input-group-text bg-dark text-white border-0"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* BUTTON */}
            <button className="btn btn-info w-100 fw-bold">
              🔄 Update Password
            </button>

          </form>
        </div>
      </div>
    </>
  );
}