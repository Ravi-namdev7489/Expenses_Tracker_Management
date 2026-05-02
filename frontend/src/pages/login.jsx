import { useState } from "react";

import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.status === 200) {
        toast.success("Login successful ✅",data.message);
        // 🔐 (optional) store user/token
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userName", data.userName);

        setTimeout(() => {
          navigate("/"); // change if needed
        }, 2000);
      } else {
        toast.error(data.message || "Invalid credentials ❌");
        setMessage(data.message);
      }

    } catch (error) {
      console.error("error", error);
      toast.error("Server error ❌");
    }
  };

  return (
    <>
      
      <ToastContainer />

      <div className="container d-flex justify-content-center align-items-center vh-100">

        <div className="card shadow-lg p-4" style={{ width: "400px" }}>
          
          <h3 className="text-center mb-3">Welcome Back</h3>
          <p className="text-center text-muted">Login to your account</p>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            {message && (
              <div className="alert alert-danger p-2 text-center">
                {message}
              </div>
            )}

            <button className="btn btn-success w-100">
              Login
            </button>

          </form>

          {/* 🔗 SIGNUP LINK */}
          <div className="text-center mt-3">
            <small>
              Don’t have an account?{" "}
              <Link to="/signup" className="text-primary fw-bold">
                Signup
              </Link>
            </small>
          </div>

        </div>
      </div>
    </>
  );
}

export default Login;