import React, { useEffect, useMemo, useState } from "react";
import { fetchEvents } from "../api/eventApi";

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
                    <Section title="All Events" items={nonFests} />
                    {!!fests.length && (
                        <Section title="Fest Events (TechnoVIT & Vibrance)" items={fests} />
                    )}
                </>
            )}
        </div>
    );
}

function Section({ title, items }) {
    if (!items.length) return null;
    return (
        <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <div className="grid md:grid-cols-2 gap-6">
                {items.map((event) => (
                    <Card key={event._id || event.id} event={event} />
                ))}
            </div>
        </div>
    );
}

function Card({ event }) {
    const type = typeFromEvent(event);
    const dateTime = event?.eventDateTime ? new Date(event.eventDateTime) : null;

    return (
        <div className="bg-white shadow-md rounded-lg p-6 border">
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <p className="text-sm text-gray-500 mb-2">{type}</p>
            <p className="text-gray-700 mb-3">{event.description}</p>

            <p className="text-sm text-gray-600">
                <span className="font-semibold">Date:</span>{" "}
                {dateTime ? dateTime.toLocaleDateString() : "TBA"} &nbsp; |{" "}
                <span className="font-semibold">Time:</span>{" "}
                {dateTime ? dateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "TBA"}
            </p>
            <p className="text-sm text-gray-600">
                <span className="font-semibold">Venue:</span> {event.venue || "TBA"}
            </p>
            {event?.conductedBy && (
                <p className="text-sm text-gray-600">
                    <span className="font-semibold">Conducted By:</span> {event.conductedBy}
                </p>
            )}

            <button
                disabled
                title="Registration endpoint not implemented yet"
                className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded opacity-60 cursor-not-allowed"
            >
                Register
            </button>
        </div>
    );
}
