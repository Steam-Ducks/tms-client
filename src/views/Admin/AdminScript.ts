// views/Admin/AdminScript.ts
import { useDashboard } from '../Dashboard/DashboardScript'
import { useRoles } from './RoleScript'
export { default as Card } from '@/components/AdminCardComponent.vue'
export { default as MessageControl } from '@/components/MessageControlComponent.vue'
export { default as UserComponent } from '@/components/Users/UsersComponent.vue'
export { default as RolesComponent } from '@/components/RolesComponent.vue'
export { default as UserFormComponent } from '@/components/UserFormComponent.vue'
export { default as RoleFormComponent } from '@/components/RoleFormComponent.vue'
export { default as Modal } from '@/components/ModalComponent.vue'

// ÚNICO ponto de entrada para o painel
export function useAdmin() {

  // Roles
  const {
    rolesList, loadingRoles, rolesError,
    showRoleForm, roleFormMode, editingRoleId, form,
    handleAddRole, handleEditRole, handleDeleteRole, submitRole,
  } = useRoles()

  // Dashboard
  const { zones, status } = useDashboard()

  const SendMessages = () => {
    console.log('Disparando mensagens…')
  }

  const envios = [
  { destinatario: "+55 12 98877 6655", regiao: "Zona Sul", dataEnvio: "19/09/2025 00:00:13", status: "Resolvido" },
  { destinatario: "+55 11 92111 2222", regiao: "Zona Norte", dataEnvio: "19/10/2025 01:58:15", status: "Não Resolvido" },

  { destinatario: "+55 12 98877 6655", regiao: "Zona Sul", dataEnvio: "19/09/2025 00:00:13", status: "Resolvido" },
  { destinatario: "+55 11 92111 2222", regiao: "Zona Norte", dataEnvio: "19/10/2025 01:58:15", status: "Não Resolvido" },

  { destinatario: "+55 12 98877 6655", regiao: "Zona Sul", dataEnvio: "19/09/2025 00:00:13", status: "Resolvido" },
  { destinatario: "+55 11 92111 2222", regiao: "Zona Norte", dataEnvio: "19/10/2025 01:58:15", status: "Não Resolvido" },

  { destinatario: "+55 11 92111 2222", regiao: "Zona Norte", dataEnvio: "19/10/2025 01:58:15", status: "Não Resolvido" },
  { destinatario: "+55 12 98877 6655", regiao: "Zona Sul", dataEnvio: "19/09/2025 00:00:13", status: "Resolvido" },

  { destinatario: "+55 11 92111 2222", regiao: "Zona Norte", dataEnvio: "19/10/2025 01:58:15", status: "Não Resolvido" },
  { destinatario: "+55 11 92111 2222", regiao: "Zona Norte", dataEnvio: "19/10/2025 01:58:15", status: "Não Resolvido" },

  { destinatario: "+55 12 98877 6655", regiao: "Zona Sul", dataEnvio: "19/09/2025 00:00:13", status: "Resolvido" },
  { destinatario: "+55 11 92111 2222", regiao: "Zona Norte", dataEnvio: "19/10/2025 01:58:15", status: "Não Resolvido" },

  { destinatario: "+55 11 92111 2222", regiao: "Zona Norte", dataEnvio: "19/10/2025 01:58:15", status: "Não Resolvido" },
  { destinatario: "+55 12 98877 6655", regiao: "Zona Sul", dataEnvio: "19/09/2025 00:00:13", status: "Resolvido" },

  { destinatario: "+55 11 92111 2222", regiao: "Zona Norte", dataEnvio: "19/10/2025 01:58:15", status: "Não Resolvido" },
  { destinatario: "+55 11 92111 2222", regiao: "Zona Norte", dataEnvio: "19/10/2025 01:58:15", status: "Não Resolvido" },

  { destinatario: "+55 12 98877 6655", regiao: "Zona Sul", dataEnvio: "19/09/2025 00:00:13", status: "Resolvido" },
  { destinatario: "+55 11 92111 2222", regiao: "Zona Norte", dataEnvio: "19/10/2025 01:58:15", status: "Não Resolvido" },
];


  return {
    rolesList, loadingRoles, rolesError,
    showRoleForm, roleFormMode, editingRoleId, form,
    handleAddRole, handleEditRole, handleDeleteRole, submitRole,
    zones, status, envios, SendMessages,
  }
}
