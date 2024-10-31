<template>
    <div class="q-pa-md">
      <q-card class="q-pa-md custom-card">
        <div class="title-bar">
          <h4>Cadastro de Pagamento</h4>
          <q-btn color="brown" icon="arrow_back" label="Voltar" @click="voltar" class="voltar-btn" />
        </div>
  
        <q-card-section>
          <q-form @submit="adicionarPagamento">
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
                  v-model="data_pagamento"
                  label="Data do Pagamento"
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
                  v-model="vencimento"
                  label="Data de Vencimento"
                  type="date"
                  outlined
                  class="input-field"
                />
              </div>
  
              <div class="row">
                <q-input
                  filled
                  v-model="status"
                  label="Status do Pagamento (1 para pago, 0 para não pago)"
                  outlined
                  class="input-field"
                  required
                />
                <q-input
                  filled
                  v-model="parcela"
                  label="Parcelas (se houver)"
                  type="number"
                  outlined
                  class="input-field"
                />
              </div>
            </div>
  
            <!-- Linha para botões Voltar e Salvar -->
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
  import pagamentoService from 'src/services/pagamentoService'; // Chame o service de pagamentos
  
  const router = useRouter();
  
  const cliente_id = ref('');
  const data_pagamento = ref('');
  const valor_total = ref('');
  const desconto = ref('');
  const forma_pagamento = ref('');
  const vencimento = ref('');
  const status = ref('');
  const parcela = ref('');
  
  function voltar() {
    router.back(); // Voltar à página anterior
  }
  
  async function adicionarPagamento() {
    try {
      const novoPagamento = {
        cliente_id: cliente_id.value,
        data_pagamento: data_pagamento.value,
        valor_total: valor_total.value,
        desconto: desconto.value,
        forma_pagamento: forma_pagamento.value,
        vencimento: vencimento.value,
        status: status.value,
        parcela: parcela.value,
      };
  
      // Chama o método do serviço para adicionar o pagamento
      await pagamentoService.addPagamento(novoPagamento);
  
      // Resetando o formulário após o sucesso
      cliente_id.value = '';
      data_pagamento.value = '';
      valor_total.value = '';
      desconto.value = '';
      forma_pagamento.value = '';
      vencimento.value = '';
      status.value = '';
      parcela.value = '';
  
      alert('Pagamento cadastrado com sucesso!');
      router.push('/pagamentos'); // Redireciona para a lista de pagamentos
  
    } catch (error) {
      console.error('Erro ao adicionar pagamento:', error);
      alert('Erro ao cadastrar pagamento!');
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
  