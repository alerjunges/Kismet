<template>
    <div class="q-pa-md">
      <q-card class="q-pa-md">
        <h3>Relatório Detalhado de Vendas</h3>
  
        <!-- Verifica se as vendas estão carregadas e se há vendas -->
        <div v-if="!loading && vendas.length > 0">
          <div v-for="venda in vendas" :key="venda.venda_id" class="venda-detalhada">
            <!-- Informações da Venda -->
            <q-card-section>
              <h4>Venda #{{ venda.venda_id }}</h4>
              <p><strong>Cliente ID:</strong> {{ venda.cliente_id }}</p>
              <p><strong>Data da Venda:</strong> {{ venda.data_venda }}</p>
              <p><strong>Valor Total:</strong> R$ {{ venda.valor_total }}</p>
              <p><strong>Desconto:</strong> R$ {{ venda.desconto }}</p>
              <p><strong>Forma de Pagamento:</strong> {{ venda.forma_pagamento }}</p>
              <p><strong>Endereço de Entrega:</strong> {{ venda.endereco_entrega }}</p>
              <p><strong>Observação:</strong> {{ venda.observacao }}</p>
              
              <!-- Produtos da Venda -->
              <h5>Produtos:</h5>
              <q-table
                :rows="venda.produtos"
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
  
        <div v-else-if="vendas.length === 0">Nenhuma venda disponível.</div>
        <q-spinner v-if="loading" size="30px" color="primary" />
      </q-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useVendaStore } from 'src/stores/vendaStore';
  
  const store = useVendaStore();
  const loading = computed(() => store.loading);
  const vendas = computed(() => store.vendas);
  
  // Colunas da tabela de produtos
  const produtoColumns = [
    { name: 'produto_id', label: 'ID do Produto', align: 'left', field: 'produto_id' },
    { name: 'nome', label: 'Nome do Produto', align: 'left', field: 'nome' },
    { name: 'quantidade', label: 'Quantidade', align: 'left', field: 'quantidade' },
    { name: 'preco_unitario', label: 'Preço Unitário', align: 'left', field: 'preco_unitario' },
    { name: 'subtotal', label: 'Subtotal', align: 'left', field: 'subtotal' },
    { name: 'desconto', label: 'Desconto', align: 'left', field: 'desconto' },
  ];
  
  // Buscar dados das vendas ao montar o componente
  onMounted(() => {
    store.fetchVendasData(); // Busca as vendas do sistema
  });
  </script>
  
  <style scoped>
  .venda-detalhada {
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
  