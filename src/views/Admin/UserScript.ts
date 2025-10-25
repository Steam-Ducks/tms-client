import UserService from '@/services/UserService'
import { reactive, ref, onMounted } from 'vue'
import Swal from 'sweetalert2'

export function useUsers() {
  type Mode = 'create' | 'edit'
  type UserCard = { id: number | string; name: string; role?: string }

  const users = ref<UserCard[]>([])
  const loadingUsers = ref(false)
  const usersError = ref<string | null>(null)
  const rawUsers = ref<any>(null)

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
    Object.keys(initialUser).forEach(key => {
      delete initialUser[key]
    })
    Object.assign(initialUser, { username: '', email: '', phoneNumber: '', password: '', roleId: undefined })
    showUserForm.value = true
  }
  function handleEdit(user: { id: string | number; name: string; role?: string }) {
    userFormMode.value = 'edit'
    editingUserId.value = user.id
    Object.keys(initialUser).forEach(key => {
      delete initialUser[key]
    })
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
        timer: 1600,
        showConfirmButton: false,
        background: '#1e1e1e',
        color: '#fff',
      })
    } catch (e: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: e.message ?? 'Falha ao excluir usuário.',
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
      await Swal.fire({ icon:'success', title:'Usuário cadastrado!', timer:1600, showConfirmButton:false, background:'#1e1e1e', color:'#fff' })
    } else {
      users.value = users.value.map(u => (u.id === card.id ? card : u))
      await Swal.fire({ icon:'success', title:'Alterações salvas!', timer:1600, showConfirmButton:false, background:'#1e1e1e', color:'#fff' })
    }
    showUserForm.value = false
  }

  onMounted(loadUsers)

  return {
    users, loadingUsers, usersError, rawUsers,
    showUserForm, userFormMode, editingUserId, initialUser,
    handleAdd, handleEdit, handleDelete, onUserFormSuccess,
  }
}
