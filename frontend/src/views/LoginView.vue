<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card shadow p-4" style="width: 350px;">
        <h2 class="text-center text-primary mb-4">Iniciar Sesión</h2>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="email" class="form-label">Correo Electrónico</label>
            <input v-model="email" type="email" id="email" class="form-control" required placeholder="usuario@example.com">
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Contraseña</label>
            <input v-model="password" type="password" id="password" class="form-control" required placeholder="********">
          </div>
          <button class="btn btn-primary w-100" :disabled="loading">
            {{ loading ? "Iniciando..." : "Iniciar Sesión" }}
          </button>
          <div v-if="error" class="alert alert-danger mt-3">
            {{ error }}
          </div>
        </form>
        <div class="text-center mt-3">
          <p>¿No tienes cuenta? <router-link to="/registro" class="text-primary">Regístrate aquí</router-link></p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  
  const email = ref("");
  const password = ref("");
  const error = ref(null);
  const loading = ref(false);
  const router = useRouter();
  
  const handleLogin = async () => {
    error.value = null;
    loading.value = true;
    
    try {
      // Simulación de autenticación
      if (email.value === "admin@example.com" && password.value === "123456") {
        localStorage.setItem("user", JSON.stringify({ email: email.value, role: "admin" }));
        router.push("/");
      } else {
        throw new Error("Credenciales incorrectas");
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };
  </script>
  
  