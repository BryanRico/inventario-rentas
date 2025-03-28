<template>
    <div class="container mt-4">
      <h1 class="text-center text-primary">Gestión de Usuarios</h1>
      <div class="d-flex justify-content-between mb-3">
        <button class="btn btn-success">+ Nuevo Usuario</button>
      </div>
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario.id">
            <td>{{ usuario.id }}</td>
            <td>{{ usuario.nombre }}</td>
            <td>{{ usuario.email }}</td>
            <td>{{ usuario.rol }}</td>
            <td>
              <button class="btn btn-primary btn-sm me-2">Editar</button>
              <button class="btn btn-danger btn-sm">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  const usuarios = ref([
    { id: 1, nombre: "Juan Pérez", email: "juan@example.com", rol: "Admin" },
    { id: 2, nombre: "María García", email: "maria@example.com", rol: "Operador" },
  ]);
  </script>
  