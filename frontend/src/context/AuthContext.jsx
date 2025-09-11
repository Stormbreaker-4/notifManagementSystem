import React, { createContext, useEffect, useMemo, useRef, useState } from "react";
import { login as loginApi, register as registerApi } from "../api/authApi";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { _id, name, email, role, token }
    const logoutTimerRef = useRef(null);

    const clearLogoutTimer = () => {
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        }
    };

    const startLogoutTimer = (token) => {
        clearLogoutTimer();
        if (!token) return;
        try {
            const { exp } = jwtDecode(token); // seconds epoch
            const msRemaining = exp * 1000 - Date.now();
            if (msRemaining <= 0) {
                logout();
                return;
            }
            logoutTimerRef.current = setTimeout(() => {
                logout(); // will also redirect via axios interceptor (below)
            }, msRemaining);
        } catch {
            // if token can't be decoded, logout defensively
            logout();
        }
    };

    useEffect(() => {
        try {
            const raw = localStorage.getItem("user");
            if (raw) {
                const data = JSON.parse(raw);
                setUser(data);
                startLogoutTimer(data.token);
            }
        } catch { }
        return () => clearLogoutTimer();
    }, []);

    const login = async (email, password) => {
        const { data } = await loginApi({ email, password });
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        startLogoutTimer(data.token);
        return data;
    };

    const register = async (payload) => {
        const { data } = await registerApi(payload);
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        startLogoutTimer(data.token);
        return data;
    };

    const logout = () => {
        try { localStorage.removeItem("user"); } catch { }
        setUser(null);
        // call backend to revoke refresh + clear cookie (best-effort)
        fetch("http://localhost:5000/api/auth/logout", { method: "POST", credentials: "include" })
        .catch(() => {});
            // .finally(() => { if (typeof window !== 'undefined') window.location.replace('/login'); });
    };

    const value = useMemo(() => ({
        user,
        login,
        register,
        logout,
        isStudent: user?.role === "student",
        isCoordinator: user?.role === "coordinator",
    }), [user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
