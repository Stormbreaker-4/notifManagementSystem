import React, { useContext, useEffect, useState } from "react";
import { fetchEvents } from "../../api/eventApi";
import { AuthContext } from "../../context/AuthContext";

export default function MyEvents() {
    const { user } = useContext(AuthContext);
    const [mine, setMine] = useState([]);

    useEffect(() => {
        (async () => {
            const { data } = await fetchEvents();
            const list = (data || []).filter((e) => {
                const createdBy = typeof e.createdBy === "object" ? e.createdBy._id : e.createdBy;
                return createdBy === user?._id;
            });
            setMine(list);
        })();
    }, [user?._id]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">My Events</h1>
            {!mine.length ? (
                <p className="text-gray-600">No events yet.</p>
            ) : (
                <table className="w-full border-collapse border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-3 py-2 text-left">Title</th>
                            <th className="border px-3 py-2 text-left">Date</th>
                            <th className="border px-3 py-2 text-left">Venue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mine.map((e) => (
                            <tr key={e._id}>
                                <td className="border px-3 py-2">{e.title}</td>
                                <td className="border px-3 py-2">
                                    {e.eventDateTime ? new Date(e.eventDateTime).toLocaleString() : "TBA"}
                                </td>
                                <td className="border px-3 py-2">{e.venue || "TBA"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
