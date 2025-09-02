import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="flex justify-between items-center px-6 py-4 bg-blue-600 text-white">
            <Link to="/" className="font-bold text-xl">VIT Events</Link>
            <nav className="space-x-4">
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
                <Link to="/profile">Profile</Link>
            </nav>
        </header>
    );
};

export default Header;
