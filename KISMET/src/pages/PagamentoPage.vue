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
              label="Adicionar Pagamento"
              @click="adicionarPagamento"
            />
            <div class="result-count">
              {{ pagamentosFiltrados.length }} pagamento(s) encontrado(s)
            </div>
          </div>

          <q-table
            v-if="pagamentosFiltrados && pagamentosFiltrados.length > 0 && !loading && !error"
            :rows="pagamentosFiltrados"
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
                  <q-icon name="delete" class="q-mr-sm action-icon" @click="deletarPagamento(props.row.id)" />
                </q-td>
                <q-td class="vertical-line body-cell">{{ props.row.id }}</q-td>
                <q-td class="vertical-line body-cell">
                  <q-input v-if="isEditing(props.row)" v-model="editingPagamento.cliente_id" dense />
                  <span v-else>{{ props.row.cliente_id }}</span>
                </q-td>
                <q-td class="vertical-line body-cell">
                  <q-input v-if="isEditing(props.row)" v-model="editingPagamento.data_pagamento" dense />
                  <span v-else>{{ formatarData(props.row.data_pagamento) }}</span>
                </q-td>
                <q-td class="vertical-line body-cell">
                  <q-input v-if="isEditing(props.row)" v-model="editingPagamento.valor_total" dense />
                  <span v-else>{{ formatarMoeda(props.row.valor_total) }}</span>
                </q-td>
                <q-td class="vertical-line body-cell">
                  <q-input v-if="isEditing(props.row)" v-model="editingPagamento.desconto" dense />
                  <span v-else>{{ formatarMoeda(props.row.desconto) }}</span>
                </q-td>
                <q-td class="vertical-line body-cell">
                  <q-input v-if="isEditing(props.row)" v-model="editingPagamento.forma_pagamento" dense />
                  <span v-else>{{ props.row.forma_pagamento }}</span>
                </q-td>
                <q-td class="vertical-line body-cell">
                  <q-input v-if="isEditing(props.row)" v-model="editingPagamento.vencimento" dense />
                  <span v-else>{{ formatarData(props.row.vencimento) }}</span>
                </q-td>
                <q-td class="vertical-line body-cell">
                  <q-input v-if="isEditing(props.row)" v-model="editingPagamento.parcela" dense />
                  <span v-else>{{ props.row.parcela }}</span>
                </q-td>
                <q-td class="vertical-line body-cell">
                  <q-input v-if="isEditing(props.row)" v-model="editingPagamento.status" dense />
                  <span v-else>{{ props.row.status }}</span>
                </q-td>
                <q-td v-if="isEditing(props.row)">
                  <q-btn label="Salvar" @click="salvarEdicao(props.row.id)" color="green" />
                </q-td>
              </q-tr>
            </template>
          </q-table>

          <div v-else-if="pagamentos.length === 0">Nenhum pagamento disponível.</div>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePagamentoStore } from 'src/stores/pagamentoStore';

const router = useRouter();
const store = usePagamentoStore();
const search = ref('');
const editingPagamento = ref(null);

const columns = [
  { name: 'acao', label: 'Ações', align: 'center' },
  { name: 'id', label: 'ID Pagamento', align: 'left', field: 'id' },
  { name: 'cliente_id', label: 'ID Cliente', align: 'left', field: 'cliente_id' },
  { name: 'data_pagamento', label: 'Data de Pagamento', align: 'left', field: 'data_pagamento' },
  { name: 'valor_total', label: 'Valor Total', align: 'right', field: 'valor_total' },
  { name: 'desconto', label: 'Desconto', align: 'right', field: 'desconto' },
  { name: 'forma_pagamento', label: 'Forma de Pagamento', align: 'left', field: 'forma_pagamento' },
  { name: 'vencimento', label: 'Data de Vencimento', align: 'left', field: 'vencimento' },
  { name: 'parcela', label: 'Parcela', align: 'left', field: 'parcela' },
  { name: 'status', label: 'Status', align: 'left', field: 'status' }
];

const loading = computed(() => store.loading);
const error = computed(() => store.error);
const pagamentos = computed(() => store.pagamentos);

onMounted(() => {
  store.fetchPagamentosData();
});

const pagamentosFiltrados = computed(() =>
  pagamentos.value ? pagamentos.value.filter(pagamento =>
    pagamento.cliente_id.toString().toLowerCase().includes(search.value.toLowerCase())
  ) : []
);

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

function formatarData(data) {
  if (!data) return 'Data Inválida';
  const dataObj = new Date(data);
  return dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function toggleEdit(pagamento) {
  if (editingPagamento.value && editingPagamento.value.id === pagamento.id) {
    editingPagamento.value = null;
  } else {
    editingPagamento.value = { ...pagamento };
  }
}

function isEditing(row) {
  return editingPagamento.value && editingPagamento.value.id === row.id;
}

async function salvarEdicao(pagamentoId) {
  try {
    await store.updatePagamento(pagamentoId, editingPagamento.value);
    editingPagamento.value = null;
    store.fetchPagamentosData();
  } catch (err) {
    console.error('Erro ao atualizar pagamento:', err);
  }
}

function adicionarPagamento() {
  router.push('/adicionar-pagamento');
}

async function deletarPagamento(pagamentoId) {
  try {
    await store.deletePagamento(pagamentoId);
    store.fetchPagamentosData();
  } catch (err) {
    console.error("Erro ao deletar pagamento:", err);
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

.custom-button {
  width: 250px;
  margin-top: 2px;
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
  margin-top: 20px;
}

.action-icon {
  font-size: 20px;
  cursor: pointer;
  color: #04442C;
}

.action-icon:hover {
  color: #e74c3c;
}
</style>
