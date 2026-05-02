import { Link ,useNavigate} from "react-router-dom";


function Navbar() {
    const navigate=useNavigate()
  const userId = localStorage.getItem('userId');

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login')
    
  };

  return (
    <div className="container-fluid p-0">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

        <div className="container-fluid">

          {/* LEFT SIDE */}
          <Link className="navbar-brand" to="/">
            <i className="bi bi-wallet2 me-2"></i>
            Expense
          </Link>

          {/* RIGHT SIDE */}
          <div className="collapse navbar-collapse justify-content-end">
            <ul className="navbar-nav">

              <li className="nav-item">
                <Link className="nav-link" to="/">
                  <i className="bi bi-house-door me-1"></i>
                  Home
                </Link>
              </li>

              {userId ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/add-expense">
                      <i className="bi bi-plus-circle me-1"></i>
                      Add Expense
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/manage-expense">
                      <i className="bi bi-gear me-1"></i>
                      Manage Expense
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/expense-report">
                      <i className="bi bi-bar-chart me-1"></i>
                      Report
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/change-password">
                      <i className="bi bi-key me-1"></i>
                      Change Password
                    </Link>
                  </li>

                  <li className="nav-item">
                    <button 
                      className="btn btn-sm btn-danger ms-2 mt-1"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-1"></i>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/signup">
                      <i className="bi bi-person-plus me-1"></i>
                      Signup
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      <i className="bi bi-box-arrow-in-right me-1"></i>
                      Login
                    </Link>
                  </li>
                </>
              )}

            </ul>
          </div>

        </div>

      </nav>
    </div>
  );
}

export default Navbar;