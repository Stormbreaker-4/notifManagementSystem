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
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                <h1 className="text-3xl font-bold text-indigo-600">Events</h1>
                <input
                    placeholder="Search events..."
                    className="border rounded px-3 py-2 w-full md:w-80"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
            </div>

            {loading ? (
                <p className="text-gray-600">Loading…</p>
            ) : (
                <>
                    <Section title="All Events" items={nonFests} onRegister={onRegister} />
                    {!!fests.length && (
                        <Section title="Fest Events (TechnoVIT & Vibrance)" items={fests} onRegister={onRegister} />
                    )}
                </>
            )}
        </div>
    );
}

function Section({ title, items, onRegister }) {
    if (!items.length) return null;
    return (
        <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <div className="grid md:grid-cols-2 gap-6">
                {items.map((event) => (
                    <EventCard key={event._id || event.id} event={event} onRegister={onRegister} />
                ))}
            </div>
        </div>
    );
}

