import { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext.ts";
import type { Student, University } from "../types.ts";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<Student | University | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Single source of truth for "who is logged in". Hits the cookie-backed
    // /auth/status endpoint; credentials:'include' is what sends the session
    // cookie. Exposed via context so SigninPage/SignupPage can re-run it after
    // establishing a session.
    const refreshUser = useCallback(async () => {
        try {
            const res = await fetch('http://localhost:3000/auth/status', {
                credentials: 'include',
                headers: { 'Authorization' : `Bearer ${localStorage.getItem('token') ?? ""}` }
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data.user ?? null);
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error(err ?? 'Failed to fetch user status');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // [] via useCallback deps → runs exactly once on mount instead of on every
    // render (the original had no deps array and re-fetched constantly).
    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    return (
        <AuthContext.Provider value={{ user, isLoading, setUser, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};
