<template>
  <HeaderComponent class="header-overlay" />
  <router-view />
</template>

<script setup lang="ts">
import HeaderComponent from '../components/HeaderComponent.vue'
</script>

<style>
.header-overlay {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 20px;
}
</style>
