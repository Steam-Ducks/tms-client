import axios, { AxiosError } from "axios";

export interface RolePayload {
  description: string;
  regionIds: number[];                
}

export interface Role {
  id: number | string;
  description: string;
  regionIds?: number[] | null;       
  regionNames?: string[] | null;      
  regionId?: number | string | null;
  regionName?: string | null;
}

const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
});

function parseError(e: unknown): never {
  const err = e as AxiosError<any>;
  throw new Error(err.response?.data?.message || err.message || "Erro inesperado");
}

function toNumberArray(v: unknown): number[] {
  if (Array.isArray(v)) return v.map(Number).filter(n => Number.isFinite(n));
  if (v == null || v === "") return [];
  return [Number(v)].filter(n => Number.isFinite(n));
}

class RoleService {
  async create(payload: RolePayload): Promise<Role> {
    try {
      const body = {
        description: payload.description,
        regionId: 1,
      };
      const { data } = await api.post("/roles", body);
      return data;
    } catch (e) { parseError(e); }
  }

  async list(): Promise<Role[]> {
    try {
      const { data } = await api.get("/roles");
      return data;
    } catch (e) { parseError(e); }
  }

  async getById(id: string | number): Promise<Role> {
    try {
      const { data } = await api.get(`/roles/${id}`);
      return data;
    } catch (e) { parseError(e); }
  }

  async update(id: string | number, payload: RolePayload): Promise<Role> {
    try {
      const body = {
        description: payload.description,
        regionId: 1, 
      };
      const { data } = await api.put(`/roles/${id}`, body);
      return data;
    } catch (e) { parseError(e); }
  }

  async remove(id: string | number): Promise<void> {
    try { await api.delete(`/roles/${id}`); }
    catch (e) { parseError(e); }
  }
}

export default new RoleService();
