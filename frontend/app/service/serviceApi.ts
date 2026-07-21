import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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
  API.get(`/${id}`);