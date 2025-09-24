// eslint-disable-next-line vue/multi-word-component-names
<script setup lang="ts">
import MapDemo from '../views/MapDemo.vue'
</script>

<template>
  <MapDemo />
  <div class="scrollable-content">
    </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Define a fonte padrão para toda a aplicação */
body {
  font-family: 'Figtree', sans-serif;
}

.scrollable-content {
  width: 100%;
  background-color: #1a1a1a;
  color: #e0e0e0;
  padding: 50px 20px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
}
</style>

