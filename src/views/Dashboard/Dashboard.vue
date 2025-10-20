<script setup lang="ts">
  import { useDashboard } from './DashboardScript'
  const { zones, status, handleRegionClick, MapComponent, CaptionComponent, Card,
          DoubleBarChart, weeklySpeedData, DonutChart, donutChartData } = useDashboard()
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
          :level="zone.level"
          :region="zone.name"
        />
      </div>

      <div class="charts-area">
          <div class="chart-wrapper">
            <h3 class="chart-title">Velocidade Média Semanal</h3>
              <DoubleBarChart
                  :chart-data="weeklySpeedData"
              />
          </div>

          <div class="chart-wrapper donut-wrapper">
            <DonutChart
              :region-name="donutChartData.regionName"
              :value="donutChartData.value"
              :limit="donutChartData.limit"
              :difference="donutChartData.difference"
            />
          </div>
      </div>
    </div>
</div>
</template>
