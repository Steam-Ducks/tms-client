<template>
  <form @submit.prevent="onSubmit" class="form">
    <p>
      <label for="desc">Descrição</label>
      <input id="desc" v-model.trim="props.form.description" type="text" required />
    </p>

    <fieldset class="region-group">
      <legend>Regiões</legend>

      <label class="region-all">
        <input type="checkbox" v-model="allSelected" />
        Selecionar todas
      </label>

      <div class="region-grid" :aria-invalid="regionsInvalid ? 'true' : 'false'">
        <label v-for="r in regions" :key="r.id" class="region-item">
          <input type="checkbox" :value="r.id" v-model="selected" />
          <span>{{ r.name }}</span>
        </label>
      </div>

      <small v-if="regionsInvalid" class="region-error">
        Selecione ao menos uma região.
      </small>
    </fieldset>


    <div class="actions">
      <button type="button" class="cancel" @click="$emit('cancel')">Cancelar</button>
      <button type="submit" class="create">Salvar</button>
    </div>
  </form>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'

  const props = defineProps<{
    form: { description: string; regionIds: number[] }
  }>()
  const emit = defineEmits<{ (e: 'submit'): void; (e: 'cancel'): void }>()

  const regions = [
    { id: 1, name: 'Zona Sul' },
    { id: 2, name: 'Zona Sudeste' },
    { id: 3, name: 'Zona Leste' },
    { id: 4, name: 'Zona Central' },
    { id: 5, name: 'Zona Oeste' },
    { id: 6, name: 'Zona Norte' },
  ]

  // (opcional) evitar mutar props diretamente: espelha em um ref e sincroniza
  const selected = ref<number[]>(
    Array.isArray(props.form.regionIds) ? [...props.form.regionIds] : []
  )
  
  watch(selected, (v) => {
    if (!Array.isArray(props.form.regionIds)) {
      props.form.regionIds = []
    }
    props.form.regionIds.splice(0, props.form.regionIds.length, ...v)
  })

  const regionsInvalid = ref(false)

  const allSelected = computed({
    get: () => selected.value.length === regions.length,
    set: (val: boolean) => {
      selected.value = val ? regions.map(r => r.id) : []
    }
  })

  function onSubmit() {
    regionsInvalid.value = selected.value.length === 0
    if (regionsInvalid.value) return
    emit('submit')
  }
</script>

<style scoped>
  .form {
    align-items: center;
    justify-content: center;
    margin: 15px;
  }

  label {
    display: inline-block;
    min-width: 88px;
    font-size: 13px;
    padding-bottom: 5px;
  }

  input[type="text"] {
    width: 100%;
    padding: 8px;
    background-color: #ffffff19;
    border: 1px solid #cccccc00;
    border-radius: 6px;
    color: white;
  }

  .region-group {
    border: none;
    padding: 0;
    margin: 16px 0 8px;
  }

  .region-group legend {
    font-size: 13px;
    padding-bottom: 5px;
    color: #fff;
  }

  .region-all {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #fff;
    margin-bottom: 8px;
  }

  .region-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 8px 14px;
    padding: 8px 0;
  }

  .region-item {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #fff;
    font-size: 14px;
  }

  .region-grid[aria-invalid="true"] {
    outline: 1px solid #ff4d4f;
    border-radius: 6px;
    padding: 8px;
  }

  .region-error {
    color: #ffb3b3;
    display: block;
    margin-top: 6px;
  }

  .actions {
    display: flex;
    gap: 5%;
    align-items: center;
    justify-content: center;
    margin-top: 24px;
  }

  button {
    width: 30%;
    padding: 8px 14px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
  }

  .create {
    background-color: #0a7a2f;
    color: azure;
  }

  .cancel {
    background-color: #ffffff07;
    color: rgba(255, 255, 255, 0.822);
    border: 1px solid rgba(255, 255, 255, 0.307);
  }

  .region-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); 
  gap: 12px;
  margin-top: 12px;
  }

  .region-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 14px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
    font-size: 14px;
    transition: all 0.2s ease;
  }

  .region-item:hover {
    border-color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.08);
  }

  .region-item:has(input:checked) {
    border-color: #0a7a2f;
    background: rgba(10, 122, 47, 0.12);
  }

  .region-item input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #0a7a2f;
  }

  .region-grid[aria-invalid="true"] {
    outline: 1px solid #ff4d4f;
    border-radius: 6px;
    padding: 8px;
  }

  @media (max-width: 600px) {
    .region-grid {
      grid-template-columns: 1fr;
    }
  }

  .region-all{
    display: flex;
    align-items: center;
    padding: 5px 14px;
    border-radius: 8px;
    color: #fff;
    font-size: 14px;
    transition: all 0.2s ease;
  }

</style>
