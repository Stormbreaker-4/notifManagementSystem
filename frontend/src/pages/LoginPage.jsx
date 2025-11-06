import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function LoginPage() {
    const { login } = useContext(AuthContext);
    const nav = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });

    async function onSubmit(e) {
        e.preventDefault();
        const promise = login(form.email, form.password).then((data) => {
            toast.success(`Welcome back, ${data.name}!`);
            nav("/", { replace: true });
            return "Login successful";
        });
        
        toast.promise(promise, {
            loading: 'Logging in...',
            success: (msg) => msg,
            error: (err) => err?.response?.data?.message || "Invalid credentials",
        });
    }

    return (
        <div className="flex justify-center items-center min-h-[70vh]">
            <form onSubmit={onSubmit} className="bg-white shadow p-6 rounded w-80 space-y-3">
                <h1 className="text-xl font-bold">Login</h1>
                <input className="border p-2 w-full" placeholder="Email"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input className="border p-2 w-full" placeholder="Password" type="password"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Login</button>
            </form>
        </div>
    );
}
