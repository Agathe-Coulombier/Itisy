import React, {useState} from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/authenticate/HomePage/Homepage.jsx";
import ResetPassword from "./components/authenticate/ResetPassword/ResetPassword.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import { ProtectedRoute } from "./hooks/protectedRoute.jsx";
import { AuthProvider } from "./hooks/authContext.jsx";
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
            path="/dashboard/view"
            element={
              <ProtectedRoute>
                <Dashboard mode="view" /> 
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/create-folder"
            element={
              <ProtectedRoute>
                <Dashboard mode="create-folder" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/modify-folder"
            element={
              <ProtectedRoute>
                <Dashboard mode="modify-folder" />
              </ProtectedRoute>
            }
          />
        
        </Routes>
      </AuthProvider>
    </Router>
  );
}



export default App;
