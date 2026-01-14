import api from "./api";

type Credentials = { email: string; password: string };

export const authService = {
  login: (data: Credentials) => api.post("/auth/login", data),
  registerStudent: (data: Credentials) => api.post("/auth/register", data),
};
