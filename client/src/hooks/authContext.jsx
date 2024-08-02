import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useLocalStorage } from './useLocalStorage';  
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [user, setUser] = useState(null);
const [accessToken, setAccessToken] = useLocalStorage('accessToken', null);
const [refreshToken, setRefreshToken] = useLocalStorage('refreshToken', null);
const [loading, setLoading] = useState(true);
const [authChecked, setAuthChecked] = useState(false);
const navigate = useNavigate();

// Login function
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

// Function to handle logout
const logout = () => {
setAccessToken(null);
setRefreshToken(null);
setIsAuthenticated(false);
setUser(null);
navigate('/');
console.log("Logged out, state updated:", {
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    user: null
});
};

// Check the access token on initial load / every time the token in modified / every min
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

// Set periodic check to every 60 seconds
const intervalId = setInterval(checkAuth, 60000); 
// Cleanup on unmount
return () => clearInterval(intervalId); 
}, [accessToken]);

// Refresh token on user activity
useEffect(() => {
// Refresh access token after checking the refresh token is still valid
const refreshAccessToken = async () => {
    try {
    const response = await axios.post('http://localhost:4000/auth/refreshAccessToken', { token: refreshToken });
    setAccessToken(response.data.accessToken)
    } catch (error) {
    console.error('Failed to refresh access token:', error);
    logout();
    }
};
// Triggers the refreshAccessToken if user authenticated and toke expiracy <= 3m
const resetExpiration = () => {
    const tokenExpirationTime = accessToken? jwtDecode(accessToken).exp : 0;
    const timeNow= Date.now() / 1000;

    if (refreshToken && (tokenExpirationTime - timeNow) <= 180) {
        refreshAccessToken();
    }
};
// window.addEventListener('mousemove', resetExpiration);
window.addEventListener('click', resetExpiration);
window.addEventListener('keypress', resetExpiration);
return () => {
    // window.removeEventListener('mousemove', resetExpiration);
    window.removeEventListener('click', resetExpiration);
    window.removeEventListener('keypress', resetExpiration);
};
        
}, [refreshToken, setAccessToken, logout]);

// Axios Interceptor: refreshes the token when an API request fails due to token 
// expiration, ensuring that protected API calls are not blocked due to expired 
// tokens
useEffect(() => {
const interceptor = axios.interceptors.response.use(
    response => response,
    async error => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
        const response = await axios.post('http://localhost:4000/auth/refreshAccessToken', { token: refreshToken, user: user });
        if (response.status === 200) {
            setAccessToken(response.data.accessToken);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.accessToken;
            return axios(originalRequest);
        }
        } catch (tokenError) {
        console.error("Failed to refresh token:", tokenError);
        logout();
        }
    }
    return Promise.reject(error);
    }
);
return () => axios.interceptors.response.eject(interceptor);
}, [refreshToken, setAccessToken, logout]);

return (
<AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, login, logout, loading }}>
    {children}
</AuthContext.Provider>
);
};
