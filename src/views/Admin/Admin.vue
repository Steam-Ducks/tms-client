<script lang="ts" setup>
  import Card from '@/components/AdminCardComponent.vue'
  import MessageControl from '@/components/MessageControlComponent.vue'
  import UserComponent from '@/components/UsersComponent.vue'
  import { useDashboard } from '../Dashboard/DashboardScript.ts'
  import { linhas } from './AdminScript.ts'
  const { zones, status } = useDashboard()
</script>

<style src="./AdminStyle.css" scoped/>

<template>
    <div class="admin-header">
        <img src="/src/logo.png" class="logo" alt="Logo Tráfegou" />
        <p>Painel do Administrador</p>
        <div @click="SendMessages" class="mesage-button">Disparar Mensagens</div>
    </div>
    <div class="card-grid">
        <Card
          v-for="zone in zones"
          :key="zone.id"
          :level="zone.level"
          :region="zone.name"
          :status="status.text"
        />
    </div>
    <div class="admin-body">
        <MessageControl :rows="linhas" />
        <div style="width:30%;">
            <UserComponent />
        </div>
    </div>
</template>