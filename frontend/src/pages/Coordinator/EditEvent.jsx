import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventById, updateEvent } from "../../api/eventApi";
import { fetchAllCategories } from "../../api/categoryApi";

export default function EditEvent() {
    const { id } = useParams();
    const nav = useNavigate();
    const [original, setOriginal] = useState(null);
    const [form, setForm] = useState({ title: "", description: "", date: "", time: "", venue: "", categoryId: "" });
    const [categories, setCategories] = useState([]);
    const [err, setErr] = useState("");
    const [ok, setOk] = useState("");

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
                setErr(e?.response?.data?.message || "Failed to load event");
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
        setErr(""); setOk("");
        const payload = buildPatchPayload();
        if (!Object.keys(payload).length) {
            setOk("No changes to save.");
            return;
        }
        if (!window.confirm("Save changes to this event?")) return;
        try {
            await updateEvent(id, payload);
            setOk("Event updated.");
            setTimeout(() => nav("/coordinator/myevents"), 600);
        } catch (e2) {
            setErr(e2?.response?.data?.message || "Update failed");
        }
    }

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Event</h1>
            {err && <p className="text-red-600 mb-2">{err}</p>}
            {ok && <p className="text-green-600 mb-2">{ok}</p>}

            <form onSubmit={onSubmit} className="flex flex-col gap-3">
                <input className="border p-2" placeholder="Event Title" value={form.title}
                       onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <textarea className="border p-2" placeholder="Description" value={form.description}
                       onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <select className="border p-2" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-2">
                    <input type="date" className="border p-2" value={form.date}
                           onChange={(e) => setForm({ ...form, date: e.target.value })} />
                    <input type="time" className="border p-2" value={form.time}
                           onChange={(e) => setForm({ ...form, time: e.target.value })} />
                </div>
                <input className="border p-2" placeholder="Venue" value={form.venue}
                       onChange={(e) => setForm({ ...form, venue: e.target.value })} />
                <div className="flex gap-3">
                    <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">Save Changes</button>
                    <button type="button" onClick={() => nav(-1)} className="px-4 py-2 rounded border">Cancel</button>
                </div>
            </form>
        </div>
    );
}


