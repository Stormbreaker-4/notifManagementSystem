import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const { register } = useContext(AuthContext);
    const nav = useNavigate();
    const [form, setForm] = useState({
        name: "", email: "", password: "", role: "student",
    });
    const [err, setErr] = useState("");

    async function onSubmit(e) {
        e.preventDefault();
        setErr("");
        try {
            await register(form);
            nav("/");
        } catch (e2) {
            setErr(e2?.response?.data?.message || "Registration failed");
        }
    }

    return (
        <div className="flex justify-center items-center min-h-[70vh]">
            <form onSubmit={onSubmit} className="bg-white shadow p-6 rounded w-96 space-y-3">
                <h1 className="text-xl font-bold">Register</h1>
                {err && <p className="text-red-600 text-sm">{err}</p>}
                <input className="border p-2 w-full" placeholder="Name"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input className="border p-2 w-full" placeholder="Email"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input className="border p-2 w-full" placeholder="Password" type="password"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <select className="border p-2 w-full"
                    value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                    <option value="student">Student</option>
                    <option value="coordinator">Coordinator</option>
                </select>
                <button className="bg-green-600 text-white px-4 py-2 rounded w-full">Create account</button>
            </form>
        </div>
    );
}
