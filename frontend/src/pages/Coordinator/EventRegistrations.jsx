import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { listRegistrations, downloadRegistrationsCsv } from "../../api/eventApi";

const EventRegistrations = () => {
    const { eventId } = useParams();
    const [rows, setRows] = useState([]);
    const [err, setErr] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const { data } = await listRegistrations(eventId);
                setRows(data);
            } catch (e) {
                setErr(e?.response?.data?.message || "Failed to load registrations");
            }
        })();
    }, [eventId]);

    async function onDownloadCsv() {
        const res = await downloadRegistrationsCsv(eventId);
        const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = `event_${eventId}_registrations.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Registrations for Event #{eventId}</h1>
            {err && <p className="text-red-600 mb-2">{err}</p>}
            <div className="mb-3">
                <button onClick={onDownloadCsv} className="bg-blue-600 text-white px-3 py-1 rounded">Download CSV</button>
            </div>
            <table className="w-full border-collapse border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-3 py-2">Name</th>
                        <th className="border px-3 py-2">Email</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((reg, idx) => (
                        <tr key={idx}>
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
