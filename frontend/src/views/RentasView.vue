<template>
    <div class="container mt-4">
      <h1 class="text-center text-primary">Gestión de Rentas</h1>
      <div class="d-flex justify-content-end mb-3">
        <button class="btn btn-success">+ Nueva Renta</button>
      </div>
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Proyecto</th>
            <th>Cliente</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="renta in rentas" :key="renta.id">
            <td>{{ renta.id }}</td>
            <td>{{ renta.proyecto }}</td>
            <td>{{ renta.cliente }}</td>
            <td>{{ renta.fechaInicio }}</td>
            <td>{{ renta.fechaFin }}</td>
            <td>
              <span :class="getEstadoClass(renta.estado)">{{ renta.estado }}</span>
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
  import { ref } from "vue";
  
  const rentas = ref([
    { id: 1, proyecto: "Spot Publicitario", cliente: "Agencia XYZ", fechaInicio: "2025-03-20", fechaFin: "2025-03-25", estado: "Pendiente" },
    { id: 2, proyecto: "Videoclip", cliente: "Cantante ABC", fechaInicio: "2025-04-10", fechaFin: "2025-04-12", estado: "Aprobada" },
  ]);
  
  const getEstadoClass = (estado) => {
    return estado === "Aprobada" ? "badge bg-success" : "badge bg-warning";
  };
  </script>
  