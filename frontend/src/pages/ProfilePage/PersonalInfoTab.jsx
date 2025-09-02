import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const PersonalInfoTab = () => {
    const { user } = useContext(AuthContext); // { _id, name, email, role, token }

    if (!user) {
        return <p className="text-gray-600">Not logged in.</p>;
    }

    return (
        <div>
            <h2 className="text-lg font-semibold">Personal Info</h2>
            <p><span className="font-medium">Name:</span> {user.name}</p>
            <p><span className="font-medium">Email:</span> {user.email}</p>
            <p><span className="font-medium">Role:</span> {user.role}</p>
            <p className="text-xs text-gray-500 mt-2">User ID: {user._id}</p>
        </div>
    );
};

export default PersonalInfoTab;
