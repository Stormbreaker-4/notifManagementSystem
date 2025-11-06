import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, registerForEvent } from "../api/eventApi";
import { AuthContext } from "../context/AuthContext";
import CategoryBadge from "../components/CategoryBadge";
import OrganizerContact from "../components/OrganizerContact";
import toast from "react-hot-toast";

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
        const promise = registerForEvent(id).then(({ data }) => {
            setEvent((prev) => ({
                ...prev,
                registrations: [...(prev.registrations || []), user?._id],
            }));
            setTimeout(() => navigate("/"), 1500);
            return data.message || "Registered successfully!";
        });
        
        toast.promise(promise, {
            loading: 'Registering...',
            success: (msg) => msg,
            error: (err) => err?.response?.data?.message || "Registration failed!",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading event details...</p>
                </div>
            </div>
        );
    }
    
    if (!event) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 text-lg font-semibold">Event not found.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-gray-800 mb-3">{event.title}</h1>
                            <CategoryBadge name={event.categoryId?.name} />
                        </div>
                    </div>
                    
                    <div className="prose max-w-none mb-6">
                        <p className="text-gray-700 text-lg leading-relaxed">{event.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📍</span>
                            <div>
                                <p className="text-sm text-gray-500">Venue</p>
                                <p className="font-semibold text-gray-800">{event.venue || "TBA"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📅</span>
                            <div>
                                <p className="text-sm text-gray-500">Date & Time</p>
                                <p className="font-semibold text-gray-800">{formatDate(event.eventDateTime) || "TBA"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-6 mb-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Organised By</h3>
                        <OrganizerContact name={event.createdBy?.name} email={event.createdBy?.email} mobile={event.createdBy?.mobileNumber} />
                    </div>

                    {/* Meta Details (only for admin or coordinator) */}
                    {(user?.role === "admin" || user?.role === "coordinator") && (
                        <div className="border-t pt-6 mb-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Meta Details</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>Created On: {formatDate(event.createdOn)}</p>
                                <p>Last Updated: {formatDate(event.updatedAt)}</p>
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-4 pt-6 border-t">
                        <button
                            onClick={() => navigate("/")}
                            className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                            ← Back to Events
                        </button>
                        {user && user.role === 'student' && (
                            <button
                                onClick={handleRegister}
                                disabled={event.registrations?.some(r => (typeof r === 'object' ? r._id : r) === user._id)}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {event.registrations?.some(r => (typeof r === 'object' ? r._id : r) === user._id) ? 'Already Registered' : 'Register for Event'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
