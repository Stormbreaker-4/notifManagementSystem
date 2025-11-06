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
import AdminDashboard from "./pages/Admin/Dashboard";
import UserManagement from "./pages/Admin/UserManagement";
import CategoryManagement from "./pages/Admin/CategoryManagement";
import AllEvents from "./pages/Admin/AllEvents";
import NotificationMonitor from "./pages/Admin/NotificationMonitor";
import AllRegistrations from "./pages/Admin/AllRegistrations";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import EventDetails from "./pages/EventDetails";

function App() {
    return (
        <Router>
            <Navbar />
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


                    {/* Admin-only routes */}
                    <Route path="/admin/dashboard" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/users" element={<ProtectedRoute roles={["admin"]}><UserManagement /></ProtectedRoute>} />
                    <Route path="/admin/categories" element={<ProtectedRoute roles={["admin"]}><CategoryManagement /></ProtectedRoute>} />
                    <Route path="/admin/events" element={<ProtectedRoute roles={["admin"]}><AllEvents /></ProtectedRoute>} />
                    <Route path="/admin/notifications" element={<ProtectedRoute roles={["admin"]}><NotificationMonitor /></ProtectedRoute>} />
                    <Route path="/admin/registrations" element={<ProtectedRoute roles={["admin"]}><AllRegistrations /></ProtectedRoute>} />


                    {/* Catch-all */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
        </Router>
    );
}

export default App;
