import React, { useContext, useState, useEffect } from "react";
import { createEvent } from "../../api/eventApi";
import { fetchAllCategories } from "../../api/categoryApi";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
    const nav = useNavigate();
    const { user } = useContext(AuthContext);
    const [form, setForm] = useState({
        title: "",
        description: "",
        date: "",
        time: "",
        venue: "",
        categoryId: "", // you can pre-fill with known categoryId
    });
    const [categories, setCategories] = useState([]);
    const [err, setErr] = useState("");
    const [ok, setOk] = useState("");

    async function onSubmit(e) {
        e.preventDefault();
        setErr(""); setOk("");

        const eventDateTime = new Date(`${form.date}T${form.time || "09:00"}`);
        try {
            await createEvent({
                title: form.title,
                description: form.description,
                eventDateTime,
                venue: form.venue,
                categoryId: form.categoryId,
            });
            setOk("Event created!");
            setTimeout(() => nav("/coordinator/myevents"), 600);
        } catch (e2) {
            setErr(e2?.response?.data?.message || "Failed to create event");
        }
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
            {err && <p className="text-red-600 mb-2">{err}</p>}
            {ok && <p className="text-green-600 mb-2">{ok}</p>}

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
