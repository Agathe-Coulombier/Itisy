import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./authContext";
import Loader from "../components/Loader/Loader";

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
    return <div className = "loader-container"> 
        < Loader />
    </div>
    }

    return isAuthenticated ? children : <Navigate to="/" />;
};