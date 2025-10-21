<script lang="ts" setup>
  import { SendMessages, envios, users, handleAdd, handleDelete, handleEdit, Card, MessageControl, UserComponent, RolesComponent, roles, zones, status } from './AdminScript.ts'
</script>
<style src="./AdminStyle.css" scoped/>

<template>
    <div class="admin-header">
        <img src="/src/logo.png" class="logo" alt="Logo Tráfegou" />
        <p>Painel do Administrador</p>
        <div @click="SendMessages" class="mesage-button">Disparar Mensagens</div>
    </div>
    <div class="card-grid">
        <Card v-for="zone in zones" :key="zone.id" :level="zone.level" :region="zone.name" :status="status.text" />
    </div>
    <div class="admin-body">
        <MessageControl :rows="envios" />
        <div class="side-cards">
            <UserComponent :users="users" @add="handleAdd" @edit="handleEdit" @delete="handleDelete" />
            <RolesComponent :roles="roles" @add="handleAdd" @edit="handleEdit" @delete="handleDelete" />
        </div>
    </div>
</template>