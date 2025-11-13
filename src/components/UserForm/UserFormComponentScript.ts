// src/components/UserForm/UserFormComponentScript.ts
import { onMounted, reactive, ref, watch } from "vue";
import UserService from "@/services/UserService";
import RoleService from "@/services/RoleService";
import type { User, UserPayload } from "@/services/UserService";
import type { Role } from "@/services/RoleService";

export type Mode = "create" | "edit";

type Props = {
  mode: Mode;
  userId?: string | number;
  initialUser?: Partial<User>;
};

type EmitFn = (event: "success" | "cancel", payload?: User) => void;

export function useUserForm(props: Props, emit: EmitFn) {
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

  async function loadRoles() {
    try {
      const rolesList = await RoleService.list();
      roles.value = rolesList;
    } catch (e: unknown) {
      console.error("Falha ao carregar cargos:", e);
    }
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

      if ((merged as any).roleDescription && roles.value.length > 0) {
        const matchingRole = roles.value.find(
          (role) => role.description === (merged as any).roleDescription
        );
        form.roleId = matchingRole
          ? typeof matchingRole.id === "number"
            ? matchingRole.id
            : Number(matchingRole.id)
          : undefined;
      } else {
        (form as any).roleId = (merged as any).roleId;
      }
    } catch (e: unknown) {
      error.value = (e as Error).message || "Falha ao carregar usuário.";
    } finally {
      loading.value = false;
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

  watch(
    () => props.mode,
    async (newMode) => {
      if (newMode === "create") {
        resetForm();
      } else {
        await loadIfEdit();
      }
    }
  );

  watch(
    () => props.userId,
    async () => {
      await loadRoles();
      await loadIfEdit();
    }
  );

  watch(
    () => props.initialUser,
    async () => {
      await loadRoles();
      await loadIfEdit();
    },
    { deep: true }
  );

  watch(
    () => form.phoneNumber,
    (val) => {
      const masked = maskPhone(val);
      if (val !== masked) form.phoneNumber = masked;
    }
  );

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

  function cancel() {
    emit("cancel");
  }

  return {
    loading,
    error,
    successMsg,
    showPassword,
    roles,
    form,
    onSubmit,
    cancel,
  };
}