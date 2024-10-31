<template>
    <div class="q-pa-md">
      <q-card class="q-pa-md custom-card">
        <div class="title-bar">
          <h4>Cadastro de Compra</h4>
          <q-btn color="brown" icon="arrow_back" label="Voltar" @click="voltar" class="voltar-btn" />
        </div>
  
        <q-card-section>
          <q-form @submit="adicionarCompra">
            <div class="q-gutter-md">
              <div class="row">
                <q-input
                  filled
                  v-model="fornecedor_id"
                  label="ID do Fornecedor"
                  outlined
                  class="input-field"
                  required
                />
                <q-input
                  filled
                  v-model="data_compra"
                  label="Data da Compra"
                  type="date"
                  outlined
                  required
                  class="input-field"
                />
              </div>
  
              <div class="row">
                <q-input
                  filled
                  v-model="valor_total"
                  label="Valor Total"
                  type="number"
                  outlined
                  required
                  class="input-field"
                />
                <q-input
                  filled
                  v-model="desconto"
                  label="Desconto"
                  type="number"
                  outlined
                  class="input-field"
                />
              </div>
  
              <div class="row">
                <q-input
                  filled
                  v-model="forma_pagamento"
                  label="Forma de Pagamento"
                  outlined
                  class="input-field"
                  required
                />
                <q-input
                  filled
                  v-model="endereco_entrega"
                  label="Endereço de Entrega"
                  outlined
                  class="input-field"
                />
              </div>
            </div>
  
            <div class="button-row">
              <q-btn type="submit" color="brown" icon="save" label="Salvar" class="salvar-btn" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import compraService from 'src/services/compraService'; // Chame o service de compras
  
  const router = useRouter();
  
  const fornecedor_id = ref('');
  const data_compra = ref('');
  const valor_total = ref('');
  const desconto = ref('');
  const forma_pagamento = ref('');
  const endereco_entrega = ref('');
  
  function voltar() {
    router.back(); 
  }
  
  async function adicionarCompra() {
    try {
      const novaCompra = {
        fornecedor_id: fornecedor_id.value,
        data_compra: data_compra.value,
        valor_total: valor_total.value,
        desconto: desconto.value,
        forma_pagamento: forma_pagamento.value,
        endereco_entrega: endereco_entrega.value,
      };
  
      // Chama o método do serviço para adicionar a compra
      await compraService.addCompra(novaCompra);
      
      // Limpa os campos após o sucesso
      fornecedor_id.value = '';
      data_compra.value = '';
      valor_total.value = '';
      desconto.value = '';
      forma_pagamento.value = '';
      endereco_entrega.value = '';
  
      alert('Compra cadastrada com sucesso!');
  
    } catch (error) {
      console.error('Erro ao adicionar compra:', error);
      alert('Erro ao cadastrar compra!');
    }
  }
  </script>
  
  <style scoped>
  .custom-card {
    max-width: 900px;
    margin: auto;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .title-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #04442C;
    color: white;
    padding: 16px;
    border-radius: 4px 4px 0 0;
  }
  
  .q-form {
    display: grid;
    gap: 20px;
  }
  
  .row {
    display: flex;
    gap: 20px;
  }
  
  .input-field {
    flex: 1;
  }
  
  .voltar-btn {
    background-color: #04442C;
    color: white;
  }
  
  .button-row {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
  
  .salvar-btn {
    background-color: #04442C;
    color: white;
    width: 120px;
  }
  </style>
  