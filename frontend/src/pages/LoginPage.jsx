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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex justify-center items-center p-6">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Welcome Back</h1>
                    <p className="text-gray-600 text-center mb-8">Sign in to your account</p>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <input 
                                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" 
                                placeholder="Email"
                                type="email"
                                value={form.email} 
                                onChange={(e) => setForm({ ...form, email: e.target.value })} 
                            />
                        </div>
                        <div>
                            <input 
                                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" 
                                placeholder="Password" 
                                type="password"
                                value={form.password} 
                                onChange={(e) => setForm({ ...form, password: e.target.value })} 
                            />
                        </div>
                        <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
