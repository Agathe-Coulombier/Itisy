import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useLocalStorage } from './useLocalStorage';  // Adjust the path as necessary

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [user, setUser] = useState(null);
const [accessToken, setAccessToken] = useLocalStorage('accessToken', null);
const [refreshToken, setRefreshToken] = useLocalStorage('refreshToken', null);
const [loading, setLoading] = useState(true); // Add a loading state
const [authChecked, setAuthChecked] = useState(false);

useEffect(() => {
    const checkAuth = async () => {
    try {
        if (accessToken) {
        console.log("Requesting authentication check...");
        const response = await axios.get('http://localhost:4000/auth/check-auth', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (response.data.authenticated) {
            setIsAuthenticated(true);
            setUser(response.data.user);
        } else {
            setIsAuthenticated(false);
            setUser(null);
        }
        }
    } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
    } finally {
        setLoading(false);
        setAuthChecked(true); 
    }
    };

    checkAuth();
}, [accessToken]);

useEffect(() => {
    if (authChecked) {
    // console.log("Authentication state updated:", { isAuthenticated, user });
    }
}, [isAuthenticated, user, authChecked]);

// Axios Interceptor for handling token refresh
axios.interceptors.response.use(
    response => response,
    async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const response = await axios.post('http://localhost:4000/auth/token', { token: refreshToken });
        if (response.status === 200) {
        setAccessToken(response.data.accessToken);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.accessToken;
        return axios(originalRequest);
        }
    }
    return Promise.reject(error);
    }
);

const login = async (credentials, response) => {
    setAccessToken(response.data.accessToken);
    setRefreshToken(response.data.refreshToken);
    setIsAuthenticated(true);
    setUser(response.data.user);

    console.log("Login response:", response);
    console.log("State after login:", {
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken,
    isAuthenticated: true,
    user: response.data.user
    });
};

const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
    setUser(null);
    console.log("Logged out, state updated:", {
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    user: null
    });
};

return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, login, logout, loading }}>
    {children}
    </AuthContext.Provider>
);
};
