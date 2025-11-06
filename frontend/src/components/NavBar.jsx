import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        const confirmed = await new Promise((resolve) => {
            toast((t) => (
                <div>
                    <p className="mb-2">Are you sure you want to logout?</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => { toast.dismiss(t.id); resolve(true); }}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => { toast.dismiss(t.id); resolve(false); }}
                            className="px-3 py-1 bg-gray-300 rounded text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ), { duration: Infinity });
        });
        
        if (!confirmed) return;
        
        logout();
        setIsOpen(false);
        setProfileOpen(false);
        toast.success('Logged out successfully');
        navigate("/", { replace: true });
    };

    const linkBase =
        "hover:text-gray-200 transition-colors";
    const activeClass =
        "underline underline-offset-4";

    const FirstName = user?.name?.split(" ")[0] || (user?.role === 'admin' ? 'System' : 'Profile');
    const initial = (user?.name || (user?.role === 'admin' ? 'S' : 'P')).charAt(0).toUpperCase();
    const roleColor = !user ? "bg-gray-400" : user.role === 'student' ? "bg-green-600" : user.role === 'coordinator' ? "bg-purple-600" : user.role === 'admin' ? "bg-red-600" : "bg-gray-600";

    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Brand */}
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold">VIT Events</Link>
                    </div>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center space-x-6">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `${linkBase} ${isActive ? activeClass : ""}`
                            }
                        >
                            Home
                        </NavLink>

                        {!user && (
                            <>
                                <NavLink to="/login" className={({ isActive }) => `${linkBase} ${isActive ? activeClass : ""}`}>Login</NavLink>
                                <NavLink to="/register" className={({ isActive }) => `${linkBase} ${isActive ? activeClass : ""}`}>Register</NavLink>
                            </>
                        )}
                        {user && user.role === 'student' && (
                            <></>
                        )}
                        {user && user.role === 'coordinator' && (
                            <>
                                <NavLink to="/coordinator/dashboard" className={({ isActive }) => `${linkBase} ${isActive ? activeClass : ""}`}>Dashboard</NavLink>
                            </>
                        )}
                        {user && user.role === 'admin' && (
                            <>
                                <NavLink to="/profile" className={({ isActive }) => `${linkBase} ${isActive ? activeClass : ""}`}>System</NavLink>
                            </>
                        )}

                        {user && (
                            <div className="relative">
                                <button onClick={() => setProfileOpen((s) => !s)} className="flex items-center focus:outline-none">
                                    <div className={`${roleColor} w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold`}>{initial}</div>
                                </button>
                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-md py-1 z-20">
                                        <button onClick={() => { setProfileOpen(false); navigate('/profile'); }} className="w-full text-left px-3 py-2 hover:bg-gray-100">My Profile</button>
                                        <button onClick={handleLogout} className="w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600">Logout</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button
                        className="md:hidden"
                        onClick={() => setIsOpen((s) => !s)}
                        aria-label="Toggle Menu"
                    >
                        ☰
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-blue-500 px-4 pb-4 space-y-2">
                    <NavLink
                        to="/"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                            `${linkBase} block ${isActive ? activeClass : ""}`
                        }
                    >
                        Home
                    </NavLink>

                    {!user && (
                        <>
                            <NavLink to="/login" onClick={() => setIsOpen(false)} className={({ isActive }) => `${linkBase} block ${isActive ? activeClass : ""}`}>Login</NavLink>
                            <NavLink to="/register" onClick={() => setIsOpen(false)} className={({ isActive }) => `${linkBase} block ${isActive ? activeClass : ""}`}>Register</NavLink>
                        </>
                    )}
                    {user && user.role === 'student' && (
                        <>
                            <NavLink to="/profile" onClick={() => setIsOpen(false)} className={({ isActive }) => `${linkBase} block ${isActive ? activeClass : ""}`}>{FirstName}</NavLink>
                            <button onClick={handleLogout} className="block">Logout</button>
                        </>
                    )}
                    {user && user.role === 'coordinator' && (
                        <>
                            <NavLink to="/" onClick={() => setIsOpen(false)} className={({ isActive }) => `${linkBase} block ${isActive ? activeClass : ""}`}>Home</NavLink>
                            <NavLink to="/coordinator/dashboard" onClick={() => setIsOpen(false)} className={({ isActive }) => `${linkBase} block ${isActive ? activeClass : ""}`}>Dashboard</NavLink>
                            <button onClick={handleLogout} className="block">Logout</button>
                        </>
                    )}
                    {user && user.role === 'admin' && (
                        <>
                            <NavLink to="/profile" onClick={() => setIsOpen(false)} className={({ isActive }) => `${linkBase} block ${isActive ? activeClass : ""}`}>System</NavLink>
                            <button onClick={handleLogout} className="block">Logout</button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
