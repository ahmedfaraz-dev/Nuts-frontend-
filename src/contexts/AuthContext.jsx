import React, { createContext, useContext, useState, useEffect } from 'react';
import { userApi } from '../Api/userApi.js';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    // On mount, try to restore session
    useEffect(() => {
        const restoreSession = async () => {
            // Optimization: Only try to restore if a token exists
            const token = Cookies.get("token") || localStorage.getItem("token");
            
            if (!token) {
                console.log("No auth token found, skipping session restoration.");
                setAuthLoading(false);
                return;
            }

            try {
                console.log("Restoring session...");
                const profileRes = await userApi.getCurrentUser();

                // Extract user data reliably even if nested (res.user or res.data)
                const userData = profileRes.user || profileRes.data || profileRes;

                if (userData && typeof userData === 'object') {
                    console.log("Session restored successfully:", userData.name);
                    setUser(userData);
                }
            } catch (err) {
                console.error("Session restoration failed:", err.response?.data?.message || err.message);
                // Clear state if session restoration failed due to invalid/expired token
                if (err.response?.status === 401) {
                    setUser(null);
                    Cookies.remove("token", { path: '/' });
                    localStorage.removeItem("token");
                }
            } finally {
                setAuthLoading(false);
            }
        };
        restoreSession();
    }, []);

    const login = async (credentials) => {
        try {
            const res = await userApi.login(credentials);

            // Robustly extract user data and token
            const userData = res.user || res.data || res;
            const token = res.accessToken || res.token || res.data?.accessToken || res.data?.token;

            // Centralized token handling
            if (token) {
                Cookies.set("token", token, { expires: 7, path: '/' });
                localStorage.setItem("token", token);
            }

            setUser(userData);
            return userData;
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
        Cookies.remove("token", { path: '/' });
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, setUser, authLoading, login, register, logout }}>
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
