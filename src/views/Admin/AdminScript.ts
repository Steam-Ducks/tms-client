// DashboardUsersScript.ts
import Card from '@/components/AdminCardComponent.vue'
import MessageControl from '@/components/MessageControlComponent.vue'
import UserComponent from '@/components/UsersComponent.vue'
import UserFormComponent from '@/components/UserFormComponent.vue'
import RolesComponent from '@/components/RolesComponent.vue'
import { useDashboard } from '../Dashboard/DashboardScript.ts'
import Modal from '@/components/ModalComponent.vue'
import UserService from '@/services/UserService'
import { reactive, ref, onMounted } from 'vue'
import Swal from 'sweetalert2'

type Mode = 'create' | 'edit'
type UserCard = { id: number | string; name: string; role?: string }

export function useAdminUsers() {
  // AGORA estamos dentro de uma função que será chamada no setup()
  const { zones, status } = useDashboard()

  const SendMessages = () => { /* TODO */ }

  const envios = [
    { destinatario: "+55 12 98877 6655", remetente: "Giuliano Bertoti", regiao: "Zona Sul", tipoAviso: "Congestionamento", dataEnvio: "19/09/2025 00:00:13", status: "Entregue", }, { destinatario: "+55 11 92111 2222", remetente: "Central", regiao: "Zona Norte", tipoAviso: "Obra", dataEnvio: "19/10/2025 01:58:15", status: "Não Entregue", }, { destinatario: "+55 12 98877 6655", remetente: "Giuliano Bertoti", regiao: "Zona Sul", tipoAviso: "Congestionamento", dataEnvio: "19/09/2025 00:00:13", status: "Entregue", }, { destinatario: "+55 11 92111 2222", remetente: "Central", regiao: "Zona Norte", tipoAviso: "Obra", dataEnvio: "19/10/2025 01:58:15", status: "Não Entregue", }, { destinatario: "+55 12 98877 6655", remetente: "Giuliano Bertoti", regiao: "Zona Sul", tipoAviso: "Congestionamento", dataEnvio: "19/09/2025 00:00:13", status: "Entregue", }, { destinatario: "+55 11 92111 2222", remetente: "Central", regiao: "Zona Norte", tipoAviso: "Obra", dataEnvio: "19/10/2025 01:58:15", status: "Não Entregue", }, { destinatario: "+55 12 98877 6655", remetente: "Giuliano Bertoti", regiao: "Zona Sul", tipoAviso: "Congestionamento", dataEnvio: "19/09/2025 00:00:13", status: "Entregue", }, { destinatario: "+55 11 92111 2222", remetente: "Central", regiao: "Zona Norte", tipoAviso: "Obra", dataEnvio: "19/10/2025 01:58:15", status: "Não Entregue", }, { destinatario: "+55 12 98877 6655", remetente: "Giuliano Bertoti", regiao: "Zona Sul", tipoAviso: "Congestionamento", dataEnvio: "19/09/2025 00:00:13", status: "Entregue", }, { destinatario: "+55 11 92111 2222", remetente: "Central", regiao: "Zona Norte", tipoAviso: "Obra", dataEnvio: "19/10/2025 01:58:15", status: "Não Entregue", }, { destinatario: "+55 12 98877 6655", remetente: "Giuliano Bertoti", regiao: "Zona Sul", tipoAviso: "Congestionamento", dataEnvio: "19/09/2025 00:00:13", status: "Entregue", }, { destinatario: "+55 11 92111 2222", remetente: "Central", regiao: "Zona Norte", tipoAviso: "Obra", dataEnvio: "19/10/2025 01:58:15", status: "Não Entregue", }, { destinatario: "+55 12 98877 6655", remetente: "Giuliano Bertoti", regiao: "Zona Sul", tipoAviso: "Congestionamento", dataEnvio: "19/09/2025 00:00:13", status: "Entregue", }, { destinatario: "+55 11 92111 2222", remetente: "Central", regiao: "Zona Norte", tipoAviso: "Obra", dataEnvio: "19/10/2025 01:58:15", status: "Não Entregue", },
  ]

  const roles = [
    { id: 1, name: 'Cargo 1', zonas: ['Zona Sudeste', 'Zona Sul'] },
    { id: 2, name: 'Cargo 2', zonas: ['Zona Norte', 'Zona Sul', 'Zona Oeste', 'Zona Lest'] },
    { id: 3, name: 'Cargo 3', zonas: ['Zona Norte', 'Zona Sul', 'Zona Sudeste', 'Zona Oeste', 'Zona Lest'] },
  ]

  const users = ref<UserCard[]>([])
  const loadingUsers = ref(false)
  const usersError = ref<string | null>(null)
  const rawUsers = ref<any>(null) // opcional: debug

  function mapToCard(u: any): UserCard {
    return {
      id: u.id,
      name: u.username ?? u.name ?? '(sem nome)',
      role: u.roleDescription ?? '—', 
    }
  }

  async function loadUsers() {
    try {
      loadingUsers.value = true
      usersError.value = null
      const data = await UserService.list()
      console.log('RAW /users ->', data)
      rawUsers.value = data
      users.value = (data ?? []).map(mapToCard)
    } catch (e: any) {
      usersError.value = e.message ?? 'Falha ao carregar usuários.'
      console.error('Erro ao listar usuários:', e)
    } finally {
      loadingUsers.value = false
    }
  }

  const showUserForm = ref(false)
  const userFormMode = ref<Mode>('create')
  const editingUserId = ref<string | number | undefined>(undefined)
  const initialUser = reactive<any>({})

  function handleAdd() {
    userFormMode.value = 'create'
    editingUserId.value = undefined
    Object.assign(initialUser, { username: '', email: '', phoneNumber: '', password: '' })
    showUserForm.value = true
  }

  function handleEdit(user: { id: string | number; name: string; role?: string }) {
    userFormMode.value = 'edit'
    editingUserId.value = user.id
    Object.assign(initialUser, {}) 
    showUserForm.value = true
  }

  async function handleDelete(user: { id: string | number }) {
    const result = await Swal.fire({
      title: 'Excluir usuário?',
      text: 'Essa ação não poderá ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      background: '#1e1e1e',
      color: '#fff',
    })

    if (!result.isConfirmed) return

    try {
      await UserService.remove(user.id)
      await loadUsers()
      await Swal.fire({
        icon: 'success',
        title: 'Usuário removido!',
        text: 'O usuário foi excluído com sucesso.',
        timer: 2000,
        showConfirmButton: false,
        background: '#1e1e1e',
        color: '#fff',
      })
    } catch (e: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: e.message ?? 'Falha ao excluir usuário.',
        confirmButtonColor: '#d33',
        background: '#1e1e1e',
        color: '#fff',
      })
    }
  }

  async function onUserFormSuccess(saved: any) {
    const hasId = saved && (saved.id ?? saved.id === 0)
    const hasName = !!(saved?.username || saved?.name)
    const hasRole = !!(saved?.roleDescription || (Array.isArray(saved?.roles) && saved.roles.length))

    if (!hasId || !hasName || !hasRole) {
      await loadUsers()
      await Swal.fire({
        icon: 'success',
        title: 'Usuário salvo!',
        text: 'Lista atualizada.',
        timer: 1600,
        showConfirmButton: false,
        background: '#1e1e1e',
        color: '#fff',
      })
      showUserForm.value = false
      return
    }

    const card = mapToCard(saved)
    if (userFormMode.value === 'create') {
      users.value = [card, ...users.value]
      await Swal.fire({
        icon: 'success',
        title: 'Usuário cadastrado!',
        timer: 1600,
        showConfirmButton: false,
        background: '#1e1e1e',
        color: '#fff',
      })
    } else {
      users.value = users.value.map(u => (u.id === card.id ? card : u))
      await Swal.fire({
        icon: 'success',
        title: 'Alterações salvas!',
        timer: 1600,
        showConfirmButton: false,
        background: '#1e1e1e',
        color: '#fff',
      })
    }

    showUserForm.value = false
  }


  onMounted(loadUsers)

  return {
    users, loadingUsers, usersError, rawUsers,
    roles, zones, status, envios,
    showUserForm, userFormMode, editingUserId, initialUser,
    handleAdd, handleEdit, handleDelete, onUserFormSuccess, SendMessages,
    Card, MessageControl, UserComponent, RolesComponent, Modal, UserFormComponent,
  }
}