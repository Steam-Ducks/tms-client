<script setup lang="ts">
import { ref, computed } from 'vue';

export interface MessageRow {
  id: number;
  status: boolean;
  ocorrencia: string;
  location: string;
  date: string;
  destinatario: string;
}

const props = defineProps<{ rows: MessageRow[] }>();
const emit = defineEmits<{
  resolve: [id: number, message: string]
}>();

const showResolveModal = ref(false);
const selectedMessageId = ref<number | null>(null);
const resolveMessage = ref('');

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);

const totalPages = computed(() =>
  Math.ceil((props.rows?.length || 0) / itemsPerPage.value)
);

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return props.rows?.slice(start, end) || [];
});

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function statusClass(status: boolean) {
  return status ? "status status--ok" : "status status--err";
}

function statusText(status: boolean) {
  return status ? "Resolvido" : "Não Resolvido";
}

function handleStatusClick(row: MessageRow) {
  if (!row.status) {
    selectedMessageId.value = row.id;
    resolveMessage.value = '';
    showResolveModal.value = true;
  }
}

function confirmResolve() {
  if (selectedMessageId.value && resolveMessage.value.trim()) {
    emit('resolve', selectedMessageId.value, resolveMessage.value);
    closeModal();
  }
}

function closeModal() {
  showResolveModal.value = false;
  selectedMessageId.value = null;
  resolveMessage.value = '';
}
</script>

<template>
  <div class="message-control">
    <h2>Controle de envios</h2>

    <!-- WRAPPER COM OVERFLOW -->
    <div class="table-wrap">
      <table class="message-table">
        <thead>
          <tr>
            <th>Destinatário</th>
            <th>Localização</th>
            <th>Data</th>
            <th>Ocorrência</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody v-if="paginatedRows.length">
          <tr v-for="row in paginatedRows" :key="row.id">
            <td>{{ row.destinatario }}</td>
            <td>{{ row.location }}</td>
            <td>{{ row.date }}</td>
            <td>{{ row.ocorrencia }}</td>
            <td>
              <span
                :class="statusClass(row.status)"
                :style="{ cursor: !row.status ? 'pointer' : 'default' }"
                @click="handleStatusClick(row)"
              >
                {{ statusText(row.status) }}
              </span>
            </td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr>
            <td class="empty" colspan="5">Sem registros</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div v-if="totalPages > 1" class="pagination">
      <button
        class="pagination-btn"
        @click="prevPage"
        :disabled="currentPage === 1"
      >
        ← Anterior
      </button>

      <div class="pagination-info">
        <span
          v-for="page in totalPages"
          :key="page"
          class="page-number"
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </span>
      </div>

      <button
        class="pagination-btn"
        @click="nextPage"
        :disabled="currentPage === totalPages"
      >
        Próxima →
      </button>
    </div>

    <!-- Modal de Confirmação -->
    <div v-if="showResolveModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>Confirmar Resolução</h3>
        <p>Descreva brevemente como o problema foi resolvido:</p>
        <textarea
          v-model="resolveMessage"
          placeholder="Ex: Congestionamento normalizado após acidente ser removido..."
          rows="4"
        ></textarea>
        <div class="modal-actions">
          <button class="btn-cancel" @click="closeModal">Cancelar</button>
          <button
            class="btn-confirm"
            @click="confirmResolve"
            :disabled="!resolveMessage.trim()"
          >
            Confirmar Resolução
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-control {
  width: 67%;
  height: 811px;
  border-radius: 16px;
  background-color: #1d1d1d90;
  padding-bottom: 20px;

  /* Faz o wrapper ocupar o resto e rolar dentro */
  display: flex;
  flex-direction: column;
}

.message-control h2 {
  color: #fff;
  padding: 20px;
  margin-left: 20px;
  margin-bottom: 8px;
}

/* CONTAINER QUE ROLA */
.table-wrap {
  flex: 1;                 /* ocupa o restante da altura */
  overflow-y: auto;        /* rolagem aqui */
  width: 90%;
  margin: 0 auto 16px;
  border-radius: 8px;
}

/* Estilo da tabela */
.message-table {
  width: 100%;
  color: #fff;
  text-align: left;
  border-collapse: collapse;
  font-size: 15px;
}

/* Cabeçalho fixo */
thead th {
  position: sticky;
  top: 0;
  background: #1d1d1d;     /* cor de fundo para cobrir linhas ao rolar */
  z-index: 1;
  font-weight: 600;
  padding: 10px 0;
  border-bottom: 1px solid #444;
}

tbody td {
  padding: 10px 0;
  border-bottom: 1px solid #2b2b2b;
}

.empty {
  text-align: center;
  color: #bdbdbd;
  padding: 24px 0;
}

.status {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 12px;
  font-weight: 600;
  line-height: 1;
  border: 2px solid #777;
  color: #ddd;
}
.status--ok  { border-color: #00bf63; color: #00bf63; }
.status--err { border-color: #ff4d4f; color: #ff4d4f; }

/* Scrollbar (opcional) */
.table-wrap {
  scrollbar-width: thin;                 /* Firefox */
  scrollbar-color: #4b4b4b transparent;  /* Firefox */
}
.table-wrap::-webkit-scrollbar {
  width: 8px;
}
.table-wrap::-webkit-scrollbar-track {
  background: transparent;
}
.table-wrap::-webkit-scrollbar-thumb {
  background: #4b4b4b;
  border-radius: 8px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.modal-content h3 {
  color: #fff;
  margin: 0 0 12px 0;
  font-size: 1.3rem;
}

.modal-content p {
  color: #bdbdbd;
  margin-bottom: 16px;
  font-size: 0.95rem;
}

.modal-content textarea {
  width: 100%;
  background: #1d1d1d;
  border: 1px solid #444;
  border-radius: 8px;
  color: #fff;
  padding: 12px;
  font-family: inherit;
  font-size: 0.95rem;
  resize: vertical;
  margin-bottom: 20px;
}

.modal-content textarea:focus {
  outline: none;
  border-color: #00bf63;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-cancel,
.btn-confirm {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #444;
  color: #fff;
}

.btn-cancel:hover {
  background: #555;
}

.btn-confirm {
  background: #00bf63;
  color: #fff;
}

.btn-confirm:hover:not(:disabled) {
  background: #00d96f;
}

.btn-confirm:disabled {
  background: #333;
  color: #666;
  cursor: not-allowed;
}

/* Pagination Styles */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
  padding: 16px 0;
}

.pagination-btn {
  padding: 8px 16px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #3a3a3a;
  border-color: #00bf63;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-info {
  display: flex;
  gap: 8px;
}

.page-number {
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 6px;
  color: #bdbdbd;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.page-number:hover {
  background: #3a3a3a;
  border-color: #00bf63;
  color: #fff;
}

.page-number.active {
  background: #00bf63;
  border-color: #00bf63;
  color: #fff;
}
</style>
