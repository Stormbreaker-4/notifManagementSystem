import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "../../api/eventApi";
import { listRegistrations } from "../../api/eventApi";
import toast from "react-hot-toast";

export default function AllRegistrations() {
    const nav = useNavigate();
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingRegs, setLoadingRegs] = useState(false);

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

    async function loadRegistrations(eventId) {
        setLoadingRegs(true);
        try {
            const { data } = await listRegistrations(eventId);
            setRegistrations(data || []);
            setSelectedEvent(eventId);
        } catch (e) {
            toast.error('Failed to load registrations');
        } finally {
            setLoadingRegs(false);
        }
    }

    const selectedEventData = events.find(e => e._id === selectedEvent);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="max-w-7xl mx-auto text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading events...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => nav("/admin/dashboard")} className="px-3 py-1 border rounded hover:bg-gray-100">
                        ← Back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">All Student Registrations</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Select Event</h2>
                            <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                {events.length === 0 ? (
                                    <p className="text-gray-600">No events found.</p>
                                ) : (
                                    events.map((event) => (
                                        <button
                                            key={event._id}
                                            onClick={() => loadRegistrations(event._id)}
                                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                                selectedEvent === event._id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <h3 className="font-semibold text-gray-800 mb-1">{event.title}</h3>
                                            <p className="text-sm text-gray-600">
                                                {event.registrations?.length || 0} registrations
                                            </p>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        {selectedEvent ? (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="mb-4">
                                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                                        {selectedEventData?.title || 'Event Registrations'}
                                    </h2>
                                    {selectedEventData && (
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p>📅 {selectedEventData.eventDateTime ? new Date(selectedEventData.eventDateTime).toLocaleString() : 'TBA'}</p>
                                            {selectedEventData.venue && <p>📍 {selectedEventData.venue}</p>}
                                        </div>
                                    )}
                                </div>

                                {loadingRegs ? (
                                    <div className="text-center py-12">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <p className="mt-2 text-gray-600">Loading registrations...</p>
                                    </div>
                                ) : registrations.length === 0 ? (
                                    <p className="text-gray-600 text-center py-8">No registrations for this event.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {registrations.map((reg, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 text-sm text-gray-900">{reg.name}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-600">{reg.email}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className="mt-4 text-sm text-gray-600">
                                            Total: <strong>{registrations.length}</strong> registration{registrations.length !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                <p className="text-gray-600 text-lg">Select an event to view registrations</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

