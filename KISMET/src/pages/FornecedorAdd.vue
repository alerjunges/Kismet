<template>
  <div class="q-pa-md">
    <q-card class="q-pa-md custom-card">
      <div class="title-bar">
        <h4>Cadastro de Fornecedor</h4>
        <q-btn color="brown" icon="arrow_back" label="Voltar" @click="voltar" class="voltar-btn" />
      </div>

      <q-card-section>
        <q-form @submit="adicionarFornecedor">
          <div class="q-gutter-md">
            <div class="row">
              <q-input
                filled
                v-model="nome"
                label="Nome"
                outlined
                class="input-field"
                required
              />
              <q-input
                filled
                v-model="email"
                label="Email"
                type="email"
                outlined
                required
                class="input-field"
              />
            </div>

            <div class="row">
              <q-input
                filled
                v-model="telefone"
                label="Telefone"
                outlined
                class="input-field"
              />
              <q-input
                filled
                v-model="endereco"
                label="Endereço"
                outlined
                class="input-field"
              />
            </div>

            <div class="row">
              <q-input
                filled
                v-model="cnpj"
                label="CNPJ"
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
import { useFornecedorStore } from 'src/stores/fornecedorStore';

const router = useRouter();
const fornecedorStore = useFornecedorStore();

const nome = ref('');
const email = ref('');
const telefone = ref('');
const endereco = ref('');
const cnpj = ref('');

function voltar() {
  router.back();
}

async function adicionarFornecedor() {
  try {
    const novoFornecedor = {
      nome: nome.value,
      email: email.value,
      telefone: telefone.value,
      endereco: endereco.value,
      cnpj: cnpj.value,
    };

    await fornecedorStore.addFornecedor(novoFornecedor);

    nome.value = '';
    email.value = '';
    telefone.value = '';
    endereco.value = '';
    cnpj.value = '';

    alert('Fornecedor cadastrado com sucesso!');
    router.push('/fornecedor'); 

  } catch (error) {
    console.error('Erro ao adicionar fornecedor:', error);
    alert('Erro ao cadastrar fornecedor!');
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
