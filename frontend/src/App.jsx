import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import Dashboard from "./pages/Coordinator/Dashboard";
import MyEvents from "./pages/Coordinator/MyEvents";
import CreateEvent from "./pages/Coordinator/CreateEvent";
import EventRegistrations from "./pages/Coordinator/EventRegistrations";

function App() {
    return (
        <Router>
            <Navbar />
            <div className="max-w-6xl mx-auto p-4">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/coordinator/dashboard" element={<Dashboard />} />
                    <Route path="/coordinator/myevents" element={<MyEvents />} />
                    <Route path="/coordinator/create" element={<CreateEvent />} />
                    <Route path="/coordinator/registrations/:eventId" element={<EventRegistrations />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
