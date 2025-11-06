import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-6">
            <div className="text-center">
                <h1 className="text-8xl font-bold text-red-600 mb-4">404</h1>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h2>
                <p className="text-gray-600 text-lg mb-8">Oops! The page you are looking for doesn't exist.</p>
                <div className="flex gap-4 justify-center">
                    <Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors font-medium">
                        Go Home
                    </Link>
                    <Link to="/profile" className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                        My Profile
                    </Link>
                </div>
            </div>
        </div>
    );
}