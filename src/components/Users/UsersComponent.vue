<script setup lang="ts">
import { Trash2, Edit3 } from 'lucide-vue-next'
import { useUsers } from './UserComponentScript'
import Modal from '@/components/ModalComponent.vue'
import UserFormComponent from '@/components/UserFormComponent.vue'

const {
  users,
  loadingUsers,
  usersError,

  showUserForm,
  userFormMode,
  editingUserId,
  initialUser,

  handleAdd,
  handleEdit,
  handleDelete,
  onUserFormSuccess,
  closeUserForm,
} = useUsers()
</script>

<style src="./UsersComponentStyle.css" scoped></style>

<template>
  <div class="user-control">
    <div class="head">
      <h2>Usuários</h2>
      <button type="button" class="add-button" @click="handleAdd">Adicionar</button>
    </div>

    <div class="header-line"></div>

    <div class="body">
      <template v-if="loadingUsers">
        <div class="empty">Carregando usuários…</div>
      </template>

      <template v-else-if="usersError">
        <div class="empty">Erro ao carregar usuários.</div>
      </template>

      <template v-else-if="users?.length">
        <div
          v-for="user in users"
          :key="user.id"
          class="user-card"
        >
          <div class="card-info">
            <div class="user-name">{{ user.name }}</div>
            <div class="user-role">{{ user.role }}</div>
          </div>
          <div class="card-actions">
            <button
              type="button"
              class="edit-button"
              @click="handleEdit(user)"
            >
              <Edit3 class="icon" />
            </button>
            <button
              type="button"
              class="delete-button"
              @click="handleDelete(user)"
            >
              <Trash2 class="icon" />
            </button>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="empty">Nenhum usuário cadastrado.</div>
      </template>
    </div>

    <Modal v-if="showUserForm" @close="closeUserForm">
      <div class="title">
        <h3>{{ userFormMode === 'create' ? 'Cadastrar usuário' : 'Editar usuário' }}</h3>
        <hr />
      </div>
      <UserFormComponent
        :mode="userFormMode"
        :user-id="editingUserId"
        :initial-user="initialUser"
        @success="onUserFormSuccess"
        @cancel="closeUserForm"
      />
    </Modal>
  </div>
</template>
