import { storeToRefs } from 'pinia';
import { useUsuarioStore } from '@/stores/usuario';

export function useLogin() {
  const store = useUsuarioStore();
  const { erro, token, nomeUsuario } = storeToRefs(store);

  async function loginWrapper(nome: string, senha: string) {
    await store.login(nome, senha); 
  }

  return { erro, token, nomeUsuario, loginWrapper };
}
