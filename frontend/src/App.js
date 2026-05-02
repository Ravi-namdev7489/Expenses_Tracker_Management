import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Home from  './pages/home';
import Signup from './pages/signup';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import Add_Expense from './pages/AddExpense';
import ManageExpense from './pages/ManageExpense';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ExpenseReport from './pages/ExpenseReport';
import ChangePassword from './pages/ChangePassword';
import React from 'react';
import Navbar from "./componant/Navbar";
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
rel="stylesheet"></link>
function App() {
  return (
  
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/add-expense" element={<Add_Expense/>}/>
        <Route path="/manage-expense" element={<ManageExpense/>}/>
        <Route path="/expense-report" element={<ExpenseReport/>}/>
        <Route path="/change-password" element={<ChangePassword/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
