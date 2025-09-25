// eslint-disable-next-line vue/multi-word-component-names
<script setup lang="ts">
  import MapDemo from '../views/MapDemo.vue'
  import { useLevelStatus, type Level } from "../services/LevelStatus"
  import Card from '../components/CardComponent.vue'

  const { status, setLevel } = useLevelStatus()
  const zoneLevels = [
    { id: '1', name: 'Zona Sul', level: 2 },
    { id: '2', name: 'Zona Sudeste', level: 3 },
    { id: '3', name: 'Zona Leste', level: 1 },
    { id: '4', name: 'Zona Central', level: 5 },
    { id: '5', name: 'Zona Oeste', level: 4 },
    { id: '6', name: 'Zona Norte', level: 5 }
  ]

  const level=3
  setLevel(level)

</script>

<template>
  <MapDemo />
  <div class="scrollable-content">
    <div class="status-geral-cidade">
      <h1> O trânsito em São José dos Campos está <b :style="{ color: status.color }">{{ status.text }}</b> neste momento. </h1>
    </div>
    <div class="card-grid">
      <Card
          v-for="zone in zoneLevels"
          :key="zone.id"
          :level="zone.level as Level"
          :region="zone.name"
      />
    </div>
  </div>
</template>

<style>

  @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700;800&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Define a fonte padrão para toda a aplicação */
  body {
    font-family: 'Figtree', sans-serif;
  }

  .scrollable-content {
    width: 100%;
    background-color: #1a1a1a;
    color: #e0e0e0;
    padding: 50px 20px;
    min-height: 100vh;
    justify-content: center;
    text-align: center;
  }

  .status-geral-cidade {
    color:#e0e0e0;
    width: 100%;
    padding-left: 30%;
    padding-right: 30%;
    text-align: center;
    font-size: 90%;

  }

.card-grid {
  display: flex;           /* isso é essencial para alinhar em linha */
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-top: 30px;
}
</style>

