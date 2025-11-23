<template>
  <div class="my-telegram-code">
    <h2>Conexão com Telegram</h2>

    <div v-if="loading" class="status loading">
      🔄 Carregando código do Telegram...
    </div>

    <div v-else-if="error" class="status error">
      ❌ {{ error }}
      <button class="btn small" @click="fetchCode">Tentar novamente</button>
    </div>

    <div v-else-if="code" class="code-container">
      <div class="status success">✅ Código: {{ code }}</div>
      <div class="instructions">
        Use este código no bot do Telegram: <code>/register {{ code }}</code>
      </div>
      <div class="actions">
        <button class="btn" @click="copyToClipboard">
          {{ copying ? '📋 Copiado!' : '📋 Copiar' }}
        </button>
        <button class="btn" @click="generateCode" :disabled="generating">
          {{ generating ? '🔄 Gerando...' : '🔄 Novo Código' }}
        </button>
        <button class="btn danger" @click="clearCode" :disabled="clearing">
          {{ clearing ? '🗑️ Limpando...' : '🗑️ Limpar' }}
        </button>
      </div>
    </div>

    <div v-else class="status no-code">
      📭 Nenhum código gerado
      <button class="btn" @click="generateCode" :disabled="generating">
        {{ generating ? '🎯 Gerando...' : '🎯 Gerar Código' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const code = ref<string>('')
const loading = ref(false)
const generating = ref(false)
const clearing = ref(false)
const copying = ref(false)
const error = ref<string>('')

const token = ref<string | null>(null)

const getToken = (): string | null => {
  try {
    const usuarioStr = localStorage.getItem('usuario')
    if (!usuarioStr) return null
    const usuario = JSON.parse(usuarioStr)
    return usuario.token || null
  } catch {
    return null
  }
}

const getHeaders = () => {
  const t = token.value
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (t) headers['Authorization'] = `Bearer ${t}`
  return headers
}

const fetchCode = async () => {
  error.value = ''
  loading.value = true
  code.value = ''

  if (!token.value) {
    error.value = 'Token JWT não encontrado. Faça login.'
    loading.value = false
    return
  }

  try {
    const res = await fetch('http://localhost:8080/api/telegram/my-telegram/get-code', {
      headers: getHeaders(),
    })
    const data = await res.json()
    if (res.ok) code.value = data.code || ''
    else error.value = data.error || 'Erro ao buscar código'
  } catch {
    error.value = 'Problema de conexão com o backend.'
  } finally {
    loading.value = false
  }
}

const generateCode = async () => {
  error.value = ''
  generating.value = true
  code.value = ''

  if (!token.value) {
    error.value = 'Token JWT não encontrado. Faça login.'
    generating.value = false
    return
  }

  try {
    const res = await fetch('http://localhost:8080/api/telegram/my-telegram/generate-code', {
      method: 'POST',
      headers: getHeaders(),
    })
    const data = await res.json()
    if (res.ok) code.value = data.code
    else error.value = data.error || 'Erro ao gerar código'
  } catch {
    error.value = 'Problema de conexão com o backend.'
  } finally {
    generating.value = false
  }
}

const clearCode = async () => {
  error.value = ''
  clearing.value = true

  if (!token.value) {
    error.value = 'Token JWT não encontrado. Faça login.'
    clearing.value = false
    return
  }

  try {
    const res = await fetch('http://localhost:8080/api/telegram/my-telegram/clear-code', {
      method: 'DELETE',
      headers: getHeaders(),
    })
    if (res.ok) code.value = ''
    else {
      const data = await res.json()
      error.value = data.error || 'Erro ao limpar código'
    }
  } catch {
    error.value = 'Problema de conexão com o backend.'
  } finally {
    clearing.value = false
  }
}

const copyToClipboard = async () => {
  if (!code.value) return
  try {
    await navigator.clipboard.writeText(code.value)
    copying.value = true
    setTimeout(() => copying.value = false, 2000)
  } catch {
    error.value = 'Erro ao copiar código'
  }
}

onMounted(() => {
  token.value = getToken()
  fetchCode()
})
</script>

<style scoped>
.my-telegram-code {
  background: #1d1d1d;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  color: #fff;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  margin-bottom: 20px;
}

.status {
  margin: 12px 0;
  padding: 8px 12px;
  border-radius: 8px;
}

.loading { color: #00bf63; background: #002f1a; }
.success { color: #00ff00; background: #003300; }
.error { color: #ff6b6b; background: #330000; }
.no-code { color: #bdbdbd; background: #1a1a1a; }

.instructions { margin: 12px 0; font-size: 0.9em; color: #ccc; }

.actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.btn {
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  background-color: #333;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}
.btn:hover { background-color: #555; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }

.btn.small { padding: 4px 8px; font-size: 0.8em; }
.btn.danger { background-color: #aa2222; }
.btn.danger:hover { background-color: #cc4444; }
</style>
