import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function ExpenseReport() {
  const navigate = useNavigate();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");

  // =========================
  // CHECK LOGIN
  // =========================
  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  // =========================
  // FETCH DATA
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fromDate || !toDate) {
      toast.warning("Please select both dates ⚠️");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setExpenses([]);

      const res = await fetch(
        `http://127.0.0.1:8000/api/expense-report/${userId}?from_date=${fromDate}&to_date=${toDate}`
      );

      const data = await res.json();

      if (res.status === 200) {
        setExpenses(data.data);   // ✅ FIXED
        toast.success("Data fetched successfully ✅");
      } else {
        setMessage(data.error || "Something went wrong");
        toast.error(data.error || "Error ❌");
      }

    } catch (error) {
      console.error(error);
      toast.error("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // TOTAL CALCULATION
  // =========================
  const total = expenses.reduce((sum, item) => sum + item.Ex_cost, 0);

  // =========================
  // UI
  // =========================
  return (
    <>
      <ToastContainer />

      <div className="container py-5">

        {/* CARD */}
        <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "500px" }}>
          <h3 className="text-center mb-3">Expense Report</h3>

          <form onSubmit={handleSubmit}>

            {/* FROM DATE */}
            <div className="mb-3">
              <label className="form-label">From Date</label>
              <input
                type="date"
                className="form-control"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
              />
            </div>

            {/* TO DATE */}
            <div className="mb-3">
              <label className="form-label">To Date</label>
              <input
                type="date"
                className="form-control"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
              />
            </div>

            {/* ERROR MESSAGE */}
            {message && (
              <div className="alert alert-danger text-center p-2">
                {message}
              </div>
            )}

            {/* BUTTON */}
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Loading..." : "Search"}
            </button>

          </form>
        </div>

        {/* ================= TABLE ================= */}
        {expenses.length > 0 && (
          <div className="mt-5">
            <h4 className="text-center mb-3">Report Result</h4>

            <div className="table-responsive">
              <table className="table table-bordered table-striped text-center">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Item</th>
                    <th>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.Ex_Date}</td>
                      <td>{item.Ex_Item}</td>
                      <td>₹ {item.Ex_cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TOTAL */}
            <h5 className="text-end mt-3">
              Total: ₹ {total}
            </h5>
          </div>
        )}

        {/* NO DATA */}
        {!loading && expenses.length === 0 && fromDate && toDate && (
          <p className="text-center mt-4 text-muted">
            No data found for selected dates
          </p>
        )}

      </div>
    </>
  );
}