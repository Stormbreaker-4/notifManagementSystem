import api from "./axios";

export const fetchEvents = () => api.get("/api/events");
export const createEvent = (payload) => api.post("/api/events", payload);
export const getEventById = (id) => api.get(`api/events/${id}`);
export const registerForEvent = (id) => api.post(`/api/events/${id}/register`);