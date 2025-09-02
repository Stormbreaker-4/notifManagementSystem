import React, { useState } from "react";
import PersonalInfoTab from "./PersonalInfoTab";
import RegisteredEventsTab from "./RegisteredEventsTab";
import PreferencesTab from "./PreferencesTab";

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState("info");

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">My Profile</h1>
            <div className="flex gap-4 mb-4">
                <button onClick={() => setActiveTab("info")}>Personal Info</button>
                <button onClick={() => setActiveTab("events")}>Registered Events</button>
                <button onClick={() => setActiveTab("preferences")}>Preferences</button>
            </div>

            {activeTab === "info" && <PersonalInfoTab />}
            {activeTab === "events" && <RegisteredEventsTab />}
            {activeTab === "preferences" && <PreferencesTab />}
        </div>
    );
};

export default ProfilePage;
