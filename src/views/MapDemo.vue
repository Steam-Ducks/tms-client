<template>
  <div class="demo-page">
    <div class="map-card">
      <MapComponent
        :zone-levels="zoneLevels"
        @region-click="handleRegionClick"
      />
      <CaptionComponent />
  </div>
  </div>
</template>

<script setup lang="ts">
import MapComponent from '../components/MapComponent.vue'
import CaptionComponent from '../components/CaptionComponent.vue'


const zoneLevels = [
  { id: '1', name: 'Zona SUL', level: 2 },
  { id: '2', name: 'Zona SUDESTE', level: 3 },
  { id: '3', name: 'Zona LESTE', level: 1 },
  { id: '4', name: 'Zona CENTRAL', level: 5 },
  { id: '5', name: 'Zona OESTE', level: 4 },
  { id: '6', name: 'Zona NORTE', level: 5 }
]

const handleRegionClick = (regionId: string) => {
  console.log('Clicked :', regionId)
}
</script>

<style scoped>
.demo-page {
  flex-direction: column;
  align-items: center;
}

.map-card {
  width: 100%;
  height: 700px;
  position: relative;
}


</style>
