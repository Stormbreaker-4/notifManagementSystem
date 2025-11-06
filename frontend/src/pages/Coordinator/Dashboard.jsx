import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const quickActions = [
        { to: "/coordinator/myevents", title: "My Events", desc: "View and manage your events", icon: "📅", color: "bg-blue-500" },
        { to: "/coordinator/create", title: "Create Event", desc: "Add a new event", icon: "➕", color: "bg-green-500" },
        { to: "/profile", title: "My Profile", desc: "View and edit your profile", icon: "👤", color: "bg-purple-500" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Coordinator Dashboard</h1>
                <p className="text-gray-600 mb-8">Manage your events and notifications</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {quickActions.map((action) => (
                        <Link
                            key={action.to}
                            to={action.to}
                            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 transform hover:-translate-y-1"
                        >
                            <div className={`${action.color} w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4`}>
                                {action.icon}
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">{action.title}</h2>
                            <p className="text-gray-600 text-sm">{action.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
