import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export const createService = (data: any) =>
  API.post("/services", data);

export const getServices = () =>
  API.get("/services");

export const deleteService = (id: number) =>
  API.delete(`/services/${id}`);

/* ============================= */
/* DETAIL SERVICE                */
/* ============================= */

export const getServiceDetail = (id: number) =>
  API.get(`/services/${id}`);