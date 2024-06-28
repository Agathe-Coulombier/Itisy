import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import HomePage from "./components/HomePage/Homepage";
import MailTemplate from "./emails/MailTemplate.js";
import ResetPassword from "./components/ResetPassword/ResetPassword.jsx";

function App() {
  return (
      <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/email" element={<MailTemplate />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}
export default App;