<template>
  <div class="q-pa-md">
    <q-layout view="hHh Lpr lFf" container style="height: 100vh">
      <!-- Conteúdo principal -->
      <q-page-container>
        <q-page class="q-px-lg q-py-md">
          <q-spinner v-if="loading" size="30px" color="primary" />
          <div v-if="error" class="text-negative">{{ error }}</div>

          <div class="row q-mb-md">
            <!-- Botão de Adicionar Produto -->
            <q-btn
              class="custom-button"
              color="green-10"
              icon="add"
              label="Adicionar Produto"
              @click="adicionarProduto"
            />

            <!-- Contador de Produtos -->
            <div class="result-count">
              {{ produtosFiltrados.length }} produto(s) encontrado(s)
            </div>
          </div>

          <!-- Tabela de Produtos -->
          <q-table
            v-if="produtosFiltrados && produtosFiltrados.length > 0 && !loading && !error"
            :rows="produtosFiltrados"
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
                  <q-icon name="delete" class="q-mr-sm action-icon" @click="deletarProduto(props.row.id)" />
                </q-td>

                <!-- Produto ID (não editável) -->
                <q-td class="vertical-line body-cell">{{ props.row.id }}</q-td>

                <!-- Nome (editável) -->
                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingProduto && editingProduto.id === props.row.id"
                           v-model="editingProduto.nome" dense />
                  <span v-else>{{ props.row.nome }}</span>
                </q-td>

                <!-- Descrição (editável) -->
                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingProduto && editingProduto.id === props.row.id"
                           v-model="editingProduto.descricao" dense />
                  <span v-else>{{ props.row.descricao }}</span>
                </q-td>

                <!-- Preço (editável) -->
                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingProduto && editingProduto.id === props.row.id"
                           v-model="editingProduto.preco" dense />
                  <span v-else>{{ formatarMoeda(props.row.preco) }}</span>
                </q-td>

                <!-- Quantidade Disponível (editável) -->
                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingProduto && editingProduto.id === props.row.id"
                           v-model="editingProduto.quantidade_disponivel" dense />
                  <span v-else>{{ props.row.quantidade_disponivel }}</span>
                </q-td>

                <!-- Tamanho (editável) -->
                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingProduto && editingProduto.id === props.row.id"
                           v-model="editingProduto.tamanho" dense />
                  <span v-else>{{ props.row.tamanho }}</span>
                </q-td>

                <!-- Cor (editável) -->
                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingProduto && editingProduto.id === props.row.id"
                           v-model="editingProduto.cor" dense />
                  <span v-else>{{ props.row.cor }}</span>
                </q-td>

                <!-- Tipo (editável) -->
                <q-td class="vertical-line body-cell">
                  <q-input v-if="editingProduto && editingProduto.id === props.row.id"
                           v-model="editingProduto.tipo" dense />
                  <span v-else>{{ props.row.tipo }}</span>
                </q-td>

                <!-- Botão para salvar as edições -->
                <q-td v-if="editingProduto && editingProduto.id === props.row.id">
                  <q-btn label="Salvar" @click="salvarEdicao(props.row.id)" color="green" />
                </q-td>
              </q-tr>
            </template>
          </q-table>

          <!-- Caso não haja produtos disponíveis -->
          <div v-else-if="produtosFiltrados && produtosFiltrados.length === 0">Nenhum produto disponível.</div>

        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProdutoStore } from 'src/stores/produtoStore';

const router = useRouter();
const search = ref('');
const editingProduto = ref(null);
const produtoStore = useProdutoStore();

const columns = [
  { name: 'acao', label: 'Ações', align: 'center' },
  { name: 'id', label: 'ID Produto', align: 'left', field: 'id' },
  { name: 'nome', label: 'Nome', align: 'left', field: 'nome' },
  { name: 'descricao', label: 'Descrição', align: 'left', field: 'descricao' },
  { name: 'preco', label: 'Preço', align: 'right', field: 'preco' },
  { name: 'quantidade_disponivel', label: 'Quantidade', align: 'left', field: 'quantidade_disponivel' },
  { name: 'tamanho', label: 'Tamanho', align: 'left', field: 'tamanho' },
  { name: 'cor', label: 'Cor', align: 'left', field: 'cor' },
  { name: 'tipo', label: 'Tipo', align: 'left', field: 'tipo' }
];

onMounted(async () => {
  await produtoStore.fetchProdutosData();
});

const produtosFiltrados = computed(() =>
  produtoStore.produtos ? produtoStore.produtos.filter(produto =>
    produto.nome.toLowerCase().includes(search.value.toLowerCase())
  ) : []
);

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

function toggleEdit(produto) {
  if (editingProduto.value && editingProduto.value.id === produto.id) {
    editingProduto.value = null;
  } else {
    editingProduto.value = { ...produto };
  }
}

async function salvarEdicao(produtoId) {
  try {
    await produtoStore.updateProduto(produtoId, editingProduto.value);
    editingProduto.value = null;
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
  }
}

function adicionarProduto() {
  router.push('/adicionar-produto');
}

async function deletarProduto(produtoId) {
  try {
    await produtoStore.deleteProduto(produtoId);
  } catch (err) {
    console.error("Erro ao deletar produto:", err);
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

/* Botão de adicionar produto */
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

/* Estilo do contador de produtos */
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
