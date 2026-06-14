import api from "../services/api";

export const loginUser = (data: { userId: string; password: string }) =>
  api.post("/auth/login", data);