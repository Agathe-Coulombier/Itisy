import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if user is authenticated when the component mounts
        axios.get('http://localhost:4000/auth/check-auth', { withCredentials: true })

            .then(response => {
                if (response.status === 200) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            
                console.log("auth context success", isAuthenticated)
            })
            .catch(() => {
                setIsAuthenticated(false);
                console.log("authContext fail")
            });

            console.log("coucou")
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
