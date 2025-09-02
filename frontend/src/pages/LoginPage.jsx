import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const { login } = useContext(AuthContext);
    const nav = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [err, setErr] = useState("");

    async function onSubmit(e) {
        e.preventDefault();
        setErr("");
        try {
            const data = await login(form.email, form.password); // returns user object
            if (data.role === "coordinator") {
                nav("/coordinator/dashboard", { replace: true });
            } else {
                nav("/profile", { replace: true });
            }
        } catch (e2) {
            setErr(e2?.response?.data?.message || "Login failed");
        }
    }

    return (
        <div className="flex justify-center items-center min-h-[70vh]">
            <form onSubmit={onSubmit} className="bg-white shadow p-6 rounded w-80 space-y-3">
                <h1 className="text-xl font-bold">Login</h1>
                {err && <p className="text-red-600 text-sm">{err}</p>}
                <input className="border p-2 w-full" placeholder="Email"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input className="border p-2 w-full" placeholder="Password" type="password"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Login</button>
            </form>
        </div>
    );
}
