<template>
  <div class="q-pa-md">
    <q-card class="q-pa-md">
      <h3>Relatório Detalhado de Compras</h3>

      <div v-if="!loading && compras && compras.length > 0">
        <div v-for="compra in compras" :key="compra.compra_id" class="compra-detalhada">
          <!-- Informações da Compra -->
          <q-card-section>
            <h4>Compra #{{ compra.compra_id }}</h4>
            <p><strong>Fornecedor ID:</strong> {{ compra.fornecedor_id }}</p>
            <p><strong>Data da Compra:</strong> {{ compra.data_compra }}</p>
            <p><strong>Valor Total:</strong> R$ {{ compra.valor_total }}</p>
            <p><strong>Desconto:</strong> R$ {{ compra.desconto }}</p>
            <p><strong>Forma de Pagamento:</strong> {{ compra.forma_pagamento }}</p>
            <p><strong>Endereço de Entrega:</strong> {{ compra.endereco_entrega }}</p>
            <p><strong>Categoria:</strong> {{ compra.categoria }}</p> 
            <p><strong>Observação:</strong> {{ compra.observacao }}</p>
            
            <!-- Produtos da Compra -->
            <h5>Produtos:</h5>
            <q-table
              :rows="compra.produtos || []"
              :columns="produtoColumns"
              row-key="produto_id"
              class="produtos-tabela"
            >
              <template v-slot:body-cell-produto_id="props">
                <q-td>{{ props.row.produto_id }}</q-td>
              </template>
              <template v-slot:body-cell-nome="props">
                <q-td>{{ props.row.nome }}</q-td>
              </template>
              <template v-slot:body-cell-quantidade="props">
                <q-td>{{ props.row.quantidade }}</q-td>
              </template>
              <template v-slot:body-cell-preco_unitario="props">
                <q-td>R$ {{ props.row.preco_unitario }}</q-td>
              </template>
              <template v-slot:body-cell-subtotal="props">
                <q-td>R$ {{ props.row.subtotal }}</q-td>
              </template>
              <template v-slot:body-cell-desconto="props">
                <q-td>R$ {{ props.row.desconto }}</q-td>
              </template>
            </q-table>
          </q-card-section>

          <q-separator />
        </div>
      </div>

      <div v-else-if="compras && compras.length === 0">Nenhuma compra disponível.</div>
      <q-spinner v-if="loading" size="30px" color="primary" />
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCompraStore } from 'src/stores/compraStore';

const store = useCompraStore();
const loading = computed(() => store.loading);
const compras = computed(() => store.compras || []); 

const produtoColumns = [
  { name: 'produto_id', label: 'ID do Produto', align: 'left', field: 'produto_id' },
  { name: 'nome', label: 'Nome do Produto', align: 'left', field: 'nome' },
  { name: 'quantidade', label: 'Quantidade', align: 'left', field: 'quantidade' },
  { name: 'preco_unitario', label: 'Preço Unitário', align: 'left', field: 'preco_unitario' },
  { name: 'subtotal', label: 'Subtotal', align: 'left', field: 'subtotal' },
  { name: 'desconto', label: 'Desconto', align: 'left', field: 'desconto' },
];

onMounted(() => {
  store.fetchComprasData(); 
});
</script>

<style scoped>
.compra-detalhada {
  margin-bottom: 24px;
}

.produtos-tabela {
  margin-top: 16px;
}

h4 {
  margin-bottom: 12px;
}

h5 {
  margin-top: 16px;
}
</style>