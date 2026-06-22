import { Navigate, } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from "./ui/LoadingScreen.tsx";

export const ProtectedRoute = ({ children }: {children: React.ReactNode}) => {
    const { user, isLoading } = useAuth();

    if(isLoading) {
        return <LoadingScreen />
    }

    if(!user) {
        return <Navigate to="/login" replace />
    }

    return children;
}