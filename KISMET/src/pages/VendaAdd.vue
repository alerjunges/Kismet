<template>
    <div class="q-pa-md">
      <q-card class="q-pa-md custom-card">
        <div class="title-bar">
          <h4>Cadastro de Venda</h4>
          <q-btn color="brown" icon="arrow_back" label="Voltar" @click="voltar" class="voltar-btn" />
        </div>
  
        <q-card-section>
          <q-form @submit="adicionarVenda">
            <div class="q-gutter-md">
              <div class="row">
                <q-input
                  filled
                  v-model="cliente_id"
                  label="ID do Cliente"
                  outlined
                  class="input-field"
                  required
                />
                <q-input
                  filled
                  v-model="data_venda"
                  label="Data da Venda"
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
import { useVendaStore } from 'src/stores/vendaStore';

const router = useRouter();
const vendaStore = useVendaStore();

const cliente_id = ref('');
const data_venda = ref('');
const valor_total = ref('');
const desconto = ref('');
const forma_pagamento = ref('');
const endereco_entrega = ref('');

function voltar() {
  router.back();
}

async function adicionarVenda() {
  try {
    const novaVenda = {
      cliente_id: cliente_id.value,
      data_venda: data_venda.value,
      valor_total: valor_total.value,
      desconto: desconto.value,
      forma_pagamento: forma_pagamento.value,
      endereco_entrega: endereco_entrega.value,
    };

    await vendaStore.addVenda(novaVenda);

    cliente_id.value = '';
    data_venda.value = '';
    valor_total.value = '';
    desconto.value = '';
    forma_pagamento.value = '';
    endereco_entrega.value = '';

    alert('Venda cadastrada com sucesso!');
    router.push('/venda');
  } catch (error) {
    console.error('Erro ao adicionar venda:', error);
    alert('Erro ao cadastrar venda!');
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
  