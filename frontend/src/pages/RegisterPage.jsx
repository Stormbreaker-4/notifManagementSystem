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
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex justify-center items-center p-6">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Create Account</h1>
                    <p className="text-gray-600 text-center mb-8">Join VIT Events today</p>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <input 
                                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500" 
                                placeholder="Name"
                                value={form.name} 
                                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                            />
                        </div>
                        <div>
                            <input 
                                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500" 
                                placeholder="Email"
                                type="email"
                                value={form.email} 
                                onChange={(e) => setForm({ ...form, email: e.target.value })} 
                            />
                        </div>
                        <div>
                            <input 
                                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500" 
                                placeholder="Password" 
                                type="password"
                                value={form.password} 
                                onChange={(e) => setForm({ ...form, password: e.target.value })} 
                            />
                        </div>
                        <div>
                            <input 
                                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500" 
                                placeholder="Mobile Number (+911234567890)"
                                value={form.mobileNumber} 
                                onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })} 
                            />
                        </div>
                        <div>
                            <select 
                                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                                value={form.role} 
                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                            >
                                <option value="student">Student</option>
                                <option value="coordinator">Coordinator</option>
                            </select>
                        </div>
                        <button className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md">
                            Create Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
