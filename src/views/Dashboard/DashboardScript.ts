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

// 1. DEFINIÇÃO DA INTERFACE DOS DADOS DE ALERTA
export interface TrafficAlert {
  id: number;
  region: string;
  street: string;
  statusText: string;
  level: 'ruim' | 'pessimo' | 'regular' | 'bom' | 'excelente';
  time: string;
}


export function useDashboard() {
  const zones = ref<ZoneLevel[]>([])
  const { status, setLevel } = useLevelStatus()
  let intervalId: number | null = null

  //ESTADO REATIVO PARA OS ALERTAS (Simulação do top dos top 5)
  const trafficAlerts = ref<TrafficAlert[]>([
    {
      id: 1,
      region: "Região Centro",
      street: "Av. Principal",
      statusText: "Tráfego PÉSSIMO devido a incidente.",
      level: 'pessimo',
      time: "Atualizado: 17:20"
    },
    {
      id: 2,
      region: "Região Oeste",
      street: "Rua das Laranjeiras",
      statusText: "Trânsito RUIM em 70% da via.",
      level: 'ruim',
      time: "Atualizado: 17:15"
    },
    {
      id: 3,
      region: "Região Sul",
      street: "Rodovia Z",
      statusText: "Fluxo regular, aumento de lentidão.",
      level: 'regular',
      time: "Atualizado: 17:10"
    },
    {
      id: 4,
      region: "Região Leste",
      street: "Av. do Parque",
      statusText: "Trânsito bom, leve lentidão em um trecho.",
      level: 'bom',
      time: "Atualizado: 17:05"
    },
    {
      id: 5,
      region: "Região Norte",
      street: "Rua da Serra",
      statusText: "Tráfego excelente, sem ocorrências.",
      level: 'excelente',
      time: "Atualizado: 17:00"
    },
  ]);

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

  const fetchAlerts = async () => {
    console.log("Alertas de tráfego prontos para atualização.");
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
    await fetchAlerts() // CHAME A FUNÇÃO NA INICIALIZAÇÃO

    intervalId = setInterval(async () => {
      await fetchZones()
      await updateCityLevel()
      await fetchAlerts() // CHAME A FUNÇÃO NO INTERVALO
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
    trafficAlerts,
  }
}
