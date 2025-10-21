<script lang="ts" setup>
  import { useLogin } from './LoginScript';
  const { nome, senha, onSubmit } = useLogin();
</script>
<style src="./LoginStyle.css" />

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

  </div>
</template>
