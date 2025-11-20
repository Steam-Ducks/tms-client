<template>
  <header class="header">
    <div class="left-section">
      <div v-if="isAuthenticated">
        <div class="auth" @click="adminPage">
          <img :src="adminIcon" class="login-icon" alt="Ícone de Admin" />
          <span class="login-text">Admin</span>
        </div>
      </div>
    </div>

    <div class="center-section">
      <img src="/src/logo.png" class="logo" alt="Logo Tráfegou" />
    </div>

    <div class="right-section">
      <div v-if="isAuthenticated">
        <div class="auth" @click="logout">
          <img :src="loginIcon" class="login-icon" alt="Ícone de Logout" />
          <span class="login-text">Logout</span>
        </div>
      </div>
      <div class="auth" v-else @click="loginPage">
        <img :src="loginIcon" class="login-icon" alt="Ícone de Login" />
        <span class="login-text">Login</span>
      </div>

    </div>
  </header>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { useRouter } from "vue-router";
  import { storeToRefs } from "pinia";
  import { usuarioStore } from "@/stores/usuario";
  import loginIcon from "../login-icon.png";
  import adminIcon from "../admin-icon.png";

  const router = useRouter();
  const store = usuarioStore();
  const { token } = storeToRefs(store);
  const isAuthenticated = computed(() => !!token.value);

  const loginPage = () => {
      router.push("/login");
  };
  const logout = () => {
    store.logout();
    router.push("/");
  };
  const adminPage = () => {
    router.push("/admin");
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
    background: rgba(255, 255, 255, 0.1);
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
    margin-right: 6px;
  }

  .auth{
    display: inline-flex;
    align-items: center;
  }

  .auth-button{
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 36px;
    padding: 0 14px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.18);
    backdrop-filter: blur(10px);
    color: #fff;
    font-family: "Figtree", sans-serif;
    font-weight: 600;
    line-height: 1;
    cursor: pointer;
    transition: transform .15s ease, background .15s ease, border-color .15s ease;
    margin-right: 10px;
  }

</style>