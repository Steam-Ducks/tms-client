import { ref } from "vue";
import { defineStore } from "pinia";
import LoginService from "@/services/LoginService";

export const useUsuarioStore = defineStore(
  "usuario",
  () => {
    const nomeUsuario = ref<string | null>(null);
    const token = ref<string | null>(null);
    const tokenType = ref<string>("Bearer");
    const erro = ref<string | null>(null);

    async function login(nome: string, senha: string) {
      try {
        erro.value = null;
        const { accessToken, tokenType: tt } = await LoginService.login(nome, senha);
        nomeUsuario.value = nome;
        token.value = accessToken;
        tokenType.value = tt ?? "Bearer";

        LoginService.setAuthHeader(tokenType.value, token.value);
      } catch (ex: any) {
        erro.value =
          ex?.response?.data?.message ??
          ex?.message ??
          "Falha ao fazer login.";
        nomeUsuario.value = null;
        token.value = null;
        LoginService.clearAuthHeader();
      }
    }

    function logout() {
      nomeUsuario.value = null;
      token.value = null;
      erro.value = null;
      LoginService.clearAuthHeader();
    }

    function hydrateAuthHeader() {
      if (token.value) {
        LoginService.setAuthHeader(tokenType.value, token.value);
      }
    }

    return { nomeUsuario, token, tokenType, erro, login, logout, hydrateAuthHeader };
  },
  ({
    persist: {
      paths: ["nomeUsuario", "token", "tokenType"],
    },
  } as any)
);
