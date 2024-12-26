import React, { createContext, useState, useContext } from 'react';

// Create the context
const UserContext = createContext();

// Create a custom hook to use the user context
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData);  // Set the user data when logging in
    };

    const logout = () => {
        setUser(null);  // Clear the user data on logout
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
