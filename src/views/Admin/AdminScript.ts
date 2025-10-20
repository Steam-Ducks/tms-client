import Card from '@/components/AdminCardComponent.vue'
import MessageControl from '@/components/MessageControlComponent.vue'
import UserComponent from '@/components/UsersComponent.vue'
import RolesComponent from '@/components/RolesComponent.vue'
import { useDashboard } from '../Dashboard/DashboardScript.ts'
const { zones, status } = useDashboard()

const SendMessages = () => {
    // Todo: Implement send messages functionality
}

const envios = [
  {
    destinatario: "+55 12 98877 6655",
    remetente: "Giuliano Bertoti",
    regiao: "Zona Sul",
    tipoAviso: "Congestionamento",
    dataEnvio: "19/09/2025 00:00:13",
    status: "Entregue",
  },
  {
    destinatario: "+55 11 92111 2222",
    remetente: "Central",
    regiao: "Zona Norte",
    tipoAviso: "Obra",
    dataEnvio: "19/10/2025 01:58:15",
    status: "Não Entregue",
  },
  {
    destinatario: "+55 12 98877 6655",
    remetente: "Giuliano Bertoti",
    regiao: "Zona Sul",
    tipoAviso: "Congestionamento",
    dataEnvio: "19/09/2025 00:00:13",
    status: "Entregue",
  },
  {
    destinatario: "+55 11 92111 2222",
    remetente: "Central",
    regiao: "Zona Norte",
    tipoAviso: "Obra",
    dataEnvio: "19/10/2025 01:58:15",
    status: "Não Entregue",
  },
  {
    destinatario: "+55 12 98877 6655",
    remetente: "Giuliano Bertoti",
    regiao: "Zona Sul",
    tipoAviso: "Congestionamento",
    dataEnvio: "19/09/2025 00:00:13",
    status: "Entregue",
  },
  {
    destinatario: "+55 11 92111 2222",
    remetente: "Central",
    regiao: "Zona Norte",
    tipoAviso: "Obra",
    dataEnvio: "19/10/2025 01:58:15",
    status: "Não Entregue",
  },
  {
    destinatario: "+55 12 98877 6655",
    remetente: "Giuliano Bertoti",
    regiao: "Zona Sul",
    tipoAviso: "Congestionamento",
    dataEnvio: "19/09/2025 00:00:13",
    status: "Entregue",
  },
  {
    destinatario: "+55 11 92111 2222",
    remetente: "Central",
    regiao: "Zona Norte",
    tipoAviso: "Obra",
    dataEnvio: "19/10/2025 01:58:15",
    status: "Não Entregue",
  },
  {
    destinatario: "+55 12 98877 6655",
    remetente: "Giuliano Bertoti",
    regiao: "Zona Sul",
    tipoAviso: "Congestionamento",
    dataEnvio: "19/09/2025 00:00:13",
    status: "Entregue",
  },
  {
    destinatario: "+55 11 92111 2222",
    remetente: "Central",
    regiao: "Zona Norte",
    tipoAviso: "Obra",
    dataEnvio: "19/10/2025 01:58:15",
    status: "Não Entregue",
  },
  {
    destinatario: "+55 12 98877 6655",
    remetente: "Giuliano Bertoti",
    regiao: "Zona Sul",
    tipoAviso: "Congestionamento",
    dataEnvio: "19/09/2025 00:00:13",
    status: "Entregue",
  },
  {
    destinatario: "+55 11 92111 2222",
    remetente: "Central",
    regiao: "Zona Norte",
    tipoAviso: "Obra",
    dataEnvio: "19/10/2025 01:58:15",
    status: "Não Entregue",
  },
  {
    destinatario: "+55 12 98877 6655",
    remetente: "Giuliano Bertoti",
    regiao: "Zona Sul",
    tipoAviso: "Congestionamento",
    dataEnvio: "19/09/2025 00:00:13",
    status: "Entregue",
  },
  {
    destinatario: "+55 11 92111 2222",
    remetente: "Central",
    regiao: "Zona Norte",
    tipoAviso: "Obra",
    dataEnvio: "19/10/2025 01:58:15",
    status: "Não Entregue",
  },
] 

const users = [
  { id: 1, name: 'Giuliano Bertoti', role: 'Cargo 2' },
  { id: 2, name: 'Maria Silva', role: 'Cargo 1' },
  { id: 1, name: 'Alex Turner', role: 'Singer and guitar player' },
]
function handleAdd() {
  console.log('add user')
}
function handleEdit(user: any) {
  console.log('edit', user)
}
function handleDelete(user: any) {
  console.log('delete', user)
}

const roles = [
  { id: 1, name: 'Cargo 1', zonas: ['Zona Sudeste', 'Zona Sul'], },
  { id: 2, name: 'Cargo 2', zonas: ['Zona Norte', 'Zona Sul', 'Zona Oeste', 'Zona Lest'], },
  { id: 3, name: 'Cargo 3', zonas: ['Zona Norte', 'Zona Sul', 'Zona Sudeste', 'Zona Oeste', 'Zona Lest'], },
];

export { SendMessages, envios, users, handleAdd, handleEdit, handleDelete, Card, MessageControl, UserComponent, RolesComponent, roles, zones, status };