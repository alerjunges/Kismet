<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md row items-start q-gutter-md">

      <q-card v-for="item in produtos" :key="item.nome" class="my-card">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">{{item.nome}}</div>
          <div class="text-subtitle2">{{item.descricao}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">

          <q-icon :name="item.icone" />

          <div class="text-subtitle1">
            {{item.preco}}
          </div>
          <div class="text-caption text-grey">
            {{item.desc2}}
          </div>
        </q-card-section>
        <q-separator />

        <q-card-actions align="right">
          <q-btn flat @click="exibirAlerta(item)">ADD</q-btn>
          <q-btn flat>VER MAIS</q-btn>
        </q-card-actions>
      </q-card>


      <q-dialog v-model="showAlert">
        <q-card>
          <q-card-section>
            <div class="text-h6">ADD AO CARRINHO</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            {{produtoSelecionado}}
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </div>
  </q-page>
</template>
<script setup>
defineOptions({
  name: 'IndexPage',
  data: () => ({
    
    showAlert: true, // controlar quando exibir o alerta
    
    produtoSelecionado: '', // qual produto foi clicado
    
    produtos: [
      { nome: 'Chinelo', descricao: 'chinelo havaianas, todo mundo usa', preco: '$ 15,00', desc2: 'qualquer coisa', icone: 'warning' },
      { nome: 'Tenis', descricao: 'All Stars', preco: '$ 100,00', desc2: 'akjsdakjshd', icone: 'print' },
      { nome: 'Camiseta', descricao: 'Gremio', preco: '$ 150,00', desc2: '', icone: 'today' },
      { nome: 'Tamanco', descricao: '', preco: '$ 500,00', desc2: '...', icone: 'style' }
    ]
  }),

  methods: {
    exibirAlerta(nome) {
      this.showAlert = true;
      this.produtoSelecionado = nome;
    }
  }
});
</script>