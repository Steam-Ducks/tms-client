import axios from "axios";

export interface ZoneLevel {
  id: string;
  name: string;
  level: number;
}

const API_URL = "http://localhost:8080/levels/zones";

class TrafficService {
  async getZoneLevels(): Promise<ZoneLevel[]> {
    const response = await axios.get<ZoneLevel[]>(API_URL);
    return response.data;
  }
}

export default new TrafficService();