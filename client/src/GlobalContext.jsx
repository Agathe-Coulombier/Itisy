import React, { createContext, useContext } from 'react';

// Create a context
const GlobalContext = createContext();

// Create a provider component
export const GlobalProvider = ({ children }) => {
    // Define your global function
    const globalFunction = () => {
        console.log('This is a global function');
    };

    return (
        <GlobalContext.Provider value={{ globalFunction }}>
            {children}
        </GlobalContext.Provider>
    );
};

// Custom hook to use the GlobalContext
export const useGlobalContext = () => {
    return useContext(GlobalContext);
};
