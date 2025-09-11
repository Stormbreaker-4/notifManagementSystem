import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <>
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <h1 className="text-6xl font-bold text-red-600">404</h1>
                <p className="text-xl mt-4">Oops! The page you are looking for doesn't exist.</p>
                <div className="mt-6 space-x-3">
                    <Link to="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">Go Home</Link>
                    <Link to="/profile" className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">My Profile</Link>
                </div>
            </div>
        </>
    );
}