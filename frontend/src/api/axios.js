import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
});

api.interceptors.request.use((config) => {
    const raw = localStorage.getItem("user");
    if (raw) {
        const { token } = JSON.parse(raw);
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
