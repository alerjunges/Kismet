<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Menu Lateral (Drawer) -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="custom-drawer"
    >
      <div class="logo-container">
        <img
          class="logo-image"
          src="src/assets/Logo-kismet-login.png"
          alt="Logo Kismet"
        />
      </div>

      <q-list class="menu-content">
        <q-item clickable v-ripple @click="navigateTo('/')">
          <q-item-section avatar>
            <q-icon name="info" />
          </q-item-section>
          <q-item-section>Informações Gerais</q-item-section>
        </q-item>

        <!-- Compra -->
        <q-item clickable v-ripple @click="navigateTo('/compra')">
          <q-item-section avatar>
            <q-icon name="shopping_cart" />
          </q-item-section>
          <q-item-section>Compra</q-item-section>
        </q-item>

        <!-- Venda -->
        <q-item clickable v-ripple @click="navigateTo('/venda')">
          <q-item-section avatar>
            <q-icon name="attach_money" />
          </q-item-section>
          <q-item-section>Venda</q-item-section>
        </q-item>

        <!-- Produto -->
        <q-item clickable v-ripple @click="navigateTo('/produto')">
          <q-item-section avatar>
            <q-icon name="inventory" />
          </q-item-section>
          <q-item-section>Produto</q-item-section>
        </q-item>

        <!-- Pagamento -->
        <q-item clickable v-ripple @click="navigateTo('/pagamento')">
          <q-item-section avatar>
            <q-icon name="credit_card" />
          </q-item-section>
          <q-item-section>Pagamento</q-item-section>
        </q-item>

        <!-- Cliente -->
        <q-item clickable v-ripple @click="navigateTo('/cliente')">
          <q-item-section avatar>
            <q-icon name="group" />
          </q-item-section>
          <q-item-section>Cliente</q-item-section>
        </q-item>

        <!-- Fornecedor -->
        <q-item clickable v-ripple @click="navigateTo('/fornecedor')">
          <q-item-section avatar>
            <q-icon name="local_shipping" />
          </q-item-section>
          <q-item-section>Fornecedor</q-item-section>
        </q-item>
      </q-list>

      <div class="drawer-footer">
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>
              {{ userStore.user ? userStore.user : 'Usuário' }}
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="logout">
            <q-item-section avatar>
              <q-icon name="power_settings_new" />
            </q-item-section>
            <q-item-section>Encerrar</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from 'src/stores/userStore';

const leftDrawerOpen = ref(false);
const router = useRouter();
const userStore = useUserStore();

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function navigateTo(route) {
  router.push(route);
}

function logout() {
  leftDrawerOpen.value = false;
  userStore.logout();
  router.push("/login");
}
</script>

<style scoped>
/* Menu Lateral */
.custom-drawer {
  background: #04442c;
  color: white;
  width: 220px;
}

.logo-container {
  text-align: center;
  padding: 15px 0;
}

.logo-image {
  width: 200px;
  height: auto;
}

.q-drawer a {
  color: white;
}

.q-drawer a:hover {
  color: #e74c3c;
}

.menu-content {
  margin-top: 0px;
}

.drawer-footer {
  margin-top: 47%;
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>
