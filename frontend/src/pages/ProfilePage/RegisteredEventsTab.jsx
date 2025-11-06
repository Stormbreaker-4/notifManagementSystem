import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { fetchEvents } from "../../api/eventApi";
import CategoryBadge from "../../components/CategoryBadge";

const RegisteredEventsTab = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await fetchEvents();
                setEvents(Array.isArray(data) ? data : []);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const myEvents = useMemo(() => {
        if (!user?._id) return [];
        const uid = String(user._id);

        const candidateUserLists = (ev) => [
            ev?.participants,
            ev?.registeredUsers,
            ev?.registrations,
        ];

        const includesUser = (list) => {
            if (!list) return false;
            if (Array.isArray(list)) {
                return list.some((x) => {
                    if (!x) return false;
                    if (typeof x === "string") return x === uid;
                    if (typeof x === "object") {
                        const id = x.userId || x._id || x.id;
                        return id && String(id) === uid;
                    }
                    return false;
                });
            }
            return false;
        };

        return events.filter((ev) => {
            const lists = candidateUserLists(ev);
            return lists.some((l) => includesUser(l));
        });
    }, [events, user?._id]);

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

    if (!user) return <p className="text-gray-600">Not logged in.</p>;
    
    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-gray-600">Loading your registrations…</p>
            </div>
        );
    }

    if (!myEvents.length) {
        return (
            <div>
                <h2 className="text-lg font-semibold mb-3">My Registered Events</h2>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-600">No registrations found yet.</p>
                    <p className="text-sm text-gray-500 mt-2">Register for events to see them here.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-lg font-semibold mb-3">My Registered Events</h2>
            <div className="space-y-3">
                {myEvents.map((ev) => {
                    const dt = ev?.eventDateTime ? new Date(ev.eventDateTime) : null;
                    return (
                        <div key={ev._id || ev.id} className="flex items-center justify-between border-2 border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <p className="font-semibold text-gray-800">{ev.title}</p>
                                    <CategoryBadge name={ev.categoryId?.name} />
                                </div>
                                <p className="text-sm text-gray-600 mb-1 line-clamp-2">{ev.description || "No description available"}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                                    <span>📅 {dt ? formatDate(ev.eventDateTime) : "TBA"}</span>
                                    {ev.venue && <span>📍 {ev.venue}</span>}
                                </div>
                            </div>
                            <button
                                onClick={() => navigate(`/events/${ev._id}`)}
                                className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium whitespace-nowrap"
                            >
                                View Details
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RegisteredEventsTab;
