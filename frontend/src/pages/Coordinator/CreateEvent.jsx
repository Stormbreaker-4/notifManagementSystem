import React, { useState, useEffect } from "react";
import { createEvent } from "../../api/eventApi";
import { fetchAllCategories } from "../../api/categoryApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function CreateEvent() {
    const nav = useNavigate();
    const [form, setForm] = useState({
        title: "",
        description: "",
        date: "",
        time: "",
        venue: "",
        categoryId: "",
    });
    const [categories, setCategories] = useState([]);

    async function onSubmit(e) {
        e.preventDefault();
        if (!form.title.trim()) {
            toast.error('Event title is required');
            return;
        }
        if (!form.categoryId) {
            toast.error('Category is required');
            return;
        }
        if (!form.date) {
            toast.error('Event date is required');
            return;
        }

        const eventDateTime = new Date(`${form.date}T${form.time || "09:00"}`);
        const promise = createEvent({
            title: form.title,
            description: form.description,
            eventDateTime,
            venue: form.venue,
            categoryId: form.categoryId,
        }).then(() => {
            setTimeout(() => nav("/coordinator/myevents"), 1500);
            return "Event created successfully!";
        });
        
        toast.promise(promise, {
            loading: 'Creating event...',
            success: (msg) => msg,
            error: (err) => err?.response?.data?.message || "Failed to create event",
        });
    }

    // load categories for dropdown
    useEffect(() => {
        (async () => {
            try {
                const { data } = await fetchAllCategories();
                setCategories(data || []);
            } catch (e) { /* ignore */ }
        })();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => nav("/coordinator/dashboard")} className="px-3 py-1 border rounded hover:bg-gray-100">
                        ← Back
                    </button>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Create Event</h1>
                        <p className="text-gray-600">Fill in the details to create a new event</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <form onSubmit={onSubmit} className="flex flex-col gap-4">
                        <input className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500" placeholder="Event Title"
                            value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                        <textarea className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 min-h-[120px]" placeholder="Description"
                            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        <select className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                            <option value="">Select Category</option>
                            {categories.map((c) => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="date" className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                                value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                            <input type="time" className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                                value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                        </div>
                        <input className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500" placeholder="Venue"
                            value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
                        <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md">Create Event</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
