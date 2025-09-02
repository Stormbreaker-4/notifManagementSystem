import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Coordinator Dashboard</h1>
            <div className="flex flex-col gap-3">
                <Link to="/coordinator/myevents" className="p-4 bg-gray-100 border rounded hover:bg-gray-200">
                    📅 View My Events
                </Link>
                <Link to="/coordinator/create" className="p-4 bg-gray-100 border rounded hover:bg-gray-200">
                    ➕ Create New Event
                </Link>
                <Link to="/profile" className="p-4 bg-gray-100 border rounded hover:bg-gray-200">
                    👤 My Profile
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
