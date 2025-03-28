<template>
    <div class="container mt-4">
      <h1 class="text-center text-primary">Inventario de Equipos</h1>
      <div class="d-flex justify-content-between mb-3">
        <button class="btn btn-success">+ Nuevo Equipo</button>
        <input type="text" class="form-control w-25" placeholder="Buscar equipo..." v-model="busqueda">
      </div>
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Marca</th>
            <th>Categoría</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="equipo in filtrarEquipos" :key="equipo.id">
            <td>{{ equipo.id }}</td>
            <td>{{ equipo.nombre }}</td>
            <td>{{ equipo.marca }}</td>
            <td>{{ equipo.categoria }}</td>
            <td>
              <span :class="getEstadoClass(equipo.estado)">{{ equipo.estado }}</span>
            </td>
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
  import { ref, computed } from "vue";
  
  const equipos = ref([
    { id: 1, nombre: "Cámara Sony A7S III", marca: "Sony", categoria: "Cámaras", estado: "Disponible" },
    { id: 2, nombre: "Lente Canon 24-70mm", marca: "Canon", categoria: "Lentes", estado: "Ocupado" },
  ]);
  
  const busqueda = ref("");
  
  const filtrarEquipos = computed(() => {
    return equipos.value.filter(equipo =>
      equipo.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
    );
  });
  
  const getEstadoClass = (estado) => {
    return estado === "Disponible" ? "badge bg-success" : "badge bg-danger";
  };
  </script>
  