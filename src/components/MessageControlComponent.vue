<script setup lang="ts">
import { ref, computed } from 'vue';

export interface MessageRow {
  id: number;
  status: boolean;
  ocorrencia: string | null;
  location: string;
  date: string;
  destinatario: string;
}

const props = defineProps<{ rows: MessageRow[] }>();
const emit = defineEmits<{
  resolve: [id: number, occurrence: string]
}>();

const showResolveModal = ref(false);
const selectedMessageId = ref<number | null>(null);
const customOccurrence = ref('');

const occurrenceTypes = [
  'Obra',
  'Acidente',
  'Engarrafamento',
  'Alagamento',
  'Bloqueio de via',
  'Manifestação',
  'Outro'
];

const selectedOccurrence = ref('');
const showCustomInput = ref(false);

// Sorting
type SortKey = 'destinatario' | 'location' | 'date' | 'ocorrencia' | 'status';
const sortKey = ref<SortKey | null>(null);
const sortOrder = ref<'asc' | 'desc'>('asc');

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);

const totalPages = computed(() =>
  Math.ceil((props.rows?.length || 0) / itemsPerPage.value)
);

const sortedRows = computed(() => {
  if (!props.rows) return [];
  
  const rows = [...props.rows];
  
  if (!sortKey.value) return rows;
  
  return rows.sort((a, b) => {
    const aVal = a[sortKey.value!];
    const bVal = b[sortKey.value!];
    
    // Handle null values
    if (aVal === null && bVal === null) return 0;
    if (aVal === null) return sortOrder.value === 'asc' ? 1 : -1;
    if (bVal === null) return sortOrder.value === 'asc' ? -1 : 1;
    
    // Compare values
    let comparison = 0;
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      comparison = aVal.localeCompare(bVal);
    } else if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
      comparison = aVal === bVal ? 0 : aVal ? 1 : -1;
    } else {
      comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    }
    
    return sortOrder.value === 'asc' ? comparison : -comparison;
  });
});

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return sortedRows.value.slice(start, end);
});

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

function sort(key: SortKey) {
  if (sortKey.value === key) {
    // Toggle order if clicking same column
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    // New column, default to ascending
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
  // Reset to first page when sorting
  currentPage.value = 1;
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
    customOccurrence.value = '';
    selectedOccurrence.value = '';
    showCustomInput.value = false;
    showResolveModal.value = true;
  }
}

function selectOccurrence(occurrence: string) {
  selectedOccurrence.value = occurrence;
  if (occurrence === 'Outro') {
    showCustomInput.value = true;
    customOccurrence.value = '';
  } else {
    showCustomInput.value = false;
  }
}

function confirmResolve() {
  const finalOccurrence = showCustomInput.value ? customOccurrence.value : selectedOccurrence.value;
  if (selectedMessageId.value && finalOccurrence.trim()) {
    emit('resolve', selectedMessageId.value, finalOccurrence);
    closeModal();
  }
}

function closeModal() {
  showResolveModal.value = false;
  selectedMessageId.value = null;
  customOccurrence.value = '';
  selectedOccurrence.value = '';
  showCustomInput.value = false;
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
            <th @click="sort('destinatario')" class="sortable">
              Destinatário
              <span class="sort-indicator" v-if="sortKey === 'destinatario'">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th @click="sort('location')" class="sortable">
              Localização
              <span class="sort-indicator" v-if="sortKey === 'location'">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th @click="sort('date')" class="sortable">
              Data
              <span class="sort-indicator" v-if="sortKey === 'date'">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th @click="sort('ocorrencia')" class="sortable">
              Ocorrência
              <span class="sort-indicator" v-if="sortKey === 'ocorrencia'">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th @click="sort('status')" class="sortable">
              Status
              <span class="sort-indicator" v-if="sortKey === 'status'">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
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
        <p>Qual foi o tipo de ocorrência?</p>
        
        <div class="options-grid">
          <button
            v-for="occurrence in occurrenceTypes"
            :key="occurrence"
            class="option-btn"
            :class="{ active: selectedOccurrence === occurrence }"
            @click="selectOccurrence(occurrence)"
          >
            {{ occurrence }}
          </button>
        </div>

        <textarea
          v-if="showCustomInput"
          v-model="customOccurrence"
          placeholder="Descreva o tipo de ocorrência..."
          rows="3"
          class="custom-input"
        ></textarea>

        <div class="modal-actions">
          <button class="btn-cancel" @click="closeModal">Cancelar</button>
          <button
            class="btn-confirm"
            @click="confirmResolve"
            :disabled="!selectedOccurrence || (showCustomInput && !customOccurrence.trim())"
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

thead th.sortable {
  cursor: pointer;
  user-select: none;
  transition: color 0.2s;
}

thead th.sortable:hover {
  color: #00bf63;
}

.sort-indicator {
  margin-left: 6px;
  font-size: 0.8em;
  color: #00bf63;
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

/* Resolution Options Grid */
.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 20px 0;
}

.option-btn {
  padding: 12px 20px;
  background: #2a2a2a;
  border: 2px solid #444;
  border-radius: 8px;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.option-btn:hover {
  background: #3a3a3a;
  border-color: #00bf63;
}

.option-btn.active {
  background: #00bf63;
  border-color: #00bf63;
  color: #1a1a1a;
}

.custom-input {
  width: 100%;
  padding: 12px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  color: #fff;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  margin-top: 12px;
}

.custom-input:focus {
  outline: none;
  border-color: #00bf63;
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
