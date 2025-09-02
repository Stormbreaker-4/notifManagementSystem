import api from "./axios";

export const getPreferences = (userId) => api.get(`/api/preferences/${userId}`);
export const updatePreferences = (userId, payload) =>
    api.put(`/api/preferences/${userId}`, payload);
