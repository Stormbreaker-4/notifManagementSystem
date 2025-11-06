import React, { useContext, useEffect, useState } from "react";
import { fetchEvents, deleteEvent, listRegistrations, downloadRegistrationsCsv } from "../../api/eventApi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

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
        if (!window.confirm('Delete this event?')) return;
        await deleteEvent(id);
        setMine((prev) => prev.filter(e => e._id !== id));
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
            <h1 className="text-2xl font-bold mb-4">My Events</h1>
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
