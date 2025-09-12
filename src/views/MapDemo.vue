<template>
  <div class="demo-page">
    <div class="demo-header">
      <h1>exemplo de uso componente mapa</h1>
    </div>

    <div class="map-card">
      <MapComponent
        :zone-levels="zoneLevels"
        @region-click="handleRegionClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import MapComponent from '../components/MapComponent.vue'

// exemplo de como receber do backend os niveis de cada zona
const zoneLevels = [
  { id: '1', name: 'Zona SUL', level: 2 },
  { id: '2', name: 'Zona SUDESTE', level: 3 },
  { id: '3', name: 'Zona LESTE', level: 1 },
  { id: '4', name: 'CENTRO', level: 5 },
  { id: '5', name: 'Zona OESTE', level: 4 },
  { id: '6', name: 'Zona NORTE', level: 1 }
]


const handleRegionClick = (regionId: string) => {
  console.log('Clicked :', regionId)
}
</script>

<style scoped>
.demo-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0c0c0c 0%, #242424 100%);
  color: white;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.demo-header {
  text-align: center;
  margin-bottom: 40px;
}

.demo-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}



.map-card {
  width: 100%;
  max-width: 1200px;
  height: 500px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  padding: 8px;
}

</style>
