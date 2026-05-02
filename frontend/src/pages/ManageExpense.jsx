import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ManageExpense() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/"); // redirect if no user
    } else {
      fetchapi();
    }
  }, [userId]);
  const [editExpense,setEditExpense]=useState(null)
  const handleEdit=(expense)=>{
        setEditExpense(expense)
  }
  const handleChange=(e)=>{
    setEditExpense({...editExpense,[e.target.name]:e.target.value});
  }

  // ✅ FETCH API
  const fetchapi = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/manage-expense/${userId}`
      );

      const result = await res.json();

      if (res.status === 200) {
        toast.success(result.message);
        setMessage(result.message);
        setExpenses(result.data); // ✅ store data
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };
const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setMessage("");
      const res = await fetch(`http://127.0.0.1:8000/api/update-expense/${editExpense.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editExpense)
      });

      const data = await res.json();

      if (res.status === 200 || res.status === 201) {
        toast.success(data.message );
        setEditExpense(null)
        fetchapi()

      } else {
        toast.error(data.error || "Error ❌");
        setMessage(data.error);
      }

    } catch (error) {
      console.error("Error:", error);
      toast.error("Server error ❌");
    }
  };
// ✅ DELETE
  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete?")) return;

  try {
    const res = await fetch(
      `http://127.0.0.1:8000/api/delete-expense/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    if (res.status === 200) {
      toast.success(data.message);
      fetchapi()

    } else {
      toast.error(data.error || "Delete failed ❌");
    }

  } catch (error) {
    toast.error("Server error ❌");
  }
};

  return (
    <div className="container py-4">
   

      {/* TITLE */}
      <div className="mb-4 text-center">
        <h2 className="fw-bold">Manage Your Daily Expenses</h2>
        <p className="text-muted">{message}</p>
      </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle text-center">

              <thead className="table-dark">
                <tr>
                  <th>Id</th>
                  <th>Date</th>
                  <th>Item Name</th>
                  <th>Cost</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {expenses.length > 0 ? (
                  expenses.map((exp,id) => (
                    <tr key={id}>
                      <td>{exp.id}</td>
                      <td>{exp.Ex_Date}</td>
                      <td>{exp.Ex_Item}</td>
                      <td>{exp.Ex_cost}</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={()=>handleEdit(exp)}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-danger "onClick={()=>handleDelete(exp.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-muted">
                      No expenses found
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        {editExpense && (
            <div className="modal show d-block" >
            <div className="modal-dialog">
                <div className="modal-content">
                <div class="modal-header bg-primary ">
                    <h3 className="modal-title text-center">Edit Expense </h3>
                    <button type="button" class="btn-close"onClick={()=>setEditExpense(null)}></button>
                </div>
                <div class="modal-body">
                   <div className="mb-3">
              <label className="form-label">Expense Date</label>
              <input
                type="date"
                name="Ex_Date"
                className="form-control"
                value={editExpense.Ex_Date }
                onChange={handleChange}
                required
              />
            </div>

            {/* ITEM */}
            <div className="mb-3">
              <label className="form-label">Expense Item</label>
              <input
                type="text"
                name="Ex_Item"
                className="form-control"
                placeholder="Enter item name"
                value={editExpense.Ex_Item }
                onChange={handleChange}
                required
              />
            </div>

            {/* COST */}
            <div className="mb-3">
              <label className="form-label">Expense Cost</label>
              <input
                type="number"
                name="Ex_cost"
                className="form-control"
                placeholder="Enter cost"
                value={editExpense.Ex_cost }
                onChange={handleChange}
                required
              />
            </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={()=>setEditExpense(null)}>Close</button>
                    <button type="button" className="btn btn-primary" onClick={handleUpdate}>Save changes</button>
                </div>
                </div>
            </div>
        </div>)
}
           <ToastContainer />
</div>
     
  );
}