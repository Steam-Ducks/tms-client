<script setup lang="ts">
    export interface MessageRow {
      destinatario: string;    
      remetente: string;        
      regiao: string;           
      tipoAviso: string;        
      dataEnvio: string;
      status: string;           
    }

    const props = defineProps<{
      rows: MessageRow[];     
    }>();

    function statusClass(status: String) {
      switch (status) {
          case "Entregue": return "status status--ok";
          case "Não Entregue": return "status status--err";
      }
    }
</script>

<template>
  <div class="message-control">
    <h2> Controle de envios </h2>

    <table class="message-table">
      <thead>
        <tr>
          <th>Destinatário</th>
          <th>Remetente</th>
          <th>Região</th>
          <th>Tipo de Aviso</th>
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
            <span :class="statusClass(row.status)">
              {{ row.status }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<style scoped>
.message-control {
  width: 67%;
  height: 811px;
  border-radius: 16px;
  background-color: #1d1d1d90;
  padding-bottom: 20px;
}

.message-control h2 {
  color: #fff;
  padding: 20px;
  margin-left: 20px;
}

.message-table {
  width: 90%;
  margin: auto;
  color: #fff;
  text-align: left;
  border-collapse: collapse;
  font-size: 15px;
}

thead th {
  font-weight: 600;
  padding: 10px 0;
  border-bottom: 1px solid #444;
  size: 15px;
}

tbody td {
  padding: 10px 0;
  size: 15px;
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

/* cores por estado */
.status--ok  { border-color: #00bf63; color: #00bf63; }
.status--err { border-color: #ff4d4f; color: #ff4d4f; }
</style>
