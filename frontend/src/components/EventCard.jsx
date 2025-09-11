import { Link } from "react-router-dom";

export default function EventCard({ event }) {
    return (
        <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
            <h2 className="text-xl font-bold mb-2">{event.title}</h2>
            <p className="text-sm text-gray-500 mb-1">{event.category}</p>
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
