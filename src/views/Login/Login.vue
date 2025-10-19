<script lang="ts" setup>
    import { ref } from 'vue';
    import { useLogin } from './LoginScript';
    import './LoginStyle.css';

    const nome = ref('');
    const senha = ref('');

    const { erro, loginWrapper } = useLogin();

    async function onSubmit(e: Event) {
    e.preventDefault();
    await loginWrapper(nome.value, senha.value);
    }
</script>


<template>
  <div class="about">
    <h1 id="hello">Usuários</h1>

    <p>
      <label for="nome" id="labelNome">Nome: </label>
      <input id="nome" type="text" v-model="nome" />
    </p>

    <p>
      <label for="senha" id="labelSenha">Senha: </label>
      <input id="senha" type="password" v-model="senha" />
    </p>

    <button @click="onSubmit">Login</button>

    <p v-if="erro">{{ erro }}</p>
  </div>
</template>
