import axios from 'axios'

export interface HourlyIndicator {
  hour: number
  regionName: string
  indicatorName: string
  averageValue: number
}

export interface DailyIndicator {
  day: Date
  regionName: string
  indicatorName: string
  averageValue: number
}

const API_URL_HOURLY = 'http://localhost:8080/indicators/hourly'
const API_URL_DAILY = 'http://localhost:8080/indicators/daily'
const API_STATUS = 'http://localhost:8080/indicators/status'

class IndicatorService {
  async getHourlyIndicators(): Promise<HourlyIndicator[]> {
    const response = await axios.get<{ hourly: HourlyIndicator[] }>(API_URL_HOURLY)
    return response.data.hourly
  }

  async getDailyIndicators(): Promise<DailyIndicator[]> {
    const response = await axios.get<{ daily: (Omit<DailyIndicator, 'day'> & { day: string })[] }>(
      API_URL_DAILY,
    )

    return response.data.daily.map((item) => ({
      ...item,
      day: new Date(item.day),
    }))
  }

  async getIndicatorsStatus() {
    try {
      return (await axios.get(API_STATUS)).data
    } catch (ex) {
      console.error('Erro ao buscar status: ', ex)
    }
  }
}

export default new IndicatorService()
