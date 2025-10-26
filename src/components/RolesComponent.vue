<script setup lang="ts">
  import { Trash2, Edit3 } from 'lucide-vue-next'

  type Role = {
    id: string | number
    name: string
    zonas: string[]
  }

  const props = defineProps<{
    roles: Role[]
  }>()

  const emit = defineEmits<{
    (e: 'add'): void
    (e: 'edit', role: Role): void
    (e: 'delete', role: Role): void
  }>()

  function onAdd() { emit('add') }
  function onEdit(role: Role) { emit('edit', role) }
  function onDelete(role: Role) { emit('delete', role) }

  const zoneClass: Record<string, string> = {
    'Zona Sul': 'chip--sul',
    'Zona Sudeste': 'chip--sudeste',
    'Zona Oeste': 'chip--oeste',
    'Zona Leste': 'chip--leste',
    'Zona Norte': 'chip--norte'
  }
</script>

<template>
    <div class="role-control">
        <div class="head">
        <h2>Cargos</h2>
        <button type="button" class="add-button" @click="onAdd">Adicionar</button>
        </div>

        <div class="header-line"></div>

        <div class="body">
            <template v-if="roles?.length">
                <div
                v-for="role in roles"
                :key="role.id"
                class="role-card"
                >
                <div class="card-info">
                    <div class="role-name">{{ role.name }}</div>
                    <div class="role-role labels">
                      <span v-for="z in role.zonas" :key="`${role.id}-${z}`" class="chip" :class="zoneClass[z] || 'chip--default'">
                        {{ z }}
                      </span>
                    </div>
                </div>
                <div class="card-actions">
                    <button type="button" class="edit-button" @click="onEdit(role)">
                    <Edit3 class="icon" />
                    </button>
                    <button type="button" class="delete-button" @click="onDelete(role)">
                    <Trash2 class="icon" />
                    </button>
                </div>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
  .role-control {
    width: 100%;
    height: 421px;
    border-radius: 16px;
    background-color: #1d1d1d90;
    padding-bottom: 20px; 
    margin-top: 10%;
  }

  .role-control h2 {
    color: #fff;
    padding: 20px;
    margin-left: 20px;
  }

  .header-line {
    border: 1px solid #444;
    width: 96%;
    margin: 0 auto 20px auto;
  }

  .head{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .add-button{
    background-color: #00BF634D;
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
    margin-left: auto;
    margin-right: 20px;
    cursor: pointer;
    border: 1px solid transparent;
  }
  .add-button:hover { background-color: #00bf6366; }  

    .body {
      padding-top: 8px; 
      overflow-y: auto;  
      height: 70%;      
      width: 95%;  
      scrollbar-width: thin;
      scrollbar-color: #4b4b4b transparent;
    }

  .role-card{
    display: flex;
    padding: 12px 20px;
    margin: 0 20px 12px 20px;
    font-size: 18px;
    color: white;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .card-info{
    width: 90%;
    text-align: left;
  }

  .card-actions{
    display: flex;
    gap: 8px;
  }

  .role-name { font-weight: 600; }
  .role-role{
    color: #bdbdbd;
    font-size: 14px;
  }

  .icon{ width: 18px; height: 18px; }

  .edit-button,
  .delete-button{
    width: 38px; 
    height: 38px; 
    padding: 6px 10px;
    border: 1px solid transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    cursor: pointer;
    color: white;
  }

  .edit-button{ background-color: #FCB1004D; }
  .edit-button:hover{ background-color: #fcb10066; }

  .delete-button{ background-color: #D915324D; }
  .delete-button:hover{ background-color: #d9153270; }

  .empty{
    text-align: center;
    color: #bdbdbd;
    padding: 24px 0;
  }

  .labels{
    display: flex;
    gap: 10px;
    flex-wrap: wrap;     
    margin-top: 8px;
  }

  .chip{
    font-size: 12px;
    font-weight: 700;
    padding: 6px 12px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    line-height: 1;
    color: #fff;
  }

  .chip--sul      { background-color: #15b559; }  
  .chip--sudeste  { background-color: #7c2ae8; }  
  .chip--oeste    { background-color: #ff7a00; } 
  .chip--leste    { background-color: #ffb300; } 
  .chip--norte    { background-color: #e3273a; } 
  .chip--default  { background-color: #555; }

</style>
