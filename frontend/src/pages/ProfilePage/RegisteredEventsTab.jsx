import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { fetchEvents } from "../../api/eventApi";

const RegisteredEventsTab = () => {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // fetch all events (no dedicated registrations endpoint yet)
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

        // try common participant field names:
        const candidateUserLists = (ev) => [
            ev?.participants,         // e.g. [ObjectId]
            ev?.registeredUsers,      // alt name
            ev?.registrations,        // alt name: could be [{userId:..}] — handled below
        ];

        const includesUser = (list) => {
            if (!list) return false;
            if (Array.isArray(list)) {
                // handle arrays of ids or array of objects like { userId: ... }
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

    if (!user) return <p className="text-gray-600">Not logged in.</p>;
    if (loading) return <p className="text-gray-600">Loading your registrations…</p>;

    if (!myEvents.length) {
        return (
            <div>
                <h2 className="text-lg font-semibold mb-2">My Registered Events</h2>
                <p className="text-gray-600">No registrations found yet.</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">My Registered Events</h2>
            <ul>
                {myEvents.map((ev) => {
                    const dt = ev?.eventDateTime ? new Date(ev.eventDateTime) : null;
                    return (
                        <li key={ev._id || ev.id} className="border-b py-2">
                            <span className="font-medium">{ev.title}</span>
                            {" — "}
                            {dt ? dt.toLocaleDateString() : "TBA"}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default RegisteredEventsTab;
