import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/authenticate/HomePage/Homepage.jsx";
import MailTemplate from "./emails/MailTemplate.js";
import ResetPassword from "./components/authenticate/ResetPassword/ResetPassword.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the homepage, accessible at the root URL */}
        <Route path="/" element={<HomePage />} />

        {/* Route for the reset password page */}
        <Route path="/auth/reset-password" element={<ResetPassword />} />

        <Route path="/auth/reset-password" element={<ResetPassword />} />
        {/* <Route element={<Dashboard isAuthenticated={isAuthenticated} />} /> */}
        {/* <Route path="dashboard" element={<Dashboard logout={logout} />} /> */}

      </Routes>
    </Router>
  );
}

export default App;
