import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomeView.vue";
import Rentas from "../views/RentasView.vue";
import Inventario from "../views/InventarioView.vue";
import Usuarios from "../views/UsuariosView.vue";
import Login from "../views/LoginView.vue";
import Registro from "../views/RegistroView.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/rentas", component: Rentas },
  { path: "/inventario", component: Inventario },
  { path: "/usuarios", component: Usuarios },
  { path: "/login", component: Login },
  { path: "/registro", component: Registro },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

