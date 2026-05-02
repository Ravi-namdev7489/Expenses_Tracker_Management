import { Link } from "react-router-dom";

function Home() {
  const userId = localStorage.getItem("userId");

  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #0d6efd10, #20c99710)"
      }}
    >
      <div
        className="card border-0 shadow-lg p-5 text-center"
        style={{
          maxWidth: "520px",
          width: "100%",
          borderRadius: "20px",
          backdropFilter: "blur(10px)"
        }}
      >

        {/* HEADER */}
        <h1 className="fw-bold">💰 Expense Tracker</h1>
        <p className="text-muted">
          Smart way to manage your money expensis 
        </p>
       
        {/* CONDITIONAL BUTTONS */}
        {userId ? (
          <Link
            to="/dashboard"
            className="btn btn-primary w-100 py-2 shadow-sm"
          >
            🚀 Go to Dashboard
          </Link>
        ) : (
          <div className="d-grid gap-2">

            <Link
              to="/signup"
              className="btn btn-success py-2"
            >
              Create Account
            </Link>

            <Link
              to="/login"
              className="btn btn-outline-primary py-2"
            >
              Login
            </Link>

          </div>
        )}

      </div>
    </div>
  );
}

export default Home;