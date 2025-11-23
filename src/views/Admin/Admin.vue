<script lang="ts" setup>
import {
  useAdmin,
  Card, MessageControl, UserComponent, RolesComponent,
  Modal, UserFormComponent, RoleFormComponent,
} from './AdminScript'
import MyTelegramCode from '../../components/MyTelegramCodeComponent.vue'
import { onMounted } from 'vue'

const {
  users, loadingUsers, usersError,
  showUserForm, userFormMode, editingUserId, initialUser,
  handleAdd, handleEdit, handleDelete, onUserFormSuccess,

  rolesList, loadingRoles, rolesError,
  showRoleForm, roleFormMode, editingRoleId, form,
  handleAddRole, handleEditRole, handleDeleteRole, submitRole,

  zones, envios, SendMessages, handleResolveAlert,
} = useAdmin()

import { useRouter } from "vue-router";
import { usuarioStore } from "@/stores/usuario";

const router = useRouter();
const store = usuarioStore();

// Map zone level to status text
const statusMap: Record<number, string> = {
  1: "excelente",
  2: "bom",
  3: "regular",
  4: "ruim",
  5: "péssimo"
}

function getZoneStatus(level: number): string {
  return statusMap[level] || "regular"
}

const homepage = () => {
    router.push("/");
};

const logout = () => {
    store.logout();
    router.push("/login");
  };

// Logs de debug
onMounted(() => {
  console.log('🎯 Admin.vue montado');
  console.log('📊 Dados carregados:');
  console.log('  - Zones:', zones?.length || 0);
  console.log('  - Users:', users?.length || 0);
  console.log('  - Roles:', rolesList?.length || 0);
  console.log('  - Envios:', envios?.length || 0);
  console.log('🔗 MyTelegramCode component importado:', !!MyTelegramCode);
});

// Log quando os dados são atualizados
console.log('🔄 Admin.vue - dados atualizados:', {
  zonesCount: zones?.length,
  usersCount: users?.length,
  rolesCount: rolesList?.length,
  enviosCount: envios?.length
});
</script>

<style src="./AdminStyle.css" scoped></style>

<template>
  <div class="admin-header">
    <img src="/src/logo.png" class="logo" alt="Logo Tráfegou" @click="homepage"/>
    <p>Painel do Administrador</p>

    <!-- Botões de navegação -->
    <div class="admin-header-buttons">
      <button @click="homepage" class="btn">Portal</button>
      <button @click="logout" class="btn btn-logout">Logout</button>
    </div>
  </div>

  <div class="card-grid">
    <Card
      v-for="zone in zones"
      :key="zone.id"
      :level="zone.level"
      :region="zone.name"
      :status="getZoneStatus(zone.level)"
    />
  </div>

  <div class="admin-body">
    <MessageControl :rows="envios" @resolve="handleResolveAlert" />

    <div class="side-cards">
      <MyTelegramCode />
      <UserComponent />
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

  <!-- Modals continuam iguais -->
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
      <h3>{{ roleFormMode === 'create' ? 'Criar cargo' : 'Editar cargo' }}</h3>
      <hr/>
    </div>
    <RoleFormComponent :form="form" @submit="submitRole" @cancel="showRoleForm = false" />
  </Modal>
</template>
<style scoped>


.admin-header-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.4rem 0.8rem;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  
}

.btn-logout {
  background-color: #dc3545;
}

.btn:hover {
  opacity: 0.9;
}
</style>
