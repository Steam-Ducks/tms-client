// src/services/LoginService.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/auth",
});

class LoginService {
  async login(username: string, password: string): Promise<{ accessToken: string; tokenType: string }> {
    const { data } = await api.post<{ accessToken: string; tokenType: string }>(
      "/login",
      { username, password }
    );
    return data;
  }

  setAuthHeader(tokenType: string, token: string) {
    api.defaults.headers.common["Authorization"] = `${tokenType} ${token}`;
  }

  clearAuthHeader() {
    delete api.defaults.headers.common["Authorization"];
  }
}

export default new LoginService();
