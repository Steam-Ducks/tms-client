<script setup lang="ts">
import { Trash2, Edit3 } from 'lucide-vue-next'

type User = {
  id: string | number
  name: string
  role: string
}

const props = defineProps<{
  users: User[]         
}>()

const emit = defineEmits<{
  (e: 'add'): void
  (e: 'edit', user: User): void
  (e: 'delete', user: User): void
}>()

function onAdd() {
  emit('add')
}
function onEdit(user: User) {
  emit('edit', user)
}
function onDelete(user: User) {
  emit('delete', user)
}
</script>

<template>
  <div class="user-control">
    <div class="head">
      <h2>Usuários</h2>
      <button type="button" class="add-button" @click="onAdd">Adicionar</button>
    </div>

    <div class="header-line"></div>

    <div class="body">
      <template v-if="users?.length">
        <div
          v-for="user in users"
          :key="user.id"
          class="user-card"
        >
          <div class="card-info">
            <div class="user-name">{{ user.name }}</div>
            <div class="user-role">{{ user.role }}</div>
          </div>
          <div class="card-actions">
            <button type="button" class="edit-button" @click="onEdit(user)">
              <Edit3 class="icon" />
            </button>
            <button type="button" class="delete-button" @click="onDelete(user)">
              <Trash2 class="icon" />
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
  .user-control {
    width: 100%;
    height: 344px;
    border-radius: 16px;
    background-color: #1d1d1d90;
    padding-bottom: 20px;
  }

  .user-control h2 {
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

  .body { padding-top: 8px; }

  .user-card{
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

  .user-name { font-weight: 600; }
  .user-role{
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
  .body {
    overflow-y: auto;  
    height: 70%;      
    width: 95%;  
  }
  .body {
    scrollbar-width: thin;
    scrollbar-color: #4b4b4b transparent;
  }
</style>
