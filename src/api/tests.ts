import api from "../services/api";

export const getAllTests = () => api.get("/tests");
export const getTestById = (id: string) => api.get(`/tests/${id}`);
export const createTest = (data: object) => api.post("/tests", data);
export const updateTest = (id: string, data: object) => api.put(`/tests/${id}`, data);
export const deleteTest = (id: string) => api.delete(`/tests/${id}`);