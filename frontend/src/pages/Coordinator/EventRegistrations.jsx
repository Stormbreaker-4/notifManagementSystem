import React from "react";
import { useParams } from "react-router-dom";

const EventRegistrations = () => {
    const { eventId } = useParams();

    const registrations = [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" }
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Registrations for Event #{eventId}</h1>
            <table className="w-full border-collapse border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-3 py-2">Name</th>
                        <th className="border px-3 py-2">Email</th>
                    </tr>
                </thead>
                <tbody>
                    {registrations.map(reg => (
                        <tr key={reg.id}>
                            <td className="border px-3 py-2">{reg.name}</td>
                            <td className="border px-3 py-2">{reg.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EventRegistrations;
