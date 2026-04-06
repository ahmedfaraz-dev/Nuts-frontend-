import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

/**
 * Wraps a route that requires the user to be logged in.
 * If adminOnly={true} the user must also have role === 'admin'.
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, authLoading } = useAuth();

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#F59115] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;

    return children;
};

export default ProtectedRoute;
