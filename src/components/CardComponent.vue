<script setup lang="ts">
import { statusMap, type Level } from "../services/LevelStatus"
import { computed, ref } from "vue"

const props = defineProps<{
  level: Level
  region: string
}>()

const emit = defineEmits<{
  expand: [region: string]
}>()

const isExpanded = ref(false)
const isLoading = ref(false)
const regionIndicators = ref<any[]>([])

const status = computed(() => statusMap[props.level])

// Função para normalizar o nome da região conforme o backend
const getBackendRegionName = (frontendName: string) => {
  // Mapeamento dos nomes do frontend para o backend
  const regionMapping: Record<string, string> = {
    'Zona Sul': 'Zona SUL',
    'Zona Norte': 'Zona NORTE',
    'Zona Leste': 'Zona LESTE',
    'Zona Oeste': 'Zona OESTE',
    'Zona Sudeste': 'Zona SUDESTE',
    'Zona Central': 'CENTRO'
  }

  return regionMapping[frontendName] || frontendName.toUpperCase()
}

// Buscar indicadores da região
const fetchRegionIndicators = async () => {
  console.log('📱 Clicou no card:', props.region)

  if (isExpanded.value) {
    console.log('🔽 Recolhendo card:', props.region)
    isExpanded.value = false
    return
  }

  try {
    isLoading.value = true

    const backendRegionName = getBackendRegionName(props.region)

    const url = `http://localhost:8080/indicators/region/${encodeURIComponent(backendRegionName)}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('📊 Dados recebidos:', data)

    regionIndicators.value = data.indicators || []

    isExpanded.value = true
    emit('expand', props.region)
  } catch (error) {
    console.error('❌ Erro ao buscar indicadores:', error)
    regionIndicators.value = []
  } finally {
    isLoading.value = false
  }
}

// Formatar mudança
const formatChange = (change: string) => {
  const icons = {
    'MELHOROU': '📈',
    'PIOROU': '📉',
    'MANTEVE': '➡️'
  }
  return `${icons[change] || ''} ${change}`
}

// Traduzir nomes dos indicadores
const translateIndicatorName = (name: string): string => {
  const translations: Record<string, string> = {
    'Average Speed': 'Velocidade Média',
    'Compliance Rate': 'Taxa de Conformidade',
    'Traffic Density': 'Densidade de Tráfego',
    'Weather': 'Clima'
  }
  return translations[name] || name
}
</script>

<template>
  <div class="card-container">
    <div
      class="card"
      :style="{ background: `linear-gradient(100deg, ${status.color}, rgba(252, 176, 0, 0.05))` }"
      @click="fetchRegionIndicators"
    >
      <div class="body">
        {{ props.level }}
      </div>
      <div class="footer">
        {{ props.region }}
      </div>
    </div>

    <!-- Conteúdo Expandido - aparece embaixo do card -->
    <div v-if="isExpanded" class="expanded-content">
      <div v-if="isLoading" class="loading">
        🔄 Carregando indicadores...
      </div>

      <div v-else-if="regionIndicators.length === 0" class="no-data">
        📭 Nenhum indicador encontrado para {{ props.region }}
      </div>

      <div v-else class="indicators-list">
        <div
          v-for="indicator in regionIndicators"
          :key="indicator.indicatorName"
          class="indicator-item"
        >
          <div class="indicator-header">
            <span class="indicator-name">{{ translateIndicatorName(indicator.indicatorName) }}</span>
            <span class="indicator-level">Nível {{ indicator.level }}</span>
          </div>
          <div class="indicator-details">
            <span class="indicator-value">Valor: {{ indicator.value }}</span>
            <span
              class="indicator-change"
              :class="{
                'improved': indicator.change === 'MELHOROU',
                'worsened': indicator.change === 'PIOROU',
                'stable': indicator.change === 'MANTEVE'
              }"
            >
              {{ formatChange(indicator.change) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* ... (o CSS permanece igual) ... */
.card-container {
  margin-bottom: 10px;
}

.card {
  width: 170px;
  height: 170px;
  border-radius: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.card:hover {
  transform: scale(1.05);
}

.body{
  height: 136px;
  width: 100%;
  font-size: 90px;
  padding-top: 20px;
  align-items: center;
  text-align: center;
  display: flex;
  justify-content: center;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.footer {
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.7);
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.expanded-content {
  margin-top: 10px;
  background: #1a1a1a;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  animation: slideDown 0.3s ease-out;
  border: 1px solid #333;
  width: 170px;
  color: white;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loading {
  text-align: center;
  padding: 10px;
  color: white;
}

.no-data {
  text-align: center;
  padding: 10px;
  color: #cccccc;
  font-style: italic;
  font-size: 12px;
}

.indicators-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.indicator-item {
  background: #2d2d2d;
  padding: 10px;
  border-radius: 6px;
  border-left: 3px solid #3498db;
  color: white;
}

.indicator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.indicator-name {
  font-weight: 600;
  color: white;
  font-size: 12px;
}

.indicator-level {
  background: #3498db;
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
}

.indicator-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
}

.indicator-value {
  color: #cccccc;
}

.indicator-change {
  font-weight: 600;
  font-size: 9px;
}

.indicator-change.improved {
  color: #2ecc71;
}

.indicator-change.worsened {
  color: #e74c3c;
}

.indicator-change.stable {
  color: #f39c12;
}
</style>
