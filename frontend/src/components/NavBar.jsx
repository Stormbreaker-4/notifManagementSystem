import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate("/", { replace: true });
    };

    const linkBase =
        "hover:text-gray-200 transition-colors";
    const activeClass =
        "underline underline-offset-4";

    const FirstName = user?.name?.split(" ")[0] || "Profile";

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

                        {!user ? (
                            <>
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) =>
                                        `${linkBase} ${isActive ? activeClass : ""}`
                                    }
                                >
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    className={({ isActive }) =>
                                        `${linkBase} ${isActive ? activeClass : ""}`
                                    }
                                >
                                    Register
                                </NavLink>
                            </>
                        ) : (
                            <>
                                {user.role === "coordinator" ? (
                                    <NavLink
                                        to="/coordinator/dashboard"
                                        className={({ isActive }) =>
                                            `${linkBase} ${isActive ? activeClass : ""}`
                                        }
                                    >
                                        Dashboard
                                    </NavLink>
                                ) : (
                                    <NavLink
                                        to="/profile"
                                        className={({ isActive }) =>
                                            `${linkBase} ${isActive ? activeClass : ""}`
                                        }
                                    >
                                        {FirstName}
                                    </NavLink>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="bg-white/10 px-3 py-1 rounded hover:bg-white/20"
                                >
                                    Logout
                                </button>
                            </>
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

                    {!user ? (
                        <>
                            <NavLink
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `${linkBase} block ${isActive ? activeClass : ""}`
                                }
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/register"
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `${linkBase} block ${isActive ? activeClass : ""}`
                                }
                            >
                                Register
                            </NavLink>
                        </>
                    ) : (
                        <>
                            {user.role === "coordinator" ? (
                                <NavLink
                                    to="/coordinator/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `${linkBase} block ${isActive ? activeClass : ""}`
                                    }
                                >
                                    Dashboard
                                </NavLink>
                            ) : (
                                <NavLink
                                    to="/profile"
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `${linkBase} block ${isActive ? activeClass : ""}`
                                    }
                                >
                                    {FirstName}
                                </NavLink>
                            )}
                            <button onClick={handleLogout} className="block">
                                Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
