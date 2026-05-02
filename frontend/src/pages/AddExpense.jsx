import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Add_Expense() {
  const navigate = useNavigate();

  const [expensis, setExpensis] = useState({
    ex_date: "",
    ex_item: "",
    ex_cost: ""
  });

  const [message, setMessage] = useState("");

  // =========================
  // DEBUG STATE CHANGE
  // =========================
 const userId=localStorage.getItem('userId')
  useEffect(() => {
      if (!userId) {
        navigate('/login')
      }
  },[]);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setExpensis((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // =========================
  // HANDLE SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setMessage("");

      console.log("Submitting:", expensis);

      const res = await fetch("http://127.0.0.1:8000/api/add-expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...expensis,
          userId:userId
        })
      });

      const data = await res.json();

      if (res.status === 200 || res.status === 201) {

        // ✅ RESET FIRST
        setExpensis({
          ex_date: "",
          ex_item: "",
          ex_cost: ""
        });

        toast.success(data.message || "Added successfully ✅");

        // ✅ NAVIGATE AFTER DELAY
        setTimeout(() => {
          navigate("/");
        }, 1500);

      } else {
        toast.error(data.error || "Error ❌");
        setMessage(data.error);
      }

    } catch (error) {
      console.error("Error:", error);
      toast.error("Server error ❌");
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <>
      <ToastContainer />

      <div className="container d-flex justify-content-center align-items-center vh-100">

        <div className="card shadow-lg p-4" style={{ width: "400px" }}>

          <h3 className="text-center mb-3">Add Expense</h3>
          <p className="text-center text-muted">
            Add and manage your expenses
          </p>

          <form onSubmit={handleSubmit}>

            {/* DATE */}
            <div className="mb-3">
              <label className="form-label">Expense Date</label>
              <input
                type="date"
                name="ex_date"
                className="form-control"
                value={expensis.ex_date || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* ITEM */}
            <div className="mb-3">
              <label className="form-label">Expense Item</label>
              <input
                type="text"
                name="ex_item"
                className="form-control"
                placeholder="Enter item name"
                value={expensis.ex_item || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* COST */}
            <div className="mb-3">
              <label className="form-label">Expense Cost</label>
              <input
                type="number"
                name="ex_cost"
                className="form-control"
                placeholder="Enter cost"
                value={expensis.ex_cost || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* ERROR MESSAGE */}
            {message && (
              <div className="alert alert-danger p-2 text-center">
                {message}
              </div>
            )}

            <button className="btn btn-primary w-100">
              Add Expense
            </button>

          </form>
        </div>
      </div>
    </>
  );
}