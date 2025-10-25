<template>
  <form @submit.prevent="onSubmit" class="form">
    <div class="form-group">
      <label for="username">Nome</label>
      <input id="username" type="text" v-model.trim="form.username" placeholder="Nome" required />
    </div>

    <div class="form-group">
      <label for="email">Email</label>
      <input id="email" type="email" v-model.trim="form.email" placeholder="exemplo@email.com" required />
    </div>

    <div class="form-group">
      <label for="phoneNumber">Telefone</label>
      <input
        id="phoneNumber"
        type="text"
        v-model="form.phoneNumber"
        placeholder="(11) 98765-4321"
        maxlength="15"
      />
    </div>

    <div class="form-group">
      <label for="roleId">Cargo</label>
      <select id="roleId" v-model="form.roleId" required>
        <option :value="undefined">Selecione um cargo</option>
        <option v-for="role in roles" :key="role.id" :value="role.id">
          {{ role.description }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label for="senha">Senha</label>
        <div class="password-wrapper">
          <input
            id="senha"
            :type="showPassword ? 'text' : 'password'"
            v-model="form.password"
            :required="mode === 'create'"
            :placeholder="mode === 'edit' ? 'Deixe em branco para manter a atual' : ''"
            minlength="6"
          />

        <button type="button" class="toggle" @click="showPassword = !showPassword">
          <svg v-if="showPassword" width="18" height="18" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg" style="icon">
            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
          </svg>

          <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.29 21.29 0 0 1 5.08-6.17"/>
            <path d="M1 1l22 22"/>
            <path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5c.65 0 1.27-.18 1.79-.5"/>
            <path d="M14.47 14.47 9.53 9.53"/>
            <path d="M22.94 12.94A10.94 10.94 0 0 0 12 4a10.94 10.94 0 0 0-3.12.44"/>
          </svg>
        </button>

        </div>
    </div>

    <div class="actions">
      <button type="button" class="cancel" @click="$emit('cancel')" :disabled="loading">Cancelar</button>
      <button class="create" type="submit" :disabled="loading">
        {{ mode === 'create' ? 'Cadastrar' : 'Salvar alterações' }}
      </button>
    </div>

  </form>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref, watch } from "vue";
  import UserService from "@/services/UserService";
  import RoleService from "@/services/RoleService";
  import type { User, UserPayload } from "@/services/UserService";
  import type { Role } from "@/services/RoleService";

  type Mode = "create" | "edit";

  const props = defineProps<{
    mode: Mode;
    userId?: string | number;
    initialUser?: Partial<User>;
  }>();

  const emit = defineEmits<{
    (e: "success", user: User): void;
    (e: "cancel"): void;
  }>();

  const loading = ref(false);
  const error = ref<string | null>(null);
  const successMsg = ref<string | null>(null);
  const showPassword = ref(false);
  const roles = ref<Role[]>([]);

  const form = reactive<UserPayload>({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    roleId: undefined,
  });

  function maskPhone(raw: string | null | undefined): string {
    let v = (raw ?? "").replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);

    if (v.length > 10) {
      return v.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (v.length > 6) {
      return v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (v.length > 2) {
      return v.replace(/^(\d{2})(\d{0,5}).*/, "($1) $2");
    } else if (v.length > 0) {
      return v.replace(/^(\d*)/, "($1");
    }
    return "";
  }

  function resetForm() {
    form.username = "";
    form.email = "";
    form.phoneNumber = "";
    form.password = "";
    form.roleId = undefined;
    error.value = null;
    successMsg.value = null;
  }

  async function loadIfEdit() {
    if (props.mode !== "edit") return;

    try {
      loading.value = true;
      error.value = null;

      let fetched: Partial<User> | undefined;
      if (props.userId != null) {
        fetched = await UserService.getById(props.userId);
      }

      const merged = { ...(fetched ?? {}), ...(props.initialUser ?? {}) };

      form.username = merged.username ?? "";
      form.email = merged.email ?? "";
      form.phoneNumber = maskPhone(merged.phoneNumber ?? "");
      form.password = "";

      // Handle roleId - if we have a roleDescription, find the matching role ID
      if (merged.roleDescription && roles.value.length > 0) {
        const matchingRole = roles.value.find(role => role.description === merged.roleDescription);
        form.roleId = matchingRole ? (typeof matchingRole.id === 'number' ? matchingRole.id : Number(matchingRole.id)) : undefined;
      } else {
        form.roleId = merged.roleId;
      }
    } catch (e: unknown) {
      error.value = (e as Error).message || "Falha ao carregar usuário.";
    } finally {
      loading.value = false;
    }
  }

  async function loadRoles() {
    try {
      const rolesList = await RoleService.list();
      roles.value = rolesList;
    } catch (e: unknown) {
      console.error("Falha ao carregar cargos:", e);
    }
  }

  onMounted(async () => {
    await loadRoles();
    if (props.mode === "create") {
      resetForm();
    } else {
      await loadIfEdit();
    }
  });

  watch(() => props.mode, async (newMode) => {
    if (newMode === "create") {
      resetForm();
    } else {
      await loadIfEdit();
    }
  });

  watch(() => props.userId, async () => {
    await loadRoles();
    await loadIfEdit();
  });
  watch(() => props.initialUser, async () => {
    await loadRoles();
    await loadIfEdit();
  }, { deep: true });
  watch(() => form.phoneNumber, (val) => {
    const masked = maskPhone(val);
    if (val !== masked) form.phoneNumber = masked;
  });

  async function onSubmit() {
    try {
      loading.value = true;
      error.value = null;
      successMsg.value = null;

      if (!form.username || !form.email) {
        throw new Error("Preencha nome e email.");
      }
      if (props.mode === "create" && (!form.password || form.password.length < 6)) {
        throw new Error("Senha precisa ter ao menos 6 caracteres.");
      }
      if (!form.phoneNumber || form.phoneNumber.replace(/\D/g, "").length < 11) {
        throw new Error("Número de telefone inválido, esperado 11 dígitos.");
      }

      let saved: User;

      if (props.mode === "create") {
        const payload: UserPayload = {
          username: form.username,
          email: form.email,
          phoneNumber: form.phoneNumber.replace(/\D/g, ""),
          password: form.password,
          roleId: form.roleId,
        };
        saved = await UserService.register(payload);
        successMsg.value = "Usuário cadastrado com sucesso!";
      } else {
        if (!props.userId) throw new Error("userId não informado para edição.");
        const payload: UserPayload = {
          username: form.username,
          email: form.email,
          phoneNumber: form.phoneNumber.replace(/\D/g, ""),
          roleId: form.roleId,
        };
        if (form.password && form.password.length >= 6) {
          payload.password = form.password;
        }
        saved = await UserService.update(props.userId, payload);
        successMsg.value = "Usuário atualizado com sucesso!";
      }

      emit("success", saved);
    } catch (e: unknown) {
      error.value = (e as Error).message || "Erro ao salvar.";
    } finally {
      loading.value = false;
    }
  }
</script>

<style scoped>
  .form {
    align-items: center;
    justify-content: center;
    margin: 15px;
  }
  .form-group{
    margin-top: 10px;
    width: 100%;
    box-sizing: border-box;
  }
  label {
    display: inline-block;
    min-width: 88px;
    font-size: 13px;
    padding-bottom: 5px;
  }
  input, select {
    width: 100%;
    padding: 8px;
    background-color: #ffffff19;
    border: 1px solid #cccccc00;
    border-radius: 6px;
    color: white;
    box-sizing: border-box;
  }

  select {
    cursor: pointer;
  }

  select option {
    background-color: #2c3e50;
    color: white;
  }
  .password-wrapper {
    display: flex;
  }
  .password-wrapper input{
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }
  .toggle {
    background-color: #ffffff2f;
    border: 1px solid transparent;
    width: 15%;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.1s ease;
  }

  .toggle:hover {
    background-color: #ffffff3f;
  }

  .toggle:active {
    transform: scale(0.96);
  }

  .toggle svg {
    display: block;
    width: 18px;
    height: 18px;
    transform: translateY(1px);
  }
  .actions {
    display: flex;
    gap: 5%;
    align-items: center;
    justify-content: center;
    margin-top: 12%;
  }
  button {
    width: 30%;
    padding: 8px 14px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
  }
  .error {
    color: #b30000;
  }
  .success {
    color: #0a7a2f;
  }
  .return {
    text-align: center;
    width: 100%;
    padding: 5px;
  }
  .create {
    background-color: #0a7a2f;
    color: #0a7a2f;
    color: azure;
  }
  .cancel {
    background-color: #ffffff07;
    color: rgba(255, 255, 255, 0.822);
    border: 1px solid rgba(255, 255, 255, 0.307);;
  }
</style>
