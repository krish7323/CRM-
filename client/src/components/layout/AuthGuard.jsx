import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
export const AuthGuard = ({ children }) => {
    const { isAuthenticated } = useAppStore();
    const location = useLocation();
    if (!isAuthenticated) {
        // Redirect unauthenticated users to /login and preserve attempted URL
        return <Navigate to="/login" state={{ from: location }} replace/>;
    }
    return <>{children}</>;
};
