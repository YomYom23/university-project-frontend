import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext.ts";
import type { Student, University} from "../types.ts";

export const AuthProvider = ({ children }: { children: React.ReactNode}) => {
    const [ user, setUser ] = useState<Student | University | null>(null);
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await fetch('http://localhost:3000/auth/status', {
                    credentials: 'include',
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
            } catch (err) {
                console.error(err ?? 'Failed to fetch user status');
            } finally {
                setIsLoading(false);
            }
        }

        verifyUser();
    }, [])

    return (
        <AuthContext.Provider value={{ user, isLoading, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}