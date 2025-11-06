import React, { useContext, useState, useEffect } from "react";
import { createEvent } from "../../api/eventApi";
import { fetchAllCategories } from "../../api/categoryApi";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function CreateEvent() {
    const nav = useNavigate();
    const { user } = useContext(AuthContext);
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
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Create Event</h1>
            <form onSubmit={onSubmit} className="flex flex-col gap-3">
                <input className="border p-2" placeholder="Event Title"
                    value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <textarea className="border p-2" placeholder="Description"
                    value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <select className="border p-2" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                </select>
                <div className="grid grid-cols-2 gap-2">
                    <input type="date" className="border p-2"
                        value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                    <input type="time" className="border p-2"
                        value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                </div>
                <input className="border p-2" placeholder="Venue"
                    value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
                <button className="bg-green-600 text-white px-4 py-2 rounded">Save Event</button>
            </form>
        </div>
    );
}
