import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers } from "../../api/userApi";
import { fetchEvents } from "../../api/eventApi";
import { fetchNotifications } from "../../api/notificationApi";
import { fetchAllCategories } from "../../api/categoryApi";
import toast from "react-hot-toast";

export default function AdminDashboard() {
    const [stats, setStats] = useState({ users: 0, events: 0, notifications: 0, categories: 0 });

    useEffect(() => {
        (async () => {
            try {
                const [usersRes, eventsRes, notifsRes, catsRes] = await Promise.all([
                    getUsers().catch(() => ({ data: [] })),
                    fetchEvents().catch(() => ({ data: [] })),
                    fetchNotifications().catch(() => ({ data: [] })),
                    fetchAllCategories().catch(() => ({ data: [] })),
                ]);
                setStats({
                    users: usersRes.data?.length || 0,
                    events: eventsRes.data?.length || 0,
                    notifications: notifsRes.data?.length || 0,
                    categories: catsRes.data?.length || 0,
                });
            } catch (e) {
                toast.error('Failed to load dashboard stats');
            }
        })();
    }, []);

    const cards = [
        { title: 'Users', count: stats.users, link: '/admin/users', color: 'bg-blue-500', icon: '👥' },
        { title: 'Events', count: stats.events, link: '/admin/events', color: 'bg-green-500', icon: '📅' },
        { title: 'Notifications', count: stats.notifications, link: '/admin/notifications', color: 'bg-purple-500', icon: '🔔' },
        { title: 'Categories', count: stats.categories, link: '/admin/categories', color: 'bg-orange-500', icon: '🏷️' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
                <p className="text-gray-600 mb-8">Manage users, events, categories, and monitor system activity</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {cards.map((card) => (
                        <Link
                            key={card.title}
                            to={card.link}
                            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 transform hover:-translate-y-1"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-2">{card.count}</p>
                                </div>
                                <div className={`${card.color} w-16 h-16 rounded-full flex items-center justify-center text-3xl`}>
                                    {card.icon}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Link
                        to="/admin/users"
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 block"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-2">👥 User Management</h2>
                        <p className="text-gray-600">Create, view, update, and delete users. Manage roles and permissions.</p>
                    </Link>
                    <Link
                        to="/admin/categories"
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 block"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-2">🏷️ Category Management</h2>
                        <p className="text-gray-600">Create and manage event categories (Club Event, Workshop, Fest, etc.)</p>
                    </Link>
                    <Link
                        to="/admin/events"
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 block"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-2">📅 All Events</h2>
                        <p className="text-gray-600">View and manage all events across the system.</p>
                    </Link>
                    <Link
                        to="/admin/notifications"
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 block"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-2">🔔 Notification Monitor</h2>
                        <p className="text-gray-600">Monitor notification delivery status and logs.</p>
                    </Link>
                    <Link
                        to="/admin/registrations"
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 block"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-2">📋 All Registrations</h2>
                        <p className="text-gray-600">View all student registrations across all events.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}

