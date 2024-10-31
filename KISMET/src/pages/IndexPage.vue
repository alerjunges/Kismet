<template>
  <div>
    <h1>Lista de Usuários</h1>
    ????
    <ul v-if="clientesStore.listaClientes?.length">
      <li v-for="user in clientesStore.listaClientes" :key="user.email">
        {{ user.cliente_id }} {{ user.nome }} - {{ user.email }} - {{ user.telefone }} - {{ user.endereco }} - {{ user.cpf }}
      </li>
    </ul>
    <p v-else>Carregando...</p>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useClientesStore } from "src/stores/clienteStore";

const clientesStore = useClientesStore();
onMounted(() => {
  clientesStore.getClientes();
});
</script>
