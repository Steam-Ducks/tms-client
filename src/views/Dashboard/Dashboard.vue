<!-- Dashboard.vue -->
<script setup lang="ts">
  import MapComponent from '@/components/MapComponent.vue'
  import CaptionComponent from '@/components/CaptionComponent.vue'
  import Card from '@/components/CardComponent.vue'
  import { useDashboard } from './DashboardScript.ts'
  import './DashboardStyle.css'
  const { zones, status } = useDashboard()
</script>

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
