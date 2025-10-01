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
            {user.mobileNumber && <p><span className="font-medium">Mobile:</span> {user.mobileNumber}</p>}
            <p><span className="font-medium">Role:</span> {user.role}</p>
        </div>
    );
};

export default PersonalInfoTab;
