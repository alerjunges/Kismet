<template>
  <div class="q-pa-md">
    <q-layout view="hHh Lpr lFf" container style="height: 100vh">
      <!-- Conteúdo principal -->
      <q-page-container>
        <q-page class="q-px-lg q-py-md">
          <q-spinner v-if="loading" size="30px" color="primary" />
          <div v-if="error" class="text-negative">{{ error }}</div>

          <div class="row q-mb-md">
            <!-- Botão de Adicionar Compra -->
            <q-btn
              class="custom-button"
              color="green-10"
              icon="add"
              label="Adicionar Compra"
              @click="adicionarCompra"
            />

            <!-- Botão de Relatório Detalhado -->
            <q-btn
              class="custom-button"
              color="blue-10"
              icon="description"
              label="Relatório Detalhado"
              @click="verRelatorioDetalhado"
            />

            <!-- Contador de Compras -->
            <div class="result-count">
              {{ comprasFiltradas.length }} compra(s) encontrada(s)
            </div>
          </div>

          <!-- Tabela de Compras -->
          <q-table
            v-if="comprasFiltradas && comprasFiltradas.length > 0 && !loading && !error"
            :rows="comprasFiltradas"
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
                <q-td class="vertical-line body-cell">
                  <q-icon name="edit" class="q-mr-sm action-icon" @click="toggleEdit(props.row)" />
                  <q-icon name="delete" class="q-mr-sm action-icon" @click="deletarCompra(props.row.id)" />
                </q-td>
                
                <q-td class="vertical-line body-cell">{{ props.row.id }}</q-td>
                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingCompra && editingCompra.id === props.row.id"
                           v-model="editingCompra.fornecedor_id" dense />
                  <span v-else>{{ props.row.fornecedor_id }}</span>
                </q-td>

                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingCompra && editingCompra.id === props.row.id"
                           v-model="editingCompra.data_compra" dense />
                  <span v-else>{{ formatarData(props.row.data_compra) }}</span>
                </q-td>

                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingCompra && editingCompra.id === props.row.id"
                           v-model="editingCompra.valor_total" dense />
                  <span v-else>{{ formatarMoeda(props.row.valor_total) }}</span>
                </q-td>

                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingCompra && editingCompra.id === props.row.id"
                           v-model="editingCompra.desconto" dense />
                  <span v-else>{{ formatarMoeda(props.row.desconto) }}</span>
                </q-td>

                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingCompra && editingCompra.id === props.row.id"
                           v-model="editingCompra.forma_pagamento" dense />
                  <span v-else>{{ props.row.forma_pagamento }}</span>
                </q-td>

                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingCompra && editingCompra.id === props.row.id"
                           v-model="editingCompra.endereco_entrega" dense />
                  <span v-else>{{ props.row.endereco_entrega }}</span>
                </q-td>

                <q-td v-if="editingCompra && editingCompra.id === props.row.id">
                  <q-btn label="Salvar" @click="salvarEdicao(props.row.id)" color="green" />
                </q-td>
              </q-tr>
            </template>
          </q-table>

          <div v-else-if="comprasFiltradas && comprasFiltradas.length === 0">Nenhuma compra disponível.</div>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCompraStore } from 'src/stores/compraStore';

const router = useRouter();
const compraStore = useCompraStore();
const search = ref('');
const editingCompra = ref(null);

const columns = [
  { name: 'acao', label: 'Ações', align: 'center' },
  { name: 'id', label: 'ID Compra', align: 'left', field: 'id' },
  { name: 'fornecedor_id', label: 'ID Fornecedor', align: 'left', field: 'fornecedor_id' },
  { name: 'data_compra', label: 'Data da Compra', align: 'left', field: 'data_compra' },
  { name: 'valor_total', label: 'Valor Total', align: 'right', field: 'valor_total' },
  { name: 'desconto', label: 'Desconto', align: 'right', field: 'desconto' },
  { name: 'forma_pagamento', label: 'Forma de Pagamento', align: 'left', field: 'forma_pagamento' },
  { name: 'endereco_entrega', label: 'Endereço de Entrega', align: 'left', field: 'endereco_entrega' }
];

// Computed properties para reatividade
const loading = computed(() => compraStore.loading);
const error = computed(() => compraStore.error);
const compras = computed(() => compraStore.compras);

// Funções para formatar valores monetários e datas
function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

function formatarData(data) {
  const dataObj = new Date(data);
  return dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Filtrar compras com base na busca
const comprasFiltradas = computed(() =>
  compras.value ? compras.value.filter(compra =>
    compra.fornecedor_id.toString().includes(search.value)
  ) : []
);

// Buscar dados de compras ao montar o componente
onMounted(async () => {
  await compraStore.fetchComprasData();
});

// Alternar o modo de edição
function toggleEdit(compra) {
  if (editingCompra.value && editingCompra.value.id === compra.id) {
    editingCompra.value = null;
  } else {
    editingCompra.value = { ...compra };
  }
}

// Função para salvar a edição
async function salvarEdicao(compraId) {
  try {
    await compraStore.updateCompra(compraId, editingCompra.value);
    editingCompra.value = null;
  } catch (err) {
    console.error('Erro ao atualizar compra:', err);
  }
}

// Função para adicionar compra
function adicionarCompra() {
  router.push('/adicionar-compra');
}

// Função para ver o relatório detalhado
function verRelatorioDetalhado() {
  router.push('/relatorio-compra');
}

// Função para deletar compra
async function deletarCompra(compraId) {
  try {
    await compraStore.deleteCompra(compraId);
  } catch (err) {
    console.error("Erro ao deletar compra:", err);
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

/* Botão de adicionar compra e relatório detalhado */
.custom-button {
  width: 250px;
  height: 53px;
  border-radius: 30px;
  background-color: #04442C !important;
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
