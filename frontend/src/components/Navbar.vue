<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <router-link class="navbar-brand" to="/">Inventario Rentas</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/rentas">Rentas</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/inventario">Inventario</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/usuarios">Usuarios</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link btn btn-outline-light" to="/login">Iniciar Sesión</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: "Navbar",
  };
  </script>
  