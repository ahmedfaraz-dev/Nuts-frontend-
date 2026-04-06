import React, { createContext, useContext, useState, useEffect } from 'react';
import { userApi } from '../Api/userApi.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // MOCK: Default admin session for development without backend
    const [user, setUser] = useState({
        name: "Admin User",
        email: "admin@example.com",
        role: "admin"
    });
    const [authLoading, setAuthLoading] = useState(false);

    // On mount, try to restore session (disabled for mock)
    useEffect(() => {
        // Mock session is already set
        setAuthLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const res = await userApi.login(credentials);
            // After login, fetch the full user profile (from our mock or real API)
            const profileRes = await userApi.getCurrentUser();
            const userData = profileRes.data || profileRes;
            setUser(userData);
            return res;
        } catch (err) {
            console.error("Login failed:", err);
            throw err;
        }
    };

    const register = async (userData) => {
        return await userApi.register(userData);
    };

    const logout = async () => {
        try {
            await userApi.logout();
        } catch (err) {
            console.error("Logout error:", err);
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, authLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
