import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, registerForEvent } from "../api/eventApi";
import { AuthContext } from "../context/AuthContext";

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // user has { role, name, email, ... }
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getEventById(id)
            .then(res => {
                setEvent(res.data);
                setLoading(false);
            })
            .catch(() => {
                setEvent(null);
                setLoading(false);
            });
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateString).toLocaleDateString("en-GB", options);
    };

    const handleRegister = async () => {
        try {
            const { data } = await registerForEvent(id);
            alert(data.message || "Registered successfully!");

            setEvent((prev) => ({
                ...prev,
                registrations: [...(prev.registrations || []), user?._id],
            }));
        } catch (error) {
            console.error("Error registering:", error);
            alert(error.response?.data?.message || "Registration failed!");
        }
    };

    if (loading) return <p className="p-4">Loading event details...</p>;
    if (!event) return <p className="p-4 text-red-500">Event not found.</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            <p className="text-sm text-gray-500 mb-2">
                Category: {event.categoryId?.name}
            </p>
            <p className="mb-4">{event.description}</p>

            <div className="mb-4">
                <p>📍 <strong>Venue:</strong> {event.venue}</p>
                <p>📅 <strong>Date & Time:</strong> {formatDate(event.eventDateTime)}</p>
            </div>

            <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold">Organised By</h3>
                <p>{event.createdBy?.name} ({event.createdBy?.email})</p>
            </div>

            {/* Meta Details (only for admin or coordinator) */}
            {(user?.role === "admin" || user?.role === "coordinator") && (
                <div className="border-t pt-4 mt-4 text-sm text-gray-600">
                    <h3 className="text-lg font-semibold">Meta Details</h3>
                    <p>Created On: {formatDate(event.createdOn)}</p>
                    <p>Last Updated: {formatDate(event.updatedAt)}</p>
                </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
                <button
                    onClick={() => navigate("/")}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    ← Back to Events
                </button>
                <button
                    onClick={handleRegister}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Register
                </button>
            </div>
        </div>
    );
}
