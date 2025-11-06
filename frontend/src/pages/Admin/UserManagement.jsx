import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, deleteUser, updateUser } from "../../api/userApi";
import toast from "react-hot-toast";

export default function UserManagement() {
    const nav = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: "", email: "", role: "", mobileNumber: "" });

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            const { data } = await getUsers();
            setUsers(data || []);
        } catch (e) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id, name) {
        const confirmed = await new Promise((resolve) => {
            toast((t) => (
                <div>
                    <p className="mb-2">Delete user <strong>{name}</strong>? This will remove all their data.</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => { toast.dismiss(t.id); resolve(true); }}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => { toast.dismiss(t.id); resolve(false); }}
                            className="px-3 py-1 bg-gray-300 rounded text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ), { duration: Infinity });
        });
        
        if (!confirmed) return;
        
        const promise = deleteUser(id).then(() => {
            loadUsers();
            return "User deleted successfully";
        });
        
        toast.promise(promise, {
            loading: 'Deleting user...',
            success: (msg) => msg,
            error: (err) => err?.response?.data?.message || "Failed to delete user",
        });
    }

    function startEdit(user) {
        setEditing(user._id);
        setForm({ name: user.name, email: user.email, role: user.role, mobileNumber: user.mobileNumber || "" });
    }

    async function handleUpdate(id) {
        if (!form.name.trim() || !form.email.trim()) {
            toast.error('Name and email are required');
            return;
        }
        
        const promise = updateUser(id, form).then(() => {
            setEditing(null);
            loadUsers();
            return "User updated successfully";
        });
        
        toast.promise(promise, {
            loading: 'Updating user...',
            success: (msg) => msg,
            error: (err) => err?.response?.data?.message || "Failed to update user",
        });
    }

    if (loading) return <div className="p-6 text-center">Loading users...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => nav("/admin/dashboard")} className="px-3 py-1 border rounded hover:bg-gray-100">
                        ← Back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        {editing === user._id ? (
                                            <>
                                                <td className="px-6 py-4">
                                                    <input
                                                        className="border rounded px-2 py-1 w-full"
                                                        value={form.name}
                                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        className="border rounded px-2 py-1 w-full"
                                                        value={form.email}
                                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        className="border rounded px-2 py-1 w-full"
                                                        value={form.mobileNumber}
                                                        onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        className="border rounded px-2 py-1 w-full"
                                                        value={form.role}
                                                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                                                    >
                                                        <option value="student">Student</option>
                                                        <option value="coordinator">Coordinator</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleUpdate(user._id)}
                                                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => setEditing(null)}
                                                            className="px-3 py-1 bg-gray-300 rounded text-sm hover:bg-gray-400"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{user.mobileNumber || "-"}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                                        user.role === 'coordinator' ? 'bg-purple-100 text-purple-800' :
                                                        'bg-green-100 text-green-800'
                                                    }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => startEdit(user)}
                                                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(user._id, user.name)}
                                                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

