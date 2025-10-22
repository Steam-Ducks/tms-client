// src/services/user.service.ts
import axios, { AxiosError } from "axios";

export interface UserPayload {
  username: string;
  email: string;
  phoneNumber: string;
  password?: string; 
}

export interface User extends Required<UserPayload> {
  id: number | string;
}

const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
});

function parseError(e: unknown): never {
  const err = e as AxiosError<any>;
  throw new Error(err.response?.data?.message || err.message || "Erro inesperado");
}

class UserService {
  async register({ username, email, password, phoneNumber }: UserPayload): Promise<User> {
    try {
      const { data } = await api.post("/auth/register", {
        username,
        email,
        password,
        phoneNumber,
      });
      return data;
    } catch (e) {
      parseError(e);
    }
  }

  async list(): Promise<User[]> {
    try {
      const { data } = await api.get("/users");
      return data;
    } catch (e) {
      parseError(e);
    }
  }

  async getById(id: string | number): Promise<User> {
    try {
      const { data } = await api.get(`/users/${id}`);
      return data;
    } catch (e) {
      parseError(e);
    }
  }

  async update(id: string | number, payload: UserPayload): Promise<User> {
    try {
      const body: any = {
        username: payload.username,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
      };
      if (payload.password && payload.password.length >= 6) {
        body.password = payload.password;
      }
      const { data } = await api.put(`/users/${id}`, body);
      return data;
    } catch (e) {
      parseError(e);
    }
  }

  async remove(id: string | number): Promise<void> {
    try {
      await api.delete(`/users/${id}`);
    } catch (e) {
      parseError(e);
    }
  }
}

export default new UserService();
