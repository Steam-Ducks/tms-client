<script setup lang="ts">
  import { useDashboard } from './DashboardScript'
  const { zones, status, handleRegionClick, MapComponent, CaptionComponent, Card } = useDashboard()
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
    </div>
  </div>
</template>
