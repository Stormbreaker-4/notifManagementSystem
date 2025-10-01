import { Link } from "react-router-dom";

function catDisplay(name) {
    if (!name) return "";
    return String(name).toUpperCase().replace(/_/g, " ");
}

function catColors(name) {
    const key = String(name || '').toLowerCase();
    switch (key) {
        case 'club_event': return { bg: 'bg-pink-100', text: 'text-pink-700', ring: 'ring-pink-200' };
        case 'workshop': return { bg: 'bg-yellow-100', text: 'text-yellow-800', ring: 'ring-yellow-200' };
        case 'recruitment': return { bg: 'bg-cyan-100', text: 'text-cyan-800', ring: 'ring-cyan-200' };
        case 'fest': return { bg: 'bg-purple-100', text: 'text-purple-800', ring: 'ring-purple-200' };
        default: return { bg: 'bg-gray-100', text: 'text-gray-800', ring: 'ring-gray-200' };
    }
}

export default function EventCard({ event }) {
    const name = (typeof event.categoryId === 'object' ? event.categoryId?.name : event.category) || '';
    const c = catColors(name);
    return (
        <div className="relative border rounded-lg p-4 shadow hover:shadow-lg transition">
            {name && (
                <div className={`absolute top-2 right-2 ${c.bg} ${c.text} ${c.ring} ring-1 px-2 py-0.5 rounded-full text-xs font-semibold`}>{catDisplay(name)}</div>
            )}
            <h2 className="text-xl font-bold mb-2">{event.title}</h2>
            <p className="text-gray-700 line-clamp-3 mb-3">{event.description}</p>
            <Link
                to={`/events/${event._id}`}
                className="text-blue-600 font-semibold hover:underline"
            >
                View Details
            </Link>
        </div>
    );
}
