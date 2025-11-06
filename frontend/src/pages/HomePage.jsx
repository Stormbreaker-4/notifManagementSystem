import React, { useEffect, useMemo, useState } from "react";
import { fetchEvents } from "../api/eventApi";
import EventCard from "../components/EventCard";

// keep ONLY ONE helper
const typeFromEvent = (ev) => {
    const cat = ev?.categoryId;
    return typeof cat === "object" && cat?.name ? cat.name : (ev?.type || "Event");
};

export default function HomePage() {
    const [events, setEvents] = useState([]);
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await fetchEvents();
                setEvents(data || []);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return events;
        return events.filter((e) =>
            [e.title, e.description, e.venue, typeFromEvent(e), e?.conductedBy]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(s)
        );
    }, [events, q]);

    const fests = filtered.filter((e) =>
        /technovit|vibrance/i.test(e.title || "") || /fest/i.test(typeFromEvent(e))
    );
    const nonFests = filtered.filter((e) => !fests.includes(e));

    // onRegister is currently not implemented server-side; keep it undefined so EventCard disables the button.
    const onRegister = undefined;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-800 mb-4">Discover Events</h1>
                    <p className="text-gray-600 text-lg mb-8">Explore upcoming events, workshops, and activities</p>
                    <div className="max-w-2xl mx-auto">
                        <input
                            placeholder="🔍 Search events by title, description, venue, or category..."
                            className="w-full border-2 border-gray-300 rounded-xl px-6 py-4 text-lg focus:outline-none focus:border-blue-500 shadow-lg"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600">Loading events...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No events found. Try a different search term.</p>
                    </div>
                ) : (
                    <>
                        <Section title="All Events" items={nonFests} onRegister={onRegister} />
                        {!!fests.length && (
                            <Section title="🎉 Fest Events (TechnoVIT & Vibrance)" items={fests} onRegister={onRegister} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function Section({ title, items, onRegister }) {
    if (!items.length) return null;
    return (
        <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((event) => (
                    <EventCard key={event._id || event.id} event={event} onRegister={onRegister} />
                ))}
            </div>
        </div>
    );
}

