<template>
  <div class="q-pa-md">
    <q-layout view="hHh Lpr lFf" container style="height: 100vh">
      <!-- Conteúdo principal -->
      <q-page-container>
        <q-page class="q-px-lg q-py-md">
          <q-spinner v-if="loading" size="30px" color="primary" />
          <div v-if="error" class="text-negative">{{ error }}</div>

          <div class="row q-mb-md">
            <!-- Botão de Adicionar Pagamento -->
            <q-btn
              class="custom-button"
              color="green-10"
              icon="add"
              label="Adicionar Pagamento"
              @click="adicionarPagamento"
            />

            <!-- Contador de Pagamentos -->
            <div class="result-count">
              {{ pagamentosFiltrados.length }} pagamento(s) encontrado(s)
            </div>
          </div>

          <!-- Tabela de Pagamentos -->
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
                <!-- Ícones de ação com tamanho maior -->
                <q-td class="vertical-line body-cell">
                  <q-icon name="edit" class="q-mr-sm action-icon" @click="toggleEdit(props.row)" />
                  <q-icon name="delete" class="q-mr-sm action-icon" @click="deletarPagamento(props.row.id)" />
                </q-td>

                <!-- Pagamento ID (não editável) -->
                <q-td class="vertical-line body-cell">{{ props.row.id }}</q-td>

                <!-- Cliente ID -->
                <q-td class="vertical-line body-cell">
                  <q-input v-if="isEditing(props.row)" v-model="editingPagamento.cliente_id" dense />
                  <span v-else>{{ props.row.cliente_id }}</span>
                </q-td>

                <!-- Data de Pagamento -->
                <q-td class="vertical-line body-cell">
                  <q-input v-if="isEditing(props.row)" v-model="editingPagamento.data_pagamento" dense />
                  <span v-else>{{ formatarData(props.row.data_pagamento) }}</span>
                </q-td>

                <!-- Valor Total -->
                <q-td class="vertical-line body-cell">
                  <q-input v-if="isEditing(props.row)" v-model="editingPagamento.valor_total" dense />
                  <span v-else>{{ formatarMoeda(props.row.valor_total) }}</span>
                </q-td>

                <!-- Desconto -->
                <q-td class="vertical-line body-cell">
                  <q-input v-if="isEditing(props.row)" v-model="editingPagamento.desconto" dense />
                  <span v-else>{{ formatarMoeda(props.row.desconto) }}</span>
                </q-td>

                <!-- Forma de Pagamento -->
                <q-td class="vertical-line body-cell">
                  <q-input v-if="isEditing(props.row)" v-model="editingPagamento.forma_pagamento" dense />
                  <span v-else>{{ props.row.forma_pagamento }}</span>
                </q-td>

                <!-- Vencimento -->
                <q-td class="vertical-line body-cell">
                  <q-input v-if="isEditing(props.row)" v-model="editingPagamento.vencimento" dense />
                  <span v-else>{{ formatarData(props.row.vencimento) }}</span>
                </q-td>

                <!-- Parcela -->
                <q-td class="vertical-line body-cell">
                  <q-input v-if="isEditing(props.row)" v-model="editingPagamento.parcela" dense />
                  <span v-else>{{ props.row.parcela }}</span>
                </q-td>

                <!-- Status -->
                <q-td class="vertical-line body-cell">
                  <q-input v-if="isEditing(props.row)" v-model="editingPagamento.status" dense />
                  <span v-else>{{ props.row.status }}</span>
                </q-td>

                <!-- Botão para salvar edições -->
                <q-td v-if="isEditing(props.row)">
                  <q-btn label="Salvar" @click="salvarEdicao(props.row.id)" color="green" />
                </q-td>
              </q-tr>
            </template>
          </q-table>

          <!-- Caso não haja pagamentos disponíveis -->
          <div v-else-if="pagamentos.length === 0">Nenhum pagamento disponível.</div>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import pagamentoService from 'src/services/pagamentoService'; // Importando o service de pagamento

const router = useRouter();
const search = ref('');
const editingPagamento = ref(null);

// Definindo colunas da tabela
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

// Buscar dados de pagamentos ao montar o componente
const loading = ref(true);
const error = ref(null);
const pagamentos = ref([]);

onMounted(async () => {
  await fetchPagamentosData();
  loading.value = false;
});

// Função para buscar dados de pagamentos
async function fetchPagamentosData() {
  try {
    pagamentos.value = await pagamentoService.getPagamentosData();
  } catch (err) {
    error.value = 'Erro ao carregar pagamentos';
  }
}

// Computed properties para reatividade
const pagamentosFiltrados = computed(() =>
  pagamentos.value ? pagamentos.value.filter(pagamento =>
    pagamento.cliente_id.toString().toLowerCase().includes(search.value.toLowerCase())
  ) : []
);

// Função para formatar valores monetários
function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

// Função para formatar datas
function formatarData(data) {
  if (!data) return 'Data Inválida'; // Verifica se a data está presente e válida
  const dataObj = new Date(data);
  return dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Função para alternar o modo de edição
function toggleEdit(pagamento) {
  if (editingPagamento.value && editingPagamento.value.id === pagamento.id) {
    editingPagamento.value = null;
  } else {
    editingPagamento.value = { ...pagamento }; // Clona o pagamento para edição
  }
}

// Função para verificar se está editando a linha atual
function isEditing(row) {
  return editingPagamento.value && editingPagamento.value.id === row.id;
}

// Função para salvar a edição
async function salvarEdicao(pagamentoId) {
  try {
    await pagamentoService.updatePagamento(pagamentoId, editingPagamento.value);
    editingPagamento.value = null; // Sai do modo de edição após salvar
    fetchPagamentosData(); // Atualiza a tabela
  } catch (err) {
    console.error('Erro ao atualizar pagamento:', err);
  }
}

// Função para adicionar pagamento
function adicionarPagamento() {
  router.push('/adicionar-pagamento');
}

// Função para deletar pagamento
async function deletarPagamento(pagamentoId) {
  try {
    await pagamentoService.deletePagamento(pagamentoId);
    fetchPagamentosData(); // Atualiza a tabela após deletar
  } catch (err) {
    console.error("Erro ao deletar pagamento:", err);
  }
}
</script>

<style scoped>
/* Cabeçalho */
.header-row {
  background-color: #04442C;
  color: white;
  font-weight: bold;
}

/* Customização de cada célula */
.body-cell {
  padding: 12px;
  border-bottom: 1px solid #ddd;
}

/* Linha da tabela */
.body-row {
  border-bottom: 1px solid #ddd;
}

/* Adicionando linha vertical entre colunas */
.vertical-line {
  border-right: 1px solid #ddd;
}

/* Botão de adicionar pagamento */
.custom-button {
  width: 250px;
  margin-top: 2px;
  height: 53px;
  border-radius: 30px;
  background-color: #04442C !important;
  color: white !important;
}

/* Estilo do contador de pagamentos */
.result-count {
  margin-left: auto;
  font-size: 16px;
  font-weight: bold;
}

/* Estilo da tabela */
.custom-table {
  width: 100%;
  text-align: left;
  margin-top: 20px;
}

/* Estilo dos ícones de ação */
.action-icon {
  font-size: 20px;
  cursor: pointer;
  color: #04442C;
}

.action-icon:hover {
  color: #e74c3c;
}
</style>
