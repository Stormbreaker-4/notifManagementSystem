import React, { useContext, useEffect, useState } from "react";
import { fetchEvents, deleteEvent, listRegistrations, downloadRegistrationsCsv } from "../../api/eventApi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function MyEvents() {
    const { user } = useContext(AuthContext);
    const [mine, setMine] = useState([]);
    const [openRegs, setOpenRegs] = useState({}); // eventId -> { rows, open }

    useEffect(() => {
        (async () => {
            const { data } = await fetchEvents();
            const list = (data || []).filter((e) => {
                const createdBy = typeof e.createdBy === "object" ? e.createdBy._id : e.createdBy;
                return createdBy === user?._id;
            });
            setMine(list);
        })();
    }, [user?._id]);

    async function onDelete(id) {
        const confirmed = await new Promise((resolve) => {
            toast((t) => (
                <div>
                    <p className="mb-2">Delete this event?</p>
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
        
        const promise = deleteEvent(id).then(() => {
            setMine((prev) => prev.filter(e => e._id !== id));
            return "Event deleted successfully!";
        });
        
        toast.promise(promise, {
            loading: 'Deleting event...',
            success: (msg) => msg,
            error: (err) => err?.response?.data?.message || "Failed to delete event",
        });
    }

    async function onToggleRegistrations(id) {
        const current = openRegs[id] || { open: false, rows: [] };
        if (current.open) {
            setOpenRegs(prev => ({ ...prev, [id]: { ...current, open: false } }));
            return;
        }
        // open and fetch if not present
        if (!current.rows.length) {
            const { data } = await listRegistrations(id);
            setOpenRegs(prev => ({ ...prev, [id]: { open: true, rows: data } }));
        } else {
            setOpenRegs(prev => ({ ...prev, [id]: { ...current, open: true } }));
        }
    }

    async function onDownloadCsv(id) {
        const res = await downloadRegistrationsCsv(id);
        const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = `event_${id}_registrations.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    }

    const nav = useNavigate();

    function EventRow({ e }) {
        const [editing, setEditing] = useState(false);
        // now edit navigates to dedicated page

        return (
            <>
                <tr key={e._id}>
                    <td className="border px-3 py-2">{e.title}</td>
                    <td className="border px-3 py-2">{e.eventDateTime ? new Date(e.eventDateTime).toLocaleString() : "TBA"}</td>
                    <td className="border px-3 py-2">{e.venue || "TBA"}</td>
                    <td className="border px-3 py-2 space-x-2">
                        <button className="text-blue-600 underline" onClick={() => onToggleRegistrations(e._id)}>
                            {openRegs[e._id]?.open ? 'Hide' : 'Registrations'}
                        </button>
                        <button className="text-blue-600 underline" onClick={() => onDownloadCsv(e._id)}>CSV</button>
                        <button className="text-blue-600 underline" onClick={() => nav(`/coordinator/notify/${e._id}`)}>Notify</button>
                        <button className="text-indigo-700 underline" onClick={() => nav(`/coordinator/edit/${e._id}`)}>Edit</button>
                        <button className="text-red-600 underline" onClick={() => onDelete(e._id)}>Delete</button>
                    </td>
                </tr>
                <tr>
                    {openRegs[e._id]?.open && (
                        <td colSpan={4} className="border px-3 py-2 bg-gray-50">
                            {!openRegs[e._id].rows.length ? (
                                <p className="text-gray-600">No registrations yet.</p>
                            ) : (
                                <ul className="list-disc pl-6 space-y-1">
                                    {openRegs[e._id].rows.map((r, idx) => (
                                        <li key={idx}>{r.name} &lt;{r.email}&gt;</li>
                                    ))}
                                </ul>
                            )}
                        </td>
                    )}
                </tr>
            </>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
                <button onClick={() => nav("/coordinator/dashboard")} className="px-3 py-1 border rounded hover:bg-gray-100">
                    ← Back
                </button>
                <h1 className="text-2xl font-bold">My Events</h1>
            </div>
            {!mine.length ? (
                <p className="text-gray-600">No events yet.</p>
            ) : (
                <table className="w-full border-collapse border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-3 py-2 text-left">Title</th>
                            <th className="border px-3 py-2 text-left">Date</th>
                            <th className="border px-3 py-2 text-left">Venue</th>
                            <th className="border px-3 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mine.map((e) => (
                            <EventRow key={e._id} e={e} />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
