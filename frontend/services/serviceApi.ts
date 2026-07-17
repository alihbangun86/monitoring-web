import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/services",
});

// Ambil semua service
export const getServices = () => API.get("/");

// Ambil detail service
export const getServiceDetail = (id: number) =>
  API.get(`/${id}`);

// Tambah service
export const createService = (data: {
  name: string;
  url: string;
}) => API.post("/", data);

// Update service
export const updateService = (
  id: number,
  data: {
    name: string;
    url: string;
  }
) => API.put(`/${id}`, data);

// Hapus service
export const deleteService = (id: number) =>
  API.delete(`/${id}`);

export const getServiceHistory = (id: number) => {
    return API.get(`/${id}/history`);
};