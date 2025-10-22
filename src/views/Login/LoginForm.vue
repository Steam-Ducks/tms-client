<script lang="ts" setup>
  import { useLogin } from './LoginScript';
  const { nome, senha, onSubmit } = useLogin();
</script>

<style scoped src="./LoginStyle.css"></style>

<template>
  <div class="login-page">
    <div class="about">
      <img src="/src/trafegou.png" alt="Logo" class="logo-top" />

      <p>
        <label for="nome" id="labelNome">Nome: </label>
        <input id="nome" type="text" v-model="nome" />
      </p>

      <p>
        <label for="senha" id="labelSenha">Senha: </label>
        <input id="senha" type="password" v-model="senha" />
      </p>

      <button @click="onSubmit">Login</button>

      <p class="support-text">
        Problemas de acesso? Contate o <br>administrador
      </p>

      <div class="logos">
        <img src="/src/prefeitura.png" alt="Prefeitura" class="logo-left" />
        <img src="/src/sd.png" alt="Steam Ducks" class="logo-right" />
      </div>
    </div>
  </div>
</template>
