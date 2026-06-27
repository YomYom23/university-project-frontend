import { Navigate, } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { ReactNode } from 'react';
import LoadingScreen from "./ui/LoadingScreen.tsx";

export const ProtectedRoute = ({ children }: {children: ReactNode}) => {
    const { user, isLoading } = useAuth();

    if(isLoading) {
        return <LoadingScreen />
    }

    if(!user) {
        return <Navigate to="/login" replace />
    }

    return children;
}