import api from "./axios";

export const fetchNotifications = () => api.get("/api/notifications");
export const updateNotificationStatus = (id, payload) =>
    api.put(`/api/notifications/${id}/status`, payload);
export const logDeliveryAttempt = (payload) =>
    api.post("/api/notifications/log", payload);
