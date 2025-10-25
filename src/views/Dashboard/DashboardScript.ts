// useDashboard.ts
import { ref, onMounted, onUnmounted, reactive } from "vue"
import TrafficService, { type ZoneLevel } from "@/services/trafficService"
import IndicatorService from "@/services/IndicatorService";
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

  const updateWeeklySpeedChart = async () => {
    try {

      const dayLabels = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
      const getDayName = (date: Date) => dayLabels[date.getDay()];

      const dailyIndicatorsRaw = await IndicatorService.getDailyIndicators();

      const dailyIndicators = dailyIndicatorsRaw.map(item => {
        const date = new Date(item.day);
        const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

        return {
          ...item,
          day: localDate
        };
      });

      const speedData = dailyIndicators
        .filter(i => i.indicatorName === "Average Speed")
        .sort((a, b) => a.day.getTime() - b.day.getTime());


      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const currentWeekStart = new Date(today);
      currentWeekStart.setDate(today.getDate() - today.getDay());

      const previousWeekStart = new Date(currentWeekStart);
      previousWeekStart.setDate(currentWeekStart.getDate() - 7);


      const week1Data = speedData.filter(item => {
        const itemDate = item.day;
        return itemDate >= previousWeekStart && itemDate < currentWeekStart;
      });

      const week2Data = speedData.filter(item => {
        const itemDate = item.day;
        return itemDate >= currentWeekStart && itemDate <= today;
      });

      const weekData = (week: typeof week1Data) => {
        return dayLabels.map((day) => {
          const items = week.filter(i => getDayName(i.day) === day);

          if (items.length === 0) return 0;
          const avg = items.reduce((sum, i) => sum + i.averageValue, 0) / items.length;
          return Math.round(avg * 100) / 100;
        });
      };

      weeklySpeedData.datasets[0].data = weekData(week1Data);
      weeklySpeedData.datasets[1].data = weekData(week2Data);

      console.log("Gráfico de Velocidade Média Semanal atualizado!")

    } catch (err) {
      console.error("Erro ao atualizar gráfico semanal:", err);
    }
  }

  const weeklySpeedData = reactive({
    labels: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
    datasets: [
      { label: 'Semana Anterior', backgroundColor: '#1174e6', data: [] },
      { label: 'Semana Atual', backgroundColor: '#E15759', data: [] },
    ],
  });

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
    await updateWeeklySpeedChart()

    intervalId = setInterval(async () => {
      await fetchZones()
      await updateCityLevel()
      await updateWeeklySpeedChart()
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
