// useDashboard.ts
import { ref, onMounted, onUnmounted } from "vue"
import TrafficService, { type ZoneLevel } from "@/services/trafficService"
import { useLevelStatus } from "@/services/LevelStatus"
import MapComponent from '@/components/MapComponent.vue'
import CaptionComponent from '@/components/CaptionComponent.vue'
import Card from '@/components/CardComponent.vue'
import DoubleBarChart from '@/components/DoubleBarChart.vue'
import DonutChart from '@/components/DonutChart.vue'
import LineChart from '@/components/LineChart.vue'

export function useDashboard() {
  const zones = ref<ZoneLevel[]>([])
  const { status, setLevel } = useLevelStatus()
  let intervalId: number | null = null

  const fetchZones = async () => {
    try {
      const data = await TrafficService.getZoneLevels()
      zones.value = data
      console.log("Dados atualizados:", data)
    } catch (err) {
      console.error("Erro ao carregar zonas:", err)
    }
  }

  const updateCityLevel = async () => {
    try {
      const cityLevel = await TrafficService.getCityLevel()
      const validLevel = Math.max(1, Math.min(5, cityLevel)) as 1 | 2 | 3 | 4 | 5
      setLevel(validLevel)
    } catch (err) {
      console.error("Erro ao carregar nível da cidade:", err)
      setLevel(3)
    }
  }

  const weeklySpeedData = {
  labels: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
  datasets: [
    { label: 'Semana 1', backgroundColor: '#1174e6', data: [1, 2, 3, 4, 5, 7, 9] },
    { label: 'Semana 2', backgroundColor: '#E15759', data: [3, 5, 8, 7, 4, 5, 6] },
  ],
};

  const donutChartData = {
      regionName: "Avenida 501",
      value: 92,
      limit: 100,
      difference: 8,
};

    const hourlySpeedData = {
      labels: Array.from({ length: 24 }, (_, i) => `${i}h`),
      datasets: [
          {
              label: 'Velocidade Média',
              borderColor: '#1174e6',
              backgroundColor: 'rgba(17, 116, 230, 0.2)',
              fill: true,
              data: [
                  10, 12, 15, 20, 35, 45, 50, 25, 20, 28, 35, 40,
                  45, 42, 38, 30, 22, 15, 18, 25, 30, 35, 40, 30
              ],
          },
      ],
  };


  onMounted(async () => {
    await fetchZones()
    await updateCityLevel()

    intervalId = setInterval(async () => {
      await fetchZones()
      await updateCityLevel()
    }, 30000)
  })

  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId)
    }
  })

  const handleRegionClick = (regionId: string) => {
    console.log('Region clicked:', regionId)
  }

  return {
    zones,
    status,
    handleRegionClick,
    // Components
    MapComponent,
    CaptionComponent,
    Card,
    DoubleBarChart,
    weeklySpeedData,
    DonutChart,
    donutChartData,
    LineChart,
    hourlySpeedData,
  }
}
