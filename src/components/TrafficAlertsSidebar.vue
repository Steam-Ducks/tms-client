<template>
  <div class="traffic-alerts-wrapper">

    <div class="alert-icon-wrapper">
      <button class="alert-icon" @click="emit('toggle')" v-if="!isOpen">
        <span style="font-size: 200%;">!</span>
      </button>
    </div>

    <transition name="slide-fade">
      <aside class="sidebar" v-if="isOpen">
        <div class="sidebar-header">
          <h3>Alertas de Tráfego:</h3>
          <button class="close-btn" @click="emit('toggle')">×</button>
        </div>

        <div class="sidebar-content">
          <div
            v-for="alert in formattedAlerts"
            :key="alert.id"
            class="notification-card"
            :class="alert.level"
          >
            <h4>{{ alert.region }}: {{ alert.street }}</h4>
            <p>{{ alert.statusText }}</p>
            <small>{{ alert.time }}</small>
          </div>

          <p v-if="formattedAlerts.length === 0 && !loading">
            Nenhum alerta crítico no momento.
          </p>

          <p v-if="loading">Carregando alertas...</p>
          <p v-if="error" class="error-message">{{ error }}</p>
        </div>
      </aside>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';

interface WorstStreetByRegionDTO {
  regionId: string;
  regionName: string;
  regionLevel: number;
  streetId: string;
  streetAddress: string;
  avgSpeed: number;
  speedLimit: number;
  severity: number;
}

interface TrafficAlert {
  id: string;
  region: string;
  street: string;
  statusText: string;
  time: string;
  level: string;
}

interface Props {
  isOpen: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(['toggle']);

// Estados reativos
const worstStreets = ref<WorstStreetByRegionDTO[]>([]);
const loading = ref(false);
const error = ref('');

// Função para buscar dados da API
const fetchWorstStreets = async () => {
  loading.value = true;
  error.value = '';

  try {
    const response = await fetch('http://localhost:8080/api/streets/worst');

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    worstStreets.value = data;
  } catch (err) {
    console.error('Erro ao buscar alertas:', err);
    error.value = 'Erro ao carregar alertas de tráfego';
  } finally {
    loading.value = false;
  }
};

// Função para determinar o nível baseado na severidade
const getSeverityLevel = (severity: number): string => {
  if (severity >= 50) return 'pessimo';
  if (severity >= 35) return 'ruim';
  if (severity >= 20) return 'regular';
  if (severity >= 10) return 'bom';
  return 'excelente';
};

// Função para gerar texto de status baseado na severidade
const getStatusText = (severity: number, avgSpeed: number, speedLimit: number): string => {
  if (severity >= 50) return 'Tráfego Parado';
  if (severity >= 35) return 'Tráfego Muito Lento';
  if (severity >= 20) return 'Tráfego Lento';
  if (severity >= 10) return 'Tráfego ';
  return 'Tráfego Fluindo ';
};

// Função para formatar o endereço (remover informações desnecessárias)
const formatStreetAddress = (address: string): string => {
  // Remove a cidade e estado do final
  return address.split(',')[0].trim();
};

// Computed property para formatar os dados da API
const formattedAlerts = computed((): TrafficAlert[] => {
  return worstStreets.value.map(street => ({
    id: street.streetId,
    region: street.regionName,
    street: formatStreetAddress(street.streetAddress),
    statusText: getStatusText(street.severity, street.avgSpeed, street.speedLimit),
    time: `Velocidade: ${street.avgSpeed.toFixed(1)}km/h (Limite: ${street.speedLimit}km/h)`,
    level: getSeverityLevel(street.severity)
  }));
});

// Buscar dados quando o componente for montado
onMounted(() => {
  fetchWorstStreets();
});

// Opcional: buscar dados automaticamente a cada X tempo
// setInterval(fetchWorstStreets, 30000); // Atualizar a cada 30 segundos
</script>

<style scoped>
.alert-icon-wrapper {
  position: absolute;
  top: 35px;
  right: 15px;
  z-index: 25;
}

.alert-icon {
  background-color: #ffcc00;
  color: #333;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
  position: relative;
  padding: 0;
}

.exclamation {
  font-weight: bold;
  font-size: 50px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100%;
  margin: 0;
  padding: 0;
  margin-top: -2px;
}

.sidebar {
  position: absolute;
  top: 100px;
  bottom: 80px;
  right: 15px;
  width: 300px;
  background-color: #2a2a2a;
  color: #ccc;
  box-shadow: -6px 0 15px rgba(0, 0, 0, 0.6);
  z-index: 20;
  overflow-y: auto;
  border-radius: 12px;
}

/* Scrollbar preto e arredondado */
.sidebar::-webkit-scrollbar {
  width: 10px;
}

.sidebar::-webkit-scrollbar-track {
  background: #1e1e1e;
  border-radius: 12px;
}

.sidebar::-webkit-scrollbar-thumb {
  background-color: #444;
  border-radius: 12px;
  border: 2px solid #1e1e1e;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background-color: #666;
}

/* Firefox */
.sidebar {
  scrollbar-width: thin;
  scrollbar-color: #444 #1e1e1e;
  border-radius: 12px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #383838;
  position: sticky;
  top: 0;
  z-index: 1;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 30px;
  cursor: pointer;
  line-height: 1;
  padding: 0;
}

.sidebar-content {
  padding: 10px 15px;
}

.notification-card {
  background-color: #333;
  padding: 10px;
  margin-bottom: 10px;
  border-left: 5px solid transparent;
  border-radius: 6px;
  color: #fff;
  transition: all 0.3s ease;
}

.notification-card:hover {
  background-color: #444;
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.notification-card.excelente { border-color: #28a745; }
.notification-card.bom { border-color: #ffc107; }
.notification-card.regular { border-color: #fd7e14; }
.notification-card.ruim { border-color: #dc3545; }
.notification-card.pessimo { border-color: #7b1fa2; }

.error-message {
  color: #dc3545;
  text-align: center;
  padding: 10px;
}

/* Transições */
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.4s ease-out;
}
</style>
