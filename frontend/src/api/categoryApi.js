import api from "./axios";

export const fetchCategoriesByType = (type) => api.get(`/api/categories/${type}`);

export const fetchAllCategories = () => api.get("/api/categories");
