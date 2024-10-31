<template>
  <div class="q-pa-md">
    <q-card class="q-pa-md custom-card">
      <div class="title-bar">
        <h4>Cadastro de Produto</h4>
        <q-btn color="brown" icon="arrow_back" label="Voltar" @click="voltar" class="voltar-btn" />
      </div>

      <q-card-section>
        <q-form @submit="adicionarProduto">
          <div class="q-gutter-md">
            <div class="row">
              <q-input
                filled
                v-model="nome"
                label="Nome do Produto"
                outlined
                class="input-field"
                required
              />
              <q-input
                filled
                v-model="preco"
                label="Preço"
                type="number"
                outlined
                required
                class="input-field"
              />
            </div>

            <div class="row">
              <q-input
                filled
                v-model="quantidade_disponivel"
                label="Quantidade Disponível"
                type="number"
                outlined
                class="input-field"
              />
              <q-input
                filled
                v-model="tamanho"
                label="Tamanho"
                outlined
                class="input-field"
              />
            </div>

            <div class="row">
              <q-input
                filled
                v-model="cor"
                label="Cor"
                outlined
                class="input-field"
              />
              <q-input
                filled
                v-model="tipo"
                label="Tipo"
                outlined
                class="input-field"
              />
            </div>

            <div class="row">
              <q-input
                filled
                v-model="descricao"
                label="Descrição"
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
import produtoService from 'src/services/produtoService'; // Chame o service de produtos

const router = useRouter();

const nome = ref('');
const preco = ref('');
const quantidade_disponivel = ref('');
const tamanho = ref('');
const cor = ref('');
const tipo = ref('');
const descricao = ref('');

function voltar() {
  router.back(); // Voltar à página anterior
}

async function adicionarProduto() {
  try {
    const novoProduto = {
      nome: nome.value,
      preco: parseFloat(preco.value),
      quantidade_disponivel: parseInt(quantidade_disponivel.value, 10),
      tamanho: tamanho.value,
      cor: cor.value,
      tipo: tipo.value,
      descricao: descricao.value,
    };

    // Chama o método do serviço para adicionar o produto
    await produtoService.addProduto(novoProduto);

    // Resetando o formulário após o sucesso
    nome.value = '';
    preco.value = '';
    quantidade_disponivel.value = '';
    tamanho.value = '';
    cor.value = '';
    tipo.value = '';
    descricao.value = '';

    alert('Produto cadastrado com sucesso!');
    router.push('/produtos'); // Redireciona para a lista de produtos

  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    alert('Erro ao cadastrar produto!');
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
