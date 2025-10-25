// views/Admin/roleScript.ts
import RoleService, { type Role, type RolePayload } from '@/services/RoleService'
import { reactive, ref, onMounted } from 'vue'
import Swal from 'sweetalert2'

export function useRoles() {
  type Mode = 'create' | 'edit'
  type RoleCard = {
    id: number | string
    name: string
    /** string pronta pra tela, pode ser "Zona Sul, Zona Leste" ou "#1, #3" */
    region?: string
  }

  const rolesList = ref<RoleCard[]>([])
  const loadingRoles = ref(false)
  const rolesError = ref<string | null>(null)
  const rawRoles = ref<any>(null)

  const showRoleForm = ref(false)
  const roleFormMode = ref<Mode>('create')
  const editingRoleId = ref<number | string | undefined>(undefined)

  const form = reactive<RolePayload>({
    description: '',
    regionIds: [],
  })

  function joinRegions(r: Role): string {
    if (r.regions && r.regions.length > 0) {
      return r.regions.map(region => region.name).join(', ')
    }
    return '—'
  }

  function mapToCard(r: Role): RoleCard {
    return {
      id: r.id,
      name: r.description,
      region: joinRegions(r),
    }
  }

  async function loadRoles() {
    try {
      loadingRoles.value = true
      rolesError.value = null
      const data = await RoleService.list()
      rawRoles.value = data
      rolesList.value = (data ?? []).map(mapToCard)
    } catch (e: unknown) {
      rolesError.value = (e as Error).message ?? 'Falha ao carregar roles.'
    } finally {
      loadingRoles.value = false
    }
  }

  function handleAddRole() {
    roleFormMode.value = 'create'
    editingRoleId.value = undefined
    form.description = ''
    form.regionIds = [] // Clear array
    showRoleForm.value = true
  }

  async function handleEditRole(card: RoleCard) {
    roleFormMode.value = 'edit'
    editingRoleId.value = card.id
    const r = await RoleService.getById(card.id)
    form.description = r.description

    form.regionIds = r.regions ? r.regions.map(region => region.id) : []

    showRoleForm.value = true
  }

  async function handleDeleteRole(card: RoleCard) {
    const result = await Swal.fire({
      title: 'Excluir role?',
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
      await RoleService.remove(card.id)
      await loadRoles()
      await Swal.fire({
        icon: 'success',
        title: 'Role removida!',
        timer: 1500,
        showConfirmButton: false,
        background: '#1e1e1e',
        color: '#fff',
      })
    } catch (e: unknown) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: (e as Error).message ?? 'Falha ao excluir role.',
        background: '#1e1e1e',
        color: '#fff',
      })
    }
  }

  async function submitRole() {
    try {
      if (!form.description?.trim()) throw new Error('Descrição é obrigatória.')
      if (!Array.isArray(form.regionIds) || form.regionIds.length === 0) {
        throw new Error('Selecione ao menos uma região.')
      }

      const payload: RolePayload = {
        description: form.description.trim(),
        regionIds: form.regionIds.map(Number),
      }

      if (roleFormMode.value === 'create') {
        const saved = await RoleService.create(payload)
        rolesList.value = [mapToCard(saved), ...rolesList.value]
        await Swal.fire({
          icon: 'success',
          title: 'Role criada!',
          timer: 1500,
          showConfirmButton: false,
          background: '#1e1e1e',
          color: '#fff',
        })
      } else {
        if (editingRoleId.value == null) throw new Error('ID não informado para edição.')

        const saved = await RoleService.update(editingRoleId.value, payload)
        const card = mapToCard(saved)
        rolesList.value = rolesList.value.map((r) => (r.id === card.id ? card : r))
        await Swal.fire({
          icon: 'success',
          title: 'Alterações salvas!',
          timer: 1500,
          showConfirmButton: false,
          background: '#1e1e1e',
          color: '#fff',
        })
      }
      showRoleForm.value = false
    } catch (e: unknown) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: (e as Error).message ?? 'Falha ao salvar role.',
        background: '#1e1e1e',
        color: '#fff',
      })
    }
  }

  onMounted(loadRoles)

  return {
    rolesList,
    loadingRoles,
    rolesError,
    rawRoles,
    showRoleForm,
    roleFormMode,
    editingRoleId,
    form,
    loadRoles,
    handleAddRole,
    handleEditRole,
    handleDeleteRole,
    submitRole,
  }
}
