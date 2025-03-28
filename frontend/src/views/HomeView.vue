<template>
  <div class="container text-center">
    <h1 class="mt-4">Bienvenido al Sistema de Inventario de Rentas</h1>
    <p class="lead">Administra el inventario, genera presupuestos y gestiona rentas fácilmente.</p>
    <div class="row mt-5">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Gestión de Rentas</h5>
            <p class="card-text">Administra las rentas de equipos fácilmente.</p>
            <router-link to="/rentas" class="btn btn-primary">Ir a Rentas</router-link>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Inventario de Equipos</h5>
            <p class="card-text">Consulta y administra los equipos disponibles.</p>
            <router-link to="/inventario" class="btn btn-primary">Ver Inventario</router-link>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Usuarios y Roles</h5>
            <p class="card-text">Gestiona usuarios y permisos del sistema.</p>
            <router-link to="/usuarios" class="btn btn-primary">Administrar Usuarios</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>
