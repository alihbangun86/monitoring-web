import api from "./api";

export const getSummary=()=>{

    return api.get("/dashboard/summary");

}

export const getServiceStatus=()=>{

    return api.get("/dashboard/services");

}

export const getChart = () => api.get("/dashboard/chart");