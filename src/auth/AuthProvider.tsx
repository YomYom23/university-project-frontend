import { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext.ts";
import type { User } from "../types.ts";

// Pure IO, deliberately outside the component: asks the cookie-backed
// /auth/status endpoint who is signed in and answers with the user or null.
// credentials:'include' is what sends the session cookie.
//
// Keeping this separate from the state updates is what lets the mount effect
// below set state inside the promise callback rather than in its body.
async function fetchAuthStatus(): Promise<User | null> {
    try {
        const res = await fetch('http://localhost:3000/auth/status', {
            credentials: 'include'
        });

        if (!res.ok) return null;

        const data = await res.json();
        return data.user ?? null;
    } catch (err) {
        console.error(err ?? 'Failed to fetch user status');
        return null;
    }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Single source of truth for "who is logged in". Exposed via context so
    // SigninPage/SignupPage can re-run it after establishing a session and
    // have the context pick up the new cookie.
    const refreshUser = useCallback(async () => {
        setUser(await fetchAuthStatus());
    }, []);

    // Resolve the session once on mount. The state updates happen in the
    // promise callback, not synchronously in the effect body, so they land
    // after the fetch settles instead of cascading an extra render.
    useEffect(() => {
        let cancelled = false;

        fetchAuthStatus().then((currentUser) => {
            if (cancelled) return;
            setUser(currentUser);
            setIsLoading(false);
        });

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, setUser, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};
