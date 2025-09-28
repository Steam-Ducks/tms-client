<template>
  <header class="header">
    <div class="left-section"></div>

    <div class="center-section">
      <img src="/src/logo.png" class="logo" alt="Logo Tráfegou" />
    </div>

    <div class="right-section" @click="goToLogin">
      <img :src="loginIcon" class="login-icon" alt="Ícone de Login" />
      <span class="login-text">Login</span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import loginIcon from "../login-icon.png";

const router = useRouter();

const goToLogin = () => {
  router.push("/login"); // login teste
};
</script>

<style scoped>
.header {

  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px auto;
  width: 90%;
  max-width: 1200px;
  height: 60px;
  padding: 0 32px;
  border-radius: 32px;
  background: rgba(30, 30, 30, 0.4);
   background: rgba(255, 255, 255, 0.1); /* transparência */
  z-index: 1;
  overflow: hidden;

 background-image: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.05) 40%,
    transparent 100%
  );
}

.header::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 32px;
  padding: 1px;
  background: linear-gradient(to bottom, rgba(217, 21, 50, 0.6), rgba(252, 177, 0, 0.6));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  z-index: -1;
}

.left-section,
.center-section,
.right-section {
  flex: 1;
  display: flex;
  align-items: center;
}

.left-section {
  justify-content: flex-start;
}

.center-section {
  justify-content: center;
}

.right-section {
  justify-content: flex-end;
  gap: 8px;
  cursor: pointer;
  margin-right: 16px;
}

.logo {
  max-height: 40px;
  object-fit: contain;
}

.login-text {
  font-family: "Figtree", sans-serif;
  font-weight: 600;
  color: #fff;
}

.login-icon {
  width: 16px;
  height: 16px;
}
</style>
