<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card shadow p-4" style="width: 350px;">
        <h2 class="text-center text-primary mb-4">Registro de Usuario</h2>
        <form @submit.prevent="handleRegister">
          <div class="mb-3">
            <label for="nombre" class="form-label">Nombre(s)</label>
            <input v-model="nombre" type="text" id="nombre" class="form-control" required placeholder="Juan Pablo">
          </div>
          <div class="mb-3">
            <label for="apellidoP" class="form-label">Apellido Paterno</label>
            <input v-model="apellidoP" type="text" id="apellidoP" class="form-control" required placeholder="Pérez">
          </div>
          <div class="mb-3">
            <label for="apellidoM" class="form-label">Apellido Materno</label>
            <input v-model="apellidoM" type="text" id="apellidoM" class="form-control" required placeholder="Ramirez">
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Correo Electrónico</label>
            <input v-model="email" type="email" id="email" class="form-control" required placeholder="usuario@example.com">
          </div>
          <div class="mb-3">
            <label for="contraseña" class="form-label">Contraseña</label>
            <input v-model="contraseña" type="password" id="contraseña" class="form-control" required placeholder="********">
          </div>
          <button class="btn btn-success w-100" :disabled="loading">
            {{ loading ? "Registrando..." : "Registrarse" }}
          </button>
          <div v-if="error" class="alert alert-danger mt-3">
            {{ error }}
          </div>
          <div v-if="success" class="alert alert-success mt-3">
            {{ success }}
          </div>
        </form>
        <div class="text-center mt-3">
          <p>¿Ya tienes cuenta? <router-link to="/login" class="text-primary">Inicia sesión aquí</router-link></p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { registrarUsuario } from "@/services/api"; // Importamos la función de la API
  
  const nombre = ref("");
  const apellidoP = ref("");
  const apellidoM = ref("");
  const email = ref("");
  const contraseña = ref("");
  const error = ref(null);
  const success = ref(null);
  const loading = ref(false);
  const router = useRouter();
  
  const handleRegister = async () => {
    error.value = null;
    success.value = null;
    loading.value = true;
  
    try {
      // Llamamos a la función que hace la petición al backend
      const response = await registrarUsuario(nombre.value, email.value, contraseña.value);
      success.value = response.message || "Registro exitoso. Redirigiendo...";
  
      // Espera 2 segundos y redirige al login
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };
  </script>
  