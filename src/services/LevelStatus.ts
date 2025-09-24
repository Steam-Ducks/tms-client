// src/composables/useTrafficStatus.ts
import { computed, ref } from "vue"

export type Level = 1 | 2 | 3 | 4 | 5


const level = ref<Level>(5)

const statusMap: Record<Level, { text: string; color: string }> = {
  1: { text: "excelente", color: "#00A651" },
  2: { text: "bom",       color: "#FFC000" },
  3: { text: "regular",   color: "#FF7B00" },
  4: { text: "ruim",      color: "#D91532" },
  5: { text: "péssimo",   color: "#a005ff" }
}


const status = computed(() => statusMap[level.value])

export function useLevelStatus() {
  return {
    level,
    status,
    setLevel: (newLevel: Level) => (level.value = newLevel)
  }
}
