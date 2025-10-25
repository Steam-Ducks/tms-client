<template>
  <div class="overlay" @click="onBackdrop">
    <div class="modal" @click.stop>
      <button class="close" type="button" @click="$emit('close')">✕</button>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ (e:'close'):void }>();
function onBackdrop() { emit('close'); }
</script>

<style scoped>
.overlay{
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(4px);
  display: grid; place-items: center;
  z-index: 999;
}
.modal{
  width: 400px;
  min-height: 30%;
  height: auto;
  background: #1f1f1f;
  color: #fff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
  position: relative;
  align-items: center;
  justify-content: center;
  max-height: 90vh;
  overflow-y: auto;
}
.close{
  position: absolute; top: 10px; right: 10px;
  background: transparent; color: #bbb; border: none;
  font-size: 18px; cursor: pointer;
}
.close:hover{ color: #fff; }
</style>
