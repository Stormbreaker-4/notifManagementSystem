import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "../../api/eventApi";
import CategoryBadge from "../../components/CategoryBadge";
import toast from "react-hot-toast";

export default function AllEvents() {
    const nav = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await fetchEvents();
                setEvents(data || []);
            } catch (e) {
                toast.error('Failed to load events');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <div className="p-6 text-center">Loading events...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => nav("/admin/dashboard")} className="px-3 py-1 border rounded hover:bg-gray-100">
                        ← Back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">All Events</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-xl font-bold text-gray-800 flex-1">{event.title}</h3>
                                <CategoryBadge name={event.categoryId?.name} />
                            </div>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>📍 {event.venue || "TBA"}</p>
                                <p>📅 {event.eventDateTime ? new Date(event.eventDateTime).toLocaleString() : "TBA"}</p>
                                <p>👤 Created by: {typeof event.createdBy === 'object' ? event.createdBy?.name : 'Unknown'}</p>
                                <p>👥 Registrations: {event.registrations?.length || 0}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

