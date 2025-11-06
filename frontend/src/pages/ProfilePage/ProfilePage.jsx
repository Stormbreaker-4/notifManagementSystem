import React, { useState, useContext, useMemo } from "react";
import PersonalInfoTab from "./PersonalInfoTab";
import RegisteredEventsTab from "./RegisteredEventsTab";
import PreferencesTab from "./PreferencesTab";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
    const { user } = useContext(AuthContext);

    // role-based tabs
    const tabs = useMemo(() => {
        if (!user) return [];
        if (user.role === "student") {
            return [
                { key: "info", label: "Personal Info", component: <PersonalInfoTab /> },
                { key: "events", label: "Registered Events", component: <RegisteredEventsTab /> },
                { key: "prefs", label: "Preferences", component: <PreferencesTab /> },
            ];
        }
        // coordinator/admin -> only personal info
        return [
            { key: "info", label: "Personal Info", component: <PersonalInfoTab /> }
        ];
    }, [user]);

    const [activeTab, setActiveTab] = useState(tabs[0]?.key || "info");

    if (!user) {
        return <div className="p-6">Please login to view profile.</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
                <p className="text-gray-600 mb-8">Manage your account settings and preferences</p>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Sidebar */}
                    <aside className="md:col-span-3">
                        <nav className="bg-white rounded-xl shadow-lg overflow-hidden">
                            {tabs.map(t => (
                                <button
                                    key={t.key}
                                    onClick={() => setActiveTab(t.key)}
                                    className={
                                        "w-full text-left px-4 py-3 border-b last:border-b-0 transition-colors " +
                                        (activeTab === t.key
                                            ? "bg-indigo-600 text-white font-medium"
                                            : "bg-white hover:bg-gray-50 text-gray-700")
                                    }
                                >
                                    {t.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Content */}
                    <section className="md:col-span-9">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            {tabs.find(t => t.key === activeTab)?.component}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
