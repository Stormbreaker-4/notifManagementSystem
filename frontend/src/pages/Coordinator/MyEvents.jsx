import React, { useContext, useEffect, useState } from "react";
import { fetchEvents, deleteEvent, listRegistrations, downloadRegistrationsCsv } from "../../api/eventApi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import CategoryBadge from "../../components/CategoryBadge";

export default function MyEvents() {
    const { user } = useContext(AuthContext);
    const nav = useNavigate();
    const [mine, setMine] = useState([]);
    const [openRegs, setOpenRegs] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await fetchEvents();
                const list = (data || []).filter((e) => {
                    const createdBy = typeof e.createdBy === "object" ? e.createdBy._id : e.createdBy;
                    return createdBy === user?._id;
                });
                setMine(list);
            } finally {
                setLoading(false);
            }
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
        if (!current.rows.length) {
            try {
                const { data } = await listRegistrations(id);
                setOpenRegs(prev => ({ ...prev, [id]: { open: true, rows: data } }));
            } catch (e) {
                toast.error('Failed to load registrations');
            }
        } else {
            setOpenRegs(prev => ({ ...prev, [id]: { ...current, open: true } }));
        }
    }

    async function onDownloadCsv(id) {
        try {
            const res = await downloadRegistrationsCsv(id);
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
            const a = document.createElement('a');
            a.href = url;
            a.download = `event_${id}_registrations.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            toast.success('CSV downloaded successfully');
        } catch (e) {
            toast.error('Failed to download CSV');
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return "TBA";
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
                <div className="max-w-7xl mx-auto text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    <p className="mt-4 text-gray-600">Loading events...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => nav("/coordinator/dashboard")} className="px-3 py-1 border rounded hover:bg-gray-100">
                            ← Back
                        </button>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800">My Events</h1>
                            <p className="text-gray-600 mt-1">Manage your events and view registrations</p>
                        </div>
                    </div>
                    <button
                        onClick={() => nav("/coordinator/create")}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
                    >
                        + Create Event
                    </button>
                </div>

                {!mine.length ? (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <p className="text-gray-600 text-lg mb-4">No events yet.</p>
                        <button
                            onClick={() => nav("/coordinator/create")}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                            Create Your First Event
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {mine.map((event) => (
                            <div key={event._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                                        <CategoryBadge name={event.categoryId?.name} />
                                    </div>
                                </div>
                                
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                                
                                <div className="space-y-2 mb-4 text-sm text-gray-600">
                                    <p className="flex items-center gap-2">
                                        <span>📅</span>
                                        <span>{formatDate(event.eventDateTime)}</span>
                                    </p>
                                    {event.venue && (
                                        <p className="flex items-center gap-2">
                                            <span>📍</span>
                                            <span>{event.venue}</span>
                                        </p>
                                    )}
                                    <p className="flex items-center gap-2">
                                        <span>👥</span>
                                        <span>{event.registrations?.length || 0} registrations</span>
                                    </p>
                                </div>

                                {openRegs[event._id]?.open && (
                                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                        <h4 className="font-semibold text-gray-800 mb-2">Registrations:</h4>
                                        {!openRegs[event._id].rows.length ? (
                                            <p className="text-gray-600 text-sm">No registrations yet.</p>
                                        ) : (
                                            <ul className="space-y-1">
                                                {openRegs[event._id].rows.map((r, idx) => (
                                                    <li key={idx} className="text-sm text-gray-700">
                                                        {r.name} &lt;{r.email}&gt;
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => onToggleRegistrations(event._id)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                                    >
                                        {openRegs[event._id]?.open ? 'Hide' : 'View'} Registrations
                                    </button>
                                    <button
                                        onClick={() => onDownloadCsv(event._id)}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
                                    >
                                        Download CSV
                                    </button>
                                    <button
                                        onClick={() => nav(`/coordinator/notify/${event._id}`)}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
                                    >
                                        Notify
                                    </button>
                                    <button
                                        onClick={() => nav(`/coordinator/edit/${event._id}`)}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(event._id)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
