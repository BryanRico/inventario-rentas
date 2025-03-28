import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    usuario: null,
    token: null,
  }),
  actions: {
    setUsuario(datos) {
      this.usuario = datos.usuario;
      this.token = datos.token;
      localStorage.setItem("token", datos.token);
    },
    logout() {
      this.usuario = null;
      this.token = null;
      localStorage.removeItem("token");
    },
  },
});
