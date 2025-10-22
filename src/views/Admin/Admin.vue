<script lang="ts" setup>
  import { useAdminUsers } from './AdminScript.ts'
    const {
        SendMessages, envios, users, loadingUsers, usersError,
        handleAdd, handleDelete, handleEdit,
        Card, MessageControl, UserComponent, RolesComponent,
        roles, zones, status, showUserForm, Modal,
        userFormMode, editingUserId, initialUser, onUserFormSuccess,
        UserFormComponent,
        rawUsers
    } = useAdminUsers()
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
            <UserComponent
                :users="users"
                :loading="loadingUsers"
                :error="usersError"
                @add="handleAdd"
                @edit="handleEdit"
                @delete="handleDelete"
            />
            <RolesComponent :roles="roles" @add="handleAdd" @edit="handleEdit" @delete="handleDelete" />
        </div>
    </div>
    <Modal v-if="showUserForm" @close="showUserForm=false">
        <div class="title">
            <h3>
                {{ userFormMode === 'create' ? 'Cadastrar usuário' : 'Editar usuário' }}
            </h3>
        </div>
        <UserFormComponent
            :mode="userFormMode"
            :user-id="editingUserId"
            :initial-user="initialUser"
            @success="onUserFormSuccess"
            @cancel="showUserForm = false"
        />
  </Modal>
</template>