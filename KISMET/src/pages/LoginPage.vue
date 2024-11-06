<template>
  <div class="login-container">
    <q-card class="login-card">
      <div class="logo-container">
        <img src="src/assets/Logo-kismet-login.png" alt="Logo Kismet" class="login-logo" />
      </div>

      <q-form @submit="login">
        <q-input
          filled
          v-model="username"
          label="Usuário"
          outlined
          class="input-field"
          required
        />
        <q-input
          filled
          v-model="password"
          label="Senha"
          type="password"
          outlined
          required
          class="input-field"
        />
        
        <q-btn type="submit" label="ENTRAR" class="submit-btn" />
      </q-form>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from 'src/stores/userStore';
import { login as loginService } from 'src/services/authService';

const username = ref('');
const password = ref('');
const router = useRouter();
const userStore = useUserStore();

async function login() {
  try {
    const user = await loginService(username.value, password.value);
    userStore.login(user.name); 
    router.push('/'); 
  } catch (error) {
    alert('Usuário ou senha inválidos');
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9f9f9;
}

.login-card {
  max-width: 500px;
  width: 100%;
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 2px solid #04442C;
}

.logo-container {
  text-align: center;
  margin-bottom: 20px;
}

.login-logo {
  width: 250px;
}

.input-field {
  margin-bottom: 20px;
}

.submit-btn {
  width: 100%;
  background-color: #04442C;
  color: white;
  border-radius: 8px;
  font-weight: bold;
  padding: 12px;
}
</style>
  