<script setup lang="ts">
  import { statusMap, type Level } from "../services/LevelStatus"
  import { computed } from "vue"

  const props = defineProps<{
    level: Level
    region: string
    status: string
  }>()

  const status = computed(() => statusMap[props.level])
</script>


<template>
  <div class="card" :style="{ border: `2px solid ${status.color}` }">
    <div class="level" :style="{ color: `${status.color}` }">
        {{ props.level }}
    </div>
    <div class="details">
      <div class="region">
        {{ props.region }}
      </div>
      <div class="status" :style="{ color: `${status.color}` }">
        {{ props.status }}
      </div>
    </div>
  </div>
</template>


<style scoped>
  .card {
    width: 230px;
    height: 90px;
    border-radius: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
    background-color: #1d1d1d6f;
    }

  .details{
    width: 70%;
  }

  .level{
    height: 100%;
    width: 30%;
    font-size: 50px;
    padding: 15px;
    align-items: center;
    text-align: center;
  }

  .region {
    height: 50%;
    display: flex;
    color: white;
    font-size: 22px;
    align-items: flex-end
  }

</style>
