import api from "./axios";

export const fetchEvents = () => api.get("/api/events");
export const createEvent = (payload) => api.post("/api/events", payload);
export const getEventById = (id) => api.get(`/api/events/${id}`);
export const registerForEvent = (id) => api.post(`/api/events/${id}/register`);

export const updateEvent = (id, payload) => api.put(`/api/events/${id}`, payload);
export const deleteEvent = (id) => api.delete(`/api/events/${id}`);
export const listRegistrations = (id) => api.get(`/api/events/${id}/registrations`);
export const downloadRegistrationsCsv = (id) => api.get(`/api/events/${id}/registrations?format=csv`, { responseType: 'blob' });