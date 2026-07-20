import api from "./api";

export const login = (username: string, password: string) => {
  return api.post("/auth/login", {
    username,
    password,
  });
};

export const me = () => {
  return api.get("/auth/me", {
    headers: {
      Authorization:
        "Bearer " + localStorage.getItem("token"),
    },
  });
};