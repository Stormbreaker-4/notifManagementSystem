import React, { createContext, useEffect, useMemo, useState } from "react";
import { login as loginApi, register as registerApi } from "../api/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { _id, name, email, role, token }

    useEffect(() => {
        const raw = localStorage.getItem("user");
        if (raw) setUser(JSON.parse(raw));
    }, []);

    const login = async (email, password) => {
        const { data } = await loginApi({ email, password });
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        return data;
    };

    const register = async (payload) => {
        const { data } = await registerApi(payload);
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    const value = useMemo(() => ({
        user,
        login,
        register,
        logout,
        isStudent: user?.role === "student",
        isCoordinator: user?.role === "coordinator",
    }), [user]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
