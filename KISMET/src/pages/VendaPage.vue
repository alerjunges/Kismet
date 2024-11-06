<template>
  <div class="q-pa-md">
    <q-layout view="hHh Lpr lFf" container style="height: 100vh">
      <!-- Conteúdo principal -->
      <q-page-container>
        <q-page class="q-px-lg q-py-md">
          <q-spinner v-if="loading" size="30px" color="primary" />
          <div v-if="error" class="text-negative">{{ error }}</div>

          <div class="row q-mb-md">
            <!-- Botão de Adicionar Venda -->
            <q-btn
              class="custom-button"
              color="green-10"
              icon="add"
              label="Adicionar Venda"
              @click="adicionarVenda"
            />

            <!-- Botão de Relatório Detalhado -->
            <q-btn
              class="custom-button"
              color="blue-10"
              icon="description"
              label="Relatório Detalhado"
              @click="verRelatorioDetalhado"
            />

            <!-- Contador de Vendas -->
            <div class="result-count">
              {{ vendasFiltradas.length }} venda(s) encontrada(s)
            </div>
          </div>

          <!-- Tabela de Vendas -->
          <q-table
            v-if="vendasFiltradas && vendasFiltradas.length > 0 && !loading && !error"
            :rows="vendasFiltradas"
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
                  <q-icon name="delete" class="q-mr-sm action-icon" @click="deletarVenda(props.row.id)" />
                </q-td>
                
                <!-- Venda ID (não editável) -->
                <q-td class="vertical-line body-cell">{{ props.row.id }}</q-td>

                <!-- Cliente ID (editável) -->
                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingVenda && editingVenda.id === props.row.id"
                           v-model="editingVenda.cliente_id" dense />
                  <span v-else>{{ props.row.cliente_id }}</span>
                </q-td>

                <!-- Data da Venda (editável) -->
                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingVenda && editingVenda.id === props.row.id"
                           v-model="editingVenda.data_venda" dense />
                  <span v-else>{{ formatarData(props.row.data_venda) }}</span>
                </q-td>

                <!-- Valor Total (editável) -->
                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingVenda && editingVenda.id === props.row.id"
                           v-model="editingVenda.valor_total" dense />
                  <span v-else>{{ formatarMoeda(props.row.valor_total) }}</span>
                </q-td>

                <!-- Desconto (editável) -->
                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingVenda && editingVenda.id === props.row.id"
                           v-model="editingVenda.desconto" dense />
                  <span v-else>{{ formatarMoeda(props.row.desconto) }}</span>
                </q-td>

                <!-- Forma de Pagamento (editável) -->
                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingVenda && editingVenda.id === props.row.id"
                           v-model="editingVenda.forma_pagamento" dense />
                  <span v-else>{{ props.row.forma_pagamento }}</span>
                </q-td>

                <!-- Endereço de Entrega (editável) -->
                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingVenda && editingVenda.id === props.row.id"
                           v-model="editingVenda.endereco_entrega" dense />
                  <span v-else>{{ props.row.endereco_entrega }}</span>
                </q-td>

                <!-- Botão para salvar as edições -->
                <q-td v-if="editingVenda && editingVenda.id === props.row.id">
                  <q-btn label="Salvar" @click="salvarEdicao(props.row.id)" color="green" />
                </q-td>
              </q-tr>
            </template>
          </q-table>

          <!-- Caso não haja vendas disponíveis -->
          <div v-else-if="vendasFiltradas && vendasFiltradas.length === 0">Nenhuma venda disponível.</div>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useVendaStore } from 'src/stores/vendaStore';

const router = useRouter();
const vendaStore = useVendaStore();
const search = ref('');
const editingVenda = ref(null);

// Definindo colunas da tabela
const columns = [
  { name: 'acao', label: 'Ações', align: 'center' },
  { name: 'id', label: 'ID Venda', align: 'left', field: 'id' },
  { name: 'cliente_id', label: 'ID Cliente', align: 'left', field: 'cliente_id' },
  { name: 'data_venda', label: 'Data da Venda', align: 'left', field: 'data_venda' },
  { name: 'valor_total', label: 'Valor Total', align: 'right', field: 'valor_total' },
  { name: 'desconto', label: 'Desconto', align: 'right', field: 'desconto' },
  { name: 'forma_pagamento', label: 'Forma de Pagamento', align: 'left', field: 'forma_pagamento' },
  { name: 'endereco_entrega', label: 'Endereço de Entrega', align: 'left', field: 'endereco_entrega' }
];

// Buscar dados de vendas ao montar o componente
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  await vendaStore.fetchVendasData();
  loading.value = false;
});

// Funções para formatar valores monetários e datas
function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

function formatarData(data) {
  const dataObj = new Date(data);
  return dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Filtrar vendas com base na busca
const vendasFiltradas = computed(() =>
  vendaStore.vendas ? vendaStore.vendas.filter(venda =>
    venda.cliente_id.toString().includes(search.value)
  ) : []
);

// Função para alternar o modo de edição
function toggleEdit(venda) {
  if (editingVenda.value && editingVenda.value.id === venda.id) {
    editingVenda.value = null;
  } else {
    editingVenda.value = { ...venda };
  }
}

// Função para salvar a edição
async function salvarEdicao(vendaId) {
  try {
    await vendaStore.updateVenda(vendaId, editingVenda.value);
    editingVenda.value = null;
    vendaStore.fetchVendasData();
  } catch (err) {
    console.error('Erro ao atualizar venda:', err);
  }
}

// Função para adicionar venda
function adicionarVenda() {
  router.push('/adicionar-venda');
}

// Função para ver o relatório detalhado
function verRelatorioDetalhado() {
  router.push('/relatorio-venda');
}

// Função para deletar venda
async function deletarVenda(vendaId) {
  try {
    await vendaStore.deleteVenda(vendaId);
    vendaStore.fetchVendasData();
  } catch (err) {
    console.error("Erro ao deletar venda:", err);
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

/* Customização da célula */
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

/* Estilizando os ícones de ação */
.action-icon {
  font-size: 20px; /* Aumenta o tamanho dos ícones */
  cursor: pointer;
  color: #04442C;
}

.action-icon:hover {
  color: #e74c3c; /* Cor ao passar o mouse */
}

/* Estilo da linha do botão */
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

/* Botão de adicionar venda e relatório detalhado */
.custom-button {
  width: 250px;
  height: 53px;
  border-radius: 30px;
  background-color: #04442C !important;
  color: white !important;
}

/* Estilo do contador de vendas */
.result-count {
  margin-left: auto;
  font-size: 16px;
  font-weight: bold;
}

/* Estilo da tabela */
.custom-table {
  width: 100%;
  text-align: left;
}

.q-col-gutter-xl {
  margin-bottom: 20px;
}
</style>
