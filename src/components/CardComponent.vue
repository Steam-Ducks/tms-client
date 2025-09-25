<template>
  <div class="card" :style="{background: `linear-gradient(120deg, ${props.bgColor}70, rgba(252, 176, 0, 0.0005))`}">
    <div class="body">
        {{ level }}
    </div>
    <div class="footer">
      {{ region }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Level } from '@/services/LevelStatus';
// props → valores oferecidos pelo dashboard
const props = defineProps<{
  level: Level
  region: string
  bgColor: string
}>()
</script>

<style>
  .card {
    width: 170px;
    height: 170px;
    border-radius: 16px;
    font-weight: bold;
    }

  .body{
    height: 136px;
    width: 100%;
    font-size: 90px;
    padding-top: 20px;
    align-items: center;
    text-align: center;
  }

</style>
