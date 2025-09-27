import axios from "axios";

export interface ZoneLevel {
  id: string;
  name: string;
  level: number;
}

const API_URL_ZONES = "http://localhost:8080/levels/zones";
const API_URL_CITY = "http://localhost:8080/levels/city";

class TrafficService {
  async getZoneLevels(): Promise<ZoneLevel[]> {
    const response = await axios.get<ZoneLevel[]>(API_URL_ZONES);
    return response.data;
  }

  async getCityLevel(): Promise<number> {
    const response = await axios.get<{ level: number }>(API_URL_CITY);
    return response.data.level;
  }

}


export default new TrafficService();