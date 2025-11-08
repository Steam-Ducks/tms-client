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
  const selectedRegion = ref<string | null>(null)
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

  const updateComplianceRateChart = async () => {
    try {

      const dailyIndicatorsRaw = await IndicatorService.getDailyIndicators();

      const dailyIndicators = dailyIndicatorsRaw.map(item => {
        const date = new Date(item.day);

        const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

        return {
          ...item,
          day: localDate
        };
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);


      const complianceRateData = dailyIndicators
        .filter(i => {
          const itemDate = new Date(i.day);
          itemDate.setHours(0, 0, 0, 0);

          const isToday = itemDate.getTime() === today.getTime();
          const isComplianceRate = i.indicatorName === "Compliance Rate";

          return isComplianceRate && isToday;
        });

      const averageComplianceRate = complianceRateData.length > 0
        ? Math.round((complianceRateData.reduce((sum, i) => sum + i.averageValue, 0) / complianceRateData.length) * 100) / 100
        : 0;

      console.log('Gráfico da Taxa de Conformidade atualizado!');

      donutChartData.value = averageComplianceRate * 100

    }
    catch (err) {
      console.error("Erro ao atualizar gráfico de Compliance Rate:", err);
    }
  }

  const updateHourlySpeedChart = async () => {
    try {
      const hoursLabels = Array.from({ length: 24 }, (_, i) => i);

      const hourlyIndicatorsRaw = await IndicatorService.getHourlyIndicators();

      const speedData = hourlyIndicatorsRaw
        .filter(i => i.indicatorName === "Average Speed");

      const hourlyAverages = hoursLabels.map(hour => {
        const items = speedData.filter(i => i.hour === hour);
        if (items.length === 0) return 0;

        const avg = items.reduce((sum, i) => sum + i.averageValue, 0) / items.length;
        return Math.round(avg * 100) / 100;
      });

      hourlySpeedData.datasets[0].data = hourlyAverages

      console.log("Gráfico de velocidade média por hora atualizado!")
    }
    catch (err) {
      console.error("Erro ao atualizar gráfico de média por hora:", err);
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
      { label: 'Semana Anterior', backgroundColor: '#D91532', data: [] },
      { label: 'Semana Atual', backgroundColor: '#00BF63', data: [] },
    ],
  });

  const donutChartData = reactive({
    regionName: "Geral",
    value: 0,
    limit: 100,
    difference: 0,
  });

  const hourlySpeedData = reactive({
    labels: Array.from({ length: 24 }, (_, i) => `${i}h`),
    datasets: [
      {
        label: 'Velocidade Média',
        borderColor: '#F97316',
        backgroundColor: 'rgba(249, 115, 22, 0.2)',
        fill: true,
        data: [] as number[],
      },
    ],
  });

  onMounted(async () => {
    await fetchZones()
    await updateCityLevel()
    await updateWeeklySpeedChart()
    await updateHourlySpeedChart()
    await updateComplianceRateChart()

    intervalId = setInterval(async () => {
      await fetchZones()
      await updateCityLevel()
      await updateWeeklySpeedChart()
      await updateHourlySpeedChart()
      await updateComplianceRateChart()
    }, 30000)
  })

  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId)
    }
  })

  const handleRegionClick = (regionId: string) => {
    console.log('Region clicked:', regionId)
    selectedRegion.value = regionId
  }

  return {
    zones,
    selectedRegion,
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
