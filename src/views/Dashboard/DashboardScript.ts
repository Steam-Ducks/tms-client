// useDashboard.ts
import { ref, onMounted, onUnmounted } from "vue"
import TrafficService, { type ZoneLevel } from "@/services/trafficService"
import { useLevelStatus } from "@/services/LevelStatus"
import MapComponent from '@/components/MapComponent.vue'
import CaptionComponent from '@/components/CaptionComponent.vue'
import Card from '@/components/CardComponent.vue'

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
    Card
  }
}
