<script setup lang="ts">
  import { computed } from 'vue'
  import { useDashboard } from './DashboardScript'
  import WeatherIcon from '../../components/WeatherIcon.vue'
  const { zones, selectedRegion, status, handleRegionClick, MapComponent, CaptionComponent, Card,
          DoubleBarChart, weeklySpeedData, DonutChart, donutChartData, LineChart, hourlySpeedData } = useDashboard()

  const selectedZone = computed(() => {
    return selectedRegion.value ? zones.value.find(zone => zone.id === selectedRegion.value) : null
  })
</script>
<style src="./DashboardStyle.css"/>
<template>
  <div class="demo-page">
    <div class="map-card">
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
        />
      </div>

      <div class="weather-section" v-if="selectedZone">
        <h2 class="section-title">Condições Meteorológicas - {{ selectedZone.name }}</h2>
        <div class="weather-display">
          <div class="weather-card">
            <WeatherIcon :weather-code="selectedZone.weatherCode" />
          </div>
        </div>
      </div>

      <div class="charts-area">
          <div class="chart-wrapper">
            <h3 class="chart-title">Velocidade Média Semanal</h3>
              <DoubleBarChart
                  :chart-data="weeklySpeedData"
              />
          </div>

          <div class="chart-wrapper donut-wrapper">
            <h3 class="chart-title">Taxa de Conformidade</h3>
            <DonutChart
              :region-name="donutChartData.regionName"
              :value="donutChartData.value"
              :limit="donutChartData.limit"
              :difference="donutChartData.difference"
            />
          </div>
      </div>
      <div class="charts-area line-chart-area">
          <div class="chart-wrapper line-chart-wrapper">
            <h3 class="chart-title">Desempenho Diário por Hora</h3>
              <LineChart :chart-data="hourlySpeedData" />
          </div>
      </div>
    </div>
</div>
</template>
