<script lang="ts" setup>
import {
  useAdmin,
  Card, MessageControl, UserComponent, RolesComponent,
  Modal, UserFormComponent, RoleFormComponent,
} from './AdminScript'

const {
  users, loadingUsers, usersError,
  showUserForm, userFormMode, editingUserId, initialUser,
  handleAdd, handleEdit, handleDelete, onUserFormSuccess,

  rolesList, loadingRoles, rolesError,
  showRoleForm, roleFormMode, editingRoleId, form,
  handleAddRole, handleEditRole, handleDeleteRole, submitRole,

  zones, status, envios, SendMessages,
} = useAdmin()
</script>

<style src="./AdminStyle.css" scoped></style>

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

      <RolesComponent
        :roles="rolesList"
        :loading="loadingRoles"
        :error="rolesError"
        @add="handleAddRole"
        @edit="handleEditRole"
        @delete="handleDeleteRole"
      />
    </div>
  </div>

  <Modal v-if="showUserForm" @close="showUserForm = false">
    <div class="title">
      <h3>{{ userFormMode === 'create' ? 'Cadastrar usuário' : 'Editar usuário' }}</h3>
      <hr/>
    </div>
    <UserFormComponent
      :mode="userFormMode"
      :user-id="editingUserId"
      :initial-user="initialUser"
      @success="onUserFormSuccess"
      @cancel="showUserForm = false"
    />
  </Modal>

  <Modal v-if="showRoleForm" @close="showRoleForm = false">
    <div class="title">
      <h3>{{ roleFormMode === 'create' ? 'Criar role' : 'Editar role' }}</h3>
      <hr/>
    </div>
    <RoleFormComponent :form="form" @submit="submitRole" @cancel="showRoleForm = false" />
  </Modal>
</template>
