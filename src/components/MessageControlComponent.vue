<script setup lang="ts">
export interface MessageRow {
  destinatario: string;
  remetente: string;
  regiao: string;
  tipoAviso: string;
  dataEnvio: string;
  status: string; // use string (minúsculo), não String
}

const props = defineProps<{ rows: MessageRow[] }>();

function statusClass(status: string) {
  switch (status) {
    case "Resolvido": return "status status--ok";
    case "Não Resolvido": return "status status--err";
    default: return "status";
  }
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
            <th></th>
            <th>Região</th>
            <th></th>
            <th>Data de envio</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody v-if="rows?.length">
          <tr v-for="(row, i) in rows" :key="i">
            <td>{{ row.destinatario }}</td>
            <td>{{ row.remetente }}</td>
            <td>{{ row.regiao }}</td>
            <td>{{ row.tipoAviso }}</td>
            <td>{{ row.dataEnvio }}</td>
            <td>
              <span :class="statusClass(row.status)">{{ row.status }}</span>
            </td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr>
            <td class="empty" colspan="6">Sem registros</td>
          </tr>
        </tbody>
      </table>
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
</style>
