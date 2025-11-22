<!-- Dashboard.vue -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDashboard } from './DashboardScript'
import WeatherIcon from '../../components/WeatherIcon.vue'
import TrafficAlertsSidebar from '@/components/TrafficAlertsSidebar.vue'

const { zones, selectedRegion, status, handleRegionClick, MapComponent, CaptionComponent, Card,
        DoubleBarChart, weeklySpeedData, DonutChart, donutChartData, LineChart, hourlySpeedData, trafficAlerts } = useDashboard()

const isSidebarOpen = ref(false)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}


const selectedZone = computed(() => {
  return selectedRegion.value ? zones.value.find(zone => zone.id === selectedRegion.value) : null
})

// Controlar qual card está expandido
const expandedRegion = ref<string | null>(null)

const handleCardExpand = (region: string) => {
  expandedRegion.value = expandedRegion.value === region ? null : region
}

const getTrendText = (value) => {

  if (value === "AUMENTOU") {
    return {
      icon: "/src/assets/trend/trend_up.png",
      text: "A tendência melhorou."
    };
  }

  if (value === "DIMINUIU") {
    return {
      icon: "/src/assets/trend/trend_down.png",
      text: "A tendência piorou."
    };
  }

  return {
    icon: "/src/assets/trend/trend_bleh.png",
    text: "A tendência se manteve."
  };
};

</script>

<style src="./DashboardStyle.css"/>

<template>
  <div class="demo-page">
    <div class="map-card">
      <TrafficAlertsSidebar
      :is-open="isSidebarOpen"
      @toggle="toggleSidebar"
      :alerts="trafficAlerts"
    />
      <MapComponent
        :zone-levels="zones"
        @region-click="handleRegionClick"
      />
      <CaptionComponent />
    </div>

    <div class="scrollable-content">
      <div class="status-geral-cidade">
        <h1> O trânsito em São José dos Campos está
          <b :style="{ color: status.color }">{{ status.text }}</b> neste momento.
        </h1>
      </div>

      <div class="card-grid">
        <Card
          v-for="zone in zones"
          :key="zone.id"
          :level="zone.level as 1 | 2 | 3 | 4 | 5"
          :region="zone.name"
          @expand="handleCardExpand"
        />
      </div>

      <div class="charts-area">
          <div class="chart-wrapper">
            <h3 class="chart-title">
              <span>Velocidade Média Semanal</span>
              <img
                class="status-icon"
                :src="getTrendText(weeklySpeedData.trend).icon"
                :title="getTrendText(weeklySpeedData.trend).text"
                :alt="getTrendText(weeklySpeedData.trend).text"
              />
            </h3>
              <DoubleBarChart
                  :chart-data="weeklySpeedData"
              />
          </div>

          <div class="chart-wrapper donut-wrapper">
            <h3 class="chart-title">
              <span>Taxa de Conformidade</span>
              <img
                class="status-icon"
                :src="getTrendText(donutChartData.trend).icon"
                :title="getTrendText(donutChartData.trend).text"
                :alt="getTrendText(donutChartData.trend).text"
              />
            </h3>
            <DonutChart
              :region-name="donutChartData.regionName"
              :value="donutChartData.value"
              :limit="donutChartData.limit"
              :difference="donutChartData.difference"
            />
          </div>

          <div class="chart-wrapper line-chart-wrapper">
            <h3 class="chart-title">
              <span>Desempenho Diário por Hora</span>
              <img
                class="status-icon"
                :src="getTrendText(hourlySpeedData.trend).icon"
                :title="getTrendText(hourlySpeedData.trend).text"
                :alt="getTrendText(hourlySpeedData.trend).text"
              />
            </h3>
              <LineChart :chart-data="hourlySpeedData" />
          </div>

          <div class="weather-wrapper" v-if="selectedZone">
            <div class="weather-display">
              <WeatherIcon :weather-code="selectedZone.weatherCode" />
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<style>
  .chart-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1.2rem;
    font-weight: 600;
  }

  .status-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
</style>
