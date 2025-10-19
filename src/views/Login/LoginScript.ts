import { ref } from 'vue';
import { usuarioStore } from '@/stores/usuario';
import { useRouter } from 'vue-router';

export function useLogin() {  
  const nome = ref('');
  const senha = ref('');
  const store = usuarioStore();
  const router = useRouter();                     

  async function loginWrapper(nome: string, senha: string) {
    await store.login(nome, senha); 
  }

  async function onSubmit(e: Event) {
    e.preventDefault();
    await store.login(nome.value, senha.value);
    if (store.token) {
      router.push('/admin'); 
    }
  }

  return {nome, senha, loginWrapper, onSubmit};
}
