import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { updateUser } from "../../api/userApi";
import toast from "react-hot-toast";

const PersonalInfoTab = () => {
    const { user, setUser } = useContext(AuthContext);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        mobileNumber: user?.mobileNumber || "",
    });

    if (!user) {
        return <p className="text-gray-600">Not logged in.</p>;
    }

    const handleSave = async () => {
        if (!form.name.trim()) {
            toast.error('Name is required');
            return;
        }
        if (!form.email.trim()) {
            toast.error('Email is required');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            toast.error('Please provide a valid email address');
            return;
        }
        if (form.mobileNumber && !/^\+91[0-9]{10}$/.test(form.mobileNumber.replace(/\s/g, ''))) {
            toast.error('Mobile number must be in format +911234567890 (+91 followed by 10 digits)');
            return;
        }

        const promise = updateUser(user._id, form).then(({ data }) => {
            setUser({ ...user, ...data });
            setEditing(false);
            return "Profile updated successfully!";
        });

        toast.promise(promise, {
            loading: 'Updating profile...',
            success: (msg) => msg,
            error: (err) => err?.response?.data?.message || "Failed to update profile",
        });
    };

    if (editing) {
        return (
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Edit Personal Info</h2>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <input
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="+911234567890"
                        value={form.mobileNumber}
                        onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
                        value={user.role}
                        disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Role cannot be changed</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Save Changes
                    </button>
                    <button
                        onClick={() => {
                            setEditing(false);
                            setForm({ name: user.name, email: user.email, mobileNumber: user.mobileNumber || "" });
                        }}
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Personal Info</h2>
                {(user.role === 'student' || user.role === 'coordinator') && (
                    <button
                        onClick={() => setEditing(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                        Edit Profile
                    </button>
                )}
            </div>
            <div className="space-y-4">
                <div className="border-b border-gray-200 pb-3">
                    <p className="text-sm text-gray-500 mb-1">Name</p>
                    <p className="text-gray-900 font-medium">{user.name}</p>
                </div>
                <div className="border-b border-gray-200 pb-3">
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="text-gray-900 font-medium">{user.email}</p>
                </div>
                {user.mobileNumber && (
                    <div className="border-b border-gray-200 pb-3">
                        <p className="text-sm text-gray-500 mb-1">Mobile Number</p>
                        <p className="text-gray-900 font-medium">{user.mobileNumber}</p>
                    </div>
                )}
                <div className="pb-3">
                    <p className="text-sm text-gray-500 mb-1">Role</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'coordinator' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                    }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoTab;
