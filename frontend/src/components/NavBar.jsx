import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold">VIT Events</Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/">Home</Link>

                        {!user && (
                            <>
                                <Link to="/login" className="hover:text-gray-200">Login</Link>
                                <Link to="/register" className="hover:text-gray-200">Register</Link>
                            </>
                        )}

                        {user && (
                            <>
                                {user.role === "coordinator" && (
                                    <Link to="/coordinator/dashboard" className="hover:text-gray-200">
                                        Coordinator
                                    </Link>
                                )}
                                <Link to="/profile" className="hover:text-gray-200">
                                    {user.name?.split(" ")[0] || "Profile"}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-white/10 px-3 py-1 rounded hover:bg-white/20"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>

                    <button
                        className="md:hidden"
                        onClick={() => setIsOpen((s) => !s)}
                        aria-label="Toggle Menu"
                    >
                        ☰
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-blue-500 px-4 pb-4 space-y-2">
                    <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
                    {!user ? (
                        <>
                            <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
                            <Link to="/register" onClick={() => setIsOpen(false)}>Register</Link>
                        </>
                    ) : (
                        <>
                            {user.role === "coordinator" && (
                                <Link to="/coordinator/dashboard" onClick={() => setIsOpen(false)}>
                                    Coordinator
                                </Link>
                            )}
                            <Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link>
                            <button onClick={handleLogout}>Logout</button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
