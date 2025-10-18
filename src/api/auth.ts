import {api} from "./client";

export type LoginResponse = {
  accessToken: string;
  username: string;
  id: number;
};

export async function loginApi(username: string, password: string) {
  const {data} = await api.post<LoginResponse>("/auth/login", {
    username,
    password,
  });
  return data;
}

export async function meApi(token: string) {
  const {data} = await api.get("/auth/me", {
    headers: {Authorization: `Bearer ${token}`},
  });
  return data;
}
