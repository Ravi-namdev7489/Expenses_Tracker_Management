import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Dashboard() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);

  const [todayExpense, setTodayExpense] = useState(0);
  const [yesterdayExpense, setYesterdayExpense] = useState(0);
  const [last7daysExpense, setLast7daysExpense] = useState(0);
  const [lastMonthExpense, setLastMonthExpense] = useState(0);
  const [currentMonthExpense, setCurrentMonthExpense] = useState(0); // ✅ NEW
  const [currentYearExpense, setCurrentYearExpense] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    } else {
      fetchapi();
    }
  }, [userId]);

  // ✅ FETCH API
  const fetchapi = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/manage-expense/${userId}`
      );

      const result = await res.json();

      if (res.status === 200) {
        setExpenses(result.data);
        calculateTotal(result.data);
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  // ✅ CALCULATION FIXED
  const calculateTotal = (data) => {
    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const last7days = new Date();
    last7days.setDate(today.getDate() - 7);

    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);

    let todaySum = 0,
      yesterdaySum = 0,
      last7Sum = 0,
      lastMonthSum = 0,
      currentMonthSum = 0,
      currentYearSum = 0,
      total = 0;

    data.forEach((item) => {
      const expenseDate = new Date(item.Ex_Date);
      const amount = parseFloat(item.Ex_cost) || 0;

      // ✅ TODAY
      if (expenseDate.toDateString() === today.toDateString()) {
        todaySum += amount;
      }

      // ✅ YESTERDAY
      if (expenseDate.toDateString() === yesterday.toDateString()) {
        yesterdaySum += amount;
      }

      // ✅ LAST 7 DAYS (RANGE FIX)
      if (expenseDate >= last7days && expenseDate <= today) {
        last7Sum += amount;
      }

      // ✅ CURRENT MONTH
      if (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      ) {
        currentMonthSum += amount;
      }

      // ✅ LAST MONTH
      if (
        expenseDate.getMonth() === lastMonth.getMonth() &&
        expenseDate.getFullYear() === lastMonth.getFullYear()
      ) {
        lastMonthSum += amount;
      }

      // ✅ CURRENT YEAR
      if (expenseDate.getFullYear() === currentYear) {
        currentYearSum += amount;
      }

      total += amount;
    });

    setTodayExpense(todaySum);
    setYesterdayExpense(yesterdaySum);
    setLast7daysExpense(last7Sum);
    setLastMonthExpense(lastMonthSum);
    setCurrentMonthExpense(currentMonthSum); // ✅ NEW
    setCurrentYearExpense(currentYearSum);
    setGrandTotal(total);
  };

  // ✅ CARD COMPONENT (Reusable)
  const Card = ({ title, value, color }) => (
    <div className="col-md-4">
      <div
        className="card shadow-lg border-0 text-white mt-3"
        style={{
          borderRadius: "15px",
          background: color,
          height: "140px",
        }}
      >
        <div className="card-body text-center d-flex flex-column justify-content-center">
          <h6 className="mb-2">{title}</h6>
          <h3 className="fw-bold">₹ {value}</h3>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center fw-bold">💰 Expense Dashboard</h2>
      <p className="text-center text-muted">Track your spending smartly</p>

      <div className="row">
        <Card title="Today" value={todayExpense} color="linear-gradient(45deg,#007bff,#00c6ff)" />
        <Card title="Yesterday" value={yesterdayExpense} color="linear-gradient(45deg,#ff9800,#ffc107)" />
        <Card title="Last 7 Days" value={last7daysExpense} color="linear-gradient(45deg,#6c757d,#adb5bd)" />
        <Card title="Current Month" value={currentMonthExpense} color="linear-gradient(45deg,#20c997,#28a745)" />
        <Card title="Last Month" value={lastMonthExpense} color="linear-gradient(45deg,#6610f2,#6f42c1)" />
        <Card title="Current Year" value={currentYearExpense} color="linear-gradient(45deg,#dc3545,#ff6b6b)" />
        <Card title="Total" value={grandTotal} color="linear-gradient(45deg,#343a40,#000)" />
      </div>
    </div>
  );
}