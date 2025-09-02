import api from "./axios";

export const fetchCategoriesByType = (type) => api.get(`/api/categories/${type}`);

// if you also have GET all later, add:
// export const fetchAllCategories = () => api.get("/api/categories");
