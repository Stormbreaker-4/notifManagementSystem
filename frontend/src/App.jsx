import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import Dashboard from "./pages/Coordinator/Dashboard";
import MyEvents from "./pages/Coordinator/MyEvents";
import CreateEvent from "./pages/Coordinator/CreateEvent";
import EditEvent from "./pages/Coordinator/EditEvent";
import NotifyEvent from "./pages/Coordinator/NotifyEvent";
import EventRegistrations from "./pages/Coordinator/EventRegistrations";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import EventDetails from "./pages/EventDetails";

function App() {
    return (
        <Router>
            <Navbar />
            <div className="max-w-6xl mx-auto p-4">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/events/:id" element={<EventDetails />} />


                    {/* Protected: user must be authenticated */}
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />


                    {/* Coordinator-only routes */}
                    <Route path="/coordinator/dashboard" element={<ProtectedRoute roles={["coordinator"]}><Dashboard /></ProtectedRoute>} />
                    <Route path="/coordinator/myevents" element={<ProtectedRoute roles={["coordinator"]}><MyEvents /></ProtectedRoute>} />
                    <Route path="/coordinator/create" element={<ProtectedRoute roles={["coordinator"]}><CreateEvent /></ProtectedRoute>} />
                    <Route path="/coordinator/edit/:id" element={<ProtectedRoute roles={["coordinator"]}><EditEvent /></ProtectedRoute>} />
                    <Route path="/coordinator/notify/:id" element={<ProtectedRoute roles={["coordinator"]}><NotifyEvent /></ProtectedRoute>} />
                    <Route path="/coordinator/registrations/:eventId" element={<ProtectedRoute roles={["coordinator"]}><EventRegistrations /></ProtectedRoute>} />


                    {/* Catch-all */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
