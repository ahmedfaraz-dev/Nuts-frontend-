import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

/**
 * Wraps a route that requires the user to be logged in.
 * If adminOnly={true} the user must also have role === 'admin'.
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, authLoading } = useAuth();
    const location = useLocation();

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50/30 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-[1100px] mx-auto bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-gray-100">
                    <div className="animate-pulse space-y-4">
                        <div className="h-6 w-44 rounded bg-gray-200" />
                        <div className="h-24 w-full rounded-2xl bg-gray-200" />
                        <div className="h-24 w-full rounded-2xl bg-gray-200" />
                        <div className="h-24 w-full rounded-2xl bg-gray-200" />
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        const redirectTo = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/login?redirectTo=${redirectTo}`} replace />;
    }

    if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;

    return children;
};

export default ProtectedRoute;
