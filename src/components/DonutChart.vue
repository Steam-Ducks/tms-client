<script setup lang="ts">
import { computed, defineProps, watch, ref } from 'vue';

interface DonutChartProps {
  regionName: string;
  value: number;
  limit: number;
  difference: number;
}

const props = defineProps<DonutChartProps>();

// Key para forçar re-render
const chartKey = ref(0);

// Watch para detectar mudanças no value
watch(() => props.value, (newValue) => {
  chartKey.value++;
}, { deep: true });

// Raio do círculo
const radius = 45;
// Circunferência (2 * PI * R). Valor usado para o stroke-dasharray.
const circumference = 2 * Math.PI * radius;

// Calcula a porcentagem do valor atingido
const percentage = computed(() =>
  Math.min(100, Math.max(0, (props.value / props.limit) * 100))
);

// Calcula o quanto da rosca deve ser preenchido
const dashArray = computed(() => {
  const arcLength = (percentage.value / 100) * circumference;
  return `${arcLength} ${circumference}`;
});

// Define a cor da rosca com base na diferença
const progressColor = computed(() => {
  if (props.difference < 0 || props.value > props.limit * 1.1) {
    return '#E15759';
  }
  return '#FCB100';
});
</script>

<template>
  <div class="donut-card-inner" :key="chartKey">
    <h3 class="donut-title">{{ regionName }}</h3>

    <div class="donut-chart-wrapper">
      <svg class="donut-svg" viewBox="0 0 100 100">
        <circle
          class="donut-bg"
          cx="50"
          cy="50"
          :r="radius"
        />
        <circle
          class="donut-progress"
          cx="50"
          cy="50"
          :r="radius"
          :style="{
            strokeDasharray: dashArray,
            stroke: progressColor,
          }"
        />
      </svg>

      <div class="donut-label">
        {{ Math.round(percentage) }}%
      </div>
    </div>
  </div>
</template>

<style scoped>
.donut-card-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.donut-title {
  font-family: 'Figtree', sans-serif;
  font-size: 1.1em;
  font-weight: 400;
  color: #e0e0e0;
  margin-bottom: 5px;
}

.donut-chart-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
}

.donut-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.donut-bg {
  fill: none;
  stroke: #3c3c3c;
  stroke-width: 10;
}

.donut-progress {
  fill: none;
  stroke-width: 10;
  stroke-dashoffset: 0;
  transition: stroke-dasharray 0.5s linear;
  stroke-linecap: round;
}

.donut-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Figtree', sans-serif;
  font-size: 3em;
  font-weight: 700;
  color: #e0e0e0;
  text-align: center;
}
</style>
