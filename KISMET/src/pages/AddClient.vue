<template>
  <div class="q-pa-md">
    <q-card class="q-pa-md custom-card">
      <div class="title-bar">
        <h4>Cadastro de Cliente</h4>
        <q-btn
          color="brown"
          icon="arrow_back"
          label="Voltar"
          @click="voltar"
          class="voltar-btn"
        />
      </div>

      <q-card-section>
        <q-form @submit="submitForm">
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
                v-model="cpf"
                label="CPF"
                outlined
                class="input-field"
              />
              <q-input
                filled
                v-model="status"
                label="Status"
                outlined
                class="input-field"
              />
            </div>
          </div>

          <div class="button-row">
            <q-btn
              type="submit"
              color="brown"
              icon="save"
              label="Salvar"
              class="salvar-btn"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useClienteStore } from "src/stores/clienteStore"; // Importando a store

const router = useRouter();
const clienteStore = useClienteStore(); // Instância da store

const nome = ref("");
const email = ref("");
const telefone = ref("");
const endereco = ref("");
const cpf = ref("");
const status = ref("");

function voltar() {
  router.back();
}

async function submitForm() {
  try {
    const novoCliente = {
      nome: nome.value,
      email: email.value,
      telefone: telefone.value,
      endereco: endereco.value,
      cpf: cpf.value,
      status: status.value,
    };
    
    await clienteStore.addCliente(novoCliente); // Usando a store para adicionar o cliente

    nome.value = "";
    email.value = "";
    telefone.value = "";
    endereco.value = "";
    cpf.value = "";
    status.value = "";

    alert("Cliente cadastrado com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar cliente:", error);
    alert("Erro ao cadastrar cliente!");
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
  background-color: #04442c;
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
  background-color: #04442c;
  color: white;
}

.button-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.salvar-btn {
  background-color: #04442c;
  color: white;
  width: 120px;
}
</style>
