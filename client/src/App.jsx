import React, {useContext} from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/authenticate/HomePage/Homepage.jsx";
import MailTemplate from "./emails/MailTemplate.js";
import ResetPassword from "./components/authenticate/ResetPassword/ResetPassword.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import { AuthProvider, AuthContext } from "./components/authenticate/authContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Route for the homepage, accessible at the root URL */}
          <Route 
            path="/" 
            element={<HomePage />} 
          />

          {/* Route for the reset password page */}
          <Route
            path="/auth/reset-password"
            element={<ResetPassword />} 
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        
        </Routes>
      </AuthProvider>
    </Router>
  );
}

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  console.log("protected route, is auth ? ", isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default App;
