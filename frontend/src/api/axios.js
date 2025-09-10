import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true, // IMPORTANT: send/receive refresh cookie
});

// attach access token
api.interceptors.request.use((config) => {
    const raw = localStorage.getItem("user");
    if (raw) {
        const { token } = JSON.parse(raw);
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- Refresh-once logic ---
let isRefreshing = false;
let pendingQueue = [];

function processQueue(error, token = null) {
    pendingQueue.forEach(({ resolve, reject, originalRequest }) => {
        if (error) {
            reject(error);
        } else {
            if (token) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
        }
    });
    pendingQueue = [];
}

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;
        const status = err?.response?.status;
        const msg = err?.response?.data?.message;

        const isAuthError = status === 401 && (
            msg === 'Token expired' || msg === 'Invalid token' || (msg && msg.toLowerCase().includes('not authorized'))
        );

        if (!isAuthError) {
            return Promise.reject(err);
        }

        // avoid infinite loops
        if (originalRequest._retry) {
            // hard logout on second failure
            try { localStorage.removeItem("user"); } catch { }
            if (typeof window !== 'undefined') window.location.replace('/login');
            return Promise.reject(err);
        }
        originalRequest._retry = true;

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                pendingQueue.push({ resolve, reject, originalRequest });
            });
        }

        isRefreshing = true;

        try {
            // Call refresh endpoint (cookie is sent automatically)
            const { data } = await axios.post(
                "http://localhost:5000/api/auth/refresh",
                {},
                { withCredentials: true }
            );

            // Update localStorage with new access token (keep rest)
            const raw = localStorage.getItem("user");
            const prev = raw ? JSON.parse(raw) : {};
            const nextUser = { ...prev, ...data, token: data.token };
            localStorage.setItem("user", JSON.stringify(nextUser));

            // Update header on the fly and retry queued
            isRefreshing = false;
            processQueue(null, data.token);

            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${data.token}`;
            return api(originalRequest);
        } catch (refreshErr) {
            isRefreshing = false;
            processQueue(refreshErr, null);
            // Refresh failed → logout
            try { localStorage.removeItem("user"); } catch { }
            if (typeof window !== 'undefined') window.location.replace('/login');
            return Promise.reject(refreshErr);
        }
    }
);

export default api;
