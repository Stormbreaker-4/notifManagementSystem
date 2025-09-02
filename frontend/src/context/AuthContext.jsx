import React, { createContext, useEffect, useState } from "react";
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
    };

    const register = async (payload) => {
        const { data } = await registerApi(payload);
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
