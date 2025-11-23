// views/Admin/AdminScript.ts
import { ref, onMounted } from 'vue'
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

  const envios = ref<Array<{
    id: number;
    status: boolean;
    ocorrencia: string;
    location: string;
    date: string;
    destinatario: string;
  }>>([])

  const loadingEnvios = ref(false)
  const enviosError = ref<string | null>(null)

  const fetchEnvios = async () => {
    loadingEnvios.value = true
    enviosError.value = null
    try {
      const response = await fetch('http://localhost:8080/api/alerts')
      if (!response.ok) {
        throw new Error('Failed to fetch alerts')
      }
      const data = await response.json()
      envios.value = data
    } catch (error) {
      console.error('Error fetching alerts:', error)
      enviosError.value = 'Erro ao carregar alertas'
    } finally {
      loadingEnvios.value = false
    }
  }

  // Fetch on mount
  onMounted(() => {
    fetchEnvios()
  })

  const handleResolveAlert = async (messageId: number, occurrenceType: string) => {
    try {
      const response = await fetch('http://localhost:8080/api/alerts/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId,
          occurrenceType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to resolve alert');
      }

      console.log(`Alert ${messageId} resolved with occurrence type: ${occurrenceType}`);

      // Refresh the list after successful resolution
      await fetchEnvios();
    } catch (error) {
      console.error('Error resolving alert:', error);
      alert('Erro ao resolver o alerta. Tente novamente.');
    }
  };


  return {
    rolesList, loadingRoles, rolesError,
    showRoleForm, roleFormMode, editingRoleId, form,
    handleAddRole, handleEditRole, handleDeleteRole, submitRole,
    zones, status, envios, loadingEnvios, enviosError, fetchEnvios, SendMessages, handleResolveAlert,
  }
}
