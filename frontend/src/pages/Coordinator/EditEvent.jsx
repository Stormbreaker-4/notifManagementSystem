import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventById, updateEvent } from "../../api/eventApi";
import { fetchAllCategories } from "../../api/categoryApi";
import toast from "react-hot-toast";

export default function EditEvent() {
    const { id } = useParams();
    const nav = useNavigate();
    const [original, setOriginal] = useState(null);
    const [form, setForm] = useState({ title: "", description: "", date: "", time: "", venue: "", categoryId: "" });
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const [{ data: ev }, { data: cats }] = await Promise.all([
                    getEventById(id),
                    fetchAllCategories(),
                ]);
                setOriginal(ev);
                setCategories(cats || []);
                setForm({
                    title: ev.title || "",
                    description: ev.description || "",
                    date: ev.eventDateTime ? new Date(ev.eventDateTime).toISOString().slice(0,10) : "",
                    time: ev.eventDateTime ? new Date(ev.eventDateTime).toISOString().slice(11,16) : "",
                    venue: ev.venue || "",
                    categoryId: ev.categoryId?._id || ev.categoryId || "",
                });
            } catch (e) {
                toast.error(e?.response?.data?.message || "Failed to load event");
            }
        })();
    }, [id]);

    function buildPatchPayload() {
        const payload = {};
        if (form.title !== (original?.title || "")) payload.title = form.title;
        if (form.description !== (original?.description || "")) payload.description = form.description;
        const iso = form.date ? new Date(`${form.date}T${form.time || "09:00"}`).toISOString() : null;
        const originalIso = original?.eventDateTime ? new Date(original.eventDateTime).toISOString() : null;
        if (iso && iso !== originalIso) payload.eventDateTime = iso;
        if ((form.venue || "") !== (original?.venue || "")) payload.venue = form.venue;
        const origCat = original?.categoryId?._id || original?.categoryId || "";
        if ((form.categoryId || "") !== (origCat || "")) payload.categoryId = form.categoryId;
        return payload;
    }

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
        
        const payload = buildPatchPayload();
        if (!Object.keys(payload).length) {
            toast.success("No changes to save.");
            return;
        }
        
        const confirmed = await new Promise((resolve) => {
            toast((t) => (
                <div>
                    <p className="mb-2">Save changes to this event?</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => { toast.dismiss(t.id); resolve(true); }}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                        >
                            Yes
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
        
        const promise = updateEvent(id, payload).then(() => {
            setTimeout(() => nav("/coordinator/myevents"), 1500);
            return "Event updated successfully!";
        });
        
        toast.promise(promise, {
            loading: 'Updating event...',
            success: (msg) => msg,
            error: (err) => err?.response?.data?.message || "Update failed",
        });
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => nav("/coordinator/myevents")} className="px-3 py-1 border rounded hover:bg-gray-100">
                        ← Back
                    </button>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Edit Event</h1>
                        <p className="text-gray-600">Update event details</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <form onSubmit={onSubmit} className="flex flex-col gap-4">
                        <input className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" placeholder="Event Title" value={form.title}
                               onChange={(e) => setForm({ ...form, title: e.target.value })} />
                        <textarea className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 min-h-[120px]" placeholder="Description" value={form.description}
                               onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        <select className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                            <option value="">Select Category</option>
                            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="date" className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" value={form.date}
                                   onChange={(e) => setForm({ ...form, date: e.target.value })} />
                            <input type="time" className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" value={form.time}
                                   onChange={(e) => setForm({ ...form, time: e.target.value })} />
                        </div>
                        <input className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" placeholder="Venue" value={form.venue}
                               onChange={(e) => setForm({ ...form, venue: e.target.value })} />
                        <div className="flex gap-3">
                            <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md flex-1" type="submit">Save Changes</button>
                            <button type="button" onClick={() => nav(-1)} className="px-6 py-3 rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-colors">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


