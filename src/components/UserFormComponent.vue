<template>
  <form @submit.prevent="onSubmit" class="form">
    <p>
      <label for="username">Nome:</label>
      <input id="username" type="text" v-model.trim="form.username" required />
    </p>

    <p>
      <label for="email">Email:</label>
      <input id="email" type="email" v-model.trim="form.email" required />
    </p>

    <p>
      <label for="phoneNumber">Telefone:</label>
      <input
        id="phoneNumber"
        type="text"
        v-model="form.phoneNumber"
        placeholder="(11) 98765-4321"
        maxlength="15"
      />
    </p>

    <div class="password-field">
      <label for="senha">Senha:</label>
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
          {{ showPassword ? '🙈' : '👁️' }}
        </button>
      </div>
    </div>

    <div class="actions">
      <button class="create" type="submit" :disabled="loading">
        {{ mode === 'create' ? 'Cadastrar' : 'Salvar alterações' }}
      </button>
      <button type="button" class="cancel" @click="$emit('cancel')" :disabled="loading">Cancelar</button>
    </div>

    <div class="return">
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="successMsg" class="success">{{ successMsg }}</p>
    </div>
  </form>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref, watch } from "vue";
  import UserService from "@/services/UserService";
  import type { User, UserPayload } from "@/services/UserService";

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

  const form = reactive<UserPayload>({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
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


  function applyPhoneMask(e: Event) {
    const input = e.target as HTMLInputElement;
    const masked = maskPhone(input.value);
    input.value = masked;
    form.phoneNumber = masked;
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
    } catch (e: any) {
      error.value = e.message || "Falha ao carregar usuário.";
    } finally {
      loading.value = false;
    }
  }

  onMounted(loadIfEdit);
  watch(() => props.userId, loadIfEdit);
  watch(() => props.initialUser, loadIfEdit, { deep: true });
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
        };
        saved = await UserService.register(payload);
        successMsg.value = "Usuário cadastrado com sucesso!";
      } else {
        if (!props.userId) throw new Error("userId não informado para edição.");
        const payload: UserPayload = {
          username: form.username,
          email: form.email,
          phoneNumber: form.phoneNumber.replace(/\D/g, ""),
        };
        if (form.password && form.password.length >= 6) {
          payload.password = form.password;
        }
        saved = await UserService.update(props.userId, payload);
        successMsg.value = "Usuário atualizado com sucesso!";
      }

      emit("success", saved);
    } catch (e: any) {
      error.value = e.message || "Erro ao salvar.";
    } finally {
      loading.value = false;
    }
  }
</script>

<style scoped>
  .form {
    max-width: 100%;
    display: grid;
    gap: 12px;
    padding: 10px;
    align-items: center;
    justify-content: center;
  }
  label {
    display: inline-block;
    min-width: 88px;
  }
  input {
    width: 500px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
  .password-wrapper {
    position: relative;
    display: inline-block;
  }
  .password-wrapper input {
    width: 500px;
  }
  .password-wrapper .toggle {
    position: absolute;
    right: 5px;
    top: 50%; 
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
  }
  .actions {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
  }
  button {
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
    color: azure;
  }
  .cancel {
    background-color: #b30000;
    color: azure;
  }
</style>