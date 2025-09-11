<template>
  <div class="demo-page">
    <div class="demo-header">
      <h1>exemplo de uso componente mapa</h1>
    </div>

    <div class="map-card">
      <MapComponent :zone-levels="zoneLevels" />
    </div>
  </div>
</template>

<script setup lang="ts">
import MapComponent from '../components/MapComponent.vue'

// exemplo de como receber do backend os niveis de cada zona
const zoneLevels = {
  'Zona SUL': 2,
  'Zona SUDESTE': 3,
  'Zona LESTE': 1,
  'CENTRO': 5,
  'Zona OESTE': 4,
  'Zona NORTE': 1
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
  max-width: 600px;
  height: 500px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  padding: 8px;
}

</style>
