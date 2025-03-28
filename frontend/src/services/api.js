import axios from "axios";

const API_URL = "http://localhost:5001/api"; // Asegúrate de que este es el puerto correcto del backend

export const registrarUsuario = async (nombre, apellidoP, apellidoM, email, contraseña) => {
  try {
    const response = await axios.post(`${API_URL}/registro`, {
      nombre,
      apellidoP, 
      apellidoM,
      email,
      contraseña,
    });
    return response.data; // Retorna la respuesta del backend
  } catch (error) {
    throw error.response?.data?.error || "Error al registrar usuario";
  }
};

export const iniciarSesion = async (email, contraseña) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, contraseña });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Error en el inicio de sesión";
  }
};
