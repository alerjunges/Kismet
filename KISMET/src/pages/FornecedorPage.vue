<template>
  <div class="q-pa-md">
    <q-layout view="hHh Lpr lFf" container style="height: 100vh">
      <q-page-container>
        <q-page class="q-px-lg q-py-md">
          <q-spinner v-if="loading" size="30px" color="primary" />
          <div v-if="error" class="text-negative">{{ error }}</div>

          <div class="row q-mb-md">
            <q-btn
              class="custom-button"
              color="green-10"
              icon="add"
              label="Adicionar Fornecedor"
              @click="adicionarFornecedor"
            />

            <q-input
              outlined
              rounded
              color="green"
              v-model="search"
              debounce="300"
              placeholder="Buscar Fornecedor"
              prepend-icon="search"
              class="custom-input"
            />

            <div class="result-count">
              {{ fornecedoresFiltrados.length }} fornecedor(es) encontrado(s)
            </div>
          </div>

          <q-table
            :rows="fornecedoresFiltrados"
            :columns="columns"
            row-key="id"
            :rows-per-page-options="[5, 10, 20]"
            class="custom-table"
            v-if="!loading && !error && fornecedores.length > 0"
          >
            <template v-slot:header="props">
              <q-tr class="header-row">
                <q-th v-for="col in props.cols" :key="col.name" :props="props" class="vertical-header">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>

            <template v-slot:body="props">
              <q-tr :props="props" class="body-row">
                <q-td class="vertical-line body-cell">
                  <q-icon name="edit" class="q-mr-sm action-icon" @click="toggleEdit(props.row)" />
                  <q-icon name="delete" class="q-mr-sm action-icon" @click="deletarFornecedor(props.row.id)" />
                </q-td>
                <q-td class="vertical-line body-cell">{{ props.row.id }}</q-td>
                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingFornecedor && editingFornecedor.id === props.row.id"
                           v-model="editingFornecedor.nome" dense />
                  <span v-else>{{ props.row.nome }}</span>
                </q-td>
                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingFornecedor && editingFornecedor.id === props.row.id"
                           v-model="editingFornecedor.endereco" dense />
                  <span v-else>{{ props.row.endereco }}</span>
                </q-td>
                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingFornecedor && editingFornecedor.id === props.row.id"
                           v-model="editingFornecedor.telefone" dense />
                  <span v-else>{{ props.row.telefone }}</span>
                </q-td>
                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingFornecedor && editingFornecedor.id === props.row.id"
                           v-model="editingFornecedor.cnpj" dense />
                  <span v-else>{{ props.row.cnpj }}</span>
                </q-td>
                <q-td v-if="editingFornecedor && editingFornecedor.id === props.row.id">
                  <q-btn label="Salvar" @click="salvarEdicao(props.row.id)" color="green" />
                </q-td>
              </q-tr>
            </template>
          </q-table>

          <div v-else-if="fornecedores.length === 0">Nenhum fornecedor disponível.</div>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useFornecedorStore } from 'src/stores/fornecedorStore';

const router = useRouter();
const fornecedorStore = useFornecedorStore();
const search = ref('');
const editingFornecedor = ref(null);

const columns = [
  { name: 'acao', label: 'Ações', align: 'center' },
  { name: 'id', label: 'ID Fornecedor', align: 'left', field: 'id' },
  { name: 'nome', label: 'Nome', align: 'left', field: 'nome' },
  { name: 'endereco', label: 'Endereço', align: 'left', field: 'endereco' },
  { name: 'telefone', label: 'Telefone', align: 'left', field: 'telefone' },
  { name: 'cnpj', label: 'CNPJ', align: 'left', field: 'cnpj' }
];

const loading = computed(() => fornecedorStore.loading);
const error = computed(() => fornecedorStore.error);
const fornecedores = computed(() => fornecedorStore.fornecedores);

onMounted(async () => {
  await fornecedorStore.fetchFornecedoresData();
});

const fornecedoresFiltrados = computed(() =>
  fornecedores.value ? fornecedores.value.filter(fornecedor =>
    fornecedor.nome.toLowerCase().includes(search.value.toLowerCase())
  ) : []
);

function toggleEdit(fornecedor) {
  if (editingFornecedor.value && editingFornecedor.value.id === fornecedor.id) {
    editingFornecedor.value = null;
  } else {
    editingFornecedor.value = { ...fornecedor };
  }
}

async function salvarEdicao(fornecedorId) {
  try {
    await fornecedorStore.updateFornecedor(fornecedorId, editingFornecedor.value);
    editingFornecedor.value = null;
    await fornecedorStore.fetchFornecedoresData();
  } catch (err) {
    console.error('Erro ao atualizar fornecedor:', err);
  }
}

function adicionarFornecedor() {
  router.push('/adicionar-fornecedor');
}

async function deletarFornecedor(fornecedorId) {
  try {
    await fornecedorStore.deleteFornecedor(fornecedorId);
    await fornecedorStore.fetchFornecedoresData();
  } catch (err) {
    console.error("Erro ao deletar fornecedor:", err);
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

.vertical-header {
  border-right: 2px solid #ddd;
}

.custom-button {
  width: 250px;
  margin-top: 2px;
  height: 53px;
  border-radius: 30px;
  background-color: #04442C !important;
  color: white !important;
}

.custom-input {
  width: 250px;
  height: 30px;
  margin-left: 10px;
  background-color: white !important;
}

.result-count {
  margin-left: auto;
  margin-top: 15px;
  font-size: 16px;
  font-weight: bold;
}

.custom-table {
  width: 100%;
  text-align: left;
  margin-top: 20px;
}

.q-col-gutter-xl {
  margin-bottom: 20px;
}

.action-icon {
  font-size: 20px;
  cursor: pointer;
  color: #04442C;
}
</style>
