import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useLocalStorage } from './useLocalStorage';  // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [user, setUser] = useState(null);
const [accessToken, setAccessToken] = useLocalStorage('accessToken', null);
const [refreshToken, setRefreshToken] = useLocalStorage('refreshToken', null);
const [loading, setLoading] = useState(true); // Add a loading state
const [authChecked, setAuthChecked] = useState(false);
const navigate = useNavigate();

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

// Check the access token on initial load and periodically
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

// Token expiration check
useEffect(() => {
let timeout;

if (accessToken) {
    const tokenExpirationTime = 600000;
    const expireAt = Date.now() + tokenExpirationTime;

    const checkTokenExpiration = () => {
    const currentTime = Date.now();
    if (currentTime >= expireAt) {
        logout(); // Log out if the token is expired
    } else {
        timeout = setTimeout(checkTokenExpiration, expireAt - currentTime);
    }
    };

    timeout = setTimeout(checkTokenExpiration, tokenExpirationTime);
}

return () => clearTimeout(timeout);
}, [accessToken, navigate, logout]);

// Refresh token on user activity
useEffect(() => {
const refreshAccessToken = async () => {
    try {
    const response = await axios.post('http://localhost:4000/auth/token', { token: refreshToken });
    console.log("refreshtoken", response)
    if (response.status === 200) {
        setAccessToken(response.data.accessToken);
        // Clear and reset the token expiration check timer
        clearTimeout(window.tokenCheckTimeout);    }
    } catch (error) {
    console.error('Failed to refresh access token:', error);
    logout(); // Log out if token refresh fails
    }
};

const resetExpiration = () => {
    if (refreshToken) {
    refreshAccessToken();
    }
};

// Listeners for user activity
// window.addEventListener('mousemove', resetExpiration);
window.addEventListener('click', resetExpiration);
window.addEventListener('keypress', resetExpiration);

return () => {
    // window.removeEventListener('mousemove', resetExpiration);
    window.removeEventListener('click', resetExpiration);
    window.removeEventListener('keypress', resetExpiration);
};
}, [refreshToken, setAccessToken, logout]);

// Axios Interceptor for handling token refresh
useEffect(() => {
const interceptor = axios.interceptors.response.use(
    response => response,
    async error => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
        const response = await axios.post('http://localhost:4000/auth/token', { token: refreshToken, user: user });
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

return (
<AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, login, logout, loading }}>
    {children}
</AuthContext.Provider>
);
};
