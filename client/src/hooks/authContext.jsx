import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useLocalStorage } from './useLocalStorage';  // Adjust the path as necessary

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [user, setUser] = useState(null);
const [accessToken, setAccessToken] = useLocalStorage('accessToken', null);
const [refreshToken, setRefreshToken] = useLocalStorage('refreshToken', null);

useEffect(() => {
    const checkAuth = async () => {

    try {
        if (accessToken) {
            console.log("requesting...")
        const response = await axios.get('http://localhost:4000/auth/check-auth', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log(response.data)
        if (response.data.authenticated) {
            setIsAuthenticated(true);
            setUser(response.data.user);

            console.log("is auth 2", isAuthenticated, user)
        } else {
            setIsAuthenticated(false);
        }
        }
    } catch (error) {
        setIsAuthenticated(false);
    }
    };
    checkAuth();
}, [accessToken]);

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

    console.log(response)
    console.log("access token ", accessToken);
    console.log("refresh token", refreshToken)
    console.log("is auth ", isAuthenticated)
};

const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
    setUser(null);
};

return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, login, logout }}>
    {children}
    </AuthContext.Provider>
);
};


// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { useLocalStorage } from './useLocalStorage';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // Check if user is authenticated when the component mounts
//         axios.get('http://localhost:4000/auth/check-auth', { withCredentials: true })
        

//             .then(response => {
//                 if (response.status === 200) {
//                     setIsAuthenticated(true);
//                 } else {
//                     setIsAuthenticated(false);
//                 }
            
//             })

//             .catch(() => {
//                 setIsAuthenticated(false);
//             })

//             .finally(() => {
//                 setLoading(false);
//             });

//     }, []);


//     console.log("front end to check is user auth")
//     return (
//         <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, loading, setLoading }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };
