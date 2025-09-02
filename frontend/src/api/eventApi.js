import api from "./axios";

export const fetchEvents = () => api.get("/api/events");
export const createEvent = (payload) => api.post("/api/events", payload);
