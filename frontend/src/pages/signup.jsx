import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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
      const res = await fetch("http://127.0.0.1:8000/api/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.status === 200 || res.status === 201) {
        toast.success("Signup successful ✅");

        setTimeout(() => {
          navigate("/login");
        }, 2000);

        setForm({
          name: "",
          email: "",
          password: ""
        });

      } else {
        toast.error(data.message || "Error ❌");
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
          
          <h3 className="text-center mb-3">Create Account</h3>
          <p className="text-center text-muted">Signup to continue</p>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

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

            <button className="btn btn-primary w-100">
              Sign Up
            </button>

          </form>

          {/* 🔗 LOGIN LINK */}
          <div className="text-center mt-3">
            <small>
              Already have an account?{" "}
              <Link to="/login" className="text-primary fw-bold">
                Login
              </Link>
            </small>
          </div>

        </div>
      </div>
    </>
  );
}

export default Signup;