<template>
  <div class="traffic-alerts-wrapper">

    <div class="alert-icon-wrapper">
      <button class="alert-icon" @click="emit('toggle')" v-if="!isOpen">
        <span>!</span>
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
            v-for="alert in props.alerts"
            :key="alert.id"
            class="notification-card"
            :class="alert.level"
          >
            <h4>{{ alert.region }}: {{ alert.street }}</h4>
            <p>{{ alert.statusText }}</p>
            <small>{{ alert.time }}</small>
          </div>

          <p v-if="props.alerts.length === 0">Nenhum alerta crítico no momento.</p>
        </div>
      </aside>
    </transition>

  </div>
</template>

<script setup lang="ts">
interface TrafficAlert {
  id: number | string;
  region: string;
  street: string;
  statusText: string;
  time: string;
  level: string;
}

interface Props {
  isOpen: boolean;
  alerts: TrafficAlert[];
}
const props = defineProps<Props>();
const emit = defineEmits(['toggle']);
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
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
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
}

.notification-card.excelente { border-color: #28a745; }
.notification-card.bom { border-color: #ffc107; }
.notification-card.regular { border-color: #fd7e14; }
.notification-card.ruim { border-color: #dc3545; }
.notification-card.pessimo { border-color: #7b1fa2; }

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
