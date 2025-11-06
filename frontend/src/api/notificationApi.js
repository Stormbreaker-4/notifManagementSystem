import api from "./axios";

export const fetchNotifications = () => api.get("/api/notifications");
export const updateNotificationStatus = (id, payload) =>
    api.put(`/api/notifications/${id}/status`, payload);
export const logDeliveryAttempt = (payload) =>
    api.post("/api/notifications/log", payload);

export const sendEventEmail = (eventId, payload) =>
    api.post(`/api/notifications/events/${eventId}/email`, payload);
export const testSendEventEmail = (eventId, payload) =>
    api.post(`/api/notifications/events/${eventId}/email/test`, payload);