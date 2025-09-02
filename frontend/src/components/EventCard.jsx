import React from "react";

const EventCard = ({ event }) => {
    return (
        <div className="border rounded-lg p-4 shadow-md bg-white">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p className="text-sm text-gray-600">{event.type}</p>
            <p>{event.description}</p>
            <p>
                <strong>Date:</strong> {event.date} | <strong>Time:</strong> {event.time}
            </p>
            <p>
                <strong>Venue:</strong> {event.venue}
            </p>
            <p>
                <strong>Conducted By:</strong> {event.conductedBy}
            </p>
            <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded">
                Register
            </button>
        </div>
    );
};

export default EventCard;
