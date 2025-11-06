import { Link } from "react-router-dom";
import CategoryBadge from "./CategoryBadge";

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
    const date = event.eventDateTime ? new Date(event.eventDateTime).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) : 'TBA';
    
    return (
        <div className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 transform hover:-translate-y-1 border border-gray-100">
            {name && (
                <div className="absolute top-4 right-4">
                    <CategoryBadge name={name} />
                </div>
            )}
            <h2 className="text-xl font-bold mb-3 text-gray-800 pr-20">{event.title}</h2>
            <p className="text-gray-600 line-clamp-3 mb-4 text-sm">{event.description}</p>
            <div className="space-y-2 mb-4 text-sm text-gray-500">
                <p className="flex items-center gap-2">
                    <span>📅</span>
                    <span>{date}</span>
                </p>
                {event.venue && (
                    <p className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{event.venue}</span>
                    </p>
                )}
            </div>
            <Link
                to={`/events/${event._id}`}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
                View Details →
            </Link>
        </div>
    );
}
