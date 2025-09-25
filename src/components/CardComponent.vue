<script setup lang="ts">
import { statusMap, type Level } from "../services/LevelStatus"
import { computed } from "vue"

const props = defineProps<{
  level: Level
  region: string
}>()

const status = computed(() => statusMap[props.level])
</script>


<template>
  <div class="card" :style="{ background: `linear-gradient(100deg, ${status.color}, rgba(252, 176, 0, 0.05))` }">
    <div class="body">
        {{ props.level }}
    </div>
    <div class="footer">
      {{ props.region }}
    </div>
  </div>
</template>


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
