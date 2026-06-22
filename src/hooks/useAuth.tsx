import {createContext, useContext, useState, useEffect } from "react";
import type { Student, University } from "../types.ts";

// Auth State Interface
interface AuthContextType {
    user: Student | University | null;
    isLoading: boolean;
    setUser: React.Dispatch<React.SetStateAction<Student | University | null>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider({ children}) {
    const [ user, setUser ] = useState<Student | University | null>(null);
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await fetch('http://localhost:3000/auth/status', {
                    credentials: 'include',
                });

                if (res.ok) {
                    const data = await response.json();
                    setUser(data.user);
                }
            } catch (err) {
                console.error('Not authenticated')
            } finally {
                setIsLoading(false);
            };
        }

        verifyUser();
    })

    return (
        <AuthContext.Provider value={{ user, isLoading, setUser }}>
    </AuthContext.Provider>
    )
}