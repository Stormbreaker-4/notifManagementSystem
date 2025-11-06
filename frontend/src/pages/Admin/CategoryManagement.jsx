import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllCategories, createCategory } from "../../api/categoryApi";
import toast from "react-hot-toast";

export default function CategoryManagement() {
    const nav = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState({ name: "", description: "" });

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            const { data } = await fetchAllCategories();
            setCategories(data || []);
        } catch (e) {
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(e) {
        e.preventDefault();
        if (!form.name.trim()) {
            toast.error('Category name is required');
            return;
        }
        
        const promise = createCategory(form).then(() => {
            setForm({ name: "", description: "" });
            setShowCreate(false);
            loadCategories();
            return "Category created successfully";
        });
        
        toast.promise(promise, {
            loading: 'Creating category...',
            success: (msg) => msg,
            error: (err) => err?.response?.data?.message || "Failed to create category",
        });
    }

    if (loading) return <div className="p-6 text-center">Loading categories...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => nav("/admin/dashboard")} className="px-3 py-1 border rounded hover:bg-gray-100">
                            ← Back
                        </button>
                        <h1 className="text-3xl font-bold text-gray-800">Category Management</h1>
                    </div>
                    <button
                        onClick={() => setShowCreate(!showCreate)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
                    >
                        {showCreate ? 'Cancel' : '+ Create Category'}
                    </button>
                </div>

                {showCreate && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4">Create New Category</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input
                                className="w-full border rounded px-4 py-2"
                                placeholder="Category Name (e.g., club_event, workshop, fest)"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                            <textarea
                                className="w-full border rounded px-4 py-2"
                                placeholder="Description (optional)"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                Create
                            </button>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map((cat) => (
                        <div key={cat._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{cat.name.toUpperCase().replace(/_/g, ' ')}</h3>
                            <p className="text-gray-600 text-sm">{cat.description || "No description"}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

