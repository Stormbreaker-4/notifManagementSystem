import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function RegisterPage() {
    const { register } = useContext(AuthContext);
    const nav = useNavigate();
    const [form, setForm] = useState({
        name: "", email: "", password: "", mobileNumber: "", role: "student",
    });

    function validate() {
        if (!form.name.trim()) {
            toast.error('Name is required');
            return false;
        }
        if (!form.email.trim()) {
            toast.error('Email is required');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            toast.error('Please provide a valid email address');
            return false;
        }
        if (form.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return false;
        }
        if (form.mobileNumber && !/^\+91[0-9]{10}$/.test(form.mobileNumber.replace(/\s/g, ''))) {
            toast.error('Mobile number must be in format +911234567890 (+91 followed by 10 digits)');
            return false;
        }
        return true;
    }

    async function onSubmit(e) {
        e.preventDefault();
        if (!validate()) return;
        const promise = register(form).then(() => {
            nav("/");
            return "Registration successful!";
        });
        
        toast.promise(promise, {
            loading: 'Registering...',
            success: (msg) => msg,
            error: (err) => err?.response?.data?.message || "Registration failed",
        });
    }

    return (
        <div className="flex justify-center items-center min-h-[70vh]">
            <form onSubmit={onSubmit} className="bg-white shadow p-6 rounded w-96 space-y-3">
                <h1 className="text-xl font-bold">Register</h1>
                <input className="border p-2 w-full" placeholder="Name"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input className="border p-2 w-full" placeholder="Email"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input className="border p-2 w-full" placeholder="Password" type="password"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <input className="border p-2 w-full" placeholder="Mobile Number"
                    value={form.mobileNumber} onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })} />
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
