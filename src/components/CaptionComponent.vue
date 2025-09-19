<template>
  <div class="indicator-caption">
    <div class="cor verde">1 - Excelente</div>
    <div class="cor amarelo">2 - Bom</div>
    <div class="cor laranja">3 - Regular</div>
    <div class="cor vermelho">4 - Ruim</div>
    <div class="cor pessimo">5 - Péssimo</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CaptionComponent',
});
</script>

<style scoped>
.indicator-caption {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 27px;
  display: flex;
  justify-content: space-between;
  align-items: center;


  width: 80%;
  max-width: 1386px;
  height: 35px;


  font-family: 'Figtree', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #fff;


  border-radius: 40px;
  overflow: hidden;


  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 100;
}

.cor {
  flex-grow: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  white-space: nowrap;
}


.verde {
  background-color: #00A651;
}
.amarelo {
  background-color: #FFC000;
}
.laranja {
  background-color: #FF7B00;
}
.vermelho {
  background-color: #D91532;
}
.pessimo {
  background-color: #a005ff;
}
</style>
