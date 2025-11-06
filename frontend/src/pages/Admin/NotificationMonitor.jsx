import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchNotifications } from "../../api/notificationApi";
import toast from "react-hot-toast";

export default function NotificationMonitor() {
    const nav = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        loadNotifications();
    }, []);

    async function loadNotifications() {
        try {
            const { data } = await fetchNotifications();
            setNotifications(data || []);
        } catch (e) {
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    }

    const filtered = filter === "all" ? notifications : notifications.filter(n => n.status === filter);
    const stats = {
        total: notifications.length,
        sent: notifications.filter(n => n.status === 'sent').length,
        pending: notifications.filter(n => n.status === 'pending').length,
        failed: notifications.filter(n => n.status === 'failed').length,
    };

    if (loading) return <div className="p-6 text-center">Loading notifications...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => nav("/admin/dashboard")} className="px-3 py-1 border rounded hover:bg-gray-100">
                        ← Back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Notification Monitor</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <p className="text-gray-600 text-sm">Total</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <p className="text-gray-600 text-sm">Sent</p>
                        <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <p className="text-gray-600 text-sm">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <p className="text-gray-600 text-sm">Failed</p>
                        <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
                    </div>
                </div>

                <div className="mb-4">
                    <select
                        className="border rounded px-4 py-2"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="sent">Sent</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Channel</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheduled</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filtered.map((notif) => (
                                    <tr key={notif._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm">
                                            {typeof notif.userId === 'object' ? notif.userId?.name : 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {typeof notif.eventId === 'object' ? notif.eventId?.title : 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">{notif.channel}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                notif.status === 'sent' ? 'bg-green-100 text-green-800' :
                                                notif.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {notif.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {notif.scheduledTime ? new Date(notif.scheduledTime).toLocaleString() : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

