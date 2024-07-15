import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./authContext";


export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
    return <p> Loading... </p>
    }

    return isAuthenticated ? children : <Navigate to="/" />;
};