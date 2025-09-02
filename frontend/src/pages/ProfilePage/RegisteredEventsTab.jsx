import React from "react";

const RegisteredEventsTab = () => {
    const registered = [
        { id: 1, title: "Linux Hackathon", date: "2025-09-15" },
        { id: 2, title: "TechnoVIT Quiz", date: "2025-11-02" }
    ];

    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">My Registered Events</h2>
            <ul>
                {registered.map(ev => (
                    <li key={ev.id} className="border-b py-2">
                        {ev.title} — {ev.date}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RegisteredEventsTab;
