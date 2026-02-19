/**
 * @fileoverview All API service functions for the Pet Adoption app.
 */

import api from "./axiosInstance";

// Auth
export const register = (data) => api.post("/auth/register", data).then((r) => r.data);
export const login = (data) => api.post("/auth/login", data).then((r) => r.data);
export const getMe = () => api.get("/auth/me").then((r) => r.data);

// Pets
export const getPets = (params) => api.get("/pets", { params }).then((r) => r.data);
export const getPetById = (id) => api.get(`/pets/${id}`).then((r) => r.data);
export const createPet = (formData) => api.post("/pets", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);
export const updatePet = (id, formData) => api.put(`/pets/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);
export const deletePet = (id) => api.delete(`/pets/${id}`).then((r) => r.data);

// Applications
export const submitApplication = (petId, data) => api.post(`/applications/${petId}`, data).then((r) => r.data);
export const getMyApplications = (params) => api.get("/applications/my", { params }).then((r) => r.data);
export const getAllApplications = (params) => api.get("/applications", { params }).then((r) => r.data);
export const reviewApplication = (id, data) => api.patch(`/applications/${id}/review`, data).then((r) => r.data);
