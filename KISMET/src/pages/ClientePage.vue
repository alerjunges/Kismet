<template>
  <div class="q-pa-md">
    <q-layout view="hHh Lpr lFf" container style="height: 100vh">
      <!-- Conteúdo principal -->
      <q-page-container>
        <q-page class="q-px-lg q-py-md">
          <q-spinner v-if="loading" size="30px" color="primary" />
          <div v-if="error" class="text-negative">{{ error }}</div>

          <div class="row q-mb-md">
            <!-- Botão de Adicionar Cliente -->
            <q-btn
              class="custom-button"
              color="green-10"
              icon="add"
              label="Adicionar Cliente"
              @click="adicionarCliente"
            />

            <!-- Campo de Busca -->
            <q-input
              outlined
              rounded
              color="green"
              v-model="search"
              debounce="300"
              placeholder="Buscar Cliente"
              prepend-icon="search"
              class="custom-input"
            />

            <!-- Contador de Clientes -->
            <div class="result-count">
              {{ clientesFiltrados.length }} cliente(s) encontrado(s)
            </div>
          </div>

          <!-- Tabela de Clientes -->
          <q-table
            v-if="clientesFiltrados && clientesFiltrados.length > 0 && !loading && !error"
            :rows="clientesFiltrados"
            :columns="columns"
            row-key="id"
            :rows-per-page-options="[5, 10, 20]"
            class="custom-table"
          >
            <template v-slot:header="props">
              <q-tr class="header-row">
                <q-th v-for="col in props.cols" :key="col.name" :props="props" class="header-cell vertical-line">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>

            <template v-slot:body="props">
              <q-tr :props="props" class="body-row">
                <!-- Ícones de ação -->
                <q-td class="vertical-line body-cell">
                  <q-icon name="edit" class="q-mr-sm action-icon" @click="toggleEdit(props.row)" />
                  <q-icon name="delete" class="q-mr-sm action-icon" @click="deletarCliente(props.row.id)" />
                </q-td>
                
              
                <q-td class="vertical-line body-cell">{{ props.row.id }}</q-td>

                
                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingCliente && editingCliente.id === props.row.id"
                           v-model="editingCliente.nome" dense />
                  <span v-else>{{ props.row.nome }}</span>
                </q-td>

             
                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingCliente && editingCliente.id === props.row.id"
                           v-model="editingCliente.email" dense />
                  <span v-else>{{ props.row.email }}</span>
                </q-td>

              
                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingCliente && editingCliente.id === props.row.id"
                           v-model="editingCliente.telefone" dense />
                  <span v-else>{{ props.row.telefone }}</span>
                </q-td>

            
                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingCliente && editingCliente.id === props.row.id"
                           v-model="editingCliente.endereco" dense />
                  <span v-else>{{ props.row.endereco }}</span>
                </q-td>

               
                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingCliente && editingCliente.id === props.row.id"
                           v-model="editingCliente.cpf" dense />
                  <span v-else>{{ props.row.cpf }}</span>
                </q-td>

               
                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingCliente && editingCliente.id === props.row.id"
                           v-model="editingCliente.status" dense />
                  <span v-else>{{ props.row.status }}</span>
                </q-td>

               
                <q-td v-if="editingCliente && editingCliente.id === props.row.id">
                  <q-btn label="Salvar" @click="salvarEdicao(props.row.id)" color="green" />
                </q-td>
              </q-tr>
            </template>
          </q-table>

         
          <div v-else-if="clientesFiltrados && clientesFiltrados.length === 0">Nenhum cliente disponível.</div>

        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import clienteService from 'src/services/clienteService';

const router = useRouter();
const search = ref('');
const editingCliente = ref(null);

// Definindo colunas da tabela
const columns = [
  { name: 'acao', label: 'Ações', align: 'center' },
  { name: 'id', label: 'ID Cliente', align: 'left', field: 'id' },
  { name: 'nome', label: 'Nome', align: 'left', field: 'nome' },
  { name: 'email', label: 'Email', align: 'left', field: 'email' },
  { name: 'telefone', label: 'Telefone', align: 'left', field: 'telefone' },
  { name: 'endereco', label: 'Endereço', align: 'left', field: 'endereco' },
  { name: 'cpf', label: 'CPF', align: 'left', field: 'cpf' },
  { name: 'status', label: 'Status', align: 'left', field: 'status' }
];

const loading = ref(true);
const error = ref(null);
const clientes = ref([]);

// Busca e filtra clientes
onMounted(async () => {
  await fetchClientesData();
  loading.value = false;
});

const clientesFiltrados = computed(() =>
  clientes.value ? clientes.value.filter(cliente =>
    cliente.nome.toLowerCase().includes(search.value.toLowerCase())
  ) : []
);

// Funções para gerenciar clientes usando o clienteService
async function fetchClientesData() {
  try {
    clientes.value = await clienteService.getClientesData();
  } catch (err) {
    error.value = 'Erro ao carregar clientes';
  }
}

function toggleEdit(cliente) {
  if (editingCliente.value && editingCliente.value.id === cliente.id) {
    editingCliente.value = null;
  } else {
    editingCliente.value = { ...cliente };
  }
}

async function salvarEdicao(clienteId) {
  try {
    await clienteService.updateCliente(clienteId, editingCliente.value);
    editingCliente.value = null;
    await fetchClientesData();
  } catch (err) {
    console.error('Erro ao atualizar cliente:', err);
  }
}

function adicionarCliente() {
  router.push('/adicionar-cliente');
}

async function deletarCliente(clienteId) {
  try {
    await clienteService.deleteCliente(clienteId);
    await fetchClientesData();
  } catch (err) {
    console.error("Erro ao deletar cliente:", err);
  }
}
</script>

<style scoped>
.header-row {
  background-color: #04442C;
  color: white;
  font-weight: bold;
}

.body-cell {
  padding: 12px;
  border-bottom: 1px solid #ddd;
}

.body-row {
  border-bottom: 1px solid #ddd;
}

.vertical-line {
  border-right: 1px solid #ddd;
}

.action-icon {
  font-size: 20px; 
  cursor: pointer;
  color: #04442C;
}

.action-icon:hover {
  color: #e74c3c; 
}

.row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

/* Botão de adicionar cliente */
.custom-button {
  width: 250px;
  height: 53px;
  border-radius: 30px;
  background-color: #04442C !important;
  color: white !important;
}

/* Campo de busca */
.custom-input {
  width: 250px;
  height: 37px;
  background-color: white !important;
  color: white !important;
}

.result-count {
  margin-left: auto;
  font-size: 16px;
  font-weight: bold;
}

.custom-table {
  width: 100%;
  text-align: left;
}

.q-col-gutter-xl {
  margin-bottom: 20px;
}
</style>
