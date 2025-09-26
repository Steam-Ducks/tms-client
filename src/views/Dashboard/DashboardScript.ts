// useDashboard.ts
import { ref, onMounted } from "vue"
import TrafficService, { type ZoneLevel } from "@/services/trafficService"
import { useLevelStatus } from "@/services/LevelStatus"

export function useDashboard() {
  const zones = ref<ZoneLevel[]>([])
  const { status, setLevel } = useLevelStatus()

  setLevel(3)

  onMounted(async () => {
    try {
      const data = await TrafficService.getZoneLevels()
      zones.value = data
      console.log("Dados recebidos do backend:", data)
    } catch (err) {
      console.error("Erro ao carregar zonas:", err)
    }
  })

  return { zones, status }
}
